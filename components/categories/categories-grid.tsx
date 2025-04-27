"use client"

import { useState } from "react"
import Link from "next/link"
import { PencilIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { Category } from "@/lib/db/models"
import { deleteCategory } from "@/app/actions/categories"

interface CategoriesGridProps {
  categories: Category[]
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  const [open, setOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!categoryToDelete) return

    const result = await deleteCategory(categoryToDelete)

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
    setCategoryToDelete(null)
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-4">No categories have been created yet</p>
        <Button asChild>
          <Link href="/categories/new">Create your first category</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category._id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                <CardTitle>{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Used for transactions related to {category.name.toLowerCase()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/categories/${category._id}/edit`} className="flex items-center">
                  <PencilIcon className="mr-2 h-3 w-3" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => {
                  setCategoryToDelete(category._id as string)
                  setOpen(true)
                }}
              >
                <TrashIcon className="mr-2 h-3 w-3" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
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
