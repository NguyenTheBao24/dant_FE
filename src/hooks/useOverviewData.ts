import { useState, useEffect } from "react"
import { listCanHoByToaNha, determineRoomType } from "@/services/can-ho.service"
import { listHopDongByToaNha } from "@/services/hop-dong.service"
// Import chi-tieu service dynamically to avoid circular dependencies

export function useOverviewData(selectedHostel: any, occupiedRoomsCount: number) {
    const [roomRevenues, setRoomRevenues] = useState<any[]>([])
    const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState(0)
    const [revenueByRoomType, setRevenueByRoomType] = useState<any[]>([])
    const [monthlyStats, setMonthlyStats] = useState<any[]>([])
    const [tenantStats, setTenantStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        withAccount: 0,
        withoutAccount: 0
    })
    const [roomStats, setRoomStats] = useState({
        total: 0,
        occupied: 0,
        available: 0,
        maintenance: 0,
        occupancyRate: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0)

    useEffect(() => {
        const loadOverviewData = async () => {
            if (!selectedHostel?.id) {
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            try {
                // Load tất cả dữ liệu cần thiết
                const [canHoData, hostelContracts] = await Promise.all([
                    listCanHoByToaNha(selectedHostel.id),
                    listHopDongByToaNha(selectedHostel.id)
                ])

                // Lọc dữ liệu theo tòa nhà được chọn
                const hostelCanHo = canHoData

                // Lấy danh sách khách thuê từ hợp đồng (đã có sẵn trong hostelContracts)
                const hostelTenants = hostelContracts
                    .filter((contract: any) => contract.khach_thue)
                    .map((contract: any) => contract.khach_thue)

                console.log('Hostel contracts:', hostelContracts.length)
                console.log('Hostel tenants from contracts:', hostelTenants.length)

                // Tính toán thống kê phòng - sử dụng occupiedRoomsCount từ Dashboard (giống sidebar)
                const totalRooms = hostelCanHo.length
                const maintenanceRooms = hostelCanHo.filter((room: any) => room.trang_thai === 'sua_chua').length
                const occupiedRooms = occupiedRoomsCount // Sử dụng giá trị từ Dashboard
                const availableRooms = totalRooms - occupiedRooms - maintenanceRooms

                const roomStatsData = {
                    total: totalRooms,
                    occupied: occupiedRooms,
                    available: Math.max(0, availableRooms), // Đảm bảo không âm
                    maintenance: maintenanceRooms,
                    occupancyRate: totalRooms > 0 ?
                        Math.round((occupiedRooms / totalRooms) * 100) : 0
                }
                setRoomStats(roomStatsData)

                // Tính toán thống kê khách thuê - sử dụng occupiedRoomsCount từ Dashboard
                const activeTenantsCount = occupiedRoomsCount // Sử dụng giá trị từ Dashboard

                // Tính toán tài khoản dựa trên số khách thuê thực tế (occupiedRoomsCount)
                const tenantsWithAccount = hostelTenants.filter((tenant) => tenant.tai_khoan_id).length
                const tenantsWithoutAccount = Math.max(0, occupiedRoomsCount - tenantsWithAccount)

                console.log('Tenants with account:', tenantsWithAccount)
                console.log('Tenants without account:', tenantsWithoutAccount)

                const tenantStatsData = {
                    total: occupiedRoomsCount, // Sử dụng occupiedRoomsCount làm tổng khách thuê
                    active: activeTenantsCount,
                    inactive: Math.max(0, occupiedRoomsCount - activeTenantsCount), // Đảm bảo không âm
                    withAccount: Math.min(tenantsWithAccount, occupiedRoomsCount), // Giới hạn theo occupiedRoomsCount
                    withoutAccount: tenantsWithoutAccount
                }
                setTenantStats(tenantStatsData)

                // Tính toán doanh thu theo phòng - đảm bảo hiển thị đúng số phòng đã thuê
                const roomRevenueData: any[] = []
                let totalRevenue = 0

                // Lấy tất cả hợp đồng hiệu lực (không giới hạn slice)
                const activeContracts = hostelContracts.filter((contract: any) => contract.trang_thai === 'hieu_luc')

                console.log('Total active contracts:', activeContracts.length)
                console.log('Occupied rooms count:', occupiedRoomsCount)

                activeContracts.forEach((contract: any, index: number) => {
                    const tenant = contract.khach_thue
                    const room = contract.can_ho

                    console.log(`Contract ${index + 1}:`, {
                        tenant: tenant?.ho_ten,
                        room: room?.so_can,
                        hasTenant: !!tenant,
                        hasRoom: !!room
                    })

                    if (tenant && room) {
                        const monthlyRent = room.gia_thue || 0

                        // Tính số tháng thuê từ ngày bắt đầu đến hiện tại
                        const startDate = new Date(contract.ngay_bat_dau)
                        const currentDate = new Date()
                        const monthsRented = Math.max(1, Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)))

                        const totalRoomRevenue = monthlyRent * monthsRented
                        totalRevenue += monthlyRent // Chỉ tính doanh thu tháng hiện tại

                        // Xác định loại phòng dựa trên diện tích và giá thuê
                        const roomType = determineRoomType(room.dien_tich, monthlyRent)

                        roomRevenueData.push({
                            roomNumber: room.so_can || `P${room.id}`,
                            roomType: roomType,
                            tenantName: tenant.ho_ten || 'Chưa cập nhật',
                            monthlyRent,
                            monthsRented,
                            totalRevenue: totalRoomRevenue,
                            moveInDate: contract.ngay_bat_dau,
                            status: 'active' // Chỉ hiển thị các hợp đồng hiệu lực
                        })
                    } else {
                        console.log(`Missing data for contract ${index + 1}:`, {
                            tenant: tenant,
                            room: room,
                            contract: contract
                        })
                    }
                })

                console.log('Final room revenue data length:', roomRevenueData.length)

                setRoomRevenues(roomRevenueData)
                setTotalMonthlyRevenue(totalRevenue)

                // Tính toán doanh thu theo loại phòng
                const revenueByType: { [key: string]: any } = {}

                // Tính cho tất cả phòng (kể cả phòng trống)
                hostelCanHo.forEach((room: any) => {
                    // Xác định loại phòng dựa trên diện tích và giá thuê
                    const roomType = determineRoomType(room.dien_tich, room.gia_thue)

                    if (!revenueByType[roomType]) {
                        revenueByType[roomType] = {
                            roomType,
                            count: 0,
                            totalRevenue: 0,
                            avgRevenue: 0
                        }
                    }
                    revenueByType[roomType].count++

                    // Chỉ tính doanh thu cho phòng đã thuê
                    if (room.trang_thai === 'da_thue') {
                        const roomRevenue = roomRevenueData.find(r => r.roomNumber === room.so_can)
                        if (roomRevenue) {
                            revenueByType[roomType].totalRevenue += roomRevenue.monthlyRent
                        }
                    }
                })

                // Tính trung bình
                Object.values(revenueByType).forEach((type: any) => {
                    type.avgRevenue = type.count > 0 ? type.totalRevenue / type.count : 0
                })

                setRevenueByRoomType(Object.values(revenueByType))

                // Lấy tất cả chi tiêu của tòa nhà để tính toán hiệu quả hơn
                let allExpenses: any[] = []
                try {
                    const { listChiTieuByToaNha } = await import("@/services/chi-tieu.service")
                    allExpenses = await listChiTieuByToaNha(selectedHostel.id)
                    console.log('Loaded expenses for overview:', allExpenses.length)
                } catch (error) {
                    console.error('Error loading expenses:', error)
                }

                // Gom chi tiêu theo tháng, tránh lệch UTC bằng cách cắt chuỗi YYYY-MM
                const expensesByMonthMap: Record<string, number> = {}
                allExpenses.forEach((expense: any) => {
                    // Đảm bảo format YYYY-MM từ ngay (có thể là YYYY-MM-DD hoặc YYYY-MM-DDTHH:mm:ss)
                    const ngayStr = String(expense.ngay || '')
                    const ym = ngayStr.slice(0, 7) // YYYY-MM
                    const amount = Number(expense.so_tien) || 0
                    if (ym && ym.length === 7 && amount > 0) {
                        expensesByMonthMap[ym] = (expensesByMonthMap[ym] || 0) + amount
                    }
                })

                // Debug logging for a specific building
                if (Number(selectedHostel.id) === 38) {
                    try {
                        console.log('[DEBUG][toa_nha_id=38] Raw chi_tieu rows:', allExpenses.length)
                        console.table((allExpenses || []).map((e: any) => ({
                            id: e.id,
                            toa_nha_id: e.toa_nha_id,
                            ngay: String(e.ngay || '').slice(0, 10),
                            ym: String(e.ngay || '').slice(0, 7),
                            so_tien: e.so_tien,
                            loai_chi: e.loai_chi
                        })))
                        console.log('[DEBUG][toa_nha_id=38] expensesByMonthMap:', expensesByMonthMap)
                    } catch { }
                }

                // Tính chi phí tháng hiện tại trực tiếp từ allExpenses
                const currentDate = new Date()
                const currentYear = currentDate.getFullYear()
                const currentMonth = currentDate.getMonth()
                const currentMonthStart = new Date(currentYear, currentMonth, 1)
                const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

                const currentMonthExpensesTotal = allExpenses.reduce((sum, expense: any) => {
                    const expenseDate = new Date(expense.ngay)
                    if (expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd) {
                        return sum + (expense.so_tien || 0)
                    }
                    return sum
                }, 0)

                setCurrentMonthExpenses(currentMonthExpensesTotal)

                // ✅ Gom doanh thu theo tháng dựa trên HỢP ĐỒNG hiệu lực trong từng tháng
                // Sử dụng tất cả hợp đồng của tòa nhà để phản ánh doanh thu thực tế theo thời gian
                const revenueByMonthMap: Record<string, number> = {}
                hostelContracts.forEach((contract: any) => {
                    const start = new Date(contract.ngay_bat_dau)
                    const end = contract.ngay_ket_thuc ? new Date(contract.ngay_ket_thuc) : new Date()
                    const rent = contract.can_ho?.gia_thue || 0
                    if (!isFinite(start.getTime()) || !isFinite(end.getTime()) || rent <= 0) return

                    // Lặp từng tháng mà hợp đồng còn hiệu lực
                    const loop = new Date(start.getFullYear(), start.getMonth(), 1)
                    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1)
                    while (loop <= endMonth) {
                        const ym = `${loop.getFullYear()}-${String(loop.getMonth() + 1).padStart(2, '0')}`
                        revenueByMonthMap[ym] = (revenueByMonthMap[ym] || 0) + rent
                        loop.setMonth(loop.getMonth() + 1)
                    }
                })

                if (Number(selectedHostel.id) === 38) {
                    try {
                        console.log('[DEBUG][toa_nha_id=38] revenueByMonthMap:', revenueByMonthMap)
                    } catch { }
                }

                // ✅ Hợp nhất các tháng có dữ liệu thực tế từ doanh thu hoặc chi tiêu
                const monthKeys = Array.from(new Set([
                    ...Object.keys(revenueByMonthMap),
                    ...Object.keys(expensesByMonthMap)
                ])).sort()

                // Nếu tòa nhà mới (không có hợp đồng và chi tiêu) thì hiển thị tháng hiện tại với 0
                const effectiveMonthKeys = monthKeys.length > 0
                    ? monthKeys
                    : [
                        `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
                    ]

                const last12Months = effectiveMonthKeys.slice(-12)

                if (Number(selectedHostel.id) === 38) {
                    try {
                        console.log('[DEBUG][toa_nha_id=38] effectiveMonthKeys:', effectiveMonthKeys)
                        console.log('[DEBUG][toa_nha_id=38] last12Months:', last12Months)
                    } catch { }
                }

                const monthlyStatsData: any[] = last12Months.map((ym) => {
                    const [y, m] = ym.split('-').map(Number)
                    const monthName = new Date(y, m - 1, 1).toLocaleDateString('vi-VN', { month: 'short' })
                    const revenue = Math.round(revenueByMonthMap[ym] || 0)
                    const expenses = Math.round(expensesByMonthMap[ym] || 0)
                    const profit = revenue - expenses
                    return {
                        month: monthName,
                        revenue,
                        expenses,
                        profit
                    }
                })

                setMonthlyStats(monthlyStatsData)

                if (Number(selectedHostel.id) === 38) {
                    try {
                        console.table(monthlyStatsData.map((d: any) => ({
                            month: d.month,
                            revenue: d.revenue,
                            expenses: d.expenses,
                            profit: d.profit
                        })))
                    } catch { }
                }

            } catch (error) {
                console.error('Failed to load overview data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadOverviewData()
    }, [selectedHostel?.id, occupiedRoomsCount])

    return {
        roomRevenues,
        totalMonthlyRevenue,
        revenueByRoomType,
        monthlyStats,
        currentMonthExpenses,
        tenantStats,
        roomStats,
        isLoading
    }
}
