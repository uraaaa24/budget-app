"use client"

import { useState } from "react"
import { useCategoryQuery } from "@/features/dashboard/hooks/use-category-query"
import { useCreateCategory } from "@/features/categories/hooks/use-create-category"
import { NavigationMenu } from "@/components/layout/navigation-menu"
import { TwemojiEmoji } from "@/components/ui/twemoji-emoji"
import type { TransactionType } from "@/features/dashboard/model/types"
import { useForm } from "react-hook-form"

type CategoryFormValues = {
  name: string
  emoji: string
  type: TransactionType
}

export function CategoryManagement() {
  const { categories, queryError } = useCategoryQuery()
  const { isSubmitting, mutationError, submitCategory } = useCreateCategory()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      emoji: "",
      type: "expense",
    },
  })

  const selectedType = watch("type")
  const selectedEmoji = watch("emoji")

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      await submitCategory({
        name: values.name.trim(),
        emoji: values.emoji,
        type: values.type,
      })
      reset()
    } catch {
      // Error is handled by the hook
    }
  }

  const expenseCategories = categories.filter((c) => c.type === "expense")
  const incomeCategories = categories.filter((c) => c.type === "income")

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <NavigationMenu />
      <main className="container mx-auto max-w-3xl px-6 py-8">
        {queryError && (
          <div className="mb-8 border-l-4 border-rose-500 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">{queryError}</p>
          </div>
        )}

        <h1 className="mb-8 text-2xl font-bold text-slate-900">Categories</h1>

        {/* Add Category Form */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Add New Category
          </h2>

          {mutationError && (
            <div className="mb-4 border-l-4 border-rose-500 bg-rose-50 p-4">
              <p className="text-sm text-rose-700">{mutationError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Type Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Type
              </label>
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="radio"
                    value="expense"
                    {...register("type", { required: true })}
                    className="sr-only"
                  />
                  <div
                    className={`h-11 cursor-pointer rounded-lg text-center text-sm font-medium leading-[44px] transition-colors ${
                      selectedType === "expense"
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-900"
                    }`}
                  >
                    Expense
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    value="income"
                    {...register("type", { required: true })}
                    className="sr-only"
                  />
                  <div
                    className={`h-11 cursor-pointer rounded-lg text-center text-sm font-medium leading-[44px] transition-colors ${
                      selectedType === "income"
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-900"
                    }`}
                  >
                    Income
                  </div>
                </label>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category Name
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 1, message: "Name is required" },
                  maxLength: {
                    value: 50,
                    message: "Name must be 50 characters or less",
                  },
                })}
                placeholder="Food, Transport, Salary, etc."
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:outline-none"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-rose-600">{errors.name.message}</p>
              )}
            </div>

            {/* Emoji Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Emoji
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  {...register("emoji", {
                    required: "Emoji is required",
                    minLength: { value: 1, message: "Emoji is required" },
                    maxLength: {
                      value: 8,
                      message: "Emoji must be 8 characters or less",
                    },
                  })}
                  placeholder="🍔"
                  className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:outline-none"
                />
                {selectedEmoji && (
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                    <TwemojiEmoji emoji={selectedEmoji} size={24} />
                  </div>
                )}
              </div>
              {errors.emoji && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.emoji.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-opacity hover:opacity-75 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Category"}
            </button>
          </form>
        </section>

        {/* Expense Categories */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Expense Categories
          </h2>
          <div className="space-y-2">
            {expenseCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 border-b border-slate-200 py-3"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <TwemojiEmoji emoji={category.emoji} size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {category.name}
                  </p>
                  {category.isDefault && (
                    <p className="text-xs text-slate-500">Default</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Income Categories */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Income Categories
          </h2>
          <div className="space-y-2">
            {incomeCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 border-b border-slate-200 py-3"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <TwemojiEmoji emoji={category.emoji} size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {category.name}
                  </p>
                  {category.isDefault && (
                    <p className="text-xs text-slate-500">Default</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
