"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { GET_PRODUCTS } from "@/graphql/queries";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "@/graphql/mutations";
import type { Product, ProductFormValues } from "@/types/product";
import { ProductForm } from "@/components/forms/ProductForm";
import { ProductModal } from "@/components/ui/ProductModal";
import { useAuth } from "@/context/AuthContext";

interface GetProductsData {
  products: Product[];
}

export default function ProductsPage() {
  const { hasRole } = useAuth();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data, loading, error, refetch } = useQuery<GetProductsData>(GET_PRODUCTS);
  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      setModal(null);
      refetch();
    },
  });
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      setModal(null);
      setEditingProduct(null);
      refetch();
    },
  });

  const canEdit = hasRole("MANAGER") || hasRole("STORE_KEEPER");

  const filteredProducts = useMemo(() => {
    const list = data?.products ?? [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [data?.products, search]);

  function openAdd() {
    setEditingProduct(null);
    setModal("add");
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setModal("edit");
  }

  function handleCreate(values: ProductFormValues) {
    createProduct({
      variables: {
        input: {
          name: values.name,
          price: values.price,
          stock: values.stock,
          category: values.category,
        },
      },
    });
  }

  function handleUpdate(values: ProductFormValues) {
    if (!editingProduct) return;
    updateProduct({
      variables: {
        id: editingProduct.id,
        input: {
          name: values.name,
          price: values.price,
          stock: values.stock,
          category: values.category,
        },
      },
    });
  }

  const isSubmitting = creating || updating;

  return (
    <ProtectedRoute allowedRoles={["MANAGER", "STORE_KEEPER"]}>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Products
            </h1>
            {canEdit && (
              <button
                type="button"
                onClick={openAdd}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Add Product
              </button>
            )}
          </div>

          <div>
            <input
              type="search"
              placeholder="Search by name or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error.graphQLErrors?.[0]?.message ?? error.message}
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors">
            {loading ? (
              <div className="p-4">
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Stock
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Category
                      </th>
                      {canEdit && (
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={canEdit ? 5 : 4}
                          className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {product.name}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {product.stock}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {product.category}
                          </td>
                          {canEdit && (
                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                              <button
                                type="button"
                                onClick={() => openEdit(product)}
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                              >
                                Edit
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {modal === "add" && (
          <ProductModal title="Add Product" onClose={() => setModal(null)}>
            <ProductForm
              onSubmit={handleCreate}
              onCancel={() => setModal(null)}
              isLoading={isSubmitting}
            />
          </ProductModal>
        )}

        {modal === "edit" && editingProduct && (
          <ProductModal
            title="Edit Product"
            onClose={() => {
              setModal(null);
              setEditingProduct(null);
            }}
          >
            <ProductForm
              defaultValues={{
                name: editingProduct.name,
                price: editingProduct.price,
                stock: editingProduct.stock,
                category: editingProduct.category,
              }}
              onSubmit={handleUpdate}
              onCancel={() => {
                setModal(null);
                setEditingProduct(null);
              }}
              isLoading={isSubmitting}
            />
          </ProductModal>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
