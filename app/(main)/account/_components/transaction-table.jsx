"use client";
import { bulkDeleteTransactions } from "@/actions/accounts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categoryColors } from "@/data/categories";
import UseFetch from "@/hooks/useFetch";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

function TransactionTable({ transactions }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = UseFetch(bulkDeleteTransactions);
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // apply sorting
    result.sort((a, b) => {
      let comparision = 0;
      switch (sortConfig.field) {
        case "date":
          comparision = new Date(a.date) - new Date(b.date);
          break;

        case "amount":
          comparision = a.amount - b.amount;
          break;

        case "category":
          comparision = a.category.localeCompare(b.category);
          break;

        default:
          comparision = 0;
      }
      return sortConfig.direction === "asc" ? comparision : -comparision;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field == field && current.direction === "asc" ? "desc" : "asc",
    }));
  };
  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item != id)
        : [...current, id]
    );
  };
  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((t) => t.id)
    );
  };
  const handleBulkDelete = () => {
    // TODO:
    if(!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)){
      return
    }
    deleteFn(selectedIds)
  };
  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };

  useEffect(()=>{
    if(deleted && !deleteLoading){
      toast.error("Transaction deleted successfully")
      setSelectedIds([])
    }
  },[deleted,deleteLoading])

  return (
    <div className="space-y-4">
      {deleteLoading && <BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
            <Input
              placeholder="Search transactions..."
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className="pl-10 border-purple-300 focus:border-purple-500 focus:ring-purple-500 font-medium"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">💰 Income</SelectItem>
                <SelectItem value="EXPENSE">💸 Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={recurringFilter}
              onValueChange={(value) => setRecurringFilter(value)}
            >
              <SelectTrigger className="w-[180px] border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="All Transactions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">🔄 Recurring Only</SelectItem>
                <SelectItem value="non-recurring">📋 Non-Recurring Only</SelectItem>
              </SelectContent>
            </Select>
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 font-semibold"
                >
                  <Trash className="h-4 w-4 mr-2" /> Delete ({selectedIds.length})
                </Button>
              </div>
            )}
            {(searchTerm || typeFilter || recurringFilter) && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearFilters}
                title="Clear Filters"
                className="border-purple-300 hover:bg-purple-50"
              >
                <X className="h-4 w-4 text-purple-600" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-xl border-2 border-purple-100 shadow-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100">
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length ===
                      filteredAndSortedTransactions.length &&
                    filteredAndSortedTransactions.length > 0
                  }
                  className="border-purple-400"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer font-bold text-gray-900"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  📅 Date{" "}
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4 text-purple-600" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="font-bold text-gray-900">📝 Description</TableHead>
              <TableHead
                className="cursor-pointer font-bold text-gray-900"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  🏷️ Category{" "}
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4 text-purple-600" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer font-bold text-gray-900"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  💵 Amount{" "}
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4 text-purple-600" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="font-bold text-gray-900">🔄 Recurring</TableHead>
              <TableHead className="w-[50px] font-bold text-gray-900">⚙️</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl">📋</span>
                    </div>
                    <p className="text-gray-600 font-semibold">No Transactions Found</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or add a new transaction</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-purple-50 transition-colors">
                  <TableCell>
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                      className="border-purple-400"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-700">
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <Badge
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-3 py-1 rounded-full text-white text-sm font-semibold shadow-md"
                    >
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-bold text-lg ${
                        transaction.type === "EXPENSE" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {transaction.type === "EXPENSE" ? "-" : "+"}$
                      {transaction.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="gap-1 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 border-purple-300 font-semibold"
                            >
                              <RefreshCw className="h-3 w-3" />
                              {
                                RECURRING_INTERVALS[
                                  transaction.recurringInterval
                                ]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default TransactionTable;
