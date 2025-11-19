import { supabase } from './supabase-client'

function isReady() {
    return supabase && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
}

/**
 * Send contract PDF via email
 */
export async function sendContractEmail({
    toEmail,
    tenantName,
    contractPdfBase64,
    contractId,
    hostelName,
    roomNumber
}) {
    if (!isReady()) {
        throw new Error('Supabase not configured')
    }

    try {
        // Call Supabase Edge Function to send email
        const { data, error } = await supabase.functions.invoke('send-contract-email', {
            body: {
                toEmail,
                tenantName,
                contractPdfBase64,
                contractId,
                hostelName,
                roomNumber,
                subject: `Hợp đồng thuê phòng - ${hostelName} - Phòng ${roomNumber}`,
                message: `Kính gửi ${tenantName},\n\nVui lòng tìm đính kèm hợp đồng thuê phòng của bạn.\n\nChi tiết:\n- Khu trọ: ${hostelName}\n- Phòng: ${roomNumber}\n- Mã hợp đồng: ${contractId}\n\nTrân trọng,\nQuản lý khu trọ`
            }
        })

        if (error) {
            console.error('Error sending contract email:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in sendContractEmail:', error)
        throw error
    }
}

/**
 * Send notification email
 */
export async function sendNotificationEmail({
    toEmail,
    tenantName,
    subject,
    message
}) {
    if (!isReady()) {
        throw new Error('Supabase not configured')
    }

    try {
        const { data, error } = await supabase.functions.invoke('send-notification-email', {
            body: {
                toEmail,
                tenantName,
                subject,
                message
            }
        })

        if (error) {
            console.error('Error sending notification email:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in sendNotificationEmail:', error)
        throw error
    }
}

/**
 * Notify contract email without PDF attachment (uses send-contract-email function)
 */
export async function notifyContractEmail({
    toEmail,
    tenantName,
    subject,
    message,
    contractId,
}) {
    if (!isReady()) {
        throw new Error('Supabase not configured')
    }

    try {
        const { data, error } = await supabase.functions.invoke('send-contract-email', {
            body: {
                toEmail,
                tenantName,
                subject: subject || 'Thông báo hợp đồng thuê phòng',
                message: message || 'Hợp đồng của bạn đã được tạo thành công.',
                contractId: contractId || null,
            }
        })

        if (error) {
            console.error('Error notifying contract email:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Error in notifyContractEmail:', error)
        throw error
    }
}
