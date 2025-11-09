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
    <Card className={`hover:shadow-md transition-shadow group relative ${updateDefaultLoading ? 'opacity-70' : ''}`}>
      <ProgressLink href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
            {updateDefaultLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </ProgressLink>
    </Card>
  );
}

export default AccountCard;
