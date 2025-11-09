"use server";
import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Arcjet to add rate limiting
    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.log({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request Blocked");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function scanReceipt(file) {
  try {
    // Use gemini-2.0-flash for image analysis (available model)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
    });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Analyze this receipt image and extract the following information in JSON format:
    - Total amount (just the number)
    - Date (in ISO format)
    - Description or items purchased (brief summary)
    - Merchant/store name
    - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense)
    
    Only respond with valid JSON in this exact format:
    {
      "amount": number,
      "date": "ISO date string",
      "description": "string",
      "merchantName":"string",
      "category":"string"
    }
    
    If its not a receipt, return an empty object
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
    ]);
    const response = await result.response;
    const text = response.text();
    // the text is something like that /```JSON data JSON```/ so that remove the /```JSON and JSON```/
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.log("Error parsing JSON response: ", parseError);
      console.log("Raw response text: ", cleanedText);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.log("Error scanning receipt: ", error.message);
    console.log("Full error: ", error);
    throw new Error(`Failed to scan receipt: ${error.message}`);
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: { id, userId: user.id },
  });

  if(!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}


export async function updateTransaction(id,data){
  try {
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where:{clerkUserId:userId}
    });
    if(!user) throw new Error("User not found");

    const origionalTransaction = await db.transaction.findUnique({
      where:{
        id,
        userId:user.id
      },
      include:{
        account:true
      },
    })

    if(!origionalTransaction) throw new Error("Transaction not found");

    const oldBalanceChange = origionalTransaction.type === "EXPENSE" ? -origionalTransaction.amount.toNumber() : origionalTransaction.amount.toNumber();

    const newBalanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    // Update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx)=>{
      const updated = await tx.transaction.update({
        where:{
          id,
          userId:user.id
        },
        data:{
          ...data,
          nextRecurringDate:data.isRecurring && data.recurringInterval ? calculateNextRecurringDate(data.date,data.recurringInterval) : null,
        }
      })
      // update account balance 
      await tx.account.update({
        where:{id:data.accountId},
        data:{
          balance:{
            increment:netBalanceChange
          }
        }
      })
      return updated;
    })

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return {success:true,data:serializeAmount(transaction)}

  } catch (error) {
    throw new Error(error.message)
  }
}