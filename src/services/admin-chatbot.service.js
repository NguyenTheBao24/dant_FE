import { tinhDoanhThuThang, tinhDoanhThuTheoThangTuHoaDon, listHoaDonByToaNha } from '@/services/hoa-don.service'
import { listHopDongByToaNha, listHopDongSapHetHan, listHopDongByKhachThue } from '@/services/hop-dong.service'
import { listChiTieuByToaNha, getChiTieuStatsByMonth, getChiTieuStatsByType } from '@/services/chi-tieu.service'
import { listCanHoByToaNha } from '@/services/can-ho.service'
import { getThongBaoByToaNha, getThongBaoByKhachThue } from '@/services/thong-bao.service'
import { listKhachThue } from '@/services/khach-thue.service'
import { getExpenseTypeLabel, getNotificationTypeLabel, getNotificationStatusLabel, getRoomStatusLabel, getPaymentStatusLabel } from '@/utils/translations'
import { supabase } from '@/services/supabase-client'

const ACCENT_REGEX = /[\u0300-\u036f]/g

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(ACCENT_REGEX, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function formatCurrencyVND(value) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Math.round(value || 0))
}

function formatPercent(value) {
    return `${Math.round(value)}%`
}

function getRecentMonths(count = 3) {
    const months = []
    const anchor = new Date()
    anchor.setDate(1)
    for (let i = 0; i < count; i++) {
        const year = anchor.getFullYear()
        const month = anchor.getMonth() + 1
        months.unshift({ year, month })
        anchor.setMonth(anchor.getMonth() - 1)
    }
    return months
}

function monthLabelVi(year, month) {
    return `${month.toString().padStart(2, '0')}/${year}`
}

const HISTORY_MIN_YEAR = 2025

async function buildRevenueAnswer(hostelId) {
    const now = new Date()
    const currentRevenue = await tinhDoanhThuThang(
        hostelId,
        now.getFullYear(),
        now.getMonth() + 1
    )
    const revenueMap = await tinhDoanhThuTheoThangTuHoaDon(hostelId)
    const sortedMonths = Object.keys(revenueMap || {}).sort()
    const filteredMonths = sortedMonths.filter((key) => {
        const year = parseInt(key.split('-')[0], 10)
        return year >= HISTORY_MIN_YEAR
    })
    const lastMonths = filteredMonths.slice(-3)

    const contracts = await listHopDongByToaNha(hostelId)
    const expectedRevenueFull =
        (contracts || [])
            .filter((contract) => contract.trang_thai === 'hieu_luc')
            .reduce(
                (sum, contract) => sum + (contract.can_ho?.gia_thue || contract.gia_thue || 0),
                0
            ) || 0

    const historyDetail = lastMonths
        .map((key) => {
            const [y, m] = key.split('-')
            return `• ${m}/${y}: ${formatCurrencyVND(revenueMap?.[key] || 0)}`
        })
        .join('\n')

    const forecastText = expectedRevenueFull
        ? `Doanh thu kỳ tới (giả định toàn bộ phòng thanh toán đầy đủ): ${formatCurrencyVND(
            expectedRevenueFull
        )}.`
        : 'Chưa đủ dữ liệu hợp đồng để dự báo khi tất cả phòng thanh toán.'

    const historyText = lastMonths.length
        ? `Lịch sử gần nhất (từ ${HISTORY_MIN_YEAR}):\n${historyDetail}`
        : `Hiện chưa có dữ liệu doanh thu từ ${HISTORY_MIN_YEAR} trở đi.`

    return (
        `Doanh thu tháng ${now.getMonth() + 1}/${now.getFullYear()} ước tính ` +
        `${formatCurrencyVND(currentRevenue)}.\n${forecastText}\n\n${historyText}`
    )
}

async function buildExpenseAnswer(hostelId) {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    // Chi tiêu tháng hiện tại
    const currentStats = await getChiTieuStatsByMonth(hostelId, currentYear, currentMonth)
    const currentTotal = currentStats.totalAmount || 0

    // Chi tiết theo loại tháng hiện tại
    const startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`
    const lastDay = new Date(currentYear, currentMonth, 0).getDate()
    const endDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
    const statsByType = await getChiTieuStatsByType(hostelId, startDate, endDate)

    // So sánh 3 tháng gần nhất
    const months = getRecentMonths(3)
    const monthlyComparison = []
    for (const { year, month } of months) {
        const monthStats = await getChiTieuStatsByMonth(hostelId, year, month)
        monthlyComparison.push({
            year,
            month,
            total: monthStats.totalAmount || 0
        })
    }

    // Top 5 khoản chi lớn nhất
    const allExpenses = await listChiTieuByToaNha(hostelId)
    const topExpenses = (allExpenses || [])
        .sort((a, b) => (b.so_tien || 0) - (a.so_tien || 0))
        .slice(0, 5)

    // Phân tích xu hướng
    const trend = monthlyComparison.length >= 2
        ? monthlyComparison[monthlyComparison.length - 1].total - monthlyComparison[monthlyComparison.length - 2].total
        : 0
    const trendText = trend > 0
        ? `tăng ${formatCurrencyVND(Math.abs(trend))}`
        : trend < 0
            ? `giảm ${formatCurrencyVND(Math.abs(trend))}`
            : 'không thay đổi'

    // Xây dựng câu trả lời
    let answer = `📊 PHÂN TÍCH CHI TIÊU CHI TIẾT\n\n`

    // Tổng quan tháng hiện tại
    answer += `💰 Tháng ${currentMonth}/${currentYear}: ${formatCurrencyVND(currentTotal)} (${currentStats.count} giao dịch)\n\n`

    // Chi tiết theo loại
    if (statsByType.length > 0) {
        answer += `📋 Chi tiết theo loại:\n`
        statsByType.forEach(type => {
            const percentage = currentTotal > 0 ? Math.round((type.totalAmount / currentTotal) * 100) : 0
            answer += `• ${getExpenseTypeLabel(type.loai_chi)}: ${formatCurrencyVND(type.totalAmount)} (${percentage}%) - ${type.count} giao dịch\n`
        })
        answer += `\n`
    }

    // So sánh 3 tháng
    if (monthlyComparison.length > 0) {
        answer += `📈 So sánh 3 tháng gần nhất:\n`
        monthlyComparison.forEach(({ year, month, total }) => {
            answer += `• ${monthLabelVi(year, month)}: ${formatCurrencyVND(total)}\n`
        })
        answer += `→ Xu hướng: ${trendText} so với tháng trước\n\n`
    }

    // Top 5 khoản chi lớn nhất
    if (topExpenses.length > 0) {
        answer += `🔝 Top 5 khoản chi lớn nhất:\n`
        topExpenses.forEach((expense, index) => {
            answer += `${index + 1}. ${getExpenseTypeLabel(expense.loai_chi)}: ${formatCurrencyVND(expense.so_tien || 0)}`
            if (expense.mo_ta) {
                answer += ` (${expense.mo_ta})`
            }
            answer += ` - ${new Date(expense.ngay).toLocaleDateString('vi-VN')}\n`
        })
    }

    return answer
}

async function buildContractAnswer(hostelId) {
    const expiringContracts = await listHopDongSapHetHan(hostelId, 45)
    const highlight = expiringContracts.slice(0, 5)
    const detail = highlight
        .map(
            (contract) =>
                `• Phòng ${contract.can_ho?.so_can || 'N/A'} - ${contract.khach_thue?.ho_ten || 'Khách thuê'
                } (hết hạn ${new Date(contract.ngay_ket_thuc).toLocaleDateString('vi-VN')})`
        )
        .join('\n')

    return (
        `Có ${expiringContracts.length} hợp đồng sẽ hết hạn trong 45 ngày tới.` +
        (highlight.length ? `\nDanh sách ưu tiên:\n${detail}` : '')
    )
}

async function buildOccupancyAnswer(hostelId) {
    const rooms = await listCanHoByToaNha(hostelId)
    const total = rooms.length
    const occupied = rooms.filter((room) =>
        ['da_thue', 'occupied'].includes(room.trang_thai)
    ).length
    const maintenance = rooms.filter((room) =>
        ['sua_chua', 'maintenance'].includes(room.trang_thai)
    ).length
    const available = total - occupied - maintenance
    const rate = total ? Math.round((occupied / total) * 100) : 0

    return (
        `Tổng số phòng: ${total}. Đang thuê: ${occupied} phòng. Trống: ${available} phòng. ` +
        `Đang sửa chữa: ${maintenance} phòng. Tỷ lệ lấp đầy hiện tại khoảng ${rate}%.`
    )
}

async function buildNotificationAnswer(hostelId) {
    const notifications = await getThongBaoByToaNha(hostelId)
    const total = notifications.length || 0

    // Phân loại theo trạng thái
    const pending = (notifications || []).filter(n => n.trang_thai === 'chua_xu_ly')
    const inProgress = (notifications || []).filter(n => n.trang_thai === 'dang_xu_ly')
    const handled = (notifications || []).filter(n => n.trang_thai === 'da_xu_ly')

    // Phân loại theo loại thông báo
    const byType = {}
        ; (notifications || []).forEach(n => {
            const type = n.loai_thong_bao || 'khac'
            if (!byType[type]) {
                byType[type] = {
                    total: 0,
                    pending: 0,
                    inProgress: 0,
                    handled: 0,
                    items: []
                }
            }
            byType[type].total++
            if (n.trang_thai === 'chua_xu_ly') byType[type].pending++
            else if (n.trang_thai === 'dang_xu_ly') byType[type].inProgress++
            else if (n.trang_thai === 'da_xu_ly') byType[type].handled++
            byType[type].items.push(n)
        })

    // Xây dựng câu trả lời
    let answer = `📢 PHÂN TÍCH THÔNG BÁO CHI TIẾT\n\n`

    // Tổng quan
    answer += `📊 Tổng quan:\n`
    answer += `• Tổng số: ${total} thông báo\n`
    answer += `• Chờ xử lý: ${pending.length} (${total > 0 ? Math.round((pending.length / total) * 100) : 0}%)\n`
    answer += `• Đang xử lý: ${inProgress.length} (${total > 0 ? Math.round((inProgress.length / total) * 100) : 0}%)\n`
    answer += `• Đã xử lý: ${handled.length} (${total > 0 ? Math.round((handled.length / total) * 100) : 0}%)\n\n`

    // Chi tiết theo loại
    if (Object.keys(byType).length > 0) {
        answer += `📋 Chi tiết theo loại thông báo:\n`
        Object.entries(byType).forEach(([type, stats]) => {
            const typeLabel = getNotificationTypeLabel(type)
            answer += `\n🔹 ${typeLabel}:\n`
            answer += `   • Tổng: ${stats.total} thông báo\n`
            answer += `   • Chờ xử lý: ${stats.pending}\n`
            answer += `   • Đang xử lý: ${stats.inProgress}\n`
            answer += `   • Đã xử lý: ${stats.handled}\n`

            // Hiển thị 3 thông báo gần nhất của loại này
            const recentByType = stats.items
                .sort((a, b) => new Date(b.ngay_tao) - new Date(a.ngay_tao))
                .slice(0, 3)

            if (recentByType.length > 0) {
                answer += `   • Gần đây:\n`
                recentByType.forEach(n => {
                    const statusLabel = getNotificationStatusLabel(n.trang_thai)
                    const roomInfo = n.can_ho?.so_can ? ` - Phòng ${n.can_ho.so_can}` : ''
                    answer += `     - ${new Date(n.ngay_tao).toLocaleDateString('vi-VN')}: ${n.tieu_de || 'Thông báo'}${roomInfo} (${statusLabel})\n`
                })
            }
        })
        answer += `\n`
    }

    // Top 5 thông báo gần nhất (tất cả loại)
    const recentAll = (notifications || [])
        .sort((a, b) => new Date(b.ngay_tao) - new Date(a.ngay_tao))
        .slice(0, 5)

    if (recentAll.length > 0) {
        answer += `🕐 5 thông báo gần nhất:\n`
        recentAll.forEach((n, index) => {
            const typeLabel = getNotificationTypeLabel(n.loai_thong_bao || 'khac')
            const statusLabel = getNotificationStatusLabel(n.trang_thai)
            const roomInfo = n.can_ho?.so_can ? ` - Phòng ${n.can_ho.so_can}` : ''
            answer += `${index + 1}. [${typeLabel}] ${n.tieu_de || 'Thông báo'}${roomInfo} - ${statusLabel} (${new Date(n.ngay_tao).toLocaleDateString('vi-VN')})\n`
        })
    }

    return answer
}

async function buildTenantAnswer(hostelId) {
    const rooms = await listCanHoByToaNha(hostelId)
    const totalRooms = rooms.length || 1
    const contracts = await listHopDongByToaNha(hostelId)
    const activeContracts = (contracts || []).filter(
        c => c.trang_thai === 'hieu_luc' || c.trang_thai === 'active'
    )
    const uniqueTenants = new Set(activeContracts.map(c => c.khach_thue_id || c.khach_thue?.id))
    const currentOccupancy = Math.min(
        100,
        Math.round((activeContracts.length / totalRooms) * 100) || 0
    )

    const months = getRecentMonths(3)
    const history = months
        .map(({ year, month }) => {
            const start = new Date(year, month - 1, 1)
            const end = new Date(year, month, 0)
            const activeInMonth = (contracts || []).filter(contract => {
                const startDate = contract.ngay_bat_dau ? new Date(contract.ngay_bat_dau) : null
                const endDate = contract.ngay_ket_thuc ? new Date(contract.ngay_ket_thuc) : null
                const startedBeforeEnd = !startDate || startDate <= end
                const endsAfterStart = !endDate || endDate >= start
                return startedBeforeEnd && endsAfterStart && contract.trang_thai !== 'huy'
            }).length

            const newTenants = (contracts || []).filter(contract => {
                if (!contract.ngay_bat_dau) return false
                const startDate = new Date(contract.ngay_bat_dau)
                return startDate >= start && startDate <= end
            }).length

            const occupancyRate = Math.min(
                100,
                Math.round((activeInMonth / totalRooms) * 100) || 0
            )

            return `• ${monthLabelVi(year, month)}: Tỷ lệ lấp đầy ${formatPercent(
                occupancyRate
            )} (${activeInMonth}/${totalRooms} phòng) – ${newTenants} khách thuê mới`
        })
        .join('\n')

    const expiring = await listHopDongSapHetHan(hostelId, 60)

    return (
        `Hiện có ${uniqueTenants.size} khách thuê đang hoạt động, chiếm ${formatPercent(
            currentOccupancy
        )} công suất.\n` +
        `Trong 60 ngày tới sẽ có ${expiring.length} hợp đồng cần gia hạn.\n\n` +
        'Lịch sử gần nhất:\n' +
        history
    )
}

async function buildManagerAnswer(hostel, hostelId) {
    const notifications = await getThongBaoByToaNha(hostelId)
    const total = notifications.length
    const handled = notifications.filter(n => n.trang_thai === 'da_xu_ly').length
    const inProgress = notifications.filter(n => n.trang_thai === 'dang_xu_ly').length
    const pending = notifications.filter(n => n.trang_thai === 'chua_xu_ly').length
    const completionRate = total ? Math.round((handled / total) * 100) : 0
    const backlogRate = total ? Math.round((pending / total) * 100) : 0

    const last30Day = new Date()
    last30Day.setDate(last30Day.getDate() - 30)
    const recentHandled = notifications.filter(
        n => n.trang_thai === 'da_xu_ly' && new Date(n.ngay_tao) >= last30Day
    )
    const recentPending = notifications.filter(
        n => n.trang_thai === 'chua_xu_ly' && new Date(n.ngay_tao) >= last30Day
    )

    const managerName =
        hostel?.manager?.name || hostel?.quan_ly?.ho_ten || 'Quản lý hiện tại'

    return (
        `Đánh giá quản lý ${managerName} dựa trên việc xử lý thông báo:\n` +
        `- Tổng thông báo: ${total} (đã xử lý ${handled}, đang xử lý ${inProgress}, chờ xử lý ${pending}).\n` +
        `- Tỷ lệ hoàn thành: ${completionRate}% | Tỷ lệ tồn đọng: ${backlogRate}%.\n` +
        `- 30 ngày gần nhất: xử lý ${recentHandled.length} thông báo, còn ${recentPending.length} thông báo mới chưa xử lý.\n` +
        (completionRate >= 80
            ? "→ Chất lượng xử lý tốt, duy trì tiến độ hiện tại."
            : completionRate >= 50
                ? "→ Thời gian xử lý trung bình, nên thúc đẩy giải quyết các thông báo tồn đọng nhanh hơn."
                : "→ Chất lượng xử lý thấp, cần xem xét phân bổ lại công việc hoặc hỗ trợ thêm cho quản lý.")
    )
}

async function buildOverallAssessmentAnswer(hostel, hostelId) {
    try {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1

        // Thu thập tất cả dữ liệu
        const [rooms, contracts, currentRevenue, currentExpenses, notifications, expiringContracts] = await Promise.all([
            listCanHoByToaNha(hostelId),
            listHopDongByToaNha(hostelId),
            tinhDoanhThuThang(hostelId, currentYear, currentMonth),
            getChiTieuStatsByMonth(hostelId, currentYear, currentMonth),
            getThongBaoByToaNha(hostelId),
            listHopDongSapHetHan(hostelId, 60)
        ])

        // Tính toán các chỉ số
        const totalRooms = rooms.length || 1
        const activeContracts = (contracts || []).filter(c => c.trang_thai === 'hieu_luc' || c.trang_thai === 'active')
        const occupancyRate = Math.min(100, Math.round((activeContracts.length / totalRooms) * 100) || 0)
        const uniqueTenants = new Set(activeContracts.map(c => c.khach_thue_id || c.khach_thue?.id)).size

        const revenue = currentRevenue || 0
        const expenses = currentExpenses.totalAmount || 0
        const profit = revenue - expenses
        const profitMargin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0

        const totalNotifications = notifications.length || 0
        const handledNotifications = notifications.filter(n => n.trang_thai === 'da_xu_ly').length
        const pendingNotifications = notifications.filter(n => n.trang_thai === 'chua_xu_ly').length
        const notificationCompletionRate = totalNotifications > 0 ? Math.round((handledNotifications / totalNotifications) * 100) : 100

        const expiringCount = expiringContracts.length || 0

        // Đánh giá từng khía cạnh
        const assessments = []

        // 1. Tài chính
        let financialScore = 0
        let financialComment = ''
        if (profitMargin >= 30) {
            financialScore = 5
            financialComment = 'Xuất sắc - Lợi nhuận cao, tài chính ổn định'
        } else if (profitMargin >= 15) {
            financialScore = 4
            financialComment = 'Tốt - Lợi nhuận ở mức khá, cần duy trì'
        } else if (profitMargin >= 0) {
            financialScore = 3
            financialComment = 'Trung bình - Có lãi nhưng cần tối ưu chi phí'
        } else {
            financialScore = 2
            financialComment = 'Cần cải thiện - Đang lỗ, cần xem xét lại chi phí và doanh thu'
        }
        assessments.push({ category: 'Tài chính', score: financialScore, comment: financialComment })

        // 2. Tỷ lệ lấp đầy
        let occupancyScore = 0
        let occupancyComment = ''
        if (occupancyRate >= 90) {
            occupancyScore = 5
            occupancyComment = 'Xuất sắc - Gần như đầy phòng, hiệu quả cao'
        } else if (occupancyRate >= 75) {
            occupancyScore = 4
            occupancyComment = 'Tốt - Tỷ lệ lấp đầy khá cao'
        } else if (occupancyRate >= 60) {
            occupancyScore = 3
            occupancyComment = 'Trung bình - Cần tăng cường marketing và dịch vụ'
        } else {
            occupancyScore = 2
            occupancyComment = 'Cần cải thiện - Tỷ lệ lấp đầy thấp, cần chiến lược thu hút khách'
        }
        assessments.push({ category: 'Tỷ lệ lấp đầy', score: occupancyScore, comment: occupancyComment })

        // 3. Quản lý thông báo
        let managementScore = 0
        let managementComment = ''
        if (notificationCompletionRate >= 80) {
            managementScore = 5
            managementComment = 'Xuất sắc - Xử lý thông báo hiệu quả'
        } else if (notificationCompletionRate >= 60) {
            managementScore = 4
            managementComment = 'Tốt - Xử lý thông báo khá tốt'
        } else if (notificationCompletionRate >= 40) {
            managementScore = 3
            managementComment = 'Trung bình - Cần cải thiện tốc độ xử lý'
        } else {
            managementScore = 2
            managementComment = 'Cần cải thiện - Tồn đọng nhiều thông báo chưa xử lý'
        }
        assessments.push({ category: 'Quản lý', score: managementScore, comment: managementComment })

        // 4. Quản lý hợp đồng
        let contractScore = 0
        let contractComment = ''
        const expiringRate = activeContracts.length > 0 ? Math.round((expiringCount / activeContracts.length) * 100) : 0
        if (expiringCount === 0) {
            contractScore = 5
            contractComment = 'Xuất sắc - Không có hợp đồng sắp hết hạn'
        } else if (expiringRate <= 10) {
            contractScore = 4
            contractComment = 'Tốt - Số hợp đồng sắp hết hạn ở mức thấp'
        } else if (expiringRate <= 25) {
            contractScore = 3
            contractComment = 'Trung bình - Cần chuẩn bị gia hạn hợp đồng'
        } else {
            contractScore = 2
            contractComment = 'Cần chú ý - Nhiều hợp đồng sắp hết hạn, cần xử lý ngay'
        }
        assessments.push({ category: 'Hợp đồng', score: contractScore, comment: contractComment })

        // Tính điểm tổng thể
        const totalScore = assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length
        const overallRating = totalScore >= 4.5 ? 'Xuất sắc' : totalScore >= 3.5 ? 'Tốt' : totalScore >= 2.5 ? 'Trung bình' : 'Cần cải thiện'

        // Xây dựng câu trả lời
        let answer = `📊 ĐÁNH GIÁ TỔNG QUAN KHU TRỌ\n\n`

        // Thông tin cơ bản
        answer += `🏢 Thông tin cơ bản:\n`
        answer += `• Tên khu trọ: ${hostel?.ten_toa || hostel?.ten || hostel?.name || 'N/A'}\n`
        answer += `• Tổng số phòng: ${totalRooms}\n`
        answer += `• Khách thuê hiện tại: ${uniqueTenants}\n`
        answer += `• Tỷ lệ lấp đầy: ${formatPercent(occupancyRate)}\n\n`

        // Tài chính
        answer += `💰 Tình hình tài chính (tháng ${currentMonth}/${currentYear}):\n`
        answer += `• Doanh thu: ${formatCurrencyVND(revenue)}\n`
        answer += `• Chi tiêu: ${formatCurrencyVND(expenses)}\n`
        answer += `• Lợi nhuận: ${formatCurrencyVND(profit)} (${profitMargin >= 0 ? '+' : ''}${profitMargin}%)\n\n`

        // Đánh giá từng khía cạnh
        answer += `📈 Đánh giá chi tiết:\n\n`
        assessments.forEach((assessment, index) => {
            const stars = '⭐'.repeat(assessment.score)
            answer += `${index + 1}. ${assessment.category}: ${stars} (${assessment.score}/5)\n`
            answer += `   → ${assessment.comment}\n\n`
        })

        // Đánh giá tổng thể
        answer += `🎯 ĐÁNH GIÁ TỔNG THỂ: ${overallRating} (${totalScore.toFixed(1)}/5.0)\n\n`

        // Điểm mạnh và điểm cần cải thiện
        const strengths = assessments.filter(a => a.score >= 4).map(a => a.category)
        const improvements = assessments.filter(a => a.score <= 2).map(a => a.category)

        if (strengths.length > 0) {
            answer += `✅ Điểm mạnh:\n`
            strengths.forEach(s => answer += `• ${s}\n`)
            answer += `\n`
        }

        if (improvements.length > 0) {
            answer += `⚠️ Cần cải thiện:\n`
            improvements.forEach(i => answer += `• ${i}\n`)
            answer += `\n`
        }

        // Khuyến nghị
        answer += `💡 Khuyến nghị:\n`
        if (occupancyRate < 75) {
            answer += `• Tăng cường marketing để thu hút thêm khách thuê\n`
        }
        if (profitMargin < 15) {
            answer += `• Tối ưu chi phí và tăng doanh thu để cải thiện lợi nhuận\n`
        }
        if (pendingNotifications > 5) {
            answer += `• Xử lý nhanh các thông báo tồn đọng để nâng cao chất lượng dịch vụ\n`
        }
        if (expiringCount > 0) {
            answer += `• Chuẩn bị gia hạn ${expiringCount} hợp đồng sắp hết hạn\n`
        }
        if (strengths.length === assessments.length) {
            answer += `• Duy trì hiệu suất hiện tại và tiếp tục phát triển\n`
        }

        return answer
    } catch (error) {
        console.error('[buildOverallAssessmentAnswer] Error:', error)
        return `Tôi gặp lỗi khi thu thập dữ liệu để đánh giá tổng quan: ${error?.message || 'Lỗi không xác định'}. Vui lòng thử lại sau.`
    }
}

async function buildImprovementRecommendationsAnswer(hostel, hostelId) {
    try {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1

        // Thu thập tất cả dữ liệu
        const [rooms, contracts, currentRevenue, currentExpenses, notifications, expiringContracts, revenueMap] = await Promise.all([
            listCanHoByToaNha(hostelId),
            listHopDongByToaNha(hostelId),
            tinhDoanhThuThang(hostelId, currentYear, currentMonth),
            getChiTieuStatsByMonth(hostelId, currentYear, currentMonth),
            getThongBaoByToaNha(hostelId),
            listHopDongSapHetHan(hostelId, 60),
            tinhDoanhThuTheoThangTuHoaDon(hostelId)
        ])

        // Tính toán các chỉ số
        const totalRooms = rooms.length || 1
        const activeContracts = (contracts || []).filter(c => c.trang_thai === 'hieu_luc' || c.trang_thai === 'active')
        const occupancyRate = Math.min(100, Math.round((activeContracts.length / totalRooms) * 100) || 0)
        const availableRooms = totalRooms - activeContracts.length

        const revenue = currentRevenue || 0
        const expenses = currentExpenses.totalAmount || 0
        const profit = revenue - expenses
        const profitMargin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0

        const totalNotifications = notifications.length || 0
        const handledNotifications = notifications.filter(n => n.trang_thai === 'da_xu_ly').length
        const pendingNotifications = notifications.filter(n => n.trang_thai === 'chua_xu_ly').length
        const notificationCompletionRate = totalNotifications > 0 ? Math.round((handledNotifications / totalNotifications) * 100) : 100

        const expiringCount = expiringContracts.length || 0

        // Phân tích chi tiêu theo loại
        const startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`
        const lastDay = new Date(currentYear, currentMonth, 0).getDate()
        const endDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
        const statsByType = await getChiTieuStatsByType(hostelId, startDate, endDate)

        // Phân tích xu hướng doanh thu
        const sortedMonths = Object.keys(revenueMap || {}).sort()
        const last3Months = sortedMonths.slice(-3)
        const revenueTrend = last3Months.length >= 2
            ? (revenueMap[last3Months[last3Months.length - 1]] || 0) - (revenueMap[last3Months[last3Months.length - 2]] || 0)
            : 0

        // Xây dựng khuyến nghị
        let answer = `💡 KHUYẾN NGHỊ CẢI THIỆN KHU TRỌ\n\n`

        // 1. Cải thiện tài chính
        answer += `💰 CẢI THIỆN TÀI CHÍNH:\n`
        if (profitMargin < 0) {
            answer += `• ⚠️ Đang lỗ ${formatCurrencyVND(Math.abs(profit))}. Cần:\n`
            answer += `  - Xem xét lại chi phí hoạt động, tối ưu các khoản chi không cần thiết\n`
            answer += `  - Tăng giá thuê phòng nếu thị trường cho phép\n`
            answer += `  - Tăng tỷ lệ lấp đầy để tăng doanh thu\n`
        } else if (profitMargin < 15) {
            answer += `• Lợi nhuận ở mức thấp (${profitMargin}%). Khuyến nghị:\n`
            answer += `  - Phân tích chi tiêu theo loại để tìm điểm tối ưu\n`
            if (statsByType.length > 0) {
                const topExpenseType = statsByType.sort((a, b) => b.totalAmount - a.totalAmount)[0]
                answer += `  - Loại chi tiêu lớn nhất: ${getExpenseTypeLabel(topExpenseType.loai_chi)} (${formatCurrencyVND(topExpenseType.totalAmount)}), cần xem xét tối ưu\n`
            }
            answer += `  - Tăng doanh thu bằng cách thu hút thêm khách thuê\n`
        } else {
            answer += `• ✅ Tài chính đang tốt (lợi nhuận ${profitMargin}%). Duy trì và:\n`
            answer += `  - Tiếp tục theo dõi chi phí chặt chẽ\n`
            answer += `  - Đầu tư vào cải thiện dịch vụ để giữ chân khách thuê\n`
        }
        if (revenueTrend < 0) {
            answer += `  - ⚠️ Doanh thu đang giảm, cần chiến lược marketing tích cực hơn\n`
        }
        answer += `\n`

        // 2. Tăng tỷ lệ lấp đầy
        answer += `🏠 TĂNG TỶ LỆ LẤP ĐẦY:\n`
        if (occupancyRate < 60) {
            answer += `• ⚠️ Tỷ lệ lấp đầy thấp (${occupancyRate}%), còn ${availableRooms} phòng trống. Cần:\n`
            answer += `  - Tăng cường marketing online (Facebook, Zalo, website)\n`
            answer += `  - Giảm giá thuê hoặc ưu đãi cho khách thuê mới (tháng đầu giảm giá, miễn phí wifi...)\n`
            answer += `  - Cải thiện hình ảnh phòng trọ (chụp ảnh đẹp, quay video tour)\n`
            answer += `  - Xem xét lại giá thuê có phù hợp với thị trường không\n`
        } else if (occupancyRate < 80) {
            answer += `• Tỷ lệ lấp đầy ở mức trung bình (${occupancyRate}%), còn ${availableRooms} phòng trống:\n`
            answer += `  - Tối ưu quy trình cho thuê để giảm thời gian trống phòng\n`
            answer += `  - Tăng cường dịch vụ để giữ chân khách thuê hiện tại\n`
            answer += `  - Chương trình giới thiệu khách thuê mới (thưởng cho khách cũ)\n`
        } else {
            answer += `• ✅ Tỷ lệ lấp đầy tốt (${occupancyRate}%). Duy trì bằng cách:\n`
            answer += `  - Giữ chất lượng dịch vụ cao\n`
            answer += `  - Xử lý nhanh các phản ánh của khách thuê\n`
            answer += `  - Chính sách gia hạn hợp đồng ưu đãi\n`
        }
        answer += `\n`

        // 3. Cải thiện quản lý
        answer += `👨‍💼 CẢI THIỆN QUẢN LÝ:\n`
        if (notificationCompletionRate < 50) {
            answer += `• ⚠️ Tỷ lệ xử lý thông báo thấp (${notificationCompletionRate}%), còn ${pendingNotifications} thông báo chờ xử lý:\n`
            answer += `  - Ưu tiên xử lý các thông báo quan trọng trước\n`
            answer += `  - Thiết lập thời gian phản hồi cụ thể (ví dụ: trong 24h)\n`
            answer += `  - Sử dụng hệ thống nhắc nhở tự động\n`
            answer += `  - Phân loại thông báo theo mức độ ưu tiên\n`
        } else if (notificationCompletionRate < 80) {
            answer += `• Tỷ lệ xử lý thông báo ở mức trung bình (${notificationCompletionRate}%):\n`
            answer += `  - Cải thiện quy trình xử lý để tăng tốc độ\n`
            answer += `  - Đào tạo quản lý về kỹ năng quản lý thời gian\n`
            answer += `  - Sử dụng template phản hồi để tiết kiệm thời gian\n`
        } else {
            answer += `• ✅ Quản lý đang hoạt động tốt (${notificationCompletionRate}% thông báo đã xử lý). Tiếp tục:\n`
            answer += `  - Duy trì tốc độ xử lý hiện tại\n`
            answer += `  - Cải thiện chất lượng phản hồi\n`
        }
        if (pendingNotifications > 10) {
            answer += `  - ⚠️ Có ${pendingNotifications} thông báo tồn đọng, cần xử lý ngay\n`
        }
        answer += `\n`

        // 4. Quản lý hợp đồng
        answer += `📄 QUẢN LÝ HỢP ĐỒNG:\n`
        if (expiringCount > 0) {
            answer += `• ⚠️ Có ${expiringCount} hợp đồng sắp hết hạn trong 60 ngày tới:\n`
            answer += `  - Liên hệ sớm với khách thuê để gia hạn (trước 30 ngày)\n`
            answer += `  - Chuẩn bị sẵn hợp đồng mới để ký nhanh\n`
            answer += `  - Đề xuất ưu đãi gia hạn (giảm giá, tặng tháng...)\n`
            answer += `  - Nếu khách không gia hạn, chuẩn bị tìm khách mới sớm\n`
        } else {
            answer += `• ✅ Không có hợp đồng sắp hết hạn. Tốt! Tiếp tục:\n`
            answer += `  - Theo dõi định kỳ các hợp đồng\n`
            answer += `  - Xây dựng mối quan hệ tốt với khách thuê để họ muốn gia hạn\n`
        }
        answer += `\n`

        // 5. Cải thiện dịch vụ
        answer += `🎯 CẢI THIỆN DỊCH VỤ:\n`
        const notificationTypes = {}
        notifications.forEach(n => {
            const type = n.loai_thong_bao || 'khac'
            if (!notificationTypes[type]) {
                notificationTypes[type] = { total: 0, pending: 0 }
            }
            notificationTypes[type].total++
            if (n.trang_thai === 'chua_xu_ly') notificationTypes[type].pending++
        })

        const topIssueType = Object.entries(notificationTypes)
            .sort((a, b) => b[1].pending - a[1].pending)[0]

        if (topIssueType && topIssueType[1].pending > 0) {
            answer += `• Loại vấn đề phổ biến nhất: ${getNotificationTypeLabel(topIssueType[0])} (${topIssueType[1].pending} đang chờ xử lý):\n`
            if (topIssueType[0] === 'sua_chua') {
                answer += `  - Ưu tiên sửa chữa các hạng mục quan trọng\n`
                answer += `  - Lập kế hoạch bảo trì định kỳ để tránh hỏng hóc\n`
            } else if (topIssueType[0] === 'phan_anh') {
                answer += `  - Lắng nghe và phản hồi nhanh các phản ánh\n`
                answer += `  - Cải thiện các điểm khách thuê không hài lòng\n`
            } else if (topIssueType[0] === 'thanh_toan') {
                answer += `  - Cải thiện quy trình thanh toán (QR code, chuyển khoản tự động)\n`
                answer += `  - Nhắc nhở thanh toán sớm và rõ ràng\n`
            }
        }

        answer += `• Khuyến nghị chung:\n`
        answer += `  - Thu thập feedback định kỳ từ khách thuê\n`
        answer += `  - Cải thiện cơ sở vật chất (wifi, điện nước, an ninh)\n`
        answer += `  - Tổ chức các hoạt động cộng đồng để tăng sự gắn kết\n`
        answer += `  - Xây dựng quy trình làm việc chuẩn để tăng hiệu quả\n`

        return answer
    } catch (error) {
        console.error('[buildImprovementRecommendationsAnswer] Error:', error)
        return `Tôi gặp lỗi khi phân tích dữ liệu để đưa ra khuyến nghị: ${error?.message || 'Lỗi không xác định'}. Vui lòng thử lại sau.`
    }
}

async function searchTenantByAnyCriteria(searchValue, hostelId) {
    try {
        const contracts = await listHopDongByToaNha(hostelId)
        const normalizedSearch = normalizeText(searchValue)

        // Tìm theo nhiều tiêu chí
        const matchingTenants = contracts
            .filter(c => {
                const tenant = c.khach_thue
                if (!tenant) return false

                // Tìm theo tên
                const name = normalizeText(tenant.ho_ten || '')
                if (name.includes(normalizedSearch) || normalizedSearch.includes(name)) return true

                // Tìm theo SĐT (loại bỏ khoảng trắng và dấu)
                const phone = (tenant.sdt || '').replace(/\s+/g, '').replace(/[^\d]/g, '')
                const searchPhone = searchValue.replace(/\s+/g, '').replace(/[^\d]/g, '')
                if (phone && searchPhone && (phone.includes(searchPhone) || searchPhone.includes(phone))) return true

                // Tìm theo email
                const email = normalizeText(tenant.email || '')
                if (email && normalizedSearch && (email.includes(normalizedSearch) || normalizedSearch.includes(email))) return true

                // Tìm theo CCCD
                const cccd = (tenant.cccd || '').replace(/\s+/g, '')
                const searchCccd = searchValue.replace(/\s+/g, '')
                if (cccd && searchCccd && (cccd.includes(searchCccd) || searchCccd.includes(cccd))) return true

                return false
            })
            .map(c => ({
                tenant: c.khach_thue,
                contract: c,
                room: c.can_ho
            }))

        return matchingTenants
    } catch (error) {
        console.error('[searchTenantByAnyCriteria] Error:', error)
        return []
    }
}

async function buildTenantDetailAnswer(searchValue, hostelId) {
    try {
        // Tìm khách thuê theo bất kỳ tiêu chí nào
        const matchingTenants = await searchTenantByAnyCriteria(searchValue, hostelId)

        if (matchingTenants.length === 0) {
            return `Không tìm thấy khách thuê với thông tin "${searchValue}" trong khu trọ này.\n\nBạn có thể tìm theo:\n• Tên khách thuê\n• Số điện thoại\n• Email\n• CCCD`
        }

        // Nếu có nhiều kết quả, hiển thị danh sách
        if (matchingTenants.length > 1) {
            let answer = `Tìm thấy ${matchingTenants.length} khách thuê phù hợp:\n\n`
            matchingTenants.forEach((item, index) => {
                answer += `${index + 1}. ${item.tenant?.ho_ten || 'N/A'}`
                if (item.tenant?.sdt) answer += ` - SĐT: ${item.tenant.sdt}`
                if (item.room?.so_can) answer += ` - Phòng: ${item.room.so_can}`
                answer += `\n`
            })
            answer += `\nVui lòng cung cấp thông tin cụ thể hơn để tìm chính xác.`
            return answer
        }

        // Lấy thông tin chi tiết của khách thuê đầu tiên (hoặc khách thuê chính)
        const tenantInfo = matchingTenants[0]
        const tenantId = tenantInfo.tenant?.id

        if (!tenantId) {
            return `Không tìm thấy thông tin chi tiết của khách thuê "${tenantName}".`
        }

        // Lấy hợp đồng của khách thuê
        const tenantContracts = await listHopDongByKhachThue(tenantId)
        const activeContract = tenantContracts.find(c => c.trang_thai === 'hieu_luc' || c.trang_thai === 'active')

        // Lấy hóa đơn của khách thuê
        const invoices = await listHoaDonByToaNha(hostelId)
        const tenantInvoices = invoices.filter(inv => {
            const contract = contracts.find(c => c.id === inv.hop_dong_id)
            return contract?.khach_thue_id === tenantId
        })

        // Lấy thông báo của khách thuê
        const notifications = await getThongBaoByKhachThue(tenantId)

        // Xây dựng câu trả lời
        let answer = `👤 THÔNG TIN KHÁCH THUÊ: ${tenantInfo.tenant.ho_ten}\n\n`

        // Thông tin cơ bản
        answer += `📋 Thông tin cơ bản:\n`
        answer += `• Họ tên: ${tenantInfo.tenant.ho_ten}\n`
        if (tenantInfo.tenant.sdt) answer += `• SĐT: ${tenantInfo.tenant.sdt}\n`
        if (tenantInfo.tenant.email) answer += `• Email: ${tenantInfo.tenant.email}\n`
        if (tenantInfo.tenant.cccd) answer += `• CCCD: ${tenantInfo.tenant.cccd}\n`
        answer += `\n`

        // Thông tin phòng và hợp đồng
        if (activeContract) {
            answer += `🏠 Thông tin phòng:\n`
            answer += `• Phòng: ${activeContract.can_ho?.so_can || 'N/A'}\n`
            answer += `• Giá thuê: ${formatCurrencyVND(activeContract.can_ho?.gia_thue || activeContract.gia_thue || 0)}\n`
            if (activeContract.ngay_bat_dau) {
                answer += `• Ngày bắt đầu: ${new Date(activeContract.ngay_bat_dau).toLocaleDateString('vi-VN')}\n`
            }
            if (activeContract.ngay_ket_thuc) {
                answer += `• Ngày kết thúc: ${new Date(activeContract.ngay_ket_thuc).toLocaleDateString('vi-VN')}\n`
            }
            answer += `• Trạng thái hợp đồng: ${activeContract.trang_thai === 'hieu_luc' ? 'Hiệu lực' : activeContract.trang_thai}\n`
            answer += `\n`
        }

        // Hóa đơn
        if (tenantInvoices.length > 0) {
            const unpaidInvoices = tenantInvoices.filter(inv => inv.trang_thai === 'chua_tt')
            const paidInvoices = tenantInvoices.filter(inv => inv.trang_thai === 'da_thanh_toan')
            const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + (inv.tong_tien || inv.so_tien || 0), 0)

            answer += `💰 Tình trạng thanh toán:\n`
            answer += `• Tổng hóa đơn: ${tenantInvoices.length} (đã thanh toán: ${paidInvoices.length}, chưa thanh toán: ${unpaidInvoices.length})\n`
            if (totalUnpaid > 0) {
                answer += `• Tổng tiền chưa thanh toán: ${formatCurrencyVND(totalUnpaid)}\n`
            }
            if (unpaidInvoices.length > 0) {
                answer += `• Hóa đơn chưa thanh toán:\n`
                unpaidInvoices.slice(0, 5).forEach(inv => {
                    answer += `  - HĐ ${inv.id}: ${formatCurrencyVND(inv.tong_tien || inv.so_tien || 0)} (${new Date(inv.ngay_tao).toLocaleDateString('vi-VN')})\n`
                })
            }
            answer += `\n`
        }

        // Thông báo
        if (notifications.length > 0) {
            const pendingNotifs = notifications.filter(n => n.trang_thai === 'chua_xu_ly')
            answer += `📢 Thông báo:\n`
            answer += `• Tổng số: ${notifications.length} (chờ xử lý: ${pendingNotifs.length})\n`
            if (pendingNotifs.length > 0) {
                answer += `• Thông báo chờ xử lý:\n`
                pendingNotifs.slice(0, 3).forEach(n => {
                    answer += `  - ${n.tieu_de || 'Thông báo'} (${new Date(n.ngay_tao).toLocaleDateString('vi-VN')})\n`
                })
            }
        }

        return answer
    } catch (error) {
        console.error('[buildTenantDetailAnswer] Error:', error)
        return `Tôi gặp lỗi khi tìm thông tin khách thuê "${searchValue}": ${error?.message || 'Lỗi không xác định'}.`
    }
}

async function buildRoomDetailAnswer(roomNumber, hostelId) {
    try {
        // Tìm phòng theo số phòng
        const rooms = await listCanHoByToaNha(hostelId)
        const searchNum = String(roomNumber).trim().toUpperCase()

        const room = rooms.find(r => {
            const roomNum = String(r.so_can || '').trim().toUpperCase()

            // So sánh chính xác
            if (roomNum === searchNum) return true

            // So sánh không phân biệt hoa thường
            if (roomNum.toLowerCase() === searchNum.toLowerCase()) return true

            // So sánh phần số (nếu có chữ cái prefix)
            const roomNumOnly = roomNum.replace(/^[A-Z]+/, '')
            const searchNumOnly = searchNum.replace(/^[A-Z]+/, '')
            if (roomNumOnly && searchNumOnly && roomNumOnly === searchNumOnly) return true

            // So sánh với normalize (loại bỏ dấu và khoảng trắng)
            const normalizedRoom = normalizeText(roomNum)
            const normalizedSearch = normalizeText(searchNum)
            if (normalizedRoom === normalizedSearch) return true

            // Kiểm tra nếu một trong hai chứa cái kia
            if (normalizedRoom.includes(normalizedSearch) || normalizedSearch.includes(normalizedRoom)) {
                return true
            }

            return false
        })

        if (!room) {
            return `Không tìm thấy phòng số "${roomNumber}" trong khu trọ này.\n\nVui lòng kiểm tra lại số phòng hoặc thử tìm theo:\n• Tên khách thuê\n• Số điện thoại\n• Email`
        }

        // Lấy hợp đồng của phòng
        const contracts = await listHopDongByToaNha(hostelId)
        const roomContracts = contracts.filter(c => c.can_ho_id === room.id)
        const activeContract = roomContracts.find(c => c.trang_thai === 'hieu_luc' || c.trang_thai === 'active')

        // Lấy hóa đơn của phòng
        const invoices = await listHoaDonByToaNha(hostelId)
        const roomInvoices = invoices.filter(inv => {
            const contract = contracts.find(c => c.id === inv.hop_dong_id)
            return contract?.can_ho_id === room.id
        })

        // Lấy thông báo liên quan đến phòng
        const notifications = await getThongBaoByToaNha(hostelId)
        const roomNotifications = notifications.filter(n => n.can_ho_id === room.id)

        // Xây dựng câu trả lời
        let answer = `🏠 THÔNG TIN PHÒNG: ${room.so_can}\n\n`

        // Thông tin cơ bản
        answer += `📋 Thông tin cơ bản:\n`
        answer += `• Số phòng: ${room.so_can}\n`
        if (room.dien_tich) answer += `• Diện tích: ${room.dien_tich} m²\n`
        answer += `• Giá thuê: ${formatCurrencyVND(room.gia_thue || 0)}\n`
        answer += `• Trạng thái: ${getRoomStatusLabel(room.trang_thai)}\n`
        answer += `\n`

        // Thông tin khách thuê hiện tại
        if (activeContract) {
            answer += `👤 Khách thuê hiện tại:\n`
            answer += `• Họ tên: ${activeContract.khach_thue?.ho_ten || 'N/A'}\n`
            if (activeContract.khach_thue?.sdt) answer += `• SĐT: ${activeContract.khach_thue.sdt}\n`
            if (activeContract.khach_thue?.email) answer += `• Email: ${activeContract.khach_thue.email}\n`
            if (activeContract.ngay_bat_dau) {
                answer += `• Ngày bắt đầu thuê: ${new Date(activeContract.ngay_bat_dau).toLocaleDateString('vi-VN')}\n`
            }
            if (activeContract.ngay_ket_thuc) {
                answer += `• Ngày kết thúc: ${new Date(activeContract.ngay_ket_thuc).toLocaleDateString('vi-VN')}\n`
                const endDate = new Date(activeContract.ngay_ket_thuc)
                const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
                if (daysLeft > 0 && daysLeft <= 60) {
                    answer += `• ⚠️ Còn ${daysLeft} ngày nữa sẽ hết hạn\n`
                }
            }
            answer += `\n`
        } else {
            answer += `👤 Khách thuê: Phòng đang trống\n\n`
        }

        // Hóa đơn
        if (roomInvoices.length > 0) {
            const unpaidInvoices = roomInvoices.filter(inv => inv.trang_thai === 'chua_tt')
            const paidInvoices = roomInvoices.filter(inv => inv.trang_thai === 'da_thanh_toan')
            const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + (inv.tong_tien || inv.so_tien || 0), 0)

            answer += `💰 Tình trạng thanh toán:\n`
            answer += `• Tổng hóa đơn: ${roomInvoices.length} (đã thanh toán: ${paidInvoices.length}, chưa thanh toán: ${unpaidInvoices.length})\n`
            if (totalUnpaid > 0) {
                answer += `• Tổng tiền chưa thanh toán: ${formatCurrencyVND(totalUnpaid)}\n`
            }
            if (unpaidInvoices.length > 0) {
                answer += `• Hóa đơn chưa thanh toán:\n`
                unpaidInvoices.slice(0, 5).forEach(inv => {
                    answer += `  - HĐ ${inv.id}: ${formatCurrencyVND(inv.tong_tien || inv.so_tien || 0)} (${new Date(inv.ngay_tao).toLocaleDateString('vi-VN')})\n`
                })
            }
            answer += `\n`
        }

        // Thông báo
        if (roomNotifications.length > 0) {
            const pendingNotifs = roomNotifications.filter(n => n.trang_thai === 'chua_xu_ly')
            answer += `📢 Thông báo liên quan:\n`
            answer += `• Tổng số: ${roomNotifications.length} (chờ xử lý: ${pendingNotifs.length})\n`
            if (pendingNotifs.length > 0) {
                answer += `• Thông báo chờ xử lý:\n`
                pendingNotifs.slice(0, 3).forEach(n => {
                    answer += `  - ${n.tieu_de || 'Thông báo'} (${new Date(n.ngay_tao).toLocaleDateString('vi-VN')})\n`
                })
            }
        }

        return answer
    } catch (error) {
        console.error('[buildRoomDetailAnswer] Error:', error)
        return `Tôi gặp lỗi khi tìm thông tin phòng "${roomNumber}": ${error?.message || 'Lỗi không xác định'}.`
    }
}

export async function askAdminChatbot(question, options = {}) {
    const normalized = normalizeText(question || '')
    const hostel =
        options.hostel?.id || options.hostel?.toaNhaId || options.hostel || options.hostelId

    if (!hostel) {
        return {
            answer:
                'Vui lòng chọn một khu trọ trước khi hỏi để tôi có thể lấy dữ liệu chính xác nhé.'
        }
    }

    try {
        // Kiểm tra câu hỏi về khách thuê cụ thể hoặc phòng cụ thể

        // Pattern: "phòng [số/chữ+số]", "thông tin phòng [số/chữ+số]", "phòng số [số/chữ+số]", v.v.
        // Hỗ trợ cả "A104", "104", "B205", v.v.
        const roomPatterns = [
            /phong\s+([a-z]?\d+)/i,
            /phong\s+so\s+([a-z]?\d+)/i,
            /thong tin phong\s+([a-z]?\d+)/i,
            /phong\s+([a-z]?\d+)\s+the nao/i,
            /phong\s+([a-z]?\d+)\s+ra sao/i,
            /thong tin\s+phong\s+([a-z]?\d+)/i
        ]

        // Tìm phòng trước (dễ nhận diện hơn với số)
        for (const pattern of roomPatterns) {
            const match = question.match(pattern)
            if (match && match[1]) {
                const roomNumber = match[1].trim().toUpperCase()
                return { answer: await buildRoomDetailAnswer(roomNumber, hostel) }
            }
        }

        // Nếu câu hỏi có từ "phòng" và có số/chữ+số, thử tìm phòng
        if (normalized.includes('phong')) {
            // Tìm pattern như "A104", "B205", "104" trong câu hỏi
            const roomNumberPattern = /([a-z]?\d{2,4})/i
            const roomMatch = question.match(roomNumberPattern)
            if (roomMatch && roomMatch[1]) {
                const potentialRoom = roomMatch[1].trim().toUpperCase()
                // Kiểm tra xem có phải là số phòng không (không phải SĐT hoặc CCCD)
                if (potentialRoom.length <= 5 && !potentialRoom.match(/^\d{8,}$/)) {
                    return { answer: await buildRoomDetailAnswer(potentialRoom, hostel) }
                }
            }
        }

        // Tìm email trong câu hỏi
        const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i
        const emailMatch = question.match(emailPattern)
        if (emailMatch && emailMatch[1]) {
            return { answer: await buildTenantDetailAnswer(emailMatch[1], hostel) }
        }

        // Tìm số điện thoại trong câu hỏi (dãy số từ 8-11 chữ số)
        const phonePatterns = [
            /(\d{8,11})/g,
            /(0\d{9,10})/g,
            /(\+\d{10,12})/g
        ]
        for (const pattern of phonePatterns) {
            const matches = question.match(pattern)
            if (matches && matches[0]) {
                const phone = matches[0].trim()
                // Chỉ tìm nếu không phải là số phòng (số phòng thường ngắn hơn)
                if (phone.length >= 8) {
                    return { answer: await buildTenantDetailAnswer(phone, hostel) }
                }
            }
        }

        // Tìm CCCD (dãy số 9 hoặc 12 chữ số)
        const cccdPattern = /(\d{9}|\d{12})/g
        const cccdMatch = question.match(cccdPattern)
        if (cccdMatch && cccdMatch[0]) {
            const cccd = cccdMatch[0].trim()
            return { answer: await buildTenantDetailAnswer(cccd, hostel) }
        }

        // Tìm khách thuê theo tên - với từ khóa hoặc không
        const tenantKeywords = ['khach thue', 'khach', 'thong tin', 'ten']
        const hasTenantKeyword = tenantKeywords.some(keyword => normalized.includes(keyword))

        // Nếu có từ khóa hoặc câu hỏi ngắn (có thể là tìm kiếm trực tiếp)
        if (hasTenantKeyword || question.trim().split(/\s+/).length <= 5) {
            // Loại bỏ các từ khóa và lấy phần còn lại
            let searchValue = normalized
            tenantKeywords.forEach(keyword => {
                searchValue = searchValue.replace(new RegExp(keyword, 'gi'), '').trim()
            })

            // Loại bỏ các từ không phải thông tin tìm kiếm
            const stopWords = ['la', 'the', 'nao', 'ra', 'sao', 'thong', 'tin', 've', 'cua', 'cho', 'toi', 'xem', 'hien', 'thi', 'cua', 'phong']
            stopWords.forEach(word => {
                searchValue = searchValue.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim()
            })

            // Nếu còn lại phần có độ dài hợp lý (ít nhất 2 ký tự), thử tìm
            if (searchValue.length >= 2 && searchValue.length <= 100) {
                // Lấy toàn bộ phần còn lại làm giá trị tìm kiếm
                const searchParts = searchValue.split(/\s+/).filter(p => p.length > 0)
                if (searchParts.length > 0) {
                    const fullSearchValue = searchParts.join(' ')
                    return { answer: await buildTenantDetailAnswer(fullSearchValue, hostel) }
                }
            }
        }

        // Kiểm tra câu hỏi về cải thiện/khuyến nghị
        if (
            normalized.includes('cai thien') ||
            normalized.includes('khuyen nghi') ||
            normalized.includes('goi y') ||
            normalized.includes('lam sao') ||
            normalized.includes('lam the nao') ||
            (normalized.includes('cach') && normalized.includes('cai thien')) ||
            (normalized.includes('cach') && normalized.includes('tot hon')) ||
            normalized.includes('improvement') ||
            normalized.includes('recommendation') ||
            normalized.includes('suggestion') ||
            normalized.includes('how to') ||
            (normalized.includes('quan ly') && normalized.includes('cai thien'))
        ) {
            return { answer: await buildImprovementRecommendationsAnswer(options.hostel || {}, hostel) }
        }

        // Kiểm tra đánh giá tổng quan trước để ưu tiên
        if (
            normalized.includes('danh gia') ||
            normalized.includes('tong quan') ||
            normalized.includes('overall') ||
            normalized.includes('assessment') ||
            normalized.includes('tinh hinh') ||
            normalized.includes('tinh trang') ||
            normalized.includes('chung ve') ||
            normalized.includes('danh gia chung') ||
            normalized.includes('tong ket') ||
            normalized.includes('danh gia tong') ||
            (normalized.includes('khu tro') && (normalized.includes('the nao') || normalized.includes('ra sao') || normalized.includes('chung')))
        ) {
            return { answer: await buildOverallAssessmentAnswer(options.hostel || {}, hostel) }
        }

        if (normalized.includes('doanh thu') || normalized.includes('revenue')) {
            return { answer: await buildRevenueAnswer(hostel) }
        }

        if (normalized.includes('chi tieu') || normalized.includes('expense')) {
            return { answer: await buildExpenseAnswer(hostel) }
        }

        if (
            normalized.includes('hop dong') &&
            (normalized.includes('het han') ||
                normalized.includes('sap het') ||
                normalized.includes('expiry'))
        ) {
            return { answer: await buildContractAnswer(hostel) }
        }

        if (
            normalized.includes('khach thue') ||
            normalized.includes('tenant') ||
            normalized.includes('phong trong') ||
            normalized.includes('ty le') ||
            normalized.includes('lap day') ||
            normalized.includes('occupancy')
        ) {
            return { answer: await buildTenantAnswer(hostel) }
        }

        if (normalized.includes('quan ly') || normalized.includes('manager')) {
            return { answer: await buildManagerAnswer(options.hostel || {}, hostel) }
        }

        if (normalized.includes('thong bao') || normalized.includes('notification')) {
            return { answer: await buildNotificationAnswer(hostel) }
        }

        // Kiểm tra các câu chào hỏi thông thường
        const greetings = ['xin chao', 'hello', 'hi', 'chao', 'hey', 'good morning', 'good afternoon', 'good evening']
        const isGreeting = greetings.some(greeting => normalized.startsWith(greeting) || normalized === greeting)

        // Kiểm tra xem câu hỏi có liên quan đến khu trọ không
        const hostelRelatedKeywords = [
            'doanh thu', 'revenue', 'chi tieu', 'expense', 'hop dong', 'contract',
            'khach thue', 'tenant', 'phong', 'room', 'thong bao', 'notification',
            'quan ly', 'manager', 'danh gia', 'tong quan', 'overall', 'assessment',
            'cai thien', 'improvement', 'khu tro', 'hostel', 'boarding', 'toa nha', 'building',
            'hoa don', 'invoice', 'thanh toan', 'payment', 'lap day', 'occupancy',
            'ty le', 'rate', 'gia thue', 'rent', 'dien', 'nuoc', 'utility',
            'sua chua', 'maintenance', 'phan anh', 'feedback', 'lien he', 'contact'
        ]

        const isRelatedToHostel = hostelRelatedKeywords.some(keyword => normalized.includes(keyword))

        // Nếu là câu chào hỏi hoặc câu hỏi không liên quan (và không có từ khóa liên quan)
        if (isGreeting || (!isRelatedToHostel && normalized.length > 3)) {
            const greetingText = isGreeting ? 'Xin chào! 👋\n\n' : ''
            return {
                answer:
                    greetingText +
                    'Tôi là chatbot hỗ trợ quản lý khu trọ. Tôi có thể giúp bạn với các vấn đề liên quan đến:\n\n' +
                    '📊 **Thông tin tài chính:**\n' +
                    '• Doanh thu, chi tiêu, lợi nhuận\n' +
                    '• Phân tích tài chính theo tháng\n\n' +
                    '🏠 **Quản lý phòng và khách thuê:**\n' +
                    '• Tỷ lệ lấp đầy phòng\n' +
                    '• Thông tin khách thuê\n' +
                    '• Hợp đồng sắp hết hạn\n\n' +
                    '👨‍💼 **Quản lý và dịch vụ:**\n' +
                    '• Đánh giá hiệu quả quản lý\n' +
                    '• Tình trạng thông báo\n' +
                    '• Các loại thông báo (hóa đơn, liên hệ, sửa chữa...)\n\n' +
                    '💡 **Khuyến nghị cải thiện:**\n' +
                    '• Cách cải thiện tài chính\n' +
                    '• Tăng tỷ lệ lấp đầy\n' +
                    '• Cải thiện quản lý\n\n' +
                    '📈 **Đánh giá tổng quan:**\n' +
                    '• Đánh giá toàn diện về khu trọ\n' +
                    '• Điểm mạnh và điểm cần cải thiện\n\n' +
                    'Vui lòng đặt câu hỏi cụ thể về khu trọ của bạn nhé! 😊\n\n' +
                    '**Ví dụ câu hỏi:**\n' +
                    '• "Doanh thu tháng này?"\n' +
                    '• "Chi tiêu theo loại?"\n' +
                    '• "Tỷ lệ lấp đầy phòng?"\n' +
                    '• "Đánh giá tổng quan khu trọ"\n' +
                    '• "Cách cải thiện khu trọ?"\n' +
                    '• "Tình trạng thông báo?"'
            }
        }

        return {
            answer:
                'Tôi có thể giúp bạn về doanh thu, chi tiêu, hợp đồng sắp hết hạn, tình trạng phòng, thông báo, quản lý hoặc đánh giá tổng quan khu trọ.\n\n' +
                'Một số câu hỏi bạn có thể thử:\n' +
                '• "Doanh thu tháng này?"\n' +
                '• "Chi tiêu theo loại?"\n' +
                '• "Tỷ lệ lấp đầy phòng?"\n' +
                '• "Đánh giá tổng quan khu trọ"\n' +
                '• "Cách cải thiện khu trọ?"\n' +
                '• "Tình trạng thông báo?"\n\n' +
                'Vui lòng đặt câu hỏi cụ thể hơn nhé! 😊'
        }
    } catch (error) {
        console.error('[AdminChatbot] Error:', error)
        return {
            answer:
                error?.message ||
                'Tôi gặp chút sự cố khi truy cập dữ liệu. Vui lòng thử lại sau vài phút nhé.'
        }
    }
}

