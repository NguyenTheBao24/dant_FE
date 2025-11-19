export interface BangGiaRow {
    id: number
    gia_dien: number
    gia_nuoc: number
    gia_dich_vu: number
}

export function getBangGiaByToaNha(toaNhaId: number): Promise<BangGiaRow>
export function createBangGia(bangGiaData: BangGiaRow): Promise<BangGiaRow>
export function updateBangGia(id: number, bangGiaData: Partial<BangGiaRow>): Promise<BangGiaRow>
export function upsertBangGia(toaNhaId: number, bangGiaData: Partial<Omit<BangGiaRow, 'id'>>): Promise<BangGiaRow>
