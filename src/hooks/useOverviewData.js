import { useState, useEffect } from "react"
import { listCanHoByToaNha, determineRoomType } from "@/services/can-ho.service"
import { listHopDongByToaNha } from "@/services/hop-dong.service"
import { aggregateExpensesByMonth, getCurrentMonthExpenses } from "@/utils/expenses.utils"
import { aggregateRevenueByMonth, buildMonthlyStats } from "@/utils/revenue.utils"
import { currentYearMonth } from "@/utils/months.utils"

export function useOverviewData(selectedHostel, occupiedRoomsCount) {
    const [roomRevenues, setRoomRevenues] = useState([])
    const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState(0)
    const [revenueByRoomType, setRevenueByRoomType] = useState([])
    const [monthlyStats, setMonthlyStats] = useState([])
    const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0)
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
                    .filter((contract) => contract.khach_thue)
                    .map((contract) => contract.khach_thue)

                console.log('Hostel contracts:', hostelContracts.length)
                console.log('Hostel tenants from contracts:', hostelTenants.length)

                // Tính toán thống kê phòng - sử dụng occupiedRoomsCount từ Dashboard (giống sidebar)
                const totalRooms = hostelCanHo.length
                const maintenanceRooms = hostelCanHo.filter((room) => room.trang_thai === 'sua_chua').length
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
                const roomRevenueData = []
                let totalRevenue = 0

                // Lấy tất cả hợp đồng hiệu lực (không giới hạn slice)
                const activeContracts = hostelContracts.filter((contract) => contract.trang_thai === 'hieu_luc')

                console.log('Total active contracts:', activeContracts.length)
                console.log('Occupied rooms count:', occupiedRoomsCount)

                activeContracts.forEach((contract, index) => {
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
                const revenueByType = {}

                // Tính cho tất cả phòng (kể cả phòng trống)
                hostelCanHo.forEach(room => {
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
                Object.values(revenueByType).forEach(type => {
                    type.avgRevenue = type.count > 0 ? type.totalRevenue / type.count : 0
                })

                setRevenueByRoomType(Object.values(revenueByType))

                // === Doanh thu & Chi tiêu theo tháng dựa trên dữ liệu thực tế ===
                // 1) Lấy toàn bộ chi tiêu của tòa nhà và gom theo YYYY-MM
                let allExpenses = []
                try {
                    const { listChiTieuByToaNha } = await import("@/services/chi-tieu.service")
                    allExpenses = await listChiTieuByToaNha(selectedHostel.id)
                } catch (e) {
                    console.error('Error loading expenses:', e)
                }

                const expensesByMonthMap = aggregateExpensesByMonth(allExpenses)

                // Tính chi phí tháng hiện tại để hiển thị thẻ "Chi phí tháng" theo YYYY-MM
                try { setCurrentMonthExpenses(getCurrentMonthExpenses(allExpenses)) } catch { }

                // 2) Doanh thu theo tháng: duyệt tất cả hợp đồng theo từng tháng hiệu lực
                const revenueByMonthMap = aggregateRevenueByMonth(hostelContracts, true)

                // 3) Dựng mảng thống kê 12 tháng gần nhất
                const monthlyStatsData = buildMonthlyStats(
                    revenueByMonthMap,
                    expensesByMonthMap,
                    roomStatsData.occupancyRate,
                    currentYearMonth()
                )

                // 4) Debug for toa_nha_id = 38
                if (Number(selectedHostel.id) === 38) {
                    try {
                        console.log('[DEBUG][toa_nha_id=38][JS] Raw chi_tieu rows:', allExpenses.length)
                        console.table((allExpenses || []).map((e) => ({
                            id: e.id,
                            toa_nha_id: e.toa_nha_id,
                            ngay: String(e.ngay || '').slice(0, 10),
                            ym: String(e.ngay || '').slice(0, 7),
                            so_tien: e.so_tien,
                            loai_chi: e.loai_chi
                        })))
                        console.log('[DEBUG][toa_nha_id=38][JS] expensesByMonthMap:', expensesByMonthMap)
                        console.log('[DEBUG][toa_nha_id=38][JS] revenueByMonthMap:', revenueByMonthMap)
                        // Keys và 12 tháng cuối cùng nay được tính trong buildMonthlyStats
                        console.table(monthlyStatsData.map((d) => ({ month: d.month, revenue: d.revenue, expenses: d.expenses, profit: d.profit })))
                    } catch { }
                }

                setMonthlyStats(monthlyStatsData)

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
