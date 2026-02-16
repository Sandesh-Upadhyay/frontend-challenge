"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ProductFormValues } from "@/types/product";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  category: z.string().min(1, "Category is required"),
});

export type ProductFormSchema = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 0,
      category: defaultValues?.category ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="price"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.price.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="stock"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Stock
        </label>
        <input
          id="stock"
          type="number"
          {...register("stock", { valueAsNumber: true })}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        {errors.stock && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.stock.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Category
        </label>
        <input
          id="category"
          {...register("category")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.category.message}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
