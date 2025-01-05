import { getAccountWithTransactions } from "@/actions/accounts";
import notfound from "@/app/not-found";
import React, { Suspense } from "react";
import TransactionTable from "../_components/transaction-table";
import { BarLoader } from "react-spinners";

async function UserAccount({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    return notfound();
  }

  const { transactions, ...account } = accountData;
  return (
    <div className="space-y-8 px-5">
      <div className=" flex gap-4 items-end justify-between">

      <div className="">
        <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">{account.name}</h1>
        <p className="text-muted-foreground">
          {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
        </p>
      </div>
      <div className="pb-2 text-right">
        <div className="text-xl sm:text-2xl font-bold">${parseFloat(account.balance).toFixed(2)}</div>
        <p className="text-sm text-muted-foreground">{account._count.transactions} Transaction</p>
      </div>
      </div>
      {/* Chart section */}


      {/* Transaction section */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea"/>}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}

export default UserAccount;
