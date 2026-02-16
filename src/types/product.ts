export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface ProductFormValues {
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  totalCategories: number;
}
