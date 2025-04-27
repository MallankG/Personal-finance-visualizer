"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { CategoryExpense } from "@/lib/db/models"
import { Card } from "@/components/ui/card"

interface CategoryExpensesChartProps {
  data: CategoryExpense[]
}

export function CategoryExpensesChart({ data }: CategoryExpensesChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex items-center justify-center h-80 bg-muted/20 border-none">
        <p className="text-muted-foreground">No category data available</p>
      </Card>
    )
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  // Use color from data, fallback to a default palette
  const fallbackColors = [
    "#3b82f6", "#f59e42", "#10b981", "#f43f5e", "#a78bfa", "#fbbf24", "#6366f1", "#14b8a6", "#eab308", "#64748b"
  ]
  const getColor = (entry: CategoryExpense, idx: number) => {
    return entry.color || fallbackColors[idx % fallbackColors.length]
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          nameKey="category"
          dataKey="amount"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          paddingAngle={2}
          animationDuration={1200}
          label={false}
        >
          {data.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={getColor(entry, idx)}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatCurrency(value as number), "Expenses"]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            color: "#18181b",
            fontWeight: 500,
          }}
          labelStyle={{ color: "#18181b", fontWeight: 600 }}
          cursor={{ fill: "#e5e7eb", opacity: 0.2 }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          payload={data.map((entry, idx) => {
            return {
              value: entry.category,
              type: "circle",
              color: getColor(entry, idx),
              id: idx.toString(),
            }
          })}
          formatter={(value, entry) => {
            return <span style={{ color: getColor(data[Number(entry.id)], Number(entry.id)), fontWeight: 500 }}>{value}</span>
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
