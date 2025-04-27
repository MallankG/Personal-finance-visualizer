"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import clientPromise from "@/lib/db/mongodb"
import type { Transaction } from "@/lib/db/models"
import { ObjectId } from "mongodb"

// Validation schema for transactions
const transactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  date: z.coerce.date(),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().optional(),
})

// Helper to get the transactions collection
async function getCollection() {
  const client = await clientPromise
  const db = client.db()
  return db.collection("transactions")
}

// Create a new transaction
export async function createTransaction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries())
    const validatedData = transactionSchema.parse({
      amount: data.amount,
      date: data.date ? new Date(data.date as string) : new Date(),
      description: data.description,
      categoryId: data.categoryId || undefined,
    })

    // Prepare document for insertion, converting categoryId to ObjectId if present
    const docToInsert = {
      ...validatedData,
      ...(validatedData.categoryId && { categoryId: new ObjectId(validatedData.categoryId) })
    }

    const collection = await getCollection()
    await collection.insertOne(docToInsert)

    revalidatePath("/transactions")
    revalidatePath("/")
    return { success: true, message: "Transaction created successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to create transaction" }
  }
}

// Get all transactions
export async function getTransactions() {
  try {
    const collection = await getCollection()
    const transactions = await collection.find({}).sort({ date: -1 }).toArray()
    // Convert _id to string for each transaction
    return transactions.map((tx) => ({
      ...tx,
      _id: tx._id.toString(),
    })) as Transaction[]
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return []
  }
}

// Get a single transaction by ID
export async function getTransactionById(id: string) {
  try {
    const collection = await getCollection()
    const transaction = await collection.findOne({ _id: new ObjectId(id) })
    if (!transaction) return null
    return { ...transaction, _id: transaction._id.toString() } as Transaction
  } catch (error) {
    console.error("Failed to fetch transaction:", error)
    return null
  }
}

// Update a transaction
export async function updateTransaction(id: string, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries())
    const validatedData = transactionSchema.parse({
      amount: data.amount,
      date: data.date ? new Date(data.date as string) : new Date(),
      description: data.description,
      categoryId: data.categoryId || undefined,
    })
    const collection = await getCollection()
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: validatedData })
    revalidatePath("/transactions")
    revalidatePath("/")
    return { success: true, message: "Transaction updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to update transaction" }
  }
}

// Delete a transaction
export async function deleteTransaction(id: string) {
  try {
    const collection = await getCollection()
    await collection.deleteOne({ _id: new ObjectId(id) })
    revalidatePath("/transactions")
    revalidatePath("/")
    return { success: true, message: "Transaction deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete transaction" }
  }
}

// Get monthly expenses for the chart
export async function getMonthlyExpenses() {
  try {
    const collection = await getCollection()
    const result = await collection
      .aggregate([
        {
          $addFields: {
            dateObj: { $toDate: "$date" }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$dateObj" },
              month: { $month: "$dateObj" },
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ])
      .toArray()

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return result.map((item) => ({
      month: months[item._id.month - 1],
      amount: item.total,
    }))
  } catch (error) {
    console.error("Failed to fetch monthly expenses:", error)
    return []
  }
}
