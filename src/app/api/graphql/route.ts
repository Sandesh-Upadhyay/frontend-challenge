import { NextRequest, NextResponse } from "next/server";

type Role = "MANAGER" | "STORE_KEEPER";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// In-memory store for mock data (resets on server restart)
const products: Product[] = [
  { id: "1", name: "Wheat", price: 2.5, stock: 100, category: "Grains" },
  { id: "2", name: "Corn", price: 1.8, stock: 3, category: "Grains" },
  { id: "3", name: "Soybeans", price: 4.2, stock: 50, category: "Oilseeds" },
];

function getDashboardStats() {
  const lowStockThreshold = 5;
  const categories = new Set(products.map((p) => p.category));
  return {
    totalProducts: products.length,
    lowStockItems: products.filter((p) => p.stock < lowStockThreshold).length,
    totalCategories: categories.size,
  };
}

function resolveOperation(
  operationName: string | null,
  query: string,
  variables: Record<string, unknown>
): Record<string, unknown> | null {
  const op = operationName ?? (query.includes("Login") ? "Login" : query.includes("GetProducts") ? "GetProducts" : query.includes("GetDashboardStats") ? "GetDashboardStats" : query.includes("createProduct") ? "CreateProduct" : query.includes("updateProduct") ? "UpdateProduct" : null);

  switch (op) {
    case "Login": {
      const email = (variables?.email as string) ?? "user@example.com";
      const role: Role = email.includes("store") ? "STORE_KEEPER" : "MANAGER";
      return {
        data: {
          login: {
            accessToken: "mock-jwt-" + Math.random().toString(36).slice(2),
            user: {
              id: "mock-user-1",
              email,
              role,
            },
          },
        },
      };
    }
    case "GetProducts":
      return {
        data: { products: [...products] },
      };
    case "GetDashboardStats":
      return {
        data: { dashboardStats: getDashboardStats() },
      };
    case "CreateProduct": {
      const input = variables?.input as { name: string; price: number; stock: number; category: string };
      if (!input?.name) {
        return { errors: [{ message: "name is required" }] };
      }
      const newProduct: Product = {
        id: String(products.length + 1),
        name: input.name,
        price: Number(input.price) ?? 0,
        stock: Number(input.stock) ?? 0,
        category: input.category ?? "Uncategorized",
      };
      products.push(newProduct);
      return { data: { createProduct: newProduct } };
    }
    case "UpdateProduct": {
      const id = variables?.id as string;
      const input = variables?.input as { name?: string; price?: number; stock?: number; category?: string };
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) {
        return { errors: [{ message: "Product not found" }] };
      }
      const updated = {
        ...products[idx],
        ...(input?.name != null && { name: input.name }),
        ...(input?.price != null && { price: Number(input.price) }),
        ...(input?.stock != null && { stock: Number(input.stock) }),
        ...(input?.category != null && { category: input.category }),
      };
      products[idx] = updated;
      return { data: { updateProduct: updated } };
    }
    default:
      return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables = {}, operationName } = body;
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { errors: [{ message: "Missing or invalid query" }] },
        { status: 400 }
      );
    }
    const result = resolveOperation(operationName ?? null, query, variables ?? {});
    if (!result) {
      return NextResponse.json(
        { errors: [{ message: "Unknown operation" }] },
        { status: 400 }
      );
    }
    if (result.errors) {
      return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { errors: [{ message: "Invalid request body" }] },
      { status: 400 }
    );
  }
}
