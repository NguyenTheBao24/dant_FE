import { supabase } from './supabase-client'

const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    return url && key && url !== 'https://placeholder.supabase.co'
}

// Lấy doanh thu hàng tháng của các phòng trong khu trọ
export const getMonthlyRevenueByRooms = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock revenue data')
        return getMockRevenueData()
    }

    try {
        // Thử lấy từ bảng rooms trước
        const { data: occupiedRooms, error: roomsError } = await supabase
            .from('rooms')
            .select('id, room_number, room_type, rent_amount, status')
            .eq('hostel_id', hostelId)
            .eq('status', 'occupied')

        if (roomsError) {
            // Nếu bảng rooms chưa tồn tại, sử dụng dữ liệu từ tenants
            if (roomsError.code === 'PGRST205' || roomsError.message?.includes('relation "rooms" does not exist')) {
                console.log('Rooms table does not exist, fetching from tenants table')
                return await getRevenueFromTenants(hostelId)
            }
            throw roomsError
        }

        console.log('Fetched occupied rooms:', occupiedRooms)

        // Lấy thông tin tenant cho từng phòng
        const roomRevenues = []

        for (const room of occupiedRooms) {
            // Tìm tenant tương ứng với phòng này
            const { data: tenants, error: tenantsError } = await supabase
                .from('tenants')
                .select('id, name, move_in_date, months_rented, status')
                .eq('hostel_id', hostelId)
                .eq('room_number', room.room_number)
                .eq('status', 'active')
                .limit(1)

            if (tenantsError) {
                console.error('Error fetching tenant for room', room.room_number, ':', tenantsError)
                continue
            }

            const tenant = tenants && tenants.length > 0 ? tenants[0] : null
            const monthlyRevenue = room.rent_amount || 0
            const monthsRented = tenant?.months_rented || 0
            const totalRevenue = monthlyRevenue * monthsRented

            roomRevenues.push({
                roomNumber: room.room_number,
                roomType: room.room_type,
                tenantName: tenant?.name || 'Chưa có thông tin',
                monthlyRent: monthlyRevenue,
                monthsRented: monthsRented,
                totalRevenue: totalRevenue,
                moveInDate: tenant?.move_in_date || null,
                status: tenant?.status || 'unknown'
            })
        }

        console.log('Processed room revenues:', roomRevenues)
        return roomRevenues
    } catch (error) {
        console.error('Error fetching monthly revenue by rooms:', error)
        // Trả về mock data khi có lỗi
        return getMockRevenueData()
    }
}

// Lấy tổng doanh thu hàng tháng của khu trọ
export const getTotalMonthlyRevenue = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock total revenue')
        return 67000000 // Mock data
    }

    try {
        const { data: occupiedRooms, error } = await supabase
            .from('rooms')
            .select('rent_amount')
            .eq('hostel_id', hostelId)
            .eq('status', 'occupied')

        if (error) {
            // Nếu bảng rooms chưa tồn tại, lấy từ tenants
            if (error.code === 'PGRST205' || error.message?.includes('relation "rooms" does not exist')) {
                console.log('Rooms table does not exist, fetching total revenue from tenants')
                return await getTotalRevenueFromTenants(hostelId)
            }
            console.error('Supabase error fetching total revenue:', error)
            throw error
        }

        const totalRevenue = occupiedRooms.reduce((sum, room) => {
            return sum + (room.rent_amount || 0)
        }, 0)

        console.log('Total monthly revenue for hostel', hostelId, ':', totalRevenue)
        return totalRevenue
    } catch (error) {
        console.error('Error fetching total monthly revenue:', error)
        return 67000000 // Fallback
    }
}

// Lấy thống kê doanh thu theo loại phòng
export const getRevenueByRoomType = async (hostelId) => {
    if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, returning mock revenue by room type')
        return getMockRevenueByRoomType()
    }

    try {
        const { data: occupiedRooms, error } = await supabase
            .from('rooms')
            .select('room_type, rent_amount')
            .eq('hostel_id', hostelId)
            .eq('status', 'occupied')

        if (error) {
            // Nếu bảng rooms chưa tồn tại, lấy từ tenants
            if (error.code === 'PGRST205' || error.message?.includes('relation "rooms" does not exist')) {
                console.log('Rooms table does not exist, fetching revenue by type from tenants')
                return await getRevenueByTypeFromTenants(hostelId)
            }
            console.error('Supabase error fetching revenue by room type:', error)
            throw error
        }

        console.log('Fetched occupied rooms for revenue by type:', occupiedRooms)

        // Nhóm theo loại phòng
        const revenueByType = occupiedRooms.reduce((acc, room) => {
            const roomType = room.room_type || 'Không xác định'
            if (!acc[roomType]) {
                acc[roomType] = {
                    roomType,
                    count: 0,
                    totalRevenue: 0
                }
            }
            acc[roomType].count += 1
            acc[roomType].totalRevenue += room.rent_amount || 0
            return acc
        }, {})

        const result = Object.values(revenueByType)
        console.log('Revenue by room type:', result)
        return result
    } catch (error) {
        console.error('Error fetching revenue by room type:', error)
        return getMockRevenueByRoomType()
    }
}

// Lấy tổng doanh thu từ bảng tenants
const getTotalRevenueFromTenants = async (hostelId) => {
    try {
        const { data: tenants, error } = await supabase
            .from('tenants')
            .select('rent_amount')
            .eq('hostel_id', hostelId)
            .eq('status', 'active')

        if (error) {
            console.error('Error fetching tenants for total revenue:', error)
            throw error
        }

        const totalRevenue = tenants.reduce((sum, tenant) => {
            return sum + (tenant.rent_amount || 0)
        }, 0)

        console.log('Total revenue from tenants for hostel', hostelId, ':', totalRevenue)
        return totalRevenue
    } catch (error) {
        console.error('Error fetching total revenue from tenants:', error)
        return 67000000 // Fallback
    }
}

// Lấy doanh thu theo loại phòng từ bảng tenants
const getRevenueByTypeFromTenants = async (hostelId) => {
    try {
        const { data: tenants, error } = await supabase
            .from('tenants')
            .select('rent_amount')
            .eq('hostel_id', hostelId)
            .eq('status', 'active')

        if (error) {
            console.error('Error fetching tenants for revenue by type:', error)
            throw error
        }

        // Nhóm tất cả tenants thành một loại "Phòng thuê"
        const totalRevenue = tenants.reduce((sum, tenant) => {
            return sum + (tenant.rent_amount || 0)
        }, 0)

        const result = [{
            roomType: 'Phòng thuê',
            count: tenants.length,
            totalRevenue: totalRevenue
        }]

        console.log('Revenue by type from tenants:', result)
        return result
    } catch (error) {
        console.error('Error fetching revenue by type from tenants:', error)
        return getMockRevenueByRoomType()
    }
}

// Lấy doanh thu từ bảng tenants khi bảng rooms chưa tồn tại
const getRevenueFromTenants = async (hostelId) => {
    try {
        const { data: tenants, error } = await supabase
            .from('tenants')
            .select('name, room_number, rent_amount, move_in_date, months_rented, status')
            .eq('hostel_id', hostelId)
            .eq('status', 'active')

        if (error) {
            console.error('Error fetching tenants for revenue:', error)
            throw error
        }

        console.log('Fetched tenants for revenue:', tenants)

        const roomRevenues = tenants.map(tenant => {
            const monthlyRevenue = tenant.rent_amount || 0
            const monthsRented = tenant.months_rented || 0
            const totalRevenue = monthlyRevenue * monthsRented

            return {
                roomNumber: tenant.room_number,
                roomType: 'Phòng thuê', // Mặc định vì không có thông tin loại phòng
                tenantName: tenant.name || 'Chưa có thông tin',
                monthlyRent: monthlyRevenue,
                monthsRented: monthsRented,
                totalRevenue: totalRevenue,
                moveInDate: tenant.move_in_date || null,
                status: tenant.status || 'unknown'
            }
        })

        console.log('Processed revenue from tenants:', roomRevenues)
        return roomRevenues
    } catch (error) {
        console.error('Error fetching revenue from tenants:', error)
        return getMockRevenueData()
    }
}

// Mock data functions
const getMockRevenueData = () => [
    {
        roomNumber: 'A101',
        roomType: 'Phòng đơn',
        tenantName: 'Nguyễn Văn A',
        monthlyRent: 2500000,
        monthsRented: 12,
        totalRevenue: 30000000,
        moveInDate: '2024-01-01',
        status: 'active'
    },
    {
        roomNumber: 'A102',
        roomType: 'Phòng đơn',
        tenantName: 'Trần Thị B',
        monthlyRent: 2500000,
        monthsRented: 10,
        totalRevenue: 25000000,
        moveInDate: '2024-03-01',
        status: 'active'
    },
    {
        roomNumber: 'A201',
        roomType: 'Phòng VIP',
        tenantName: 'Lê Văn C',
        monthlyRent: 4500000,
        monthsRented: 8,
        totalRevenue: 36000000,
        moveInDate: '2024-05-01',
        status: 'active'
    },
    {
        roomNumber: 'A202',
        roomType: 'Phòng VIP',
        tenantName: 'Phạm Thị D',
        monthlyRent: 4500000,
        monthsRented: 6,
        totalRevenue: 27000000,
        moveInDate: '2024-07-01',
        status: 'active'
    }
]

const getMockRevenueByRoomType = () => [
    {
        roomType: 'Phòng đơn',
        count: 2,
        totalRevenue: 5000000
    },
    {
        roomType: 'Phòng VIP',
        count: 2,
        totalRevenue: 9000000
    }
]
