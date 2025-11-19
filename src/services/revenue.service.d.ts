export interface RoomRevenue {
    roomNumber: string
    roomType: string
    tenantName: string
    monthlyRent: number
    monthsRented: number
    totalRevenue: number
    moveInDate: string | null
    status: string
}

export interface RevenueByRoomType {
    roomType: string
    count: number
    totalRevenue: number
}

export declare function getMonthlyRevenueByRooms(hostelId: number): Promise<RoomRevenue[]>
export declare function getTotalMonthlyRevenue(hostelId: number): Promise<number>
export declare function getRevenueByRoomType(hostelId: number): Promise<RevenueByRoomType[]>
