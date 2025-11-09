import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React, { Suspense } from "react";
import AccountCard from "./_component/account-card";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_component/budget-progress";
import DashboardOverview from "./_component/dashboard-overview";
import { BudgetSkeleton, OverviewSkeleton, SkeletonCard } from "@/components/loading";

// Mark this page as dynamic since it uses server-side auth/headers
export const dynamic = 'force-dynamic';

// Separate async components for each section
async function BudgetSection() {
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((account) => account.isDefault);
  
  if (!defaultAccount) return null;
  
  const budgetData = await getCurrentBudget(defaultAccount.id);
  
  if (!budgetData) return null;

  return (
    <BudgetProgress
      initialBudget={budgetData?.budget}
      currentExpenses={budgetData?.currentExpenses || 0}
    />
  );
}

async function OverviewSection() {
  const accounts = await getUserAccounts();
  const transactions = await getDashboardData();

  return <DashboardOverview accounts={accounts} transactions={transactions || []} />;
}

async function AccountsSection() {
  const accounts = await getUserAccounts();

  return (
    <>
      {accounts.length > 0 &&
        accounts?.map((account) => {
          return <AccountCard key={account.id} account={account} />;
        })}
    </>
  );
}

async function Dashboard() {
  return (
    <section className="px-5 py-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your financial overview</p>
        </div>
      </div>

      {/* Budget Progress */}
      <Suspense fallback={<BudgetSkeleton />}>
        <BudgetSection />
      </Suspense>

      {/* Overview */}
      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewSection />
      </Suspense>

      {/* Account Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          Your Accounts
          <span className="text-sm font-normal text-gray-500">(Click to view details)</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CreateAccountDrawer>
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-purple-300 hover:border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 hover:scale-105">
              <CardContent className="flex flex-col items-center justify-center text-purple-600 h-full pt-5 min-h-[180px]">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <p className="text-base font-bold">Add New Account</p>
                <p className="text-xs text-gray-600 mt-1">Create a new financial account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>

          <Suspense fallback={
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          }>
            <AccountsSection />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
