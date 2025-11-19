export interface ChiTieuRow {
    id: number
    toa_nha_id: number
    ngay: string
    loai_chi: string
    so_tien: number
    mo_ta?: string
    created_at: string
}

export interface ChiTieuStats {
    totalAmount: number
    count: number
    data: ChiTieuRow[]
}

export interface ChiTieuStatsByType {
    loai_chi: string
    totalAmount: number
    count: number
}

export function listChiTieuByToaNha(toaNhaId: number): Promise<ChiTieuRow[]>
export function getChiTieuById(id: number): Promise<ChiTieuRow>
export function createChiTieu(chiTieuData: Omit<ChiTieuRow, 'id' | 'created_at'>): Promise<ChiTieuRow>
export function updateChiTieu(id: number, chiTieuData: Partial<Omit<ChiTieuRow, 'id' | 'created_at'>>): Promise<ChiTieuRow>
export function deleteChiTieu(id: number): Promise<boolean>
export function getChiTieuStatsByMonth(toaNhaId: number, year: number, month: number): Promise<ChiTieuStats>
export function getChiTieuStatsByType(toaNhaId: number, startDate: string, endDate: string): Promise<ChiTieuStatsByType[]>
export function getTotalChiTieuInRange(toaNhaId: number, startDate: string, endDate: string): Promise<number>
