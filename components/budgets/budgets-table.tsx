"use client"

import { useState } from "react"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Budget, Category } from "@/lib/db/models"
import { deleteBudget } from "@/app/actions/budgets"

interface BudgetsTableProps {
  budgets: Budget[]
  categories: Category[]
}

export function BudgetsTable({ budgets, categories }: BudgetsTableProps) {
  const [open, setOpen] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // Build a category map for faster lookups
  const categoryMap = new Map<string, Category>()
  categories.forEach((category) => {
    if (category._id) {
      categoryMap.set(category._id, category)
    }
  })

  const handleDelete = async () => {
    if (!budgetToDelete) return

    const result = await deleteBudget(budgetToDelete)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    setOpen(false)
    setBudgetToDelete(null)
  }

  const columns: ColumnDef<Budget>[] = [
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.getValue("categoryId") as string
        const category = categoryId ? categoryMap.get(categoryId) : null

        return (
          <div className="flex items-center gap-2">
            {category ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <span>{category.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Unknown</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Budget Amount",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount)

        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "period",
      header: "Period",
      cell: ({ row }) => {
        const period = row.getValue("period") as string
        return <div className="capitalize">{period}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const budget = row.original

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setBudgetToDelete(budget._id as string)
              setOpen(true)
            }}
            className="text-destructive hover:text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data: budgets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!budgets || budgets.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No budgets have been set yet</p>
        <p className="text-xs text-muted-foreground mt-2">Set your first budget using the form</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
