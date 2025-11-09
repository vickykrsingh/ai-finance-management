"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");
  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");

      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }

      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});
    // Convert to array and sort by date
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <div>
      <Card className="border-2 border-purple-100 shadow-xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b border-purple-100">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
            Transaction Overview
          </CardTitle>
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] border-purple-300 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([key, { label }]) => {
                return (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <p className="text-sm font-semibold text-gray-600 mb-1">Total Income</p>
              <p className="text-2xl font-black text-green-600">
                ${totals.income.toFixed(2)}
              </p>
            </div>
            <div className="text-center bg-red-50 rounded-xl p-4 border-2 border-red-200">
              <p className="text-sm font-semibold text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-black text-red-600">
                ${totals.expense.toFixed(2)}
              </p>
            </div>
            <div className="text-center bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <p className="text-sm font-semibold text-gray-600 mb-1">Net Balance</p>
              <p
                className={`text-2xl font-black ${
                  totals.income - totals.expense >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${(totals.income - totals.expense).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9D5FF" />
                <XAxis dataKey="date" stroke="#9333EA" fontSize={12} />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="#9333EA"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, undefined]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #E9D5FF",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#22c55e"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#ef4444"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AccountChart;
