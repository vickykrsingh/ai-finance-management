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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredAndSortedTransactions.slice(startIndex, endIndex);
  const totalItems = filteredAndSortedTransactions.length;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, recurringFilter, sortConfig]);

  // Reset page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
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
            <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-b-2 border-purple-200">
              <TableHead className="w-[50px] pl-6">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    paginatedTransactions.length > 0 &&
                    paginatedTransactions.every(t => selectedIds.includes(t.id))
                  }
                  className="border-purple-400"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer font-bold text-gray-900 py-4"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  <span className="text-lg">📅</span>
                  <span>Date</span>
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4 text-purple-600" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="font-bold text-gray-900 py-4">
                <div className="flex items-center gap-1">
                  <span className="text-lg">📝</span>
                  <span>Description</span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer font-bold text-gray-900 py-4"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-1">
                  <span className="text-lg">🏷️</span>
                  <span>Category</span>
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4 text-purple-600" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer font-bold text-gray-900 py-4"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span className="text-lg">💵</span>
                  <span>Amount</span>
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4 text-purple-600" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="font-bold text-gray-900 py-4">
                <div className="flex items-center gap-1">
                  <span className="text-lg">🔄</span>
                  <span>Recurring</span>
                </div>
              </TableHead>
              <TableHead className="w-[80px] font-bold text-gray-900 py-4 pr-6 text-center">
                <span className="text-lg">⚙️</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-16"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl">📋</span>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">No Transactions Found</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or add a new transaction</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-purple-50/50 transition-colors border-b border-purple-100">
                  <TableCell className="pl-6">
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                      className="border-purple-400"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700 py-4">
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-gray-900 font-medium">
                      {transaction.description}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize py-4">
                    <Badge
                      style={{
                        backgroundColor: categoryColors[transaction.category],
                      }}
                      className="px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm"
                    >
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-right font-bold text-base py-4"
                  >
                    <span
                      className={transaction.type === "EXPENSE" ? "text-red-600" : "text-green-600"}
                    >
                      {transaction.type === "EXPENSE" ? "-" : "+"}$
                      {transaction.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="gap-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300 px-3 py-1.5 font-semibold"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              {
                                RECURRING_INTERVALS[
                                  transaction.recurringInterval
                                ]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                Recurs{" "}
                                {
                                  RECURRING_INTERVALS[
                                    transaction.recurringInterval
                                  ]
                                }
                              </span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1.5 bg-gray-100 text-gray-600 border-gray-300 px-3 py-1.5 font-semibold"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-100">
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-purple-200">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                          className="cursor-pointer font-medium"
                        >
                          <span className="mr-2">✏️</span> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer font-medium focus:text-red-700 focus:bg-red-50"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          <span className="mr-2">🗑️</span> Delete
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

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-purple-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Rows per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[80px] border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Page info */}
            <div className="text-sm font-semibold text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} transactions
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 border-purple-300 hover:bg-purple-50 disabled:opacity-50"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4 text-purple-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 border-purple-300 hover:bg-purple-50 disabled:opacity-50"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4 text-purple-600" />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`h-8 w-8 ${
                        currentPage === pageNumber
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                          : "border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 border-purple-300 hover:bg-purple-50 disabled:opacity-50"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4 text-purple-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 border-purple-300 hover:bg-purple-50 disabled:opacity-50"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4 text-purple-600" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;
