import { TransactionForm } from "@/components/transactions/transaction-form"
import { getCategories } from "@/app/actions/categories"

export default async function NewTransactionPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Transaction</h1>
        <p className="text-muted-foreground">Create a new financial transaction</p>
      </div>

      <TransactionForm categories={categories} />
    </div>
  )
}
