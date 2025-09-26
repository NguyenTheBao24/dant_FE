export interface QuanLyRow {
    id: number
    ho_ten: string
    sdt?: string
    email?: string
    tai_khoan_id?: number | null
    tai_khoan?: {
        id?: number
        username?: string
        role?: string
        password?: string
    } | null
}

export function listQuanLy(): Promise<QuanLyRow[]>
export function getQuanLyById(id: number): Promise<QuanLyRow | null>
export function createQuanLy(payload: Partial<QuanLyRow>): Promise<QuanLyRow>
export function updateQuanLy(id: number, updates: Partial<QuanLyRow>): Promise<QuanLyRow>
export function deleteQuanLy(id: number): Promise<{ id: number }>


