"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import clientPromise from "@/lib/db/mongodb"
import type { Category } from "@/lib/db/models"
import { ObjectId } from "mongodb"

// Validation schema for categories
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
})

// Helper to get the categories collection
async function getCollection() {
  const client = await clientPromise
  const db = client.db()
  return db.collection("categories")
}

// Create a new category
export async function createCategory(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries())
    const validatedData = categorySchema.parse({
      name: data.name,
      color: data.color,
      icon: data.icon,
    })

    const collection = await getCollection()
    await collection.insertOne(validatedData)

    revalidatePath("/categories")
    return { success: true, message: "Category created successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to create category" }
  }
}

// Get all categories
export async function getCategories() {
  try {
    const collection = await getCollection()
    const categories = await collection.find({}).toArray()
    // Convert _id to string for each category
    return categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
    })) as Category[]
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

// Get a single category by ID
export async function getCategoryById(id: string) {
  try {
    const collection = await getCollection()
    const category = await collection.findOne({ _id: new ObjectId(id) })
    if (!category) return null
    return { ...category, _id: category._id.toString() } as Category
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return null
  }
}

// Update a category
export async function updateCategory(id: string, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries())
    const validatedData = categorySchema.parse({
      name: data.name,
      color: data.color,
      icon: data.icon,
    })
    const collection = await getCollection()
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: validatedData })
    revalidatePath("/categories")
    return { success: true, message: "Category updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to update category" }
  }
}

// Delete a category
export async function deleteCategory(id: string) {
  try {
    const collection = await getCollection()
    await collection.deleteOne({ _id: new ObjectId(id) })
    revalidatePath("/categories")
    return { success: true, message: "Category deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete category" }
  }
}

// Get category expenses for pie chart
export async function getCategoryExpenses() {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db
      .collection("transactions")
      .aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              categoryId: "$categoryId",
              categoryName: { $ifNull: ["$category.name", "Uncategorized"] },
              color: { $ifNull: ["$category.color", "#999999"] },
            },
            amount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id.categoryName",
            amount: 1,
            color: "$_id.color",
          },
        },
      ])
      .toArray()

    return result
  } catch (error) {
    console.error("Failed to fetch category expenses:", error)
    return []
  }
}
