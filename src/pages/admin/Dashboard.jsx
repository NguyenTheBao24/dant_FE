"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { CustomersTab } from "@/components/admin/dashboard/customers-tab"
import { OverviewPage } from "@/components/admin/pages/overview-page"
import { AnalyticsPage } from "@/components/admin/pages/analytics-page"
import { ContactPage } from "@/components/admin/pages/contact-page"
import { NotificationsPage } from "@/components/admin/pages/notifications-page"
import { AddHostelPage } from "@/components/admin/pages/add-hostel-page"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Badge } from "@/components/admin/ui/badge"
import { Key } from "lucide-react"

import { revenueData, tenantData, notifications, expenseCategories, hostels } from "@/data/dashboard-data"
import { createToaNha, deleteToaNha, listToaNha } from "@/services/toa-nha.service"
import { updateToaNha } from "@/services/toa-nha.service"
import { createQuanLy, updateQuanLy } from "@/services/quan-ly.service"
import { createTaiKhoan } from "@/services/tai-khoan.service"
import { createFixedCanHoForToaNha } from "@/services/can-ho.service"
import { listHopDongByToaNha } from "@/services/hop-dong.service"
// Removed old dashboard tables (notifications, revenue_data, expense_categories)

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTenant, setSelectedTenant] = useState(null)
    const [selectedManager, setSelectedManager] = useState(null)
    const [hostelList, setHostelList] = useState(hostels)
    const [selectedHostel, setSelectedHostel] = useState(hostels[0])
    const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)
    const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false)
    const [tenants, setTenants] = useState(tenantData)
    const [isLoading, setIsLoading] = useState(false)
    const [chartData, setChartData] = useState({
        revenue: revenueData,
        expenseCategories: expenseCategories,
        notifications: notifications,
    })

    const filteredTenants = tenants
        .filter((tenant) => selectedHostel && (tenant.hostel_id || tenant.hostelId) === selectedHostel.id)
        .filter((tenant) => tenant.status === 'active') // Chỉ hiển thị tenant active
        .filter(
            (tenant) =>
                tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (tenant.room_number || tenant.roomNumber)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tenant.phone.includes(searchTerm),
        )


    const generateContract = (tenant) => {
        console.log(`Generating contract for ${tenant.name}`)
        alert(`Đang tạo hợp đồng thuê cho ${tenant.name}...`)
    }

    const editTenant = async (updatedTenant) => {
        try {
            await updateTenant(updatedTenant.id, updatedTenant)
            setTenants(prev => prev.map(t => t.id === updatedTenant.id ? { ...t, ...updatedTenant } : t))
        } catch (error) {
            console.error('Failed to update tenant:', error)
            // Fallback to local state
            setTenants(prev => prev.map(t => t.id === updatedTenant.id ? { ...t, ...updatedTenant } : t))
        }
    }

    const exportTenant = (tenant) => {
        const csvHeader = ['id', 'name', 'roomNumber', 'address', 'phone', 'emergencyPhone', 'rentMonths', 'status', 'hostelId']
        const row = [
            tenant.id,
            tenant.name,
            tenant.room_number || tenant.roomNumber,
            tenant.address,
            tenant.phone,
            tenant.emergency_phone || tenant.emergencyPhone,
            tenant.months_rented || tenant.rentMonths,
            tenant.status,
            tenant.hostel_id || tenant.hostelId
        ]
        const csv = `${csvHeader.join(',')}\n${row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')}`
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tenant_${tenant.id}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleDeleteTenant = async (tenant) => {
        if (!confirm(`Xóa khách thuê "${tenant.name}"?`)) return
        try {
            await deleteTenant(tenant.id)
            setTenants(prev => prev.filter(t => t.id !== tenant.id))

            // Tính toán và cập nhật occupancy tự động
            const updatedHostel = await calculateAndUpdateHostelOccupancy(selectedHostel.id)

            // Cập nhật selectedHostel với occupancy mới
            setSelectedHostel(prev => ({
                ...prev,
                occupancy: updatedHostel.occupancy
            }))

            // Cập nhật hostelList với occupancy mới
            setHostelList(prev => prev.map(hostel =>
                hostel.id === selectedHostel.id
                    ? { ...hostel, occupancy: updatedHostel.occupancy }
                    : hostel
            ))
        } catch (error) {
            console.error('Failed to delete tenant:', error)
            // Fallback to local state
            setTenants(prev => prev.filter(t => t.id !== tenant.id))

            // Tính toán occupancy ngay cả khi có lỗi
            const updatedHostel = await calculateAndUpdateHostelOccupancy(selectedHostel.id)
            setSelectedHostel(prev => ({
                ...prev,
                occupancy: updatedHostel.occupancy
            }))
            setHostelList(prev => prev.map(hostel =>
                hostel.id === selectedHostel.id
                    ? { ...hostel, occupancy: updatedHostel.occupancy }
                    : hostel
            ))
        }
    }

    // Load all data from Supabase on component mount
    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true)
            try {
                // Load tòa nhà (schema mới)
                const toaNhaData = await listToaNha()
                const mappedHostels = (toaNhaData || []).map(t => ({
                    id: t.id,
                    name: t.ten_toa,
                    address: t.dia_chi,
                    rooms: 0,
                    occupancy: 0,
                    manager: t.quan_ly ? {
                        id: t.quan_ly.id,
                        name: t.quan_ly.ho_ten,
                        phone: t.quan_ly.sdt,
                        email: t.quan_ly.email,
                        avatar: '',
                        experience: ''
                    } : {
                        id: null,
                        name: 'Chưa có quản lý',
                        phone: '',
                        email: '',
                        avatar: '',
                        experience: ''
                    }
                }))
                if (mappedHostels.length) {
                    setHostelList(mappedHostels)
                    setSelectedHostel(mappedHostels[0])
                }

                // Bỏ gọi các bảng cũ (notifications, revenue_data, expense_categories)
                setChartData({
                    revenue: [],
                    expenseCategories: [],
                    notifications: [],
                })
            } catch (error) {
                console.error('Failed to load data from Supabase:', error)
                // Use fallback data if Supabase fails
                const fallbackHostels = [
                    {
                        id: 1,
                        name: "Khu trọ mẫu",
                        address: "123 Đường mẫu, Quận 1, TP.HCM",
                        rooms: 20,
                        occupancy: 15,
                        manager: {
                            id: 1,
                            name: "Quản lý mẫu",
                            phone: "0901234567",
                            email: "manager@example.com",
                            avatar: "",
                            experience: "3 năm",
                        }
                    }
                ]
                setHostelList(fallbackHostels)
                setSelectedHostel(fallbackHostels[0])
            } finally {
                setIsLoading(false)
            }
        }

        loadAllData()
    }, [])

    // Load tenants (map từ hợp đồng) khi selectedHostel thay đổi
    useEffect(() => {
        const loadTenantsForHostel = async () => {
            if (!selectedHostel?.id) return

            console.log('Loading tenants for hostel (toa_nha):', selectedHostel.id, selectedHostel.name)

            try {
                const contracts = await listHopDongByToaNha(selectedHostel.id)
                const mapped = (contracts || [])
                    .filter(h => h.trang_thai === 'hieu_luc')
                    .map(h => ({
                        id: h.khach_thue?.id,
                        name: h.khach_thue?.ho_ten,
                        phone: h.khach_thue?.sdt,
                        room_number: h.can_ho?.so_can,
                        status: 'active',
                        hostel_id: h.can_ho?.toa_nha_id,
                        months_rented: undefined,
                        emergency_phone: undefined,
                        rent_amount: h.can_ho?.gia_thue,
                        room_id: h.can_ho?.id,
                    }))
                setTenants(mapped)
            } catch (error) {
                console.error('Failed to load tenants for hostel:', error)
            }
        }

        loadTenantsForHostel()
    }, [selectedHostel])

    const handleManagerAction = async (action, manager) => {
        switch (action) {
            case "contact":
                window.open(`tel:${manager.phone}`)
                break
            case "email":
                window.open(`mailto:${manager.email}`)
                break
            case "settings":
                setSelectedManager(manager)
                setIsManagerDialogOpen(true)
                break
            case "update_manager": {
                if (!selectedHostel) break

                try {
                    let managerId = selectedHostel.manager?.id || null
                    let taiKhoanId = selectedHostel.manager?.tai_khoan_id || null
                    // Tạo mới hoặc cập nhật bảng quan_ly
                    if (managerId) {
                        await updateQuanLy(managerId, {
                            ho_ten: manager.name,
                            sdt: manager.phone,
                            email: manager.email,
                        })
                    } else {
                        // Tạo tài khoản cho quản lý nếu chưa có
                        if (!taiKhoanId) {
                            const username = manager.email || `manager_${Date.now()}`
                            const account = await createTaiKhoan({
                                username,
                                password: 'manager@123',
                                role: 'quan_ly'
                            })
                            taiKhoanId = account?.id || null
                        }
                        const created = await createQuanLy({
                            ho_ten: manager.name,
                            sdt: manager.phone,
                            email: manager.email,
                            tai_khoan_id: taiKhoanId,
                        })
                        managerId = created?.id || null
                    }

                    // Gán quản lý vào tòa nhà
                    if (managerId) {
                        await updateToaNha(selectedHostel.id, { quan_ly_id: managerId })
                    }
                } catch (error) {
                    console.error('Failed to persist manager to quan_ly/toa_nha:', error)
                }

                // Cập nhật local state
                const updatedHostel = { ...selectedHostel, manager: { ...selectedHostel.manager, ...manager } }
                setSelectedHostel(updatedHostel)
                setHostelList(prev => prev.map(h => h.id === updatedHostel.id ? updatedHostel : h))
                break
            }
            case "create_account": {
                if (!selectedHostel) break
                try {
                    const username = manager.email || `manager_${Date.now()}`
                    const account = await createTaiKhoan({
                        username,
                        password: 'manager@123',
                        role: 'quan_ly'
                    })

                    // Cập nhật quan_ly.tai_khoan_id nếu đã có quản lý
                    if (selectedHostel.manager?.id) {
                        await updateQuanLy(selectedHostel.manager.id, { tai_khoan_id: account.id })
                    }

                    // Update local state để hiển thị ngay username/role
                    const updatedHostel = {
                        ...selectedHostel,
                        manager: {
                            ...selectedHostel.manager,
                            username: account.username,
                            role: account.role,
                        }
                    }
                    setSelectedHostel(updatedHostel)
                    setHostelList(prev => prev.map(h => h.id === updatedHostel.id ? updatedHostel : h))
                    alert('Đã cấp tài khoản cho quản lý')
                } catch (error) {
                    console.error('Failed to create manager account:', error)
                    alert('Không thể cấp tài khoản. Vui lòng kiểm tra cấu hình Supabase và RLS.')
                }
                break
            }
            case "reports":
                alert(`Xem báo cáo của ${manager.name}`)
                break
            default:
                break
        }
    }

    // chartData is now managed by state

    const renderPage = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewPage selectedHostel={selectedHostel} chartData={chartData} />
            case "customers":
                return (
                    <CustomersTab
                        filteredTenants={filteredTenants}
                        isAddTenantOpen={isAddTenantOpen}
                        onAddTenantOpenChange={setIsAddTenantOpen}
                        selectedHostel={selectedHostel}
                        onAddTenant={async (payload) => {
                            try {
                                const newTenant = {
                                    name: payload.name,
                                    room_number: payload.roomNumber,
                                    phone: payload.phone,
                                    emergency_phone: payload.emergencyPhone,
                                    months_rented: Number(payload.rentMonths || 0),
                                    rent_amount: payload.rentAmount,
                                    room_id: payload.roomId,
                                    status: "active",
                                    hostel_id: selectedHostel.id,
                                }
                                const created = await createTenant(newTenant)
                                setTenants(prev => [...prev, created])

                                // Tính toán và cập nhật occupancy tự động
                                const updatedHostel = await calculateAndUpdateHostelOccupancy(selectedHostel.id)

                                // Cập nhật selectedHostel với occupancy mới
                                setSelectedHostel(prev => ({
                                    ...prev,
                                    occupancy: updatedHostel.occupancy
                                }))

                                // Cập nhật hostelList với occupancy mới
                                setHostelList(prev => prev.map(hostel =>
                                    hostel.id === selectedHostel.id
                                        ? { ...hostel, occupancy: updatedHostel.occupancy }
                                        : hostel
                                ))
                            } catch (error) {
                                console.error('Failed to create tenant:', error)
                                // Fallback to local state
                                const nextId = tenants.length ? Math.max(...tenants.map(t => t.id)) + 1 : 1
                                const newTenant = {
                                    id: nextId,
                                    name: payload.name,
                                    roomNumber: payload.roomNumber,
                                    address: payload.address, // Chỉ lưu local cho fallback
                                    phone: payload.phone,
                                    emergencyPhone: payload.emergencyPhone,
                                    rentMonths: Number(payload.rentMonths || 0),
                                    status: "active",
                                    hostelId: selectedHostel.id,
                                }
                                setTenants(prev => [...prev, newTenant])
                            }
                        }}
                        onEditTenant={editTenant}
                        onDeleteTenant={handleDeleteTenant}
                    />
                )
            case "contact":
                return <ContactPage selectedHostel={selectedHostel} onManagerAction={handleManagerAction} />
            case "analytics":
                return <AnalyticsPage chartData={chartData} />
            case "notifications":
                return <NotificationsPage notifications={chartData.notifications} />
            case "add-hostel":
                return (
                    <AddHostelPage
                        hostels={hostelList}
                        onDelete={async (hostelId) => {
                            if (!confirm('Xóa khu trọ này?')) return
                            try {
                                await deleteToaNha(hostelId)
                                const updated = hostelList.filter(h => h.id !== hostelId)
                                setHostelList(updated)
                                if (selectedHostel?.id === hostelId) {
                                    setSelectedHostel(updated[0] || null)
                                }
                            } catch (error) {
                                console.error('Failed to delete hostel:', error)
                                alert('Lỗi khi xóa tòa nhà!')
                            }
                        }}
                        onSubmit={async (payload) => {
                            try {
                                // payload từ AddHostelPage: { ten_toa, dia_chi, quan_ly_id }
                                const created = await createToaNha({
                                    ten_toa: payload.ten_toa,
                                    dia_chi: payload.dia_chi,
                                    quan_ly_id: payload.quan_ly_id || null,
                                })
                                if (!created) {
                                    alert('Không thể tạo tòa nhà. Vui lòng kiểm tra kết nối Supabase.')
                                    return
                                }

                                // Tạo căn hộ cố định sau khi tạo tòa nhà
                                try {
                                    const total = Number(payload.so_can_ho || 10)
                                    await createFixedCanHoForToaNha(created.id, total)
                                } catch (e) {
                                    console.error('Không thể tạo căn hộ cố định:', e)
                                }

                                const mappedHostel = {
                                    id: created.id,
                                    name: created.ten_toa,
                                    address: created.dia_chi,
                                    rooms: Number(payload.so_can_ho || 0),
                                    occupancy: 0,
                                    manager: {
                                        id: created.quan_ly_id || null,
                                        name: 'Chưa có quản lý',
                                        phone: '',
                                        email: '',
                                        avatar: '',
                                        experience: ''
                                    }
                                }

                                setHostelList(prev => [...prev, mappedHostel])
                                setSelectedHostel(mappedHostel)
                                alert('Tạo tòa nhà thành công!')
                            }
                            catch (error) {
                                console.error('Failed to create hostel:', error)

                                // Fallback: create locally if Supabase fails

                            }
                        }}
                    />
                )
            default:
                return <OverviewPage selectedHostel={selectedHostel} chartData={chartData} />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                selectedHostel={selectedHostel}
                hostels={hostelList}
                searchTerm={searchTerm}
                onHostelChange={setSelectedHostel}
                onSearchChange={setSearchTerm}
            />

            <div className="flex h-[calc(100vh-64px)]">
                <DashboardSidebar activeTab={activeTab} selectedHostel={selectedHostel} onTabChange={setActiveTab} />

                <main className="flex-1 overflow-auto bg-white">
                    <div className="p-6 lg:p-8">
                        <div className="transition-all duration-500 ease-out transform animate-in fade-in-0 slide-in-from-bottom-4">
                            {renderPage()}
                        </div>
                    </div>
                </main>
            </div>

            <Dialog open={isManagerDialogOpen} onOpenChange={setIsManagerDialogOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            Cài đặt quản lý - {selectedManager?.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 text-base">
                            Cấu hình quyền hạn và chức năng cho quản lý khu trọ.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-6">
                        <div className="space-y-5">
                            <h4 className="font-semibold flex items-center text-gray-900">
                                <Key className="mr-3 h-5 w-5 text-blue-600" />
                                Quyền hạn
                            </h4>

                            <div className="grid gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="text-sm font-medium text-gray-700">Quản lý khách thuê</span>
                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                        Có quyền
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="text-sm font-medium text-gray-700">Thu chi tiền thuê</span>
                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                        Có quyền
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="text-sm font-medium text-gray-700">Bảo trì sửa chữa</span>
                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                        Có quyền
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="text-sm font-medium text-gray-700">Xem báo cáo tài chính</span>
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                        Hạn chế
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <h4 className="font-semibold text-gray-900">Thông tin liên hệ khẩn cấp</h4>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="emergency-contact" className="text-sm font-medium text-gray-700">
                                            Người liên hệ khẩn cấp
                                        </Label>
                                        <Input
                                            id="emergency-contact"
                                            placeholder="Tên người liên hệ"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="emergency-phone" className="text-sm font-medium text-gray-700">
                                            SĐT khẩn cấp
                                        </Label>
                                        <Input
                                            id="emergency-phone"
                                            placeholder="0123456789"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button
                            variant="outline"
                            onClick={() => setIsManagerDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button type="submit">
                            Lưu thay đổi
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
