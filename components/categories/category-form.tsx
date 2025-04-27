"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  CreditCard,
  Home,
  ShoppingCart,
  Utensils,
  Car,
  Heart,
  Briefcase,
  Plane,
  Book,
  Gift,
  Coffee,
  DollarSign,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import type { Category } from "@/lib/db/models"
import { createCategory, updateCategory } from "@/app/actions/categories"

interface CategoryFormProps {
  category?: Category
}

// Predefined colors
const colors = [
  "#f87171", // Red
  "#fb923c", // Orange
  "#facc15", // Yellow
  "#4ade80", // Green
  "#60a5fa", // Blue
  "#a78bfa", // Purple
  "#f472b6", // Pink
]

// Predefined icons
const icons = [
  { name: "creditCard", icon: CreditCard },
  { name: "home", icon: Home },
  { name: "shoppingCart", icon: ShoppingCart },
  { name: "utensils", icon: Utensils },
  { name: "car", icon: Car },
  { name: "heart", icon: Heart },
  { name: "briefcase", icon: Briefcase },
  { name: "plane", icon: Plane },
  { name: "book", icon: Book },
  { name: "gift", icon: Gift },
  { name: "coffee", icon: Coffee },
  { name: "dollar", icon: DollarSign },
]

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
})

export function CategoryForm({ category }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const isEditing = !!category?._id

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      color: category?.color || colors[0],
      icon: category?.icon || "creditCard",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("color", values.color)
      formData.append("icon", values.icon)

      let result

      if (isEditing && category._id) {
        result = await updateCategory(category._id, formData)
      } else {
        result = await createCategory(formData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/categories")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-2 mt-2"
                    >
                      {colors.map((color) => (
                        <FormItem key={color} className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                          </FormControl>
                          <label
                            htmlFor={`color-${color}`}
                            className={`h-8 w-8 rounded-full cursor-pointer flex items-center justify-center ${
                              field.value === color ? "ring-2 ring-primary ring-offset-2" : ""
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {field.value === color && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-white"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </label>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-6 gap-4 mt-2"
                    >
                      {icons.map((icon) => {
                        const Icon = icon.icon
                        return (
                          <FormItem key={icon.name} className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value={icon.name} id={`icon-${icon.name}`} className="sr-only" />
                            </FormControl>
                            <label
                              htmlFor={`icon-${icon.name}`}
                              className={`h-12 w-12 rounded-md cursor-pointer flex items-center justify-center ${
                                field.value === icon.name
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              <Icon className="h-6 w-6" />
                            </label>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-4 justify-end">
            <Button variant="outline" asChild>
              <Link href="/categories">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
