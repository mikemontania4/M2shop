const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/M2SHOP';

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/productos/frontend`,
  PRODUCT_BY_SLUG: (slug: string) => `${API_BASE_URL}/productos/${slug}`,
  CATEGORIES: `${API_BASE_URL}/categorias/frontend`,
  CATEGORY_BY_SLUG: (slug: string) => `${API_BASE_URL}/categorias/${slug}`,
} as const;

export default API_BASE_URL;