export interface TaiKhoanRow {
    id: number
    username: string
    password: string
    role: string
    created_at?: string
    is_active?: boolean
}

export function listTaiKhoan(): Promise<TaiKhoanRow[]>
export function getTaiKhoanById(id: number): Promise<TaiKhoanRow | null>
export function createTaiKhoan(payload: Partial<TaiKhoanRow>): Promise<TaiKhoanRow>
export function updateTaiKhoan(id: number, updates: Partial<TaiKhoanRow>): Promise<TaiKhoanRow>
export function deleteTaiKhoan(id: number): Promise<{ id: number }>
export function loginTaiKhoan(username: string, password: string): Promise<TaiKhoanRow | null>


