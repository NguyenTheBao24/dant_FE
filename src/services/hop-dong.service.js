import { supabase } from './supabase-client'
import { updateCanHo } from './can-ho.service'
import { generateFormattedId } from '../utils/id-generator'

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

/**
 * Lấy ID tiếp theo cho hop_dong theo format: HD0000000001
 */
async function getNextHopDongId() {
    try {
        console.log('Getting next hop_dong id...')

        const { data, error } = await supabase
            .from('hop_dong')
            .select('id')
            .order('id', { ascending: false })
            .limit(100)

        if (error) {
            console.error('Error getting max id:', error)
            console.warn('Using fallback id: HD0000000001')
            return 'HD0000000001'
        }

        if (data && data.length > 0) {
            const existingIds = data.map(hd => hd.id).filter(Boolean)
            const nextId = generateFormattedId('HD', existingIds)
            console.log('Next id will be:', nextId)
            return nextId
        }

        console.log('No existing records, using id: HD0000000001')
        return 'HD0000000001'
    } catch (error) {
        console.error('Error in getNextHopDongId:', error)
        console.warn('Using fallback id: HD0000000001')
        return 'HD0000000001'
    }
}

// Track pending creates to prevent duplicate calls
const pendingCreates = new Map()

export async function createHopDong(payload) {
    if (!isReady()) {
        console.error('Supabase client not ready')
        return null
    }

    // Tạo key duy nhất từ payload để detect duplicate calls
    const payloadKey = `${payload.can_ho_id}_${payload.khach_thue_id}_${payload.ngay_bat_dau || 'null'}`

    // Kiểm tra xem có đang có request tương tự đang chạy không
    if (pendingCreates.has(payloadKey)) {
        console.warn('Duplicate create request detected, waiting for existing request...')
        return await pendingCreates.get(payloadKey)
    }

    // Tạo promise và lưu vào map
    const createPromise = (async () => {
        try {
            console.log('Creating hop_dong with payload:', payload)

            // Generate id tiếp theo nếu database không tự động generate
            const nextId = await getNextHopDongId()
            console.log('Generated next id:', nextId)

            // Đảm bảo id là string hợp lệ với format HD0000000001
            if (!nextId || typeof nextId !== 'string' || !nextId.startsWith('HD')) {
                console.error('Invalid id generated:', nextId)
                throw new Error('Failed to generate valid id for hop_dong')
            }

            // Tạo payload với id được generate
            const insertPayload = [{
                id: nextId,
                can_ho_id: payload.can_ho_id,
                khach_thue_id: payload.khach_thue_id,
                ngay_bat_dau: payload.ngay_bat_dau,
                ngay_ket_thuc: payload.ngay_ket_thuc || null,
                trang_thai: payload.trang_thai || 'hieu_luc'
            }]

            console.log('Final payload to insert:', insertPayload)

            const { data, error } = await supabase.from('hop_dong').insert(insertPayload).select().single()

            if (error) {
                console.error('Insert error:', error)
                console.error('Error code:', error.code)
                console.error('Error message:', error.message)

                // Chỉ retry nếu lỗi là do duplicate key (id conflict)
                if (error.code === '23505' || (error.message?.includes('duplicate') && error.message?.includes('key'))) {
                    console.log('ID conflict detected, retrying with new ID...')
                    const retryId = await getNextHopDongId()
                    console.log('Retry id:', retryId)
                    const retryPayload = [{
                        ...insertPayload[0],
                        id: retryId,
                    }]
                    console.log('Retry payload:', retryPayload)
                    const { data: retryData, error: retryError } = await supabase
                        .from('hop_dong')
                        .insert(retryPayload)
                        .select()
                        .single()
                    if (retryError) {
                        console.error('Retry also failed:', retryError)
                        throw retryError
                    }
                    console.log('Retry successful:', retryData)
                    try { await updateCanHo(payload.can_ho_id, { trang_thai: 'da_thue' }) } catch { }
                    return retryData
                }
                throw error
            }

            console.log('Insert successful:', data)
            try { await updateCanHo(payload.can_ho_id, { trang_thai: 'da_thue' }) } catch { }
            return data
        } finally {
            // Xóa khỏi map sau khi hoàn thành
            pendingCreates.delete(payloadKey)
        }
    })()

    // Lưu promise vào map
    pendingCreates.set(payloadKey, createPromise)

    try {
        return await createPromise
    } catch (error) {
        console.error('Error creating hop_dong:', error)
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        })
        throw error
    }
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


