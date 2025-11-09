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
    <section className="px-5 space-y-8">
      {/* Budget Progress */}
      <Suspense fallback={<BudgetSkeleton />}>
        <BudgetSection />
      </Suspense>

      {/* Overview */}
      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewSection />
      </Suspense>

      {/* Account Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow  cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
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
    </section>
  );
}

export default Dashboard;
