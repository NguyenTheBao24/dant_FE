import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function createPhanHoiThongBao(phanHoiData) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('phan_hoi_thong_bao')
        .insert([{
            thong_bao_id: phanHoiData.thong_bao_id,
            nguoi_gui_loai: phanHoiData.nguoi_gui_loai,
            nguoi_gui_id: phanHoiData.nguoi_gui_id,
            noi_dung: phanHoiData.noi_dung
        }])
        .select()
        .single()
    if (error) throw error
    return data
}

export async function getPhanHoiByThongBao(thongBaoId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('phan_hoi_thong_bao')
        .select('*')
        .eq('thong_bao_id', thongBaoId)
        .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
}

export async function getPhanHoiWithDetails(thongBaoId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('phan_hoi_thong_bao')
        .select(`
            *,
            thong_bao:thong_bao_id(
                id,
                tieu_de,
                khach_thue:khach_thue_id(id, ho_ten),
                toa_nha:toa_nha_id(id, ten_toa)
            )
        `)
        .eq('thong_bao_id', thongBaoId)
        .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
}


