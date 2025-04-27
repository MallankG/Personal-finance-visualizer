import { getCategories } from "@/app/actions/categories"
import { getBudgets } from "@/app/actions/budgets"
import { BudgetForm } from "@/components/budgets/budget-form"
import { BudgetsTable } from "@/components/budgets/budgets-table"

export default async function BudgetsPage() {
  const categories = await getCategories()
  const budgets = await getBudgets()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">Set and manage your monthly spending limits</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BudgetForm categories={categories} />
        </div>
        <div className="lg:col-span-2">
          <BudgetsTable budgets={budgets} categories={categories} />
        </div>
      </div>
    </div>
  )
}
