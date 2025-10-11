import bannersData from '../data/banners.json';

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
  order: number;
}

class BannerService {
  getBanners(): Banner[] {
    return (bannersData as Banner[])
      .filter(b => b.active)
      .sort((a, b) => a.order - b.order);
  }

  getAllBanners(): Banner[] {
    return bannersData as Banner[];
  }

  getBannerById(id: number): Banner | undefined {
    return (bannersData as Banner[]).find(b => b.id === id);
  }
}

export default new BannerService();
