// MongoDB schema models
export type Transaction = {
  _id?: string
  amount: number
  date: Date
  description: string
  categoryId?: string
}

export type Category = {
  _id?: string
  name: string
  color: string
  icon: string
}

export type Budget = {
  _id?: string
  categoryId: string
  amount: number
  period: string // 'monthly', 'yearly', etc.
}

export type MonthlyExpense = {
  month: string
  amount: number
}

export type CategoryExpense = {
  category: string
  amount: number
  color: string
}

export type BudgetComparison = {
  category: string
  budgeted: number
  actual: number
  color: string
}
