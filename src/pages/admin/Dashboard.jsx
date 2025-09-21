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
import { getHostels, updateManager, createHostel, deleteHostel, updateHostelOccupancy, calculateAndUpdateHostelOccupancy } from "@/services/hostels.service"
import { getTenants, getTenantsByHostel, createTenant, updateTenant, deleteTenant } from "@/services/tenants.service"
import { getEmployees, getNotifications, getRevenueData, getExpenseCategories } from "@/services/dashboard.service"

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
                // Load hostels
                const hostelsData = await getHostels()
                if (hostelsData && hostelsData.length > 0) {
                    // Tính toán occupancy cho từng khu trọ
                    const hostelsWithUpdatedOccupancy = await Promise.all(
                        hostelsData.map(async (hostel) => {
                            const updatedHostel = await calculateAndUpdateHostelOccupancy(hostel.id)
                            return { ...hostel, occupancy: updatedHostel.occupancy }
                        })
                    )
                    setHostelList(hostelsWithUpdatedOccupancy)
                    setSelectedHostel(hostelsWithUpdatedOccupancy[0])
                }

                // Load tenants
                const tenantsData = await getTenants()
                if (tenantsData && tenantsData.length > 0) {
                    setTenants(tenantsData)
                }

                // Load chart data
                const [revenueData, expenseData, notificationsData] = await Promise.all([
                    getRevenueData(),
                    getExpenseCategories(),
                    getNotifications()
                ])

                setChartData({
                    revenue: revenueData || [],
                    expenseCategories: expenseData || [],
                    notifications: notificationsData || [],
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

    // Load tenants when selectedHostel changes
    useEffect(() => {
        const loadTenantsForHostel = async () => {
            if (!selectedHostel?.id) return

            console.log('Loading tenants for hostel:', selectedHostel.id, selectedHostel.name)

            try {
                const tenantsData = await getTenantsByHostel(selectedHostel.id)
                console.log('Tenants from getTenantsByHostel:', tenantsData)

                if (tenantsData && tenantsData.length > 0) {
                    setTenants(tenantsData)
                } else {
                    // If no tenants found for this hostel, try to get all tenants and filter
                    const allTenants = await getTenants()
                    console.log('All tenants from getTenants:', allTenants)

                    if (allTenants) {
                        const filtered = allTenants.filter(t => (t.hostel_id || t.hostelId) === selectedHostel.id)
                        console.log('Filtered tenants:', filtered)
                        setTenants(filtered)
                    }
                }
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
                    // Try to update in Supabase first
                    if (selectedHostel.manager?.id) {
                        await updateManager(selectedHostel.manager.id, manager)
                    }
                } catch (error) {
                    console.error('Failed to update manager in Supabase:', error)
                    // Continue with local update even if Supabase fails
                }

                // Update local state
                const updatedHostel = { ...selectedHostel, manager: { ...selectedHostel.manager, ...manager } }
                setSelectedHostel(updatedHostel)
                setHostelList(prev => prev.map(h => h.id === updatedHostel.id ? updatedHostel : h))
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
                        onAddTenant={async (payload) => {
                            try {
                                const newTenant = {
                                    name: payload.name,
                                    room_number: payload.roomNumber,
                                    address: payload.address,
                                    phone: payload.phone,
                                    emergency_phone: payload.emergencyPhone,
                                    months_rented: Number(payload.rentMonths || 0),
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
                                    address: payload.address,
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
                        onExportTenant={exportTenant}
                        onDeleteTenant={handleDeleteTenant}
                        onGenerateContract={generateContract}
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
                                await deleteHostel(hostelId)
                                const updated = hostelList.filter(h => h.id !== hostelId)
                                setHostelList(updated)
                                if (selectedHostel?.id === hostelId) {
                                    setSelectedHostel(updated[0] || null)
                                }
                            } catch (error) {
                                console.error('Failed to delete hostel:', error)
                                alert('Lỗi khi xóa khu trọ!')
                            }
                        }}
                        onSubmit={async (payload) => {
                            try {
                                const newHostel = await createHostel({
                                    name: payload.name,
                                    address: payload.address,
                                    rooms: payload.rooms,
                                    occupancy: 0,
                                    type: payload.type,
                                    note: payload.note,
                                })
                                console.log('Created hostel:', newHostel);
                                if (newHostel) {
                                    const hostelWithManager = {
                                        ...newHostel,
                                        manager: {
                                            id: null,
                                            name: 'Chưa có quản lý',
                                            phone: '',
                                            email: '',
                                            avatar: '',
                                            experience: ''
                                        }
                                    }
                                    console.log('Hostel with manager:', hostelWithManager);

                                    setHostelList(prev => [...prev, hostelWithManager])
                                    setSelectedHostel(hostelWithManager)
                                    alert('Tạo khu trọ thành công!')
                                } else {
                                    alert('Không thể tạo khu trọ. Vui lòng kiểm tra kết nối Supabase.')
                                }
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
