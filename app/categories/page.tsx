import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/app/actions/categories"
import { CategoriesGrid } from "@/components/categories/categories-grid"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your transaction categories</p>
        </div>
        <Button asChild>
          <Link href="/categories/new">Add Category</Link>
        </Button>
      </div>

      <CategoriesGrid categories={categories} />
    </div>
  )
}
