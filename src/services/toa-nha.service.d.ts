export interface ToaNhaRow {
    id: number
    ten_toa: string
    dia_chi?: string
    quan_ly_id?: number | null
}

export function listToaNha(): Promise<ToaNhaRow[]>
export function getToaNhaById(id: number): Promise<ToaNhaRow | null>
export function createToaNha(payload: Partial<ToaNhaRow>): Promise<ToaNhaRow>
export function updateToaNha(id: number, updates: Partial<ToaNhaRow>): Promise<ToaNhaRow>
export function deleteToaNha(id: number): Promise<{ id: number }>


