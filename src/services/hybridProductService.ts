import apiProductService, { Product as ApiProduct, Category as ApiCategory, Subcategory as ApiSubcategory, ProductListResponse } from './apiProductService';
import staticProductService from './productService.backup';

// Re-export types for compatibility
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
  descripcion?: string;
  propiedades?: string[];
  usosRecomendados?: string[];
  sizes: string[];
  colors: string[];
  featured: boolean;
  stock: number;
  // Additional fields from API
  producto?: string;
  variedad?: string;
  presentacion?: string;
  sku?: string;
  precio?: number;
  precioOriginal?: number;
  marca?: string;
  slug?: string;
  destacado?: boolean;
  nuevo?: boolean;
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

class HybridProductService {
  private useApi: boolean = true;

  constructor() {
    // Check if API is available
    this.checkApiAvailability();
  }

  private async checkApiAvailability(): Promise<void> {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL || 'http://localhost:3001/M2SHOP/productos/frontend', {
        method: 'HEAD',
        mode: 'cors',
      });
      this.useApi = response.ok;
    } catch (error) {
      console.warn('API not available, falling back to static data');
      this.useApi = false;
    }
  }

  private getService() {
    return this.useApi ? apiProductService : staticProductService;
  }

  private convertApiProductToFrontend(apiProduct: ApiProduct): Product {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      category: apiProduct.category,
      subcategory: apiProduct.subcategory,
      price: apiProduct.precio,
      originalPrice: apiProduct.precioOriginal,
      image: apiProduct.imagen || '',
      images: apiProduct.imagen ? [apiProduct.imagen] : [],
      description: apiProduct.descripcion || '',
      descripcion: apiProduct.descripcion,
      featured: apiProduct.destacado,
      stock: apiProduct.stock,
      // Additional fields
      producto: apiProduct.producto,
      variedad: apiProduct.variedad,
      presentacion: apiProduct.presentacion,
      sku: apiProduct.sku,
      precio: apiProduct.precio,
      precioOriginal: apiProduct.precioOriginal,
      marca: apiProduct.marca,
      slug: apiProduct.slug,
      destacado: apiProduct.destacado,
      nuevo: apiProduct.nuevo,
      // Default values for missing fields
      propiedades: [],
      usosRecomendados: [],
      sizes: [],
      colors: []
    };
  }

  private convertApiCategoryToFrontend(apiCategory: ApiCategory): Category {
    return {
      id: apiCategory.id,
      name: apiCategory.name,
      description: apiCategory.description,
      image: apiCategory.image,
      subcategories: apiCategory.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        image: sub.image
      }))
    };
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
  }): Promise<ProductListResponse | Product[]> {
    const service = this.getService();
    
    if (this.useApi) {
      const response = await service.getProducts(params);
      return {
        ...response,
        productos: response.productos.map(p => this.convertApiProductToFrontend(p))
      };
    } else {
      // Convert static service response to match API format
      const products = service.getProducts();
      const filteredProducts = this.filterStaticProducts(products, params);
      
      return {
        total: filteredProducts.length,
        paginas: 1,
        paginaActual: 1,
        productos: filteredProducts
      };
    }
  }

  private filterStaticProducts(products: Product[], params?: any): Product[] {
    let filtered = [...products];

    if (params?.categoria) {
      filtered = filtered.filter(p => p.category === params.categoria);
    }

    if (params?.subcategoria) {
      filtered = filtered.filter(p => p.subcategory === params.subcategoria);
    }

    if (params?.buscar) {
      const query = params.buscar.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.descripcion?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.subcategory?.toLowerCase().includes(query)
      );
    }

    if (params?.precioMin) {
      filtered = filtered.filter(p => p.precio >= params.precioMin);
    }

    if (params?.precioMax) {
      filtered = filtered.filter(p => p.precio <= params.precioMax);
    }

    return filtered;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const service = this.getService();
    
    if (this.useApi) {
      try {
        const apiProduct = await service.getProductBySlug(slug);
        return apiProduct ? this.convertApiProductToFrontend(apiProduct) : undefined;
      } catch (error) {
        console.error('Error getting product by slug:', error);
        return undefined;
      }
    } else {
      // For static service, we need to find by slug in the name or create a slug
      const products = service.getProducts();
      return products.find(p => 
        p.name.toLowerCase().replace(/[^a-z0-9-]/g, '-') === slug.toLowerCase() ||
        p.slug === slug
      );
    }
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const service = this.getService();
    
    if (this.useApi) {
      const apiProduct = await service.getProductById(id);
      return apiProduct ? this.convertApiProductToFrontend(apiProduct) : undefined;
    } else {
      return service.getProductById(id);
    }
  }

  async getProductsByCategory(category: string, subcategory?: string): Promise<Product[]> {
    const service = this.getService();
    
    if (this.useApi) {
      const apiProducts = await service.getProductsByCategory(category, subcategory);
      return apiProducts.map(p => this.convertApiProductToFrontend(p));
    } else {
      return service.getProductsByCategory(category, subcategory);
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const service = this.getService();
    
    if (this.useApi) {
      const apiProducts = await service.getFeaturedProducts();
      return apiProducts.map(p => this.convertApiProductToFrontend(p));
    } else {
      return service.getFeaturedProducts();
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    const service = this.getService();
    
    if (this.useApi) {
      const apiProducts = await service.searchProducts(query);
      return apiProducts.map(p => this.convertApiProductToFrontend(p));
    } else {
      return service.searchProducts(query);
    }
  }

  async getCategories(): Promise<Category[]> {
    const service = this.getService();
    
    if (this.useApi) {
      const apiCategories = await service.getCategories();
      return apiCategories.map(c => this.convertApiCategoryToFrontend(c));
    } else {
      return service.getCategories();
    }
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const service = this.getService();
    
    if (this.useApi) {
      const apiCategory = await service.getCategoryById(id);
      return apiCategory ? this.convertApiCategoryToFrontend(apiCategory) : undefined;
    } else {
      return service.getCategoryById(id);
    }
  }

  async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    const service = this.getService();
    
    if (this.useApi) {
      const apiSubcategories = await service.getSubcategoriesByCategory(categoryId);
      return apiSubcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        image: sub.image
      }));
    } else {
      return service.getSubcategoriesByCategory(categoryId);
    }
  }

  // Admin methods
  async upsertProduct(product: Partial<Product>): Promise<Product> {
    const service = this.getService();
    return service.upsertProduct(product);
  }

  async deleteProduct(productId: number): Promise<void> {
    const service = this.getService();
    return service.deleteProduct(productId);
  }

  async upsertCategory(category: Partial<Category>): Promise<Category> {
    const service = this.getService();
    return service.upsertCategory(category);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const service = this.getService();
    return service.deleteCategory(categoryId);
  }
}

export default new HybridProductService();