import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  featured: boolean;
  stock: number;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
}

class ProductService {
  getProducts(): Product[] {
    return productsData as Product[];
  }

  getProductById(id: number): Product | undefined {
    return productsData.find(p => p.id === id) as Product | undefined;
  }

  getProductsByCategory(category: string, subcategory?: string): Product[] {
    let products = productsData.filter(p => p.category === category) as Product[];

    if (subcategory) {
      products = products.filter(p => p.subcategory === subcategory);
    }

    return products;
  }

  getFeaturedProducts(): Product[] {
    return productsData.filter(p => p.featured) as Product[];
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return productsData.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(lowerQuery))
    ) as Product[];
  }

  getCategories(): Category[] {
    return categoriesData as Category[];
  }

  getCategoryById(id: string): Category | undefined {
    return categoriesData.find(c => c.id === id) as Category | undefined;
  }

  getSubcategoriesByCategory(categoryId: string): Subcategory[] {
    const category = this.getCategoryById(categoryId);
    return category?.subcategories || [];
  }
}

export default new ProductService();
