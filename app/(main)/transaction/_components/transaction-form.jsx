"use client";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import UseFetch from "@/hooks/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ReceiptScanner from "./receipt-scanner";

function AddTransactionForm({ accounts, categories,editMode=false,initialData=null }) {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: editMode && initialData ? {
      type:initialData.type,
      amount:initialData.amount.toString(),
      description:initialData.description,
      accountId:initialData.accountId,
      category: initialData.category,
      date: new Date(initialData.date),
      isRecurring: initialData.isRecurring,
      ...(initialData.recurringInterval && {
        recurringInterval: initialData.recurringInterval
      }),
    } : {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: accounts.find((ac) => ac.isDefault)?.id,
      date: new Date(),
      isRecurring:false,
      // category:""
    },
  });
  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = UseFetch(editMode ? updateTransaction : createTransaction);
  const router = useRouter()

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    }
    if(editMode){
      transactionFn(editId,formData)
    }else{
      transactionFn(formData)
    }
  }

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  useEffect(()=>{
    if(transactionResult?.success && !transactionLoading){
      toast.success(editMode ? "Transaction updated successfully":"Transaction created successfully");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`)
    }
  },[transactionResult,transactionLoading,editMode])

  const handleScanComplete = async (scannedData) => {
    console.log(scannedData)
    if(scannedData){
      setValue("amount",scannedData.amount.toString());
      setValue("date",new Date(scannedData.date));
      if(scannedData.description){
        setValue("description",scannedData.description)
      }
      if(scannedData.category){
        console.log(getValues("category"))
        setValue("category",scannedData.category)
      }
    }
  }

  

  return (
    <form className="space-y-6 bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100" onSubmit={handleSubmit(onSubmit)}>
      {/* AI Recipt Scanner */}
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900">Transaction Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger className="border-purple-300 focus:border-purple-500 focus:ring-purple-500">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">💸 Expense</SelectItem>
            <SelectItem value="INCOME">💰 Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500 font-medium">{errors.type.message}</p>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-lg font-semibold"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-sm text-red-500 font-medium">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900">Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger className="border-purple-300 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  className="w-full select-none items-center text-sm outline-none text-purple-600 hover:text-purple-700"
                  variant="ghost"
                >
                  + Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-500 font-medium">{errors.accountId.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
          value={getValues("category")}
        >
          <SelectTrigger className="border-purple-300 focus:border-purple-500 focus:ring-purple-500">
            <SelectValue defaultValue={getValues("category")} placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500 font-medium">{errors.category.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="w-full pl-3 text-left font-medium border-purple-300 hover:border-purple-500"
              variant="outline"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-2 border-purple-200" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500 font-medium">{errors.date.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900">Description</label>
        <Input 
          placeholder="Enter description" 
          className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
          {...register("description")} 
        />
        {errors.description && (
          <p className="text-sm text-red-500 font-medium">{errors.description.message}</p>
        )}
      </div>
      
      <div className="flex items-center justify-between rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
        <div className="space-y-0.5">
          <label className="text-sm font-bold cursor-pointer text-gray-900">
            🔄 Recurring Transaction
          </label>
          <p className="text-sm text-gray-600">
            Set up a recurring schedule for this transaction
          </p>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
        />
      </div>
      
      {isRecurring && (
        <div className="space-y-2 animate-in slide-in-from-top">
          <label className="text-sm font-bold text-gray-900">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger className="border-purple-300 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">📅 Daily</SelectItem>
              <SelectItem value="WEEKLY">📆 Weekly</SelectItem>
              <SelectItem value="MONTHLY">🗓️ Monthly</SelectItem>
              <SelectItem value="YEARLY">📊 Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500 font-medium">{errors.recurringInterval.message}</p>
          )}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold" 
          onClick={() => router.back()} 
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg" 
          disabled={transactionLoading}
        >
          {
            transactionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editMode ? "Updating..." : "Creating..."}
              </>
            ) : editMode ? (
              "✓ Update Transaction"
            ) : (
              "✓ Create Transaction"
            )
          }
        </Button>
      </div>
    </form>
  );
}

export default AddTransactionForm;
