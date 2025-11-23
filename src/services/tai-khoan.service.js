import { supabase } from './supabase-client'
import { generateFormattedId } from '../utils/id-generator'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listTaiKhoan() {
    if (!isReady()) return []
    const { data, error } = await supabase.from('tai_khoan').select('*').order('id')
    if (error) throw error
    return data || []
}

export async function getTaiKhoanById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('tai_khoan').select('*').eq('id', id).single()
    if (error) throw error
    return data
}

/**
 * Lấy ID tiếp theo cho tai_khoan theo format: TK0000000001
 * Sử dụng listTaiKhoan() để tránh vấn đề RLS
 */
async function getNextTaiKhoanId() {
    try {
        console.log('Getting next tai_khoan id...')

        // Thử dùng listTaiKhoan() trước vì nó đã được test và hoạt động
        try {
            const allTaiKhoan = await listTaiKhoan()
            console.log('List tai_khoan result:', allTaiKhoan)

            if (allTaiKhoan && allTaiKhoan.length > 0) {
                const existingIds = allTaiKhoan.map(tk => tk.id).filter(Boolean)
                const nextId = generateFormattedId('TK', existingIds)
                console.log('Next id will be:', nextId)
                return nextId
            }
        } catch (listError) {
            console.warn('Error using listTaiKhoan, trying direct query:', listError)
        }

        // Fallback: query trực tiếp
        const { data, error } = await supabase
            .from('tai_khoan')
            .select('id')
            .order('id', { ascending: false })
            .limit(1)

        if (error) {
            console.error('Error getting max id:', error)
            console.warn('Using fallback id: TK0000000001')
            return 'TK0000000001'
        }

        console.log('Direct query result:', data)

        if (data && data.length > 0 && data[0] && data[0].id != null) {
            const nextId = generateFormattedId('TK', [data[0].id])
            console.log('Next id will be:', nextId)
            return nextId
        }

        console.log('No existing records, using id: TK0000000001')
        return 'TK0000000001'
    } catch (error) {
        console.error('Error in getNextTaiKhoanId:', error)
        console.warn('Using fallback id: TK0000000001')
        return 'TK0000000001'
    }
}

// Track pending creates to prevent duplicate calls
const pendingCreates = new Map()

export async function createTaiKhoan(payload) {
    if (!isReady()) {
        console.error('Supabase client not ready')
        return null
    }

    // Tạo key duy nhất từ payload để detect duplicate calls
    const payloadKey = `${payload.username}_${payload.role || 'null'}_${payload.password || 'null'}`

    // Kiểm tra xem có đang có request tương tự đang chạy không
    if (pendingCreates.has(payloadKey)) {
        console.warn('Duplicate create request detected, waiting for existing request...')
        return await pendingCreates.get(payloadKey)
    }

    // Tạo promise và lưu vào map
    const createPromise = (async () => {
        try {
            console.log('Creating tai_khoan with payload:', payload)

            // Generate id tiếp theo nếu database không tự động generate
            const nextId = await getNextTaiKhoanId()
            console.log('Generated next id:', nextId)

            // Đảm bảo id là string hợp lệ với format TK0000000001
            if (!nextId || typeof nextId !== 'string' || !nextId.startsWith('TK')) {
                console.error('Invalid id generated:', nextId)
                throw new Error('Failed to generate valid id for tai_khoan')
            }

            // Tạo payload với id được generate - đảm bảo không có field nào là undefined
            const cleanPayload = {
                id: nextId,
                username: payload.username || '',
                password: payload.password || '',
                role: payload.role || 'khach_thue',
            }

            console.log('Final payload to insert:', cleanPayload)
            console.log('Payload id type:', typeof cleanPayload.id, 'value:', cleanPayload.id)

            const { data, error } = await supabase.from('tai_khoan').insert([cleanPayload]).select().single()

            if (error) {
                console.error('Insert error:', error)
                console.error('Error code:', error.code)
                console.error('Error message:', error.message)

                // Chỉ retry nếu lỗi là do duplicate key (id conflict)
                // KHÔNG retry cho các lỗi khác như null constraint
                if (error.code === '23505' || (error.message?.includes('duplicate') && error.message?.includes('key'))) {
                    console.log('ID conflict detected, retrying with new ID...')
                    const retryId = await getNextTaiKhoanId()
                    console.log('Retry id:', retryId)
                    const retryPayload = {
                        ...cleanPayload,
                        id: retryId,
                    }
                    console.log('Retry payload:', retryPayload)
                    const { data: retryData, error: retryError } = await supabase
                        .from('tai_khoan')
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
        console.error('Error creating tai_khoan:', error)
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        })
        throw error
    }
}

export async function updateTaiKhoan(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('tai_khoan').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteTaiKhoan(id) {
    if (!isReady()) return { id }
    const { error } = await supabase.from('tai_khoan').delete().eq('id', id)
    if (error) throw error
    return { id }
}


export async function loginTaiKhoan(username, password) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('tai_khoan')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()
    if (error) return null
    return data
}


