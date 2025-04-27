"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import type { BudgetComparison } from "@/lib/db/models"
import { Card } from "@/components/ui/card"

interface BudgetComparisonChartProps {
  data: BudgetComparison[]
}

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex items-center justify-center h-80 bg-muted/20 border-none">
        <p className="text-muted-foreground">No budget data available</p>
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

  // Create gradients for the bars
  const budgetGradientId = "budgetGradient"
  const actualGradientId = "actualGradient"

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        layout="vertical"
        barGap={8}
        barCategoryGap={16}
      >
        <defs>
          <linearGradient id={budgetGradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id={actualGradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--expense))" stopOpacity={0.8} />
            <stop offset="100%" stopColor="hsl(var(--expense))" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--muted))" />
        <XAxis
          type="number"
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ strokeWidth: 0 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          type="category"
          dataKey="category"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ strokeWidth: 0 }}
          width={100}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          formatter={(value, name) => [formatCurrency(value as number), name === 'actual' ? 'Actual' : 'Budget']}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
          }}
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
        />
        <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: "10px" }} />
        <Bar
          dataKey="budgeted"
          name="Budget"
          fill={`url(#${budgetGradientId})`}
          barSize={20}
          radius={[0, 4, 4, 0]}
          animationDuration={1500}
        />
        <Bar
          dataKey="actual"
          name="Actual"
          fill={`url(#${actualGradientId})`}
          barSize={20}
          radius={[0, 4, 4, 0]}
          animationDuration={1500}
          animationBegin={300}
          shape={(props: any) => {
            if (props.payload.actual === 0) {
              return (
                <g>
                  <rect
                    x={props.x}
                    y={props.y}
                    width={props.width}
                    height={props.height}
                    fill="#e5e7eb"
                    opacity={0.3}
                  />
                  <text
                    x={props.x + 8}
                    y={props.y + props.height / 2 + 4}
                    fontSize={12}
                    fill="#888"
                  >
                    No Data
                  </text>
                </g>
              )
            }
            // Default bar: must return a valid SVG rect
            return <rect x={props.x} y={props.y} width={props.width} height={props.height} fill={props.fill} rx={props.radius ? props.radius[0] : 0} />
          }}
        />
        {data.map(
          (item, index) =>
            item.actual > item.budgeted && (
              <ReferenceLine
                key={`ref-${index}`}
                y={item.category}
                x={item.budgeted}
                stroke="hsl(var(--expense))"
                strokeWidth={2}
                strokeDasharray="3 3"
                isFront={true}
              />
            ),
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
