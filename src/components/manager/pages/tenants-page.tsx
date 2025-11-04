import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { listHopDongByToaNha } from "@/services/hop-dong.service"
// @ts-ignore
import { getInvoicesByHopDong } from "@/services/employ-invoice.service"
import { AddTenantDialog } from "@/components/manager/dialogs/AddTenantDialog"
import { EditTenantDialog } from "@/components/manager/dialogs/EditTenantDialog"
// import helpers if needed later
// @ts-ignore
import { notifyContractEmail } from "@/services/email.service"
import {
    Users,
    Search,
    Filter,
    Edit,
    Phone,
    Mail,
    DollarSign,
    Home
} from "lucide-react"

interface Tenant {
    id: string | number
    name: string
    phone: string
    email: string
    room: string
    contractStart: string
    contractEnd: string
    rentAmount: number
    status: string
    lastPayment: string
    hopDongId: string | number
    khachThueId: string | number
    canHoId: string | number
    invoiceStatus?: 'paid' | 'unpaid' | 'no_invoice'
    buildingName?: string
    contractId?: string | number
}

interface TenantsPageProps {
    selectedHostel: any
}

export function TenantsPage({ selectedHostel }: TenantsPageProps) {
    const [tenants, setTenants] = useState<Tenant[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
    const [showTenantModal, setShowTenantModal] = useState(false)
    const [showAddTenantDialog, setShowAddTenantDialog] = useState(false)
    const [showEditTenantDialog, setShowEditTenantDialog] = useState(false)

    useEffect(() => {
        loadTenants()
    }, [selectedHostel])

    const loadTenants = async () => {
        if (!selectedHostel?.id) return

        setIsLoading(true)
        try {
            console.log('Loading tenants for toa nha ID:', selectedHostel.id)
            console.log('Selected hostel info:', {
                id: selectedHostel.id,
                name: selectedHostel.ten_toa || selectedHostel.ten || selectedHostel.name
            })

            // Load hợp đồng từ tòa nhà
            const hopDongList = await listHopDongByToaNha(selectedHostel.id)
            // Deduplicate: keep latest active contract per room id
            const latestByRoom = new Map<number, any>()
            for (const hd of hopDongList) {
                if (hd.trang_thai !== 'hieu_luc') continue
                const existing = latestByRoom.get(hd.can_ho_id)
                if (!existing) latestByRoom.set(hd.can_ho_id, hd)
                else {
                    const a = new Date(existing.ngay_bat_dau).getTime()
                    const b = new Date(hd.ngay_bat_dau).getTime()
                    if (b >= a) latestByRoom.set(hd.can_ho_id, hd)
                }
            }
            const normalizedList = latestByRoom.size ? Array.from(latestByRoom.values()) : hopDongList
            console.log('Found hop dong list:', hopDongList)
            console.log('Number of contracts found:', hopDongList.length)

            // Lấy thông tin hóa đơn: có hóa đơn hay không và có hóa đơn chưa thanh toán hay không
            const invoiceInfoList = await Promise.all(
                normalizedList.map(async (hd: any) => {
                    try {
                        const allInvoices = await getInvoicesByHopDong(hd.id)
                        const hasAny = Array.isArray(allInvoices) && allInvoices.length > 0
                        const hasUnpaid = hasAny && allInvoices.some((inv: any) => inv.trang_thai === 'chua_tt')
                        const status: 'paid' | 'unpaid' | 'no_invoice' = !hasAny ? 'no_invoice' : (hasUnpaid ? 'unpaid' : 'paid')
                        return { hopDongId: hd.id, status }
                    } catch {
                        return { hopDongId: hd.id, status: 'no_invoice' as const }
                    }
                })
            )
            const hopDongIdToInvoiceStatus = new Map(invoiceInfoList.map(x => [x.hopDongId, x.status]))

            // Transform data để phù hợp với UI
            const tenantsData: Tenant[] = normalizedList.map((hopDong: any) => {
                console.log('Processing hop dong:', hopDong)
                console.log('Can ho info:', hopDong.can_ho)
                console.log('Khach thue info:', hopDong.khach_thue)

                return {
                    id: hopDong.khach_thue?.id || hopDong.id,
                    name: hopDong.khach_thue?.ho_ten || 'Không có tên',
                    phone: hopDong.khach_thue?.sdt || 'Không có số điện thoại',
                    email: hopDong.khach_thue?.email || 'Không có email',
                    room: hopDong.can_ho?.so_can || 'Không có phòng',
                    contractStart: hopDong.ngay_bat_dau,
                    contractEnd: hopDong.ngay_ket_thuc,
                    rentAmount: hopDong.can_ho?.gia_thue || 0,
                    status: hopDong.trang_thai === 'hieu_luc' ? 'active' : 'expired',
                    lastPayment: hopDong.ngay_thanh_toan_cuoi || hopDong.ngay_bat_dau,
                    hopDongId: hopDong.id,
                    khachThueId: hopDong.khach_thue_id,
                    canHoId: hopDong.can_ho_id,
                    invoiceStatus: hopDongIdToInvoiceStatus.get(hopDong.id) as 'paid' | 'unpaid'
                }
            })

            console.log('Transformed tenants data:', tenantsData)
            console.log('Total tenants for this building:', tenantsData.length)
            setTenants(tenantsData)
        } catch (error) {
            console.error('Error loading tenants:', error)
            setTenants([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddTenant = async (tenantData: any) => {
        console.log('New tenant added:', tenantData)
        // Reload list immediately for responsive UI
        await loadTenants()
        // Optionally show a quick confirmation
        try {
            // @ts-ignore
            if (window?.toast) {
                // @ts-ignore
                window.toast.success('Đã thêm khách thuê thành công')
            } else {
                // Fallback minimal notification
                // @ts-ignore
                if (typeof window !== 'undefined') alert('Đã thêm khách thuê thành công')
            }
        } catch { }
    }

    const handleUpdateTenant = async () => {
        console.log('Tenant updated')
        // Reload tenants list after updating tenant
        await loadTenants()
    }

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
                        Quản lý thông tin khách thuê tại khu trọ <span className="font-semibold">{selectedHostel.ten_toa || selectedHostel.ten || selectedHostel.name || 'Không có tên'}</span>
                    </p>
                </div>
                <AddTenantDialog
                    isOpen={showAddTenantDialog}
                    onOpenChange={setShowAddTenantDialog}
                    onAddTenant={handleAddTenant}
                    selectedHostel={selectedHostel}
                />
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
                                    {isLoading ? "..." : tenants.filter(t => t.invoiceStatus === 'unpaid').length}
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
                                    {isLoading ? "..." : tenants.reduce((sum, t) => sum + (t.rentAmount || 0), 0).toLocaleString('vi-VN')}₫
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
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                {tenants.length === 0
                                    ? `Chưa có khách thuê nào tại ${selectedHostel.ten_toa || selectedHostel.ten || selectedHostel.name || 'tòa nhà này'}`
                                    : 'Không tìm thấy khách thuê phù hợp'
                                }
                            </h3>
                            <p className="text-gray-500">
                                {tenants.length === 0
                                    ? 'Hãy thêm khách thuê mới để bắt đầu quản lý'
                                    : 'Thử thay đổi từ khóa tìm kiếm'
                                }
                            </p>
                            {tenants.length === 0 && (
                                <div className="mt-4">
                                    <AddTenantDialog
                                        isOpen={showAddTenantDialog}
                                        onOpenChange={setShowAddTenantDialog}
                                        onAddTenant={handleAddTenant}
                                        selectedHostel={selectedHostel}
                                    />
                                </div>
                            )}
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
                                                        {tenant.contractStart ? new Date(tenant.contractStart).toLocaleDateString('vi-VN') : 'N/A'} - {tenant.contractEnd ? new Date(tenant.contractEnd).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Tiền thuê:</span>
                                                    <span className="ml-1 font-medium text-green-600">
                                                        {tenant.rentAmount ? tenant.rentAmount.toLocaleString('vi-VN') : 'N/A'}₫/tháng
                                                    </span>
                                                </div>
                                                <div className="text-sm flex items-center space-x-2">
                                                    <span className="text-gray-500">Hóa đơn:</span>
                                                    {tenant.invoiceStatus === 'no_invoice' && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Chưa có hóa đơn
                                                        </span>
                                                    )}
                                                    {tenant.invoiceStatus === 'unpaid' && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            Chưa thanh toán
                                                        </span>
                                                    )}
                                                    {tenant.invoiceStatus === 'paid' && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Đã thanh toán
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {getStatusBadge(tenant.status)}
                                            <div className="flex space-x-2">

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedTenant(tenant)
                                                        setShowEditTenantDialog(true)
                                                    }}
                                                >
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

            {/* Tenant Detail Modal */}
            {showTenantModal && selectedTenant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Chi tiết khách thuê</h3>
                            <Button
                                variant="outline"
                                onClick={() => setShowTenantModal(false)}
                            >
                                ✕
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Họ tên</label>
                                    <p className="text-lg font-semibold">{selectedTenant.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                                    <p className="text-lg">{selectedTenant.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p className="text-lg">{selectedTenant.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Phòng</label>
                                    <p className="text-lg font-semibold text-blue-600">{selectedTenant.room}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Tiền thuê/tháng</label>
                                    <p className="text-lg font-semibold text-green-600">
                                        {selectedTenant.rentAmount ? selectedTenant.rentAmount.toLocaleString('vi-VN') : 'N/A'}₫
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedTenant.status)}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Thông tin hợp đồng</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Ngày bắt đầu</label>
                                        <p className="text-lg">
                                            {selectedTenant.contractStart ? new Date(selectedTenant.contractStart).toLocaleDateString('vi-VN') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Ngày kết thúc</label>
                                        <p className="text-lg">
                                            {selectedTenant.contractEnd ? new Date(selectedTenant.contractEnd).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t">
                                <Button variant="outline" onClick={() => setShowTenantModal(false)}>
                                    Đóng
                                </Button>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => {
                                        setShowTenantModal(false)
                                        setShowEditTenantDialog(true)
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Tenant Dialog */}
            <EditTenantDialog
                isOpen={showEditTenantDialog}
                onOpenChange={setShowEditTenantDialog}
                tenant={selectedTenant}
                onUpdateSuccess={handleUpdateTenant}
            />
        </div>
    )
}
