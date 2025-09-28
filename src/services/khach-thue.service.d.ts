export interface KhachThueRow {
    id: number
    ho_ten: string
    sdt?: string
    email?: string
    cccd?: string
    tai_khoan_id?: number
}

export function listKhachThue(): Promise<KhachThueRow[]>
export function getKhachThueById(id: number): Promise<KhachThueRow | null>
export function createKhachThue(payload: Partial<KhachThueRow>): Promise<KhachThueRow | null>
export function updateKhachThue(id: number, updates: Partial<KhachThueRow>): Promise<KhachThueRow | null>
export function deleteKhachThue(id: number): Promise<{ id: number }>
