"use client"
import { updateDefaultAccount } from "@/actions/accounts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import UseFetch from "@/hooks/useFetch";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import ProgressLink from "@/components/progress-link";
import React, { useEffect } from "react";
import { toast } from "sonner";

function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updateAccount,
    error,
  } = UseFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // don't allow to toggling off the default account
    }
    
    // Show loading toast
    toast.loading("Updating default account...", { id: "default-account" });
    
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updateAccount?.success) {
      toast.success("Default account updated successfully", { id: "default-account" });
    }
  }, [updateAccount, updateDefaultLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message||"Failed to update default account", { id: "default-account" });
    }
  }, [error]);

  return (
    <Card className={`group hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-white hover:scale-105 relative overflow-hidden ${updateDefaultLoading ? 'opacity-70' : ''}`}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {isDefault && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Default
          </div>
        </div>
      )}
      
      <ProgressLink href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-lg font-bold capitalize text-gray-900">
            {name}
          </CardTitle>
          <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
            {updateDefaultLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
            )}
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
            />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm font-semibold relative z-10 border-t border-purple-100 pt-4">
          <div className="flex items-center text-green-600">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            Income
          </div>
          <div className="flex items-center text-red-600">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            Expense
          </div>
        </CardFooter>
      </ProgressLink>
    </Card>
  );
}

export default AccountCard;
