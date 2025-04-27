"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import clientPromise from "@/lib/db/mongodb"
import type { Budget } from "@/lib/db/models"
import { ObjectId } from "mongodb"

// Validation schema for budgets
const budgetSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  period: z.string().min(1, "Period is required"),
})

// Helper to get the budgets collection
async function getCollection() {
  const client = await clientPromise
  const db = client.db()
  return db.collection("budgets")
}

// Create a new budget
export async function createBudget(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries())
    const validatedData = budgetSchema.parse({
      categoryId: data.categoryId,
      amount: data.amount,
      period: data.period,
    })

    const collection = await getCollection()

    // Check if budget for this category already exists
    const existingBudget = await collection.findOne({
      categoryId: validatedData.categoryId,
      period: validatedData.period,
    })

    if (existingBudget) {
      // Update existing budget
      await collection.updateOne({ _id: existingBudget._id }, { $set: { amount: validatedData.amount } })
    } else {
      // Create new budget
      await collection.insertOne(validatedData)
    }

    revalidatePath("/budgets")
    revalidatePath("/")
    return { success: true, message: "Budget saved successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to save budget" }
  }
}

// Get all budgets
export async function getBudgets() {
  try {
    const collection = await getCollection()
    const budgets = await collection.find({}).toArray()
    // Convert _id to string for each budget
    return budgets.map((b) => ({
      ...b,
      _id: b._id.toString(),
    })) as Budget[]
  } catch (error) {
    console.error("Failed to fetch budgets:", error)
    return []
  }
}

// Delete a budget
export async function deleteBudget(id: string) {
  try {
    const collection = await getCollection()
    await collection.deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/budgets")
    revalidatePath("/")
    return { success: true, message: "Budget deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete budget" }
  }
}

// Get budget vs actual comparison
export async function getBudgetComparison() {
  try {
    const client = await clientPromise
    const db = client.db()

    // First, get all budgets with category info
    const budgets = await db
      .collection("budgets")
      .aggregate([
        {
          $match: { period: "monthly" }, // Only consider monthly budgets for now
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
      ])
      .toArray()

    // Get current month spending by category
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const spending = await db
      .collection("transactions")
      .aggregate([
        {
          $addFields: {
            dateObj: { $toDate: "$date" }
          }
        },
        {
          $match: {
            dateObj: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: { $toString: "$categoryId" },
            actual: { $sum: "$amount" },
          },
        },
      ])
      .toArray()

    // Create spending map for quick lookup
    const spendingMap = new Map()
    spending.forEach((item) => {
      spendingMap.set(item._id, item.actual)
    })

    // Combine budget and actual data
    return budgets.map((budget) => ({
      category: budget.category.name,
      budgeted: budget.amount,
      actual: spendingMap.get(budget.categoryId) || 0,
      color: budget.category.color,
    }))
  } catch (error) {
    console.error("Failed to fetch budget comparison:", error)
    return []
  }
}
