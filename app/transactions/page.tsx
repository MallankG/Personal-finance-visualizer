import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTransactions } from "@/app/actions/transactions"
import { getCategories } from "@/app/actions/categories"
import { TransactionsTable } from "@/components/transactions/transactions-table"

export default async function TransactionsPage() {
  const transactions = await getTransactions()
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage your financial transactions</p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">Add Transaction</Link>
        </Button>
      </div>

      <TransactionsTable transactions={transactions} categories={categories} />
    </div>
  )
}
