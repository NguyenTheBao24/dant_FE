import { supabase } from './supabase-client'
import { generateFormattedId } from '../utils/id-generator'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listKhachThue() {
    if (!isReady()) return []
    const { data, error } = await supabase.from('khach_thue').select('*').order('ho_ten')
    if (error) throw error
    return data || []
}

export async function getKhachThueById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('khach_thue').select('*').eq('id', id).single()
    if (error) throw error
    return data
}

/**
 * Lấy ID tiếp theo cho khach_thue theo format: KT0000000001
 * Sử dụng listKhachThue() để tránh vấn đề RLS
 */
async function getNextKhachThueId() {
    try {
        console.log('Getting next khach_thue id...')

        // Thử dùng listKhachThue() trước vì nó đã được test và hoạt động
        try {
            const allKhachThue = await listKhachThue()
            console.log('List khach_thue result:', allKhachThue)

            if (allKhachThue && allKhachThue.length > 0) {
                const existingIds = allKhachThue.map(kt => kt.id).filter(Boolean)
                const nextId = generateFormattedId('KT', existingIds)
                console.log('Next id will be:', nextId)
                return nextId
            }
        } catch (listError) {
            console.warn('Error using listKhachThue, trying direct query:', listError)
        }

        // Fallback: query trực tiếp
        const { data, error } = await supabase
            .from('khach_thue')
            .select('id')
            .order('id', { ascending: false })
            .limit(1)

        if (error) {
            console.error('Error getting max id:', error)
            console.warn('Using fallback id: KT0000000001')
            return 'KT0000000001'
        }

        console.log('Direct query result:', data)

        if (data && data.length > 0 && data[0] && data[0].id != null) {
            const nextId = generateFormattedId('KT', [data[0].id])
            console.log('Next id will be:', nextId)
            return nextId
        }

        console.log('No existing records, using id: KT0000000001')
        return 'KT0000000001'
    } catch (error) {
        console.error('Error in getNextKhachThueId:', error)
        console.warn('Using fallback id: KT0000000001')
        return 'KT0000000001'
    }
}

// Track pending creates to prevent duplicate calls
const pendingCreates = new Map()

export async function createKhachThue(payload) {
    if (!isReady()) {
        console.error('Supabase client not ready')
        return null
    }

    // Tạo key duy nhất từ payload để detect duplicate calls
    const payloadKey = `${payload.ho_ten}_${payload.sdt}_${payload.email || 'null'}_${payload.tai_khoan_id || 'null'}`

    // Kiểm tra xem có đang có request tương tự đang chạy không
    if (pendingCreates.has(payloadKey)) {
        console.warn('Duplicate create request detected, waiting for existing request...')
        return await pendingCreates.get(payloadKey)
    }

    // Tạo promise và lưu vào map
    const createPromise = (async () => {
        try {
            console.log('Creating khach_thue with payload:', payload)

            // Generate id tiếp theo nếu database không tự động generate
            const nextId = await getNextKhachThueId()
            console.log('Generated next id:', nextId)

            // Đảm bảo id là string hợp lệ với format KT0000000001
            if (!nextId || typeof nextId !== 'string' || !nextId.startsWith('KT')) {
                console.error('Invalid id generated:', nextId)
                throw new Error('Failed to generate valid id for khach_thue')
            }

            // Tạo payload với id được generate - chỉ thêm các field thực sự tồn tại trong database
            // Bảng khach_thue có: id, ho_ten, sdt, email, cccd, tai_khoan_id
            // KHÔNG có: dia_chi (địa chỉ không lưu trong bảng khach_thue)
            const cleanPayload = {
                id: nextId,
                ho_ten: payload.ho_ten || '',
                sdt: payload.sdt || null,
            }

            // Chỉ thêm email nếu có giá trị hợp lệ
            if (payload.email != null && payload.email !== '' && payload.email !== undefined) {
                cleanPayload.email = String(payload.email).trim()
            }

            // Chỉ thêm cccd nếu có giá trị hợp lệ (database dùng cccd, không phải cmnd)
            if (payload.cccd != null && payload.cccd !== '' && payload.cccd !== undefined) {
                cleanPayload.cccd = String(payload.cccd).trim()
            }

            // Chỉ thêm tai_khoan_id nếu có giá trị hợp lệ
            if (payload.tai_khoan_id != null && payload.tai_khoan_id !== '' && payload.tai_khoan_id !== undefined) {
                cleanPayload.tai_khoan_id = typeof payload.tai_khoan_id === 'string'
                    ? payload.tai_khoan_id
                    : String(payload.tai_khoan_id)
            }

            console.log('Final payload to insert:', cleanPayload)
            console.log('Payload id type:', typeof cleanPayload.id, 'value:', cleanPayload.id)

            const { data, error } = await supabase.from('khach_thue').insert([cleanPayload]).select().single()

            if (error) {
                console.error('Insert error:', error)
                console.error('Error code:', error.code)
                console.error('Error message:', error.message)

                // Chỉ retry nếu lỗi là do duplicate key (id conflict)
                // KHÔNG retry cho các lỗi khác như null constraint
                if (error.code === '23505' || (error.message?.includes('duplicate') && error.message?.includes('key'))) {
                    console.log('ID conflict detected, retrying with new ID...')
                    const retryId = await getNextKhachThueId()
                    console.log('Retry id:', retryId)
                    const retryPayload = {
                        ...cleanPayload,
                        id: retryId,
                    }
                    console.log('Retry payload:', retryPayload)
                    const { data: retryData, error: retryError } = await supabase
                        .from('khach_thue')
                        .insert([retryPayload])
                        .select()
                        .single()
                    if (retryError) {
                        console.error('Retry also failed:', retryError)
                        throw retryError
                    }
                    console.log('Retry successful:', retryData)
                    return retryData
                }
                throw error
            }

            console.log('Insert successful:', data)
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
        console.error('Error creating khach_thue:', error)
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        })
        throw error
    }
}

export async function updateKhachThue(id, updates) {
    if (!isReady()) return null

    console.log('Updating khach thue with ID:', id)
    console.log('Updates:', updates)

    try {
        const { data, error } = await supabase
            .from('khach_thue')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            throw error
        }

        console.log('Successfully updated khach thue:', data)
        return data
    } catch (error) {
        console.error('Error in updateKhachThue:', error)
        throw error
    }
}

export async function deleteKhachThue(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('khach_thue').delete().eq('id', id)
    if (error) throw error
    return { id }
}

export async function getKhachThueByTaiKhoanId(taiKhoanId) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('khach_thue')
        .select('*')
        .eq('tai_khoan_id', taiKhoanId)
        .single()
    if (error) throw error
    return data
}

// Kiểm tra email có bị trùng không (ngoại trừ user hiện tại)
export async function checkEmailExists(email, excludeId = null) {
    if (!isReady()) return false
    let query = supabase
        .from('khach_thue')
        .select('id')
        .eq('email', email)

    if (excludeId) {
        query = query.neq('id', excludeId)
    }

    const { data, error } = await query
    if (error) throw error
    return data && data.length > 0
}

// Kiểm tra số điện thoại có bị trùng không (ngoại trừ user hiện tại)
export async function checkPhoneExists(phone, excludeId = null) {
    if (!isReady()) return false
    let query = supabase
        .from('khach_thue')
        .select('id')
        .eq('sdt', phone)

    if (excludeId) {
        query = query.neq('id', excludeId)
    }

    const { data, error } = await query
    if (error) throw error
    return data && data.length > 0
}


