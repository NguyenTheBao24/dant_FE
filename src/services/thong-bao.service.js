import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function createThongBao(thongBaoData) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('thong_bao')
        .insert([{
            khach_thue_id: thongBaoData.khach_thue_id,
            toa_nha_id: thongBaoData.toa_nha_id,
            can_ho_id: thongBaoData.can_ho_id || null,
            tieu_de: thongBaoData.tieu_de,
            noi_dung: thongBaoData.noi_dung,
            loai_thong_bao: thongBaoData.loai_thong_bao || 'khac',
            trang_thai: 'chua_xu_ly'
        }])
        .select()
        .single()
    if (error) throw error
    return data
}

export async function getThongBaoByToaNha(toaNhaId, trangThai = null) {
    if (!isReady()) return []
    let query = supabase
        .from('thong_bao')
        .select(`
            *,
            khach_thue:khach_thue_id(id, ho_ten, sdt, email),
            can_ho:can_ho_id(id, so_can)
        `)
        .eq('toa_nha_id', toaNhaId)
        .order('ngay_tao', { ascending: false })
    if (trangThai) query = query.eq('trang_thai', trangThai)
    const { data, error } = await query
    if (error) throw error
    return data || []
}

export async function getThongBaoByKhachThue(khachThueId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('thong_bao')
        .select(`
            *,
            can_ho:can_ho_id(id, so_can),
            toa_nha:toa_nha_id(id, ten_toa)
        `)
        .eq('khach_thue_id', khachThueId)
        .order('ngay_tao', { ascending: false })
    if (error) throw error
    return data || []
}

export async function updateThongBaoStatus(thongBaoId, trangThai) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('thong_bao')
        .update({
            trang_thai: trangThai,
            ngay_cap_nhat: new Date().toISOString()
        })
        .eq('id', thongBaoId)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function countUnreadThongBaoByToaNha(toaNhaId) {
    if (!isReady()) return 0
    const { count, error } = await supabase
        .from('thong_bao')
        .select('*', { count: 'exact', head: true })
        .eq('toa_nha_id', toaNhaId)
        .eq('trang_thai', 'chua_xu_ly')
    if (error) throw error
    return count || 0
}

export async function deleteThongBao(thongBaoId) {
    if (!isReady()) return null
    const { error } = await supabase
        .from('thong_bao')
        .delete()
        .eq('id', thongBaoId)
    if (error) throw error
    return { success: true }
}


