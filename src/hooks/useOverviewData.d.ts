interface RoomRevenue {
    roomNumber: string
    roomType: string
    tenantName: string
    monthlyRent: number
    monthsRented: number
    totalRevenue: number
    moveInDate: string | null
    status: string
}

interface RevenueByRoomType {
    roomType: string
    count: number
    totalRevenue: number
    avgRevenue: number
}

interface MonthlyStats {
    month: string
    revenue: number
    expenses: number
    profit: number
    occupancy: number
}

interface TenantStats {
    total: number
    active: number
    inactive: number
    withAccount: number
    withoutAccount: number
}

interface RoomStats {
    total: number
    occupied: number
    available: number
    maintenance: number
    occupancyRate: number
}

interface UseOverviewDataReturn {
    roomRevenues: RoomRevenue[]
    totalMonthlyRevenue: number
    revenueByRoomType: RevenueByRoomType[]
    monthlyStats: MonthlyStats[]
    tenantStats: TenantStats
    roomStats: RoomStats
    isLoading: boolean
}

export function useOverviewData(
    selectedHostel: any,
    occupiedRoomsCount: number
): UseOverviewDataReturn
