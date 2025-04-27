import { formatDistance } from "date-fns"
import { ArrowUpIcon } from "lucide-react"
import type { Transaction } from "@/lib/db/models"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return <p className="text-muted-foreground text-sm">No recent transactions</p>
  }

  // Format as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <div key={transaction._id}>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <ArrowUpIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.date
                    ? formatDistance(new Date(transaction.date), new Date(), { addSuffix: true })
                    : "Unknown date"}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="font-medium">
              {formatCurrency(transaction.amount)}
            </Badge>
          </div>
          {index < transactions.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  )
}
