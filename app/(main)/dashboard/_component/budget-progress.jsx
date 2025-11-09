"use client";
import { updateBudget } from "@/actions/budget";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import UseFetch from "@/hooks/useFetch";
import { Check, Pencil, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );
  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = UseFetch(updateBudget);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFn(amount);
  };
  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };
  return (
    <Card className="border-2 border-purple-100 shadow-lg bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-purple-100">
        <div className="flex-1">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
            Monthly Budget
          </CardTitle>
          <div className="flex items-center gap-2 mt-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-40 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isLoading}
                  onClick={handleUpdateBudget}
                  className="hover:bg-green-100"
                >
                  <Check className="h-5 w-5 text-green-600" />
                </Button>
                <Button
                  disabled={isLoading}
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="hover:bg-red-100"
                >
                  <X className="h-5 w-5 text-red-600" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-base font-semibold text-gray-700">
                  {initialBudget
                    ? `$${currentExpenses.toFixed(
                        2
                      )} of $${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 hover:bg-purple-100 text-purple-600"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {initialBudget && (
          <div className="space-y-4">
            <div className="relative">
              <Progress
                extraStyles={`${
                  percentUsed >= 90
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : percentUsed >= 75
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
                value={percentUsed<=100?percentUsed:100}
                className="h-4"
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-600">
                Progress: {percentUsed.toFixed(1)}% used
              </p>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                percentUsed >= 90
                  ? "bg-red-100 text-red-700"
                  : percentUsed >= 75
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {percentUsed >= 90 ? "⚠️ Over Budget" : percentUsed >= 75 ? "⚡ High Usage" : "✅ On Track"}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BudgetProgress;
