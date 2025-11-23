import { supabase } from './supabase-client'
import { generateFormattedId } from '../utils/id-generator'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listQuanLy() {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('quan_ly')
        .select('*, tai_khoan: tai_khoan_id (id, username, role, password), toa_nha: toa_nha (id, ten_toa)')
        .order('id')
    if (error) throw error
    return data || []
}

export async function getQuanLyById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('quan_ly').select('*').eq('id', id).single()
    if (error) throw error
    return data
}

/**
 * Lấy ID tiếp theo cho quan_ly theo format: QL0000000001
 * Sử dụng listQuanLy() để tránh vấn đề RLS
 */
async function getNextQuanLyId() {
    try {
        console.log('Getting next quan_ly id...')

        // Thử dùng listQuanLy() trước vì nó đã được test và hoạt động
        try {
            const allQuanLy = await listQuanLy()
            console.log('List quan_ly result:', allQuanLy)

            if (allQuanLy && allQuanLy.length > 0) {
                const existingIds = allQuanLy.map(ql => ql.id).filter(Boolean)
                const nextId = generateFormattedId('QL', existingIds)
                console.log('Next id will be:', nextId)
                return nextId
            }
        } catch (listError) {
            console.warn('Error using listQuanLy, trying direct query:', listError)
        }

        // Fallback: query trực tiếp
        const { data, error } = await supabase
            .from('quan_ly')
            .select('id')
            .order('id', { ascending: false })
            .limit(1)

        if (error) {
            console.error('Error getting max id:', error)
            console.warn('Using fallback id: QL0000000001')
            return 'QL0000000001'
        }

        console.log('Direct query result:', data)

        if (data && data.length > 0 && data[0] && data[0].id != null) {
            const nextId = generateFormattedId('QL', [data[0].id])
            console.log('Next id will be:', nextId)
            return nextId
        }

        console.log('No existing records, using id: QL0000000001')
        return 'QL0000000001'
    } catch (error) {
        console.error('Error in getNextQuanLyId:', error)
        console.warn('Using fallback id: QL0000000001')
        return 'QL0000000001'
    }
}

// Track pending creates to prevent duplicate calls
const pendingCreates = new Map()

export async function createQuanLy(payload) {
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
            console.log('Creating quan_ly with payload:', payload)

            // Generate id tiếp theo nếu database không tự động generate
            const nextId = await getNextQuanLyId()
            console.log('Generated next id:', nextId)

            // Đảm bảo id là string hợp lệ với format QL0000000001
            if (!nextId || typeof nextId !== 'string' || !nextId.startsWith('QL')) {
                console.error('Invalid id generated:', nextId)
                throw new Error('Failed to generate valid id for quan_ly')
            }

            // Tạo payload với id được generate - đảm bảo không có field nào là undefined
            const cleanPayload = {
                id: nextId,
                ho_ten: payload.ho_ten || '',
                sdt: payload.sdt || null,
                email: payload.email || null,
            }

            // Chỉ thêm tai_khoan_id nếu có giá trị hợp lệ
            if (payload.tai_khoan_id != null && payload.tai_khoan_id !== '' && payload.tai_khoan_id !== undefined) {
                cleanPayload.tai_khoan_id = Number(payload.tai_khoan_id)
            }

            console.log('Final payload to insert:', cleanPayload)
            console.log('Payload id type:', typeof cleanPayload.id, 'value:', cleanPayload.id)

            const { data, error } = await supabase.from('quan_ly').insert([cleanPayload]).select().single()

            if (error) {
                console.error('Insert error:', error)
                console.error('Error code:', error.code)
                console.error('Error message:', error.message)

                // Chỉ retry nếu lỗi là do duplicate key (id conflict)
                // KHÔNG retry cho các lỗi khác như null constraint
                if (error.code === '23505' || (error.message?.includes('duplicate') && error.message?.includes('key'))) {
                    console.log('ID conflict detected, retrying with new ID...')
                    const retryId = await getNextQuanLyId()
                    console.log('Retry id:', retryId)
                    const retryPayload = {
                        ...cleanPayload,
                        id: retryId,
                    }
                    console.log('Retry payload:', retryPayload)
                    const { data: retryData, error: retryError } = await supabase
                        .from('quan_ly')
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
        console.error('Error creating quan_ly:', error)
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        })
        throw error
    }
}

export async function updateQuanLy(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('quan_ly').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteQuanLy(id) {
    if (!isReady()) {
        console.error('Supabase client not ready')
        throw new Error('Supabase client not ready')
    }

    // Validate id (có thể là string hoặc number)
    if (id == null || id === undefined || id === '') {
        console.error('Invalid id for deleteQuanLy:', id)
        throw new Error('Invalid id: id is required to delete quan_ly')
    }

    // Chấp nhận cả string (QL0000000001) và number
    const idValue = typeof id === 'string' ? id : String(id)

    console.log('Deleting quan_ly with id:', idValue)

    try {
        // Trước khi xóa, cần xóa quan hệ với toa_nha (set quan_ly_id = null)
        // Để tránh foreign key constraint violation
        try {
            const { data: toaNhaList, error: toaNhaError } = await supabase
                .from('toa_nha')
                .select('id')
                .eq('quan_ly_id', idValue)

            if (!toaNhaError && toaNhaList && toaNhaList.length > 0) {
                console.log(`Found ${toaNhaList.length} toa_nha linked to this quan_ly, removing links...`)
                const { error: updateError } = await supabase
                    .from('toa_nha')
                    .update({ quan_ly_id: null })
                    .eq('quan_ly_id', idValue)

                if (updateError) {
                    console.warn('Failed to remove quan_ly_id from toa_nha:', updateError)
                    // Không throw error ở đây, vì có thể RLS không cho phép update
                    // Nhưng vẫn thử xóa quan_ly
                } else {
                    console.log('Successfully removed quan_ly_id from toa_nha')
                }
            }
        } catch (linkError) {
            console.warn('Error checking/updating toa_nha links:', linkError)
            // Tiếp tục xóa quan_ly dù có lỗi ở đây
        }

        // Xóa quan_ly
        const { error } = await supabase
            .from('quan_ly')
            .delete()
            .eq('id', idValue)

        if (error) {
            console.error('Error deleting quan_ly:', error)
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            })
            throw error
        }

        console.log('Successfully deleted quan_ly with id:', idValue)
        return { id: idValue }
    } catch (error) {
        console.error('Error in deleteQuanLy:', error)
        throw error
    }
}

export async function getQuanLyByTaiKhoanId(taiKhoanId) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('quan_ly')
        .select('*, tai_khoan: tai_khoan_id (id, username, role, password)')
        .eq('tai_khoan_id', taiKhoanId)
        .single()
    if (error) throw error
    return data
}

export async function getToaNhaByQuanLy(quanLyId) {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('toa_nha')
        .select('*')
        .eq('quan_ly_id', quanLyId)

    if (error) throw error
    return data
}

