import { supabase } from './supabase-client'
import { updateCanHo } from './can-ho.service'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listHopDong() {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('hop_dong')
        .select('*, can_ho:can_ho_id(id, so_can, toa_nha_id, gia_thue), khach_thue:khach_thue_id(id, ho_ten, sdt, email)')
        .order('ngay_bat_dau', { ascending: false })
    if (error) throw error
    return data || []
}

export async function listHopDongByToaNha(toaNhaId) {
    if (!isReady()) return []

    // First get all rooms in the building
    const { data: rooms, error: roomsError } = await supabase
        .from('can_ho')
        .select('id')
        .eq('toa_nha_id', toaNhaId)

    if (roomsError) throw roomsError
    if (!rooms || rooms.length === 0) return []

    // Get room IDs
    const roomIds = rooms.map(room => room.id)

    // Then get contracts for those rooms
    const { data, error } = await supabase
        .from('hop_dong')
        .select('*, can_ho:can_ho_id(id, so_can, toa_nha_id, gia_thue), khach_thue:khach_thue_id(id, ho_ten, sdt, email, cccd, tai_khoan_id, tai_khoan:tai_khoan_id(id, username, password, role, created_at))')
        .in('can_ho_id', roomIds)
        .order('ngay_bat_dau', { ascending: false })

    if (error) throw error
    return data || []
}

export async function createHopDong(payload) {
    if (!isReady()) return null
    const insertPayload = [{
        can_ho_id: payload.can_ho_id,
        khach_thue_id: payload.khach_thue_id,
        ngay_bat_dau: payload.ngay_bat_dau,
        ngay_ket_thuc: payload.ngay_ket_thuc || null,
        trang_thai: payload.trang_thai || 'hieu_luc'
    }]
    const { data, error } = await supabase.from('hop_dong').insert(insertPayload).select().single()
    if (error) {
        // Một số cấu hình PostgREST có thể không trả representation -> fallback fetch
        try {
            const { data: row, error: fetchErr } = await supabase
                .from('hop_dong')
                .select('*')
                .eq('can_ho_id', payload.can_ho_id)
                .eq('khach_thue_id', payload.khach_thue_id)
                .eq('ngay_bat_dau', payload.ngay_bat_dau)
                .order('id', { ascending: false })
                .limit(1)
                .single()
            if (fetchErr) throw error
            try { await updateCanHo(payload.can_ho_id, { trang_thai: 'da_thue' }) } catch { }
            return row
        } catch (e) {
            throw error
        }
    }
    try { await updateCanHo(payload.can_ho_id, { trang_thai: 'da_thue' }) } catch { }
    return data
}

export async function updateHopDong(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('hop_dong').update(updates).eq('id', id).select().single()
    if (error) throw error
    if (updates.trang_thai && updates.trang_thai !== 'hieu_luc') {
        try { await updateCanHo(data.can_ho_id, { trang_thai: 'trong' }) } catch { }
    }
    return data
}

export async function deleteHopDong(id) {
    if (!isReady()) return { id }
    const { data, error } = await supabase.from('hop_dong').select('can_ho_id').eq('id', id).single()
    if (error) throw error
    const { error: delErr } = await supabase.from('hop_dong').delete().eq('id', id)
    if (delErr) throw delErr
    try { if (data?.can_ho_id) await updateCanHo(data.can_ho_id, { trang_thai: 'trong' }) } catch { }
    return { id }
}

export async function listHopDongSapHetHan(toaNhaId, days = 30) {
    if (!isReady()) return []
    const limitDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const { data, error } = await supabase
        .from('hop_dong')
        .select('*, can_ho:can_ho_id(id, so_can, toa_nha_id), khach_thue:khach_thue_id(id, ho_ten)')
        .eq('trang_thai', 'hieu_luc')
        .eq('can_ho.toa_nha_id', toaNhaId)
        .not('ngay_ket_thuc', 'is', null)
        .lte('ngay_ket_thuc', limitDate)
        .order('ngay_ket_thuc', { ascending: true })
    if (error) throw error
    return data || []
}

export async function listHopDongByKhachThue(khachThueId) {
    if (!isReady()) return []

    try {
        // Lấy hợp đồng với thông tin căn hộ
        const { data, error } = await supabase
            .from('hop_dong')
            .select('*, can_ho:can_ho_id(id, so_can, toa_nha_id, gia_thue, dien_tich)')
            .eq('khach_thue_id', khachThueId)
            .order('ngay_bat_dau', { ascending: false })

        if (error) throw error

        // Lấy thông tin tòa nhà và quản lý cho từng hợp đồng
        const contractsWithToaNha = await Promise.all(
            (data || []).map(async (contract) => {
                if (contract.can_ho?.toa_nha_id) {
                    try {
                        // Lấy thông tin tòa nhà
                        const { data: toaNha, error: toaNhaError } = await supabase
                            .from('toa_nha')
                            .select('id, ten_toa, dia_chi, quan_ly_id')
                            .eq('id', contract.can_ho.toa_nha_id)
                            .single()

                        if (!toaNhaError && toaNha) {
                            contract.toa_nha = toaNha

                            // Lấy thông tin quản lý nếu có
                            if (toaNha.quan_ly_id) {
                                try {
                                    const { data: quanLy, error: quanLyError } = await supabase
                                        .from('quan_ly')
                                        .select('id, ho_ten, sdt, email')
                                        .eq('id', toaNha.quan_ly_id)
                                        .single()

                                    if (!quanLyError && quanLy) {
                                        contract.toa_nha.quan_ly = quanLy
                                        contract.toa_nha.so_dien_thoai = quanLy.sdt // Thêm số điện thoại từ quản lý
                                    }
                                } catch (error) {
                                    console.error('Error fetching quan_ly for toa_nha:', toaNha.id, error)
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching toa_nha for contract:', contract.id, error)
                    }
                }
                return contract
            })
        )

        return contractsWithToaNha
    } catch (error) {
        console.error('Error in listHopDongByKhachThue:', error)
        throw error
    }
}


