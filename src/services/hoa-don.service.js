import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listHoaDon() {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('hoa_don')
        .select('*, hop_dong:hop_dong_id(id, khach_thue:khach_thue_id(ho_ten), can_ho:can_ho_id(so_can, toa_nha_id))')
        .order('ngay_tao', { ascending: false })
    if (error) throw error
    return data || []
}

export async function listHoaDonByToaNha(toaNhaId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('hoa_don')
        .select('*, hop_dong:hop_dong_id(id, khach_thue:khach_thue_id(ho_ten), can_ho:can_ho_id(so_can, toa_nha_id))')
        .eq('hop_dong.can_ho.toa_nha_id', toaNhaId)
        .order('ngay_tao', { ascending: false })
    if (error) throw error
    return data || []
}

export async function createHoaDon(payload) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('hoa_don').insert([payload]).select().single()
    if (error) throw error
    return data
}

export async function updateHoaDon(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('hoa_don').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteHoaDon(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('hoa_don').delete().eq('id', id)
    if (error) throw error
    return { id }
}

export async function tinhDoanhThuThang(toaNhaId, year, month) {
    if (!isReady()) return 0
    const start = `${year}-${String(month).padStart(2, '0')}-01`
    const endMonth = month === 12 ? 1 : month + 1
    const endYear = month === 12 ? year + 1 : year
    const end = `${endYear}-${String(endMonth).padStart(2, '0')}-01`
    const { data, error } = await supabase
        .from('hoa_don')
        .select('so_tien, hop_dong:hop_dong_id(can_ho:can_ho_id(toa_nha_id))')
        .gte('ngay_tao', start)
        .lt('ngay_tao', end)
        .eq('hop_dong.can_ho.toa_nha_id', toaNhaId)
    if (error) throw error
    return (data || []).reduce((sum, r) => sum + (r.so_tien || 0), 0)
}


