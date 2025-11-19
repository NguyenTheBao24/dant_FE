export const hostels = [
    {
        id: 1,
        name: "Khu trọ An Phú",
        address: "123 Đường An Phú, Quận 2, TP.HCM",
        rooms: 50,
        occupancy: 45,
        manager: {
            id: 1,
            name: "Nguyễn Văn An",
            phone: "0123456789",
            email: "an.nguyen@example.com",
            avatar: "/avatars/manager1.jpg",
            experience: "5 năm",
            specialties: ["Quản lý tài chính", "Bảo trì", "Quan hệ khách hàng"]
        }
    },
    {
        id: 2,
        name: "Khu trọ Bình Thạnh",
        address: "456 Đường Bình Thạnh, Quận Bình Thạnh, TP.HCM",
        rooms: 30,
        occupancy: 28,
        manager: {
            id: 2,
            name: "Trần Thị Bình",
            phone: "0987654321",
            email: "binh.tran@example.com",
            avatar: "/avatars/manager2.jpg",
            experience: "3 năm",
            specialties: ["Quản lý nhân sự", "Marketing", "Dịch vụ khách hàng"]
        }
    }
]

export const tenantData = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        roomNumber: "A101",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        phone: "0123456789",
        emergencyPhone: "0987654321",
        rentMonths: 12,
        status: "active",
        hostelId: 1
    },
    {
        id: 2,
        name: "Trần Thị B",
        roomNumber: "A102",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        phone: "0123456790",
        emergencyPhone: "0987654322",
        rentMonths: 6,
        status: "active",
        hostelId: 1
    },
    {
        id: 3,
        name: "Lê Văn C",
        roomNumber: "B201",
        address: "789 Đường DEF, Quận 3, TP.HCM",
        phone: "0123456791",
        emergencyPhone: "0987654323",
        rentMonths: 18,
        status: "active",
        hostelId: 1
    }
]

export const revenueData = [
    { month: "T1", revenue: 65000000, expense: 45000000 },
    { month: "T2", revenue: 68000000, expense: 47000000 },
    { month: "T3", revenue: 72000000, expense: 48000000 },
    { month: "T4", revenue: 75000000, expense: 50000000 },
    { month: "T5", revenue: 78000000, expense: 52000000 },
    { month: "T6", revenue: 82000000, expense: 54000000 },
    { month: "T7", revenue: 85000000, expense: 56000000 },
    { month: "T8", revenue: 88000000, expense: 58000000 },
    { month: "T9", revenue: 92000000, expense: 60000000 },
    { month: "T10", revenue: 95000000, expense: 62000000 },
    { month: "T11", revenue: 98000000, expense: 64000000 },
    { month: "T12", revenue: 102000000, expense: 66000000 }
]

export const expenseCategories = [
    { name: "Điện nước", value: 25000000, color: "#8884d8" },
    { name: "Bảo trì", value: 15000000, color: "#82ca9d" },
    { name: "Nhân viên", value: 20000000, color: "#ffc658" },
    { name: "Thuế", value: 8000000, color: "#ff7300" },
    { name: "Khác", value: 12000000, color: "#00C49F" }
]

export const notifications = [
    {
        id: 1,
        title: "Khách thuê mới",
        message: "Nguyễn Văn D đã đăng ký thuê phòng A103",
        time: "2 giờ trước",
        type: "customer"
    },
    {
        id: 2,
        title: "Báo cáo tháng",
        message: "Báo cáo doanh thu tháng 12 đã sẵn sàng",
        time: "1 ngày trước",
        type: "report"
    },
    {
        id: 3,
        title: "Bảo trì phòng",
        message: "Phòng B205 cần bảo trì hệ thống điện",
        time: "2 ngày trước",
        type: "order"
    },
    {
        id: 4,
        title: "Nhân viên mới",
        message: "Trần Văn E đã được tuyển dụng làm bảo vệ",
        time: "3 ngày trước",
        type: "employee"
    }
]
