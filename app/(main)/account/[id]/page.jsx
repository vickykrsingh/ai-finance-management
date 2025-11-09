import { getAccountWithTransactions } from "@/actions/accounts";
import notfound from "@/app/not-found";
import React, { Suspense } from "react";
import TransactionTable from "../_components/transaction-table";
import AccountChart from "../_components/account-chart";
import { CardLoader, TableSkeleton } from "@/components/loading";

// Separate async components for each section
async function ChartSection({ id }) {
  const accountData = await getAccountWithTransactions(id);
  if (!accountData) return null;
  
  return <AccountChart transactions={accountData.transactions} />;
}

async function TransactionSection({ id }) {
  const accountData = await getAccountWithTransactions(id);
  if (!accountData) return null;
  
  return <TransactionTable transactions={accountData.transactions} />;
}

async function UserAccount({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    return notfound();
  }

  const { transactions, ...account } = accountData;
  return (
    <div className="space-y-8 px-5 max-w-7xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100">
        <div className="flex gap-4 items-end justify-between flex-wrap">
          <div className="">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">💳</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 capitalize">
                {account.name}
              </h1>
            </div>
            <p className="text-gray-600 font-medium ml-15">
              {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              ${parseFloat(account.balance).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600 font-semibold mt-1">
              {account._count.transactions} Transaction{account._count.transactions !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Chart section */}
      <Suspense fallback={<CardLoader />}>
        <ChartSection id={id} />
      </Suspense>

      {/* Transaction section */}
      <Suspense fallback={<TableSkeleton rows={8} />}>
        <TransactionSection id={id} />
      </Suspense>
    </div>
  );
}

export default UserAccount;
