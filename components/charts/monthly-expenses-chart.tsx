"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { MonthlyExpense } from "@/lib/db/models"
import { Card } from "@/components/ui/card"

interface MonthlyExpensesChartProps {
  data: MonthlyExpense[]
}

export function MonthlyExpensesChart({ data }: MonthlyExpensesChartProps) {
  console.log("MonthlyExpensesChart data:", data)

  if (!data || data.length === 0) {
    return (
      <Card className="flex items-center justify-center h-80 bg-muted/20 border-none">
        <p className="text-muted-foreground">No expense data available</p>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Create a gradient for the bars
  const gradientId = "expenseGradient"

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ strokeWidth: 0 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ strokeWidth: 0 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          formatter={(value) => [formatCurrency(value as number), "Expenses"]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
          }}
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
        />
        <Bar
          dataKey="amount"
          fill={`url(#${gradientId})`}
          radius={[4, 4, 0, 0]}
          barSize={40}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
