import { useState } from 'react'
import { createTaiKhoan } from '@/services/tai-khoan.service'
import { updateKhachThue, getKhachThueById } from '@/services/khach-thue.service'

export function useTenantAccount() {
    const [isCreating, setIsCreating] = useState(false)

    const hasAccount = (tenant) => {
        return tenant.tai_khoan_id ||
            tenant.tai_khoan ||
            (tenant.tai_khoan && tenant.tai_khoan.id) ||
            (tenant.tai_khoan && tenant.tai_khoan.username)
    }

    const createAccount = async (tenant, onSuccess) => {
        if (isCreating) return

        try {
            setIsCreating(true)

            // Kiểm tra xem khách thuê đã có tài khoản chưa - kiểm tra chặt chẽ hơn
            if (hasAccount(tenant)) {
                alert('Khách thuê đã có tài khoản. Không thể cấp tài khoản mới.')
                return
            }

            // Kiểm tra thêm bằng cách gọi API để xác nhận
            try {
                const currentTenant = await getKhachThueById(tenant.id)

                if (currentTenant && currentTenant.tai_khoan_id) {
                    alert('Khách thuê đã có tài khoản. Không thể cấp tài khoản mới.')
                    return
                }
            } catch (apiError) {
                console.warn('Could not verify account status from API:', apiError)
                // Tiếp tục nếu không thể kiểm tra từ API
            }

            // Tạo username duy nhất từ email hoặc tên + timestamp
            let username
            if (tenant.email && tenant.email.trim()) {
                // Sử dụng email nếu có
                username = tenant.email.trim()
            } else {
                // Tạo username từ tên + timestamp để đảm bảo duy nhất
                const nameSlug = tenant.name.toLowerCase()
                    .replace(/[^a-z0-9]/g, '')
                    .substring(0, 10)
                const timestamp = Date.now().toString().slice(-6)
                username = `${nameSlug}_${timestamp}`
            }
            const defaultPassword = '123'

            // Tạo tài khoản mới với retry logic
            let account = null
            let finalUsername = username
            let retryCount = 0
            const maxRetries = 3

            while (!account && retryCount < maxRetries) {
                try {
                    account = await createTaiKhoan({
                        username: finalUsername,
                        password: defaultPassword,
                        role: 'khach_thue'
                    })
                } catch (error) {
                    const errorObj = error
                    if (errorObj?.code === '23505' && retryCount < maxRetries - 1) {
                        // Username trùng lặp, tạo username mới
                        retryCount++
                        const randomSuffix = Math.random().toString(36).substring(2, 8)
                        finalUsername = `${username}_${randomSuffix}`
                        console.log(`Username conflict, retrying with: ${finalUsername}`)
                    } else {
                        throw error
                    }
                }
            }

            if (!account?.id) {
                alert('Không thể tạo tài khoản sau nhiều lần thử. Vui lòng thử lại.')
                return
            }

            // Cập nhật khách thuê với tai_khoan_id
            await updateKhachThue(tenant.id, { tai_khoan_id: account.id })

            // Cập nhật local state để hiển thị thông tin tài khoản mới ngay lập tức
            const updatedTenant = {
                ...tenant,
                tai_khoan_id: account.id,
                tai_khoan: {
                    id: account.id,
                    username: finalUsername,
                    password: defaultPassword,
                    role: 'khach_thue',
                    created_at: account.created_at,
                    is_active: account.is_active
                }
            }

            // Gọi callback thành công
            if (onSuccess) {
                onSuccess(updatedTenant)
            }

            alert(`Đã cấp tài khoản thành công!\nUsername: ${finalUsername}\nPassword: ${defaultPassword}\n\nVui lòng thông báo cho khách thuê để đổi mật khẩu.`)
        } catch (error) {
            console.error('Failed to create account:', error)
            const errorObj = error
            if (errorObj?.code === '23505') {
                alert('Username đã tồn tại. Vui lòng thử lại.')
            } else {
                alert('Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.')
            }
        } finally {
            setIsCreating(false)
        }
    }

    return {
        hasAccount,
        createAccount,
        isCreating
    }
}
