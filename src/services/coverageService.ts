import coverageData from "../data/cobertura.json"

export interface CoverageArea {
  id: string
  name: string
  color: string
  weight: number
  fillOpacity: number
  coordinates: [number, number][]
}

class CoverageService {
  private areas: CoverageArea[] = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    const stored = localStorage.getItem("coverage_areas")
    if (stored) {
      try {
        this.areas = JSON.parse(stored)
      } catch {
        this.areas = [...(coverageData as CoverageArea[])]
      }
    } else {
      this.areas = [...(coverageData as CoverageArea[])]
    }
  }

  private saveToStorage() {
    localStorage.setItem("coverage_areas", JSON.stringify(this.areas))
  }

  getCoverage(): CoverageArea[] {
    return [...this.areas]
  }

  getAreaById(id: string): CoverageArea | undefined {
    return this.areas.find((area) => area.id === id)
  }

  upsertArea(area: CoverageArea): void {
    const index = this.areas.findIndex((a) => a.id === area.id)
    if (index >= 0) {
      this.areas[index] = area
    } else {
      this.areas.push(area)
    }
    this.saveToStorage()
  }

  deleteArea(id: string): void {
    this.areas = this.areas.filter((a) => a.id !== id)
    this.saveToStorage()
  }

  isInCoverageArea(lat: number, lng: number): boolean {
    return this.areas.some((area) => this.pointInPolygon([lat, lng], area.coordinates))
  }

  private pointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
    const [x, y] = point
    let inside = false

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i]
      const [xj, yj] = polygon[j]

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }

    return inside
  }
}

const coverageService = new CoverageService()
export default coverageService
