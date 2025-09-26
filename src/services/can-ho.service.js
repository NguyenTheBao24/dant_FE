import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listCanHoByToaNha(toaNhaId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('can_ho')
        .select('*')
        .eq('toa_nha_id', toaNhaId)
        .order('so_can')
    if (error) throw error
    return data || []
}

export async function countCanHoByToaNha(toaNhaId) {
    if (!isReady()) return 0
    const { count, error } = await supabase
        .from('can_ho')
        .select('*', { count: 'exact', head: true })
        .eq('toa_nha_id', toaNhaId)
    if (error) throw error
    if (typeof count === 'number') return count
    // Fallback: fetch minimal rows and return length (in case count unsupported)
    const { data, error: err2 } = await supabase
        .from('can_ho')
        .select('id')
        .eq('toa_nha_id', toaNhaId)
    if (err2) throw err2
    return (data || []).length
}

export async function listAvailableCanHoByToaNha(toaNhaId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('can_ho')
        .select('id, so_can, dien_tich, trang_thai, toa_nha_id, gia_thue')
        .eq('toa_nha_id', toaNhaId)
        .eq('trang_thai', 'trong')
        .order('so_can')
    if (error) throw error
    return data || []
}

export async function getCanHoById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('can_ho').select('*').eq('id', id).single()
    if (error) throw error
    return data
}

export async function createCanHo(payload) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('can_ho').insert([payload]).select().single()
    if (error) throw error
    return data
}

export async function updateCanHo(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('can_ho').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function updateCanHoTrangThai(id, trang_thai) {
    return updateCanHo(id, { trang_thai })
}

export async function deleteCanHo(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('can_ho').delete().eq('id', id)
    if (error) throw error
    return { id }
}

// Tạo danh sách căn hộ cố định cho một tòa nhà
export async function createFixedCanHoForToaNha(toaNhaId, total = 10) {
    if (!isReady()) return []
    const items = []
    const defaultAreas = [20, 25, 30]
    const defaultPrices = [2500000, 3500000, 4500000]
    for (let i = 1; i <= total; i++) {
        const soCan = `A${String(i).padStart(3, '0')}`
        const idx = (i - 1) % 3
        items.push({
            so_can: soCan,
            dien_tich: defaultAreas[idx],
            trang_thai: 'trong',
            toa_nha_id: toaNhaId,
            gia_thue: defaultPrices[idx],
        })
    }
    const { data, error } = await supabase.from('can_ho').insert(items).select()
    if (error) throw error
    return data || []
}


