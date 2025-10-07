import { useState, useEffect } from "react"
import { listCanHoByToaNha, determineRoomType } from "@/services/can-ho.service"
import { listHopDongByToaNha } from "@/services/hop-dong.service"

export function useOverviewData(selectedHostel, occupiedRoomsCount) {
    const [roomRevenues, setRoomRevenues] = useState([])
    const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState(0)
    const [revenueByRoomType, setRevenueByRoomType] = useState([])
    const [monthlyStats, setMonthlyStats] = useState([])
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

                // Tạo dữ liệu thống kê hàng tháng (12 tháng gần nhất) dựa trên dữ liệu thực
                const monthlyStatsData = []
                const currentDate = new Date()

                for (let i = 11; i >= 0; i--) {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
                    const monthName = date.toLocaleDateString('vi-VN', { month: 'short' })

                    // Tính doanh thu thực cho tháng này dựa trên hợp đồng hiệu lực trong tháng đó
                    let monthlyRevenue = 0
                    const targetMonth = date.getMonth() + 1
                    const targetYear = date.getFullYear()

                    // Tính doanh thu từ các hợp đồng đang hiệu lực trong tháng này
                    activeContracts.forEach((contract) => {
                        const startDate = new Date(contract.ngay_bat_dau)
                        const endDate = contract.ngay_ket_thuc ? new Date(contract.ngay_ket_thuc) : new Date()

                        // Kiểm tra xem hợp đồng có hiệu lực trong tháng này không
                        const contractStartMonth = startDate.getMonth() + 1
                        const contractStartYear = startDate.getFullYear()
                        const contractEndMonth = endDate.getMonth() + 1
                        const contractEndYear = endDate.getFullYear()

                        // Nếu hợp đồng bắt đầu trước hoặc trong tháng này và kết thúc sau hoặc trong tháng này
                        if ((contractStartYear < targetYear || (contractStartYear === targetYear && contractStartMonth <= targetMonth)) &&
                            (contractEndYear > targetYear || (contractEndYear === targetYear && contractEndMonth >= targetMonth))) {
                            const room = contract.can_ho
                            if (room && room.gia_thue) {
                                monthlyRevenue += room.gia_thue
                            }
                        }
                    })

                    // Nếu không có doanh thu thực (tháng trong tương lai), sử dụng doanh thu hiện tại
                    if (i === 0 && monthlyRevenue === 0) {
                        monthlyRevenue = totalRevenue
                    }

                    // Tính chi phí dựa trên doanh thu và chi phí cố định
                    const fixedCosts = Math.round(totalRooms * 500000) // Chi phí cố định: 500k/phòng/tháng
                    const variableCosts = Math.round(monthlyRevenue * 0.15) // Chi phí biến đổi: 15% doanh thu
                    const monthlyExpenses = fixedCosts + variableCosts

                    monthlyStatsData.push({
                        month: monthName,
                        revenue: Math.round(monthlyRevenue),
                        expenses: monthlyExpenses,
                        profit: Math.round(monthlyRevenue - monthlyExpenses),
                        occupancy: roomStatsData.occupancyRate
                    })
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
        tenantStats,
        roomStats,
        isLoading
    }
}
