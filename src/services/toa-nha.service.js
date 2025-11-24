import { supabase } from './supabase-client'
import { generateFormattedId } from '../utils/id-generator'

function isReady() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function listToaNha() {
    if (!isReady()) return []
    const { data, error } = await supabase
        .from('toa_nha')
        .select('*, quan_ly(id, ho_ten, sdt, email, tai_khoan_id, tai_khoan: tai_khoan_id (id, username, role, password))')
        .order('id')
    if (error) throw error
    return data || []
}

export async function getToaNhaById(id) {
    if (!isReady()) return null
    const { data, error } = await supabase
        .from('toa_nha')
        .select('*, quan_ly(id, ho_ten, sdt, email, tai_khoan_id, tai_khoan: tai_khoan_id (id, username, role, password))')
        .eq('id', id)
        .single()
    if (error) throw error
    return data
}

/**
 * Lấy ID tiếp theo cho toa_nha theo format: TN0000000001
 * Sử dụng listToaNha() để tránh vấn đề RLS
 */
async function getNextToaNhaId() {
    try {
        console.log('Getting next toa_nha id...')

        // Thử dùng listToaNha() trước vì nó đã được test và hoạt động
        try {
            const allToaNha = await listToaNha()
            console.log('List toa_nha result:', allToaNha)

            if (allToaNha && allToaNha.length > 0) {
                const existingIds = allToaNha.map(tn => tn.id).filter(Boolean)
                const nextId = generateFormattedId('TN', existingIds)
                console.log('Next id will be:', nextId)
                return nextId
            }
        } catch (listError) {
            console.warn('Error using listToaNha, trying direct query:', listError)
        }

        // Fallback: query trực tiếp
        const { data, error } = await supabase
            .from('toa_nha')
            .select('id')
            .order('id', { ascending: false })
            .limit(1)

        if (error) {
            console.error('Error getting max id:', error)
            console.warn('Using fallback id: TN0000000001')
            return 'TN0000000001'
        }

        console.log('Direct query result:', data)

        if (data && data.length > 0 && data[0] && data[0].id != null) {
            const nextId = generateFormattedId('TN', [data[0].id])
            console.log('Next id will be:', nextId)
            return nextId
        }

        console.log('No existing records, using id: TN0000000001')
        return 'TN0000000001'
    } catch (error) {
        console.error('Error in getNextToaNhaId:', error)
        console.warn('Using fallback id: TN0000000001')
        return 'TN0000000001'
    }
}

// Track pending creates to prevent duplicate calls
const pendingCreates = new Map()

export async function createToaNha(payload) {
    if (!isReady()) {
        console.error('Supabase client not ready')
        return null
    }

    // Tạo key duy nhất từ payload để detect duplicate calls
    const payloadKey = `${payload.ten_toa}_${payload.dia_chi}_${payload.quan_ly_id || 'null'}`

    // Kiểm tra xem có đang có request tương tự đang chạy không
    if (pendingCreates.has(payloadKey)) {
        console.warn('Duplicate create request detected, waiting for existing request...')
        return await pendingCreates.get(payloadKey)
    }

    // Tạo promise và lưu vào map
    const createPromise = (async () => {
        try {
            console.log('Creating toa_nha with payload:', payload)

            // Generate id tiếp theo nếu database không tự động generate
            const nextId = await getNextToaNhaId()
            console.log('Generated next id:', nextId)

            // Đảm bảo id là string hợp lệ với format TN0000000001
            if (!nextId || typeof nextId !== 'string' || !nextId.startsWith('TN')) {
                console.error('Invalid id generated:', nextId)
                throw new Error('Failed to generate valid id for toa_nha')
            }

            // Tạo payload với id được generate - đảm bảo không có field nào là undefined
            const cleanPayload = {
                id: nextId,
                ten_toa: payload.ten_toa || '',
                dia_chi: payload.dia_chi || '',
            }

            // Chỉ thêm quan_ly_id nếu có giá trị hợp lệ
            if (payload.quan_ly_id != null && payload.quan_ly_id !== '' && payload.quan_ly_id !== undefined) {
                cleanPayload.quan_ly_id = Number(payload.quan_ly_id)
            }

            console.log('Final payload to insert:', cleanPayload)
            console.log('Payload id type:', typeof cleanPayload.id, 'value:', cleanPayload.id)

            const { data, error } = await supabase.from('toa_nha').insert([cleanPayload]).select().single()

            if (error) {
                console.error('Insert error:', error)
                console.error('Error code:', error.code)
                console.error('Error message:', error.message)

                // Chỉ retry nếu lỗi là do duplicate key (id conflict)
                // KHÔNG retry cho các lỗi khác như null constraint
                if (error.code === '23505' || (error.message?.includes('duplicate') && error.message?.includes('key'))) {
                    console.log('ID conflict detected, retrying with new ID...')
                    const retryId = await getNextToaNhaId()
                    console.log('Retry id:', retryId)
                    const retryPayload = {
                        ...cleanPayload,
                        id: retryId,
                    }
                    console.log('Retry payload:', retryPayload)
                    const { data: retryData, error: retryError } = await supabase
                        .from('toa_nha')
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
        console.error('Error creating toa_nha:', error)
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        })
        throw error
    }
}

export async function updateToaNha(id, updates) {
    if (!isReady()) return null
    const { data, error } = await supabase.from('toa_nha').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
}

export async function deleteToaNha(id) {
    if (!isReady()) {
        console.error('Supabase client not ready')
        throw new Error('Supabase client not ready')
    }

    // Validate id (có thể là string hoặc number)
    if (id == null || id === undefined || id === '') {
        console.error('Invalid id for deleteToaNha:', id)
        throw new Error('Invalid id: id is required to delete toa_nha')
    }

    // Chấp nhận cả string (TN0000000001) và number
    const idValue = typeof id === 'string' ? id : String(id)

    console.log('Deleting toa_nha with id:', idValue)

    try {
        // Bước 1: Lấy danh sách tất cả căn hộ (can_ho) thuộc tòa nhà này
        console.log('Step 1: Getting all can_ho for toa_nha:', idValue)
        const { data: canHoList, error: canHoError } = await supabase
            .from('can_ho')
            .select('id')
            .eq('toa_nha_id', idValue)

        if (canHoError) {
            console.error('Error getting can_ho list:', canHoError)
            throw new Error(`Cannot get can_ho list: ${canHoError.message}`)
        }

        // Bước 2: Xóa tất cả các bản ghi liên quan theo thứ tự đúng để tránh foreign key constraint
        if (canHoList && canHoList.length > 0) {
            console.log(`Step 2: Found ${canHoList.length} can_ho, deleting related records...`)

            const canHoIds = canHoList.map(ch => ch.id)

            // 2.1: Xóa phan_hoi_thong_bao liên quan đến thong_bao của các can_ho này
            try {
                const { data: thongBaoList, error: tbError } = await supabase
                    .from('thong_bao')
                    .select('id')
                    .in('can_ho_id', canHoIds)

                if (!tbError && thongBaoList && thongBaoList.length > 0) {
                    const thongBaoIds = thongBaoList.map(tb => tb.id)
                    console.log(`  Found ${thongBaoIds.length} thong_bao, deleting phan_hoi_thong_bao...`)

                    const { error: delPhError } = await supabase
                        .from('phan_hoi_thong_bao')
                        .delete()
                        .in('thong_bao_id', thongBaoIds)

                    if (delPhError) {
                        console.warn(`    Failed to delete phan_hoi_thong_bao:`, delPhError)
                    } else {
                        console.log(`    Successfully deleted phan_hoi_thong_bao`)
                    }
                }
            } catch (phError) {
                console.warn('Error deleting phan_hoi_thong_bao:', phError)
            }

            // 2.2: Xóa thong_bao liên quan đến can_ho
            try {
                const { error: delTbError } = await supabase
                    .from('thong_bao')
                    .delete()
                    .in('can_ho_id', canHoIds)

                if (delTbError) {
                    console.warn(`    Failed to delete thong_bao by can_ho_id:`, delTbError)
                } else {
                    console.log(`    Successfully deleted thong_bao by can_ho_id`)
                }
            } catch (tbError) {
                console.warn('Error deleting thong_bao by can_ho_id:', tbError)
            }

            // 2.3: Xóa hoa_don liên quan đến hop_dong
            for (const canHo of canHoList) {
                try {
                    // Lấy danh sách hop_dong liên quan đến căn hộ này
                    const { data: hopDongList, error: hdError } = await supabase
                        .from('hop_dong')
                        .select('id')
                        .eq('can_ho_id', canHo.id)

                    if (!hdError && hopDongList && hopDongList.length > 0) {
                        const hopDongIds = hopDongList.map(hd => hd.id)
                        console.log(`  Found ${hopDongIds.length} hop_dong for can_ho ${canHo.id}, deleting hoa_don...`)

                        // Xóa tất cả hoa_don liên quan đến hop_dong
                        const { error: delHdError } = await supabase
                            .from('hoa_don')
                            .delete()
                            .in('hop_dong_id', hopDongIds)

                        if (delHdError) {
                            console.warn(`    Failed to delete hoa_don for can_ho ${canHo.id}:`, delHdError)
                        } else {
                            console.log(`    Successfully deleted hoa_don for can_ho ${canHo.id}`)
                        }

                        // Xóa tất cả hop_dong liên quan
                        console.log(`  Deleting ${hopDongIds.length} hop_dong for can_ho ${canHo.id}`)
                        for (const hd of hopDongList) {
                            const { error: delHdError2 } = await supabase
                                .from('hop_dong')
                                .delete()
                                .eq('id', hd.id)

                            if (delHdError2) {
                                console.warn(`    Failed to delete hop_dong ${hd.id}:`, delHdError2)
                            }
                        }
                    }
                } catch (hdError) {
                    console.warn(`Error processing hop_dong for can_ho ${canHo.id}:`, hdError)
                }
            }

            // 2.4: Xóa căn hộ
            for (const canHo of canHoList) {
                try {
                    console.log(`  Deleting can_ho ${canHo.id}`)
                    const { error: delCanHoError } = await supabase
                        .from('can_ho')
                        .delete()
                        .eq('id', canHo.id)

                    if (delCanHoError) {
                        console.error(`    Failed to delete can_ho ${canHo.id}:`, delCanHoError)
                        throw delCanHoError
                    }
                } catch (canHoDelError) {
                    console.error(`Error deleting can_ho ${canHo.id}:`, canHoDelError)
                    throw canHoDelError
                }
            }

            console.log('Successfully deleted all can_ho and related records')
        } else {
            console.log('No can_ho found for this toa_nha')
        }

        // Bước 2.5: Xóa các bản ghi liên quan đến toa_nha (không phụ thuộc can_ho)
        try {
            // Xóa chi_tieu
            const { error: delCtError } = await supabase
                .from('chi_tieu')
                .delete()
                .eq('toa_nha_id', idValue)

            if (delCtError) {
                console.warn(`Failed to delete chi_tieu:`, delCtError)
            } else {
                console.log(`Successfully deleted chi_tieu`)
            }
        } catch (ctError) {
            console.warn('Error deleting chi_tieu:', ctError)
        }

        try {
            // Xóa quan_tam
            const { error: delQtError } = await supabase
                .from('quan_tam')
                .delete()
                .eq('toa_nha_id', idValue)

            if (delQtError) {
                console.warn(`Failed to delete quan_tam:`, delQtError)
            } else {
                console.log(`Successfully deleted quan_tam`)
            }
        } catch (qtError) {
            console.warn('Error deleting quan_tam:', qtError)
        }

        try {
            // Xóa thong_bao còn lại (nếu có tham chiếu trực tiếp đến toa_nha)
            const { error: delTbError2 } = await supabase
                .from('thong_bao')
                .delete()
                .eq('toa_nha_id', idValue)

            if (delTbError2) {
                console.warn(`Failed to delete remaining thong_bao:`, delTbError2)
            } else {
                console.log(`Successfully deleted remaining thong_bao`)
            }
        } catch (tbError2) {
            console.warn('Error deleting remaining thong_bao:', tbError2)
        }

        // Bước 3: Xóa toa_nha
        console.log('Step 3: Deleting toa_nha:', idValue)
        const { error } = await supabase
            .from('toa_nha')
            .delete()
            .eq('id', idValue)

        if (error) {
            console.error('Error deleting toa_nha:', error)
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            })
            throw error
        }

        console.log('Successfully deleted toa_nha with id:', idValue)
        return { id: idValue }
    } catch (error) {
        console.error('Error in deleteToaNha:', error)
        throw error
    }
}


