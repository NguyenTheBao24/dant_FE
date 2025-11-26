import { supabase } from './supabase-client'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

/**
 * Generate ID cho thông báo theo format: TBYYYYMMDDXXXXXX
 * Ví dụ: TB20250101000001
 * - TB: prefix
 * - YYYYMMDD: năm + tháng + ngày (8 chữ số)
 * - XXXXXX: số thứ tự trong ngày (6 chữ số)
 */
async function getNextThongBaoId(date = new Date()) {
    try {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateStr = `${year}${month}${day}` // YYYYMMDD
        const prefix = `TB${dateStr}`

        // Lấy thông báo mới nhất có cùng ngày để tránh race condition
        const startDate = `${year}-${month}-${day}`
        const { data, error } = await supabase
            .from('thong_bao')
            .select('id')
            .like('id', `${prefix}%`)
            .order('id', { ascending: false })
            .limit(1) // Chỉ lấy 1 record mới nhất để tối ưu

        if (error) {
            console.warn('Error getting existing thong bao IDs, using timestamp fallback:', error)
            // Fallback: sử dụng timestamp với milliseconds
            const timestamp = Date.now()
            const ms = timestamp % 10000 // 4 chữ số cuối của timestamp
            return `${prefix}${String(ms).padStart(6, '0')}`
        }

        // Tìm số thứ tự cao nhất
        let maxSequence = 0
        if (data && data.length > 0) {
            for (const item of data) {
                if (item.id && typeof item.id === 'string' && item.id.startsWith(prefix)) {
                    // Extract 6 chữ số cuối cùng (số thứ tự)
                    const sequenceStr = item.id.slice(prefix.length)
                    const sequence = parseInt(sequenceStr, 10)
                    if (!isNaN(sequence) && sequence > maxSequence) {
                        maxSequence = sequence
                    }
                }
            }
        }

        // Thêm milliseconds để tránh duplicate trong trường hợp race condition
        const timestamp = Date.now()
        const ms = timestamp % 1000 // 3 chữ số cuối của milliseconds
        const nextSequence = maxSequence + 1
        const sequenceStr = String(nextSequence).padStart(3, '0') + String(ms).padStart(3, '0')
        return `${prefix}${sequenceStr}`
    } catch (error) {
        console.error('Error in getNextThongBaoId:', error)
        // Fallback: sử dụng timestamp với milliseconds
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const timestamp = Date.now()
        const ms = timestamp % 1000000
        return `TB${year}${month}${day}${String(ms).padStart(6, '0')}`
    }
}

export async function createThongBao(thongBaoData) {
    if (!isReady()) {
        console.error('createThongBao - Supabase not ready')
        throw new Error('Hệ thống chưa sẵn sàng. Vui lòng thử lại sau.')
    }

    console.log('createThongBao - Received data:', JSON.stringify(thongBaoData, null, 2))

    // Validate các trường bắt buộc
    if (!thongBaoData.khach_thue_id) {
        const error = new Error('khach_thue_id is required')
        console.error('createThongBao - Validation error:', error)
        throw error
    }

    if (!thongBaoData.toa_nha_id) {
        const error = new Error('toa_nha_id is required')
        console.error('createThongBao - Validation error:', error)
        throw error
    }

    if (!thongBaoData.tieu_de || !thongBaoData.tieu_de.trim()) {
        const error = new Error('tieu_de is required')
        console.error('createThongBao - Validation error:', error)
        throw error
    }

    if (!thongBaoData.noi_dung || !thongBaoData.noi_dung.trim()) {
        const error = new Error('noi_dung is required')
        console.error('createThongBao - Validation error:', error)
        throw error
    }

    // Generate ID cho thông báo nếu chưa có
    let thongBaoId = thongBaoData.id
    if (!thongBaoId) {
        try {
            thongBaoId = await getNextThongBaoId(new Date())
            console.log('createThongBao - Generated ID:', thongBaoId)
        } catch (idError) {
            console.warn('createThongBao - Could not generate ID, database will auto-generate:', idError)
            // Bỏ qua lỗi generate ID, để database tự generate nếu có trigger
        }
    }

    const dataToInsert = {
        ...(thongBaoId && { id: thongBaoId }),
        khach_thue_id: thongBaoData.khach_thue_id,
        toa_nha_id: thongBaoData.toa_nha_id,
        can_ho_id: thongBaoData.can_ho_id || null,
        tieu_de: thongBaoData.tieu_de.trim(),
        noi_dung: thongBaoData.noi_dung.trim(),
        loai_thong_bao: thongBaoData.loai_thong_bao || 'khac',
        trang_thai: 'chua_xu_ly'
    }

    console.log('createThongBao - Data to insert:', JSON.stringify(dataToInsert, null, 2))

    // Retry logic nếu gặp duplicate key error
    let retryCount = 0
    const maxRetries = 3
    let data, error

    while (retryCount < maxRetries) {
        const { data: result, error: insertError } = await supabase
            .from('thong_bao')
            .insert([dataToInsert])
            .select()
            .single()

        data = result
        error = insertError

        // Nếu không có lỗi hoặc lỗi không phải duplicate key, break
        if (!error || error.code !== '23505') {
            break
        }

        // Nếu là duplicate key, generate ID mới và retry
        console.warn(`createThongBao - Duplicate key detected (attempt ${retryCount + 1}/${maxRetries}), generating new ID...`)
        try {
            const newThongBaoId = await getNextThongBaoId(new Date())
            dataToInsert.id = newThongBaoId
            retryCount++
        } catch (idError) {
            console.error('createThongBao - Error generating new ID for retry:', idError)
            break
        }
    }

    if (error) {
        console.error('createThongBao - Supabase error:', error)
        console.error('createThongBao - Error code:', error.code)
        console.error('createThongBao - Error message:', error.message)
        console.error('createThongBao - Error details:', error.details)
        console.error('createThongBao - Error hint:', error.hint)
        throw error
    }

    console.log('createThongBao - Success, created data:', data)
    return data
}

export async function getThongBaoByToaNha(toaNhaId, trangThai = null, canHoId = null) {
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
    if (canHoId) query = query.eq('can_ho_id', canHoId)
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

/**
 * Tạo thông báo cho quản lý về thông tin liên hệ mới
 * @param {number} toaNhaId - ID tòa nhà
 * @param {string} hoTen - Họ tên người liên hệ
 * @param {string} sdt - Số điện thoại
 * @param {string} email - Email (không bắt buộc)
 * @param {string} ghiChu - Ghi chú/tin nhắn (không bắt buộc)
 * @returns {Promise<any>} Thông báo đã tạo hoặc null
 */
export async function createThongBaoForManagerAboutContact(toaNhaId, hoTen, sdt, email, ghiChu) {
    if (!isReady()) {
        console.warn('createThongBaoForManagerAboutContact - Supabase not ready')
        return null
    }

    try {
        // Lấy thông tin tòa nhà để biết tên tòa nhà
        const { data: toaNha, error: toaNhaError } = await supabase
            .from('toa_nha')
            .select('id, ten_toa')
            .eq('id', toaNhaId)
            .single()

        if (toaNhaError || !toaNha) {
            console.error('createThongBaoForManagerAboutContact - Error fetching toa_nha:', toaNhaError)
            return null
        }

        const tenToaNha = toaNha.ten_toa || 'Tòa nhà'

        // Tạo nội dung thông báo
        let noiDung = `Có thông tin liên hệ mới từ khách hàng:\n\n`
        noiDung += `Họ tên: ${hoTen}\n`
        noiDung += `Số điện thoại: ${sdt}\n`
        if (email) {
            noiDung += `Email: ${email}\n`
        }
        if (ghiChu) {
            noiDung += `\nGhi chú:\n${ghiChu}`
        }

        // Tìm hoặc tạo khách thuê tạm thời từ thông tin liên hệ
        // (vì createThongBao yêu cầu khach_thue_id)
        let khachThueId = null
        try {
            // Kiểm tra xem đã có khách thuê với số điện thoại này chưa
            const { data: existingKhachThue, error: findError } = await supabase
                .from('khach_thue')
                .select('id')
                .eq('sdt', sdt)
                .limit(1)
                .maybeSingle() // Dùng maybeSingle() thay vì single() để tránh lỗi 406

            if (findError && findError.code !== 'PGRST116') {
                // PGRST116 = no rows found, không phải lỗi
                console.warn('createThongBaoForManagerAboutContact - Error finding khach_thue:', findError)
            }

            if (existingKhachThue?.id) {
                khachThueId = existingKhachThue.id
                console.log('Found existing khach_thue with phone:', sdt)
            } else {
                // Tạo khách thuê tạm thời
                const { createKhachThue } = await import('./khach-thue.service')
                const tempKhachThue = await createKhachThue({
                    ho_ten: hoTen,
                    sdt: sdt,
                    email: email || null
                })
                if (tempKhachThue?.id) {
                    khachThueId = tempKhachThue.id
                    console.log('Created temporary khach_thue for contact:', khachThueId)
                }
            }
        } catch (khachThueError) {
            console.warn('createThongBaoForManagerAboutContact - Error creating/finding khach_thue:', khachThueError)
            // Nếu không tạo được khách thuê, bỏ qua việc tạo thông báo
            return null
        }

        if (!khachThueId) {
            console.error('createThongBaoForManagerAboutContact - Could not get khach_thue_id')
            return null
        }

        // Tạo thông báo với khách thuê tạm thời
        const thongBaoData = {
            khach_thue_id: khachThueId,
            toa_nha_id: toaNhaId,
            can_ho_id: null,
            tieu_de: `Thông tin liên hệ mới - ${tenToaNha}`,
            noi_dung: noiDung,
            loai_thong_bao: 'lien_he'
        }

        return await createThongBao(thongBaoData)
    } catch (error) {
        console.error('createThongBaoForManagerAboutContact - Unexpected error:', error)
        return null
    }
}

/**
 * Tạo thông báo cho admin về hóa đơn mới
 * @param {string} hoaDonId - ID hóa đơn
 * @param {number} hopDongId - ID hợp đồng
 * @param {number} soTien - Số tiền hóa đơn
 * @returns {Promise<any>} Thông báo đã tạo
 */
export async function createThongBaoForAdminAboutInvoice(hoaDonId, hopDongId, soTien) {
    if (!isReady()) {
        console.warn('createThongBaoForAdminAboutInvoice - Supabase not ready')
        return null
    }

    try {
        // Lấy thông tin hợp đồng để biết khach_thue_id, can_ho_id, và toa_nha_id
        const { data: hopDong, error: hopDongError } = await supabase
            .from('hop_dong')
            .select(`
                id,
                khach_thue_id,
                can_ho:can_ho_id(id, so_can, toa_nha_id)
            `)
            .eq('id', hopDongId)
            .single()

        if (hopDongError || !hopDong) {
            console.error('createThongBaoForAdminAboutInvoice - Error fetching hop_dong:', hopDongError)
            return null
        }

        const khachThueId = hopDong.khach_thue_id
        const canHoId = hopDong.can_ho?.id
        const toaNhaId = hopDong.can_ho?.toa_nha_id
        const soCan = hopDong.can_ho?.so_can

        if (!toaNhaId) {
            console.warn('createThongBaoForAdminAboutInvoice - No toa_nha_id found')
            return null
        }

        // Lấy thông tin khách thuê để hiển thị tên
        let tenantName = 'Khách thuê'
        if (khachThueId) {
            try {
                const { data: khachThue } = await supabase
                    .from('khach_thue')
                    .select('ho_ten')
                    .eq('id', khachThueId)
                    .single()
                if (khachThue?.ho_ten) {
                    tenantName = khachThue.ho_ten
                }
            } catch (e) {
                console.warn('createThongBaoForAdminAboutInvoice - Error fetching tenant name:', e)
            }
        }

        // Tạo thông báo cho admin
        const thongBaoData = {
            khach_thue_id: khachThueId, // Có thể null nếu không có khách thuê
            toa_nha_id: toaNhaId,
            can_ho_id: canHoId || null,
            tieu_de: `Hóa đơn mới - Phòng ${soCan || 'N/A'}`,
            noi_dung: `${tenantName} - Hóa đơn số ${hoaDonId} với số tiền ${Number(soTien || 0).toLocaleString('vi-VN')}₫ cần được xử lý.`,
            loai_thong_bao: 'thanh_toan'
        }

        // Nếu không có khach_thue_id, vẫn tạo thông báo nhưng với khach_thue_id = null
        // Cần kiểm tra xem database có cho phép null không
        if (!khachThueId) {
            console.warn('createThongBaoForAdminAboutInvoice - No khach_thue_id, creating notification without it')
            // Thử tạo với khach_thue_id = null, nếu lỗi thì bỏ qua
            try {
                const thongBaoId = await getNextThongBaoId(new Date())
                const { data, error } = await supabase
                    .from('thong_bao')
                    .insert([{
                        id: thongBaoId,
                        khach_thue_id: null,
                        toa_nha_id: toaNhaId,
                        can_ho_id: canHoId || null,
                        tieu_de: thongBaoData.tieu_de,
                        noi_dung: thongBaoData.noi_dung,
                        loai_thong_bao: thongBaoData.loai_thong_bao,
                        trang_thai: 'chua_xu_ly'
                    }])
                    .select()
                    .single()

                if (error) {
                    console.error('createThongBaoForAdminAboutInvoice - Error creating notification:', error)
                    return null
                }
                return data
            } catch (e) {
                console.error('createThongBaoForAdminAboutInvoice - Error:', e)
                return null
            }
        }

        // Tạo thông báo bình thường với khach_thue_id
        return await createThongBao(thongBaoData)
    } catch (error) {
        console.error('createThongBaoForAdminAboutInvoice - Unexpected error:', error)
        return null
    }
}


