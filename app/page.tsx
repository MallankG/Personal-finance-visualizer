import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMonthlyExpenses, getTransactions } from "@/app/actions/transactions"
import { getCategoryExpenses } from "@/app/actions/categories"
import { getBudgetComparison } from "@/app/actions/budgets"
import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart"
import { CategoryExpensesChart } from "@/components/charts/category-expenses-chart"
import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { DashboardSummary } from "@/components/dashboard-summary"
import { Skeleton } from "@/components/ui/skeleton"

export default async function Dashboard() {
  return (
    <div className="space-y-8 pb-10 pt-6 animate-slide-up">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your financial overview</p>
      </div>

      <Suspense fallback={<DashboardSummarySkeleton />}>
        <DashboardSummaryWrapper />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full overflow-hidden border-none bg-gradient-to-br from-primary/5 via-card to-card shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Your spending over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="h-80 flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              }
            >
              <MonthlyExpensesWrapper />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 via-card to-card shadow-md">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>How your money is allocated</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="h-80 flex items-center justify-center">
                  <Skeleton className="h-64 w-full rounded-full" />
                </div>
              }
            >
              <CategoryExpensesWrapper />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 via-card to-card shadow-md">
          <CardHeader>
            <CardTitle>Budget vs. Actual</CardTitle>
            <CardDescription>How you're tracking against budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="h-80 flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              }
            >
              <BudgetComparisonWrapper />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 via-card to-card shadow-md">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<RecentTransactionsSkeleton />}>
              <RecentTransactionsWrapper />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden border-none shadow-md">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-28 mb-1" />
            <Skeleton className="h-3 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RecentTransactionsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

async function DashboardSummaryWrapper() {
  const transactions = await getTransactions()
  const categoryExpenses = await getCategoryExpenses()

  return <DashboardSummary transactions={transactions} categoryExpenses={categoryExpenses} />
}

async function MonthlyExpensesWrapper() {
  const data = await getMonthlyExpenses()
  return <MonthlyExpensesChart data={data} />
}

async function CategoryExpensesWrapper() {
  const data = await getCategoryExpenses()
  return <CategoryExpensesChart data={data} />
}

async function BudgetComparisonWrapper() {
  const data = await getBudgetComparison()
  return <BudgetComparisonChart data={data} />
}

async function RecentTransactionsWrapper() {
  const transactions = await getTransactions()
  return <RecentTransactions transactions={transactions.slice(0, 5)} />
}
