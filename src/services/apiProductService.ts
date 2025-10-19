import { API_ENDPOINTS } from '../config/api';

export interface Product {
  id: number;
  name: string;
  producto: string;
  variedad?: string;
  presentacion?: string;
  category: string;
  subcategory?: string;
  sku: string;
  precio: number;
  precioOriginal: number;
  descripcion?: string;
  imagen?: string;
  marca?: string;
  slug: string;
  stock: number;
  destacado: boolean;
  nuevo: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
}

export interface ProductListResponse {
  total: number;
  paginas: number;
  paginaActual: number;
  productos: Product[];
}

class ApiProductService {
  private async fetchFromApi<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getProducts(params?: {
    page?: number;
    limit?: number;
    categoria?: string;
    subcategoria?: string;
    buscar?: string;
    precioMin?: number;
    precioMax?: number;
    ordenar?: string;
    orden?: 'ASC' | 'DESC';
  }): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_ENDPOINTS.PRODUCTS}?${searchParams.toString()}`;
    return this.fetchFromApi<ProductListResponse>(url);
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const url = API_ENDPOINTS.PRODUCT_BY_SLUG(slug);
    return this.fetchFromApi<Product>(url);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    try {
      const response = await this.getProducts({ limit: 1000 });
      return response.productos.find(p => p.id === id);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      return undefined;
    }
  }

  async getProductsByCategory(category: string, subcategory?: string): Promise<Product[]> {
    try {
      const response = await this.getProducts({
        categoria: subcategory || category,
        limit: 1000
      });
      return response.productos;
    } catch (error) {
      console.error('Error getting products by category:', error);
      return [];
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await this.getProducts({ limit: 1000 });
      return response.productos.filter(p => p.destacado);
    } catch (error) {
      console.error('Error getting featured products:', error);
      return [];
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await this.getProducts({
        buscar: query,
        limit: 1000
      });
      return response.productos;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return this.fetchFromApi<Category[]>(API_ENDPOINTS.CATEGORIES);
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    try {
      const categories = await this.getCategories();
      return categories.find(c => c.id === id);
    } catch (error) {
      console.error('Error getting category by ID:', error);
      return undefined;
    }
  }

  async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    try {
      const category = await this.getCategoryById(categoryId);
      return category?.subcategories || [];
    } catch (error) {
      console.error('Error getting subcategories:', error);
      return [];
    }
  }

  // Admin methods (for future implementation)
  async upsertProduct(product: Partial<Product>): Promise<Product> {
    // TODO: Implement when admin endpoints are ready
    throw new Error('Not implemented yet');
  }

  async deleteProduct(productId: number): Promise<void> {
    // TODO: Implement when admin endpoints are ready
    throw new Error('Not implemented yet');
  }

  async upsertCategory(category: Partial<Category>): Promise<Category> {
    // TODO: Implement when admin endpoints are ready
    throw new Error('Not implemented yet');
  }

  async deleteCategory(categoryId: string): Promise<void> {
    // TODO: Implement when admin endpoints are ready
    throw new Error('Not implemented yet');
  }
}

export default new ApiProductService();