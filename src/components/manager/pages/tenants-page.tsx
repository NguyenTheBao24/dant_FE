import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import {
    Users,
    Search,
    Filter,
    Plus,
    Edit,
    Eye,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    Home
} from "lucide-react"

interface TenantsPageProps {
    selectedHostel: any
}

export function TenantsPage({ selectedHostel }: TenantsPageProps) {
    const [tenants, setTenants] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const loadTenants = async () => {
            if (!selectedHostel) return

            setIsLoading(true)
            try {
                // Mock data - replace with actual API calls
                await new Promise(resolve => setTimeout(resolve, 1000))
                setTenants([
                    {
                        id: 1,
                        name: "Nguyễn Văn An",
                        phone: "0123456789",
                        email: "nguyenvanan@email.com",
                        room: "A101",
                        contractStart: "2024-01-01",
                        contractEnd: "2024-12-31",
                        rentAmount: 2500000,
                        status: "active",
                        lastPayment: "2024-12-01"
                    },
                    {
                        id: 2,
                        name: "Trần Thị Bình",
                        phone: "0987654321",
                        email: "tranthibinh@email.com",
                        room: "A102",
                        contractStart: "2024-02-01",
                        contractEnd: "2025-01-31",
                        rentAmount: 2800000,
                        status: "active",
                        lastPayment: "2024-11-28"
                    },
                    {
                        id: 3,
                        name: "Lê Văn Cường",
                        phone: "0369852147",
                        email: "levancuong@email.com",
                        room: "B201",
                        contractStart: "2024-03-01",
                        contractEnd: "2025-02-28",
                        rentAmount: 3000000,
                        status: "pending_payment",
                        lastPayment: "2024-10-15"
                    }
                ])
            } catch (error) {
                console.error('Error loading tenants:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadTenants()
    }, [selectedHostel])

    const filteredTenants = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm) ||
        tenant.room.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Hoạt động
                    </span>
                )
            case 'pending_payment':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Chờ thanh toán
                    </span>
                )
            case 'expired':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Hết hạn
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Không xác định
                    </span>
                )
        }
    }

    if (!selectedHostel) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa chọn khu trọ</h3>
                    <p className="text-gray-500">Vui lòng chọn một khu trọ để quản lý khách thuê</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Quản lý khách thuê
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Quản lý thông tin khách thuê tại khu trọ <span className="font-semibold">{selectedHostel.name}</span>
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm khách thuê
                </Button>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, số điện thoại hoặc phòng..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Lọc
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Tổng khách thuê</p>
                                <p className="text-2xl font-bold text-blue-700">
                                    {isLoading ? "..." : tenants.length}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Đang hoạt động</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {isLoading ? "..." : tenants.filter(t => t.status === 'active').length}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-600">Chờ thanh toán</p>
                                <p className="text-2xl font-bold text-yellow-700">
                                    {isLoading ? "..." : tenants.filter(t => t.status === 'pending_payment').length}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Doanh thu/tháng</p>
                                <p className="text-2xl font-bold text-purple-700">
                                    {isLoading ? "..." : tenants.reduce((sum, t) => sum + t.rentAmount, 0).toLocaleString('vi-VN')}₫
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tenants List */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách khách thuê</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-500 mt-2">Đang tải...</p>
                        </div>
                    ) : filteredTenants.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy khách thuê</h3>
                            <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTenants.map((tenant) => (
                                <div key={tenant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                        <div className="flex items-center">
                                                            <Phone className="h-4 w-4 mr-1" />
                                                            {tenant.phone}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Mail className="h-4 w-4 mr-1" />
                                                            {tenant.email}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Home className="h-4 w-4 mr-1" />
                                                            Phòng {tenant.room}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-6 mt-3">
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Hợp đồng:</span>
                                                    <span className="ml-1 font-medium">
                                                        {new Date(tenant.contractStart).toLocaleDateString('vi-VN')} - {new Date(tenant.contractEnd).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Tiền thuê:</span>
                                                    <span className="ml-1 font-medium text-green-600">
                                                        {tenant.rentAmount.toLocaleString('vi-VN')}₫/tháng
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Thanh toán cuối:</span>
                                                    <span className="ml-1 font-medium">
                                                        {new Date(tenant.lastPayment).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {getStatusBadge(tenant.status)}
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
