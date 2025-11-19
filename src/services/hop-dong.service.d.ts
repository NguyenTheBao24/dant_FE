export interface HopDongRow {
    id: number
    can_ho_id: number
    khach_thue_id: number
    bang_gia_id?: number
    ngay_bat_dau: string
    ngay_ket_thuc?: string
    trang_thai: 'hieu_luc' | 'het_han' | 'huy'
}

export function listHopDong(): Promise<HopDongRow[]>
export function getHopDongById(id: number): Promise<HopDongRow | null>
export function createHopDong(payload: Partial<HopDongRow>): Promise<HopDongRow | null>
export function updateHopDong(id: number, updates: Partial<HopDongRow>): Promise<HopDongRow | null>
export function deleteHopDong(id: number): Promise<{ id: number }>
export function listHopDongByToaNha(toaNhaId: number): Promise<HopDongRow[]>
