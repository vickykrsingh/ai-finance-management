"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "./ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import UseFetch from "@/hooks/useFetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {data:newAccount,error,fn:createAccountFn,loading:createAccountLoading,setData} = UseFetch(createAccount)

  useEffect(()=>{
    if(newAccount&&!createAccountLoading){
      toast.success("Account created successfully");
      reset();
      setOpen(false)
    }
  },[newAccount,createAccountLoading])

  useEffect(()=>{
    if(error){
      toast.error(error.message||"Failed to create account")
    }
  },[error])

  const onSubmit = async (data) => {
    await createAccountFn(data)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="border-t-4 border-purple-500">
        <DrawerHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <DrawerTitle className="text-2xl font-black flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">+</span>
            </div>
            Create New Account
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form className="space-y-5 pt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900" htmlFor="name">
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900" htmlFor="type">
                Account Type
              </label>
              <Select onValueChange={(value)=>setValue("type",value)} defaultValue={watch("type")}>
                <SelectTrigger id="type" className="border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">🏦 Current Account</SelectItem>
                  <SelectItem value="SAVINGS">💰 Savings Account</SelectItem>
                </SelectContent>
              </Select>

              {errors.type && (
                <p className="text-sm text-red-500 font-medium">{errors.type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900" htmlFor="balance">
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-lg font-semibold"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500 font-medium">{errors.balance.message}</p>
              )}
            </div>
            <div className="flex items-center justify-between rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
              <div className="space-y-0.5">
              <label className="text-sm font-bold cursor-pointer text-gray-900" htmlFor="isDefault">
                ⭐ Set as Default
              </label>
              <p className="text-sm text-gray-600">This account will be selected by default for transactions</p>
              </div>
              <Switch 
                id="isDefault" 
                onCheckedChange={(checked)=>setValue("isDefault",checked)} 
                checked={watch("isDefault")}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
              />
            </div>
            <div className="flex gap-4 pt-4">
                <DrawerClose asChild >
                    <Button type="button" variant="outline" className="flex-1 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold">
                        Cancel
                    </Button>
                </DrawerClose>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg" disabled={createAccountLoading}>
                   {createAccountLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating...</> : '✓ Create Account'}
                </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateAccountDrawer;
