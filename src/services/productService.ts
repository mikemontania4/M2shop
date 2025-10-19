// Re-export the hybrid service as the main product service
export { default } from './hybridProductService';
export type { Product, Category, Subcategory, ProductListResponse } from './apiProductService';ategories().filter(c => c.id !== categoryId);
    this.writeCategories(list);
  }
}

export default new ProductService();
