import { Card, CardContent } from "@/components/ui/card"
import type { Transaction, CategoryExpense } from "@/lib/db/models"
import { BanknotesIcon, ChartPieIcon, CreditCardIcon } from "@/components/ui/icons"

interface DashboardSummaryProps {
  transactions: Transaction[]
  categoryExpenses: CategoryExpense[]
}

export function DashboardSummary({ transactions, categoryExpenses }: DashboardSummaryProps) {
  // Calculate total expenses
  const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)

  // Get top category
  let topCategory = { category: "None", amount: 0 }
  if (categoryExpenses.length > 0) {
    topCategory = categoryExpenses.reduce(
      (max, current) => (current.amount > max.amount ? current : max),
      categoryExpenses[0],
    )
  }

  // Get transaction count
  const transactionCount = transactions.length

  // Format as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="stat-card border-none bg-gradient-to-br from-expense/10 via-card to-card">
        <CardContent className="p-6">
          <div className="stat-card-icon">
            <BanknotesIcon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
            <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-muted-foreground">Lifetime total</p>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card border-none bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="p-6">
          <div className="stat-card-icon">
            <ChartPieIcon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Top Spending Category</p>
            <p className="text-3xl font-bold">{topCategory.category}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(topCategory.amount)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card border-none bg-gradient-to-br from-saving/10 via-card to-card">
        <CardContent className="p-6">
          <div className="stat-card-icon">
            <CreditCardIcon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
            <p className="text-3xl font-bold">{transactionCount}</p>
            <p className="text-xs text-muted-foreground">All time transactions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
