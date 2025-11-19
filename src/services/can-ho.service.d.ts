export interface CanHoRow {
    id: number
    so_can: string
    dien_tich?: number
    trang_thai: 'trong' | 'da_thue'
    toa_nha_id: number
    gia_thue?: number
    loai_can_ho?: string
}

export function listCanHoByToaNha(toaNhaId: number): Promise<CanHoRow[]>
export function countCanHoByToaNha(toaNhaId: number): Promise<number>
export function listAvailableCanHoByToaNha(toaNhaId: number): Promise<CanHoRow[]>
export function getCanHoById(id: number): Promise<CanHoRow | null>
export function createCanHo(payload: Partial<CanHoRow>): Promise<CanHoRow | null>
export function updateCanHo(id: number, updates: Partial<CanHoRow>): Promise<CanHoRow | null>
export function updateCanHoTrangThai(id: number, trang_thai: 'trong' | 'da_thue'): Promise<CanHoRow | null>
export function deleteCanHo(id: number): Promise<{ id: number }>
export function createFixedCanHoForToaNha(toaNhaId: number, total?: number): Promise<CanHoRow[]>
export function determineRoomType(dien_tich?: number, gia_thue?: number): string
