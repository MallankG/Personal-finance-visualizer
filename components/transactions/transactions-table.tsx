"use client"

import { useState } from "react"
import Link from "next/link"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import type { Transaction, Category } from "@/lib/db/models"
import { deleteTransaction } from "@/app/actions/transactions"
import { Select } from "@/components/ui/select"
import { format } from "date-fns"

interface TransactionsTableProps {
  transactions: Transaction[]
  categories: Category[]
}

export function TransactionsTable({ transactions, categories }: TransactionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [open, setOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const { toast } = useToast()
  const router = useRouter();

  // Build a category map for faster lookups
  const categoryMap = new Map<string, Category>()
  categories.forEach((category) => {
    if (category._id) {
      categoryMap.set(category._id, category)
    }
  })

  const handleDelete = async () => {
    if (!transactionToDelete) return

    const result = await deleteTransaction(transactionToDelete)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    setOpen(false)
    setTransactionToDelete(null)
  }

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> 
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount)
        return <div className="w-full flex justify-center"><span>{formatted}</span></div>
      },
      meta: { align: "right" },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> 
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const value = row.getValue("date")
        if (!value) return <div>Unknown</div>
        const date = new Date(value as string)
        // Use fixed format for SSR/CSR consistency
        return <div className="text-center w-full">{format(date, "dd/MM/yyyy")}</div>
      },
      meta: { align: "center" },
    },
    {
      accessorKey: "categoryId",
      header: () => <div className="text-center w-full">Category</div>,
      cell: ({ row }) => {
        const categoryId = row.getValue("categoryId") as string
        const category = categoryId ? categoryMap.get(categoryId) : null
        return (
          <div className="flex items-center gap-2 justify-center w-full">
            {category ? (
              <><div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} /><span>{category.name}</span></>
            ) : (
              <span className="text-muted-foreground">Uncategorized</span>
            )}
          </div>
        )
      },
      meta: { align: "center" },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/transactions/${transaction._id}/edit`} className="flex items-center cursor-pointer">
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center text-destructive focus:text-destructive cursor-pointer"
                onClick={() => {
                  setTransactionToDelete(transaction._id as string)
                  setOpen(true)
                }}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Pass the original transactions array to useReactTable
  const table = useReactTable({
    data: transactions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    // Add a manual filtering function for date and category
    globalFilterFn: (row, columnId, filterValue) => {
      // This is not used, but required by the API
      return true
    },
  })

  // Filter rows after table filtering (to avoid infinite loop)
  const filteredRows = table.getRowModel().rows.filter(row => {
    let dateMatch = true
    let categoryMatch = true
    if (dateFilter) {
      const txDate = format(new Date(row.original.date), "yyyy-MM-dd")
      dateMatch = txDate === dateFilter
    }
    if (categoryFilter) {
      categoryMatch = row.original.categoryId === categoryFilter
    }
    return dateMatch && categoryMatch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center py-4">
        <Input
          placeholder="Filter by description..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
          className="max-w-xs"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="max-w-xs px-3 py-2 border rounded bg-background text-foreground"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="max-w-xs px-3 py-2 border rounded bg-background text-foreground"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap px-4 py-2 align-middle text-center">{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredRows.length ? (
              filteredRows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2 align-middle whitespace-nowrap text-center">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No transactions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {filteredRows.length} of {transactions.length} transaction(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
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
