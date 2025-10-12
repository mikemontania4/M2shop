import coverageData from '../data/cobertura.json';

export interface CoverageArea {
  id: string;
  name: string;
  color: string;
  weight: number;
  fillOpacity: number;
  coordinates: [number, number][]; // [lat, lng]
}

class CoverageService {
  private read(): CoverageArea[] {
    const saved = localStorage.getItem('coverage');
    return saved ? (JSON.parse(saved) as CoverageArea[]) : (coverageData as CoverageArea[]);
  }

  private write(list: CoverageArea[]): void {
    localStorage.setItem('coverage', JSON.stringify(list));
  }

  getCoverage(): CoverageArea[] { return this.read(); }
  getArea(id: string): CoverageArea | undefined { return this.read().find(a => a.id === id); }
  upsertArea(area: CoverageArea): void {
    const list = this.read();
    const idx = list.findIndex(a => a.id === area.id);
    if (idx >= 0) list[idx] = area; else list.push(area);
    this.write(list);
  }
  deleteArea(id: string): void { this.write(this.read().filter(a => a.id !== id)); }
}

export default new CoverageService();
