import { notFound } from "next/navigation"
import { CategoryForm } from "@/components/categories/category-form"
import { getCategoryById } from "@/app/actions/categories"

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await getCategoryById(params.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground">Update category details</p>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}
