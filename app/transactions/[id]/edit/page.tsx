import { notFound } from "next/navigation"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { getTransactionById } from "@/app/actions/transactions"
import { getCategories } from "@/app/actions/categories"

interface EditTransactionPageProps {
  params: {
    id: string
  }
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = await params
  const transaction = await getTransactionById(id)

  if (!transaction) {
    notFound()
  }

  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Transaction</h1>
        <p className="text-muted-foreground">Update transaction details</p>
      </div>

      <TransactionForm transaction={transaction} categories={categories} />
    </div>
  )
}
