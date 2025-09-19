"use client"

import { useState } from "react"
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

    const filteredTenants = tenants
        .filter((tenant) => tenant.hostelId === selectedHostel.id)
        .filter(
            (tenant) =>
                tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tenant.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tenant.phone.includes(searchTerm),
        )

    const generateContract = (tenant) => {
        console.log(`Generating contract for ${tenant.name}`)
        alert(`Đang tạo hợp đồng thuê cho ${tenant.name}...`)
    }

    const editTenant = (updatedTenant) => {
        setTenants(prev => prev.map(t => t.id === updatedTenant.id ? { ...t, ...updatedTenant } : t))
    }

    const exportTenant = (tenant) => {
        const csvHeader = ['id', 'name', 'roomNumber', 'address', 'phone', 'emergencyPhone', 'rentMonths', 'status', 'hostelId']
        const row = [tenant.id, tenant.name, tenant.roomNumber, tenant.address, tenant.phone, tenant.emergencyPhone, tenant.rentMonths, tenant.status, tenant.hostelId]
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

    const deleteTenant = (tenant) => {
        if (!confirm(`Xóa khách thuê "${tenant.name}"?`)) return
        setTenants(prev => prev.filter(t => t.id !== tenant.id))
    }

    const handleManagerAction = (action, manager) => {
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
                // Persist manager updates into selectedHostel and hostelList
                if (!selectedHostel) break
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

    const chartData = {
        revenue: revenueData,
        expenseCategories: expenseCategories,
        notifications: notifications,
    }

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
                        onAddTenant={(payload) => {
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
                        }}
                        onEditTenant={editTenant}
                        onExportTenant={exportTenant}
                        onDeleteTenant={deleteTenant}
                        onGenerateContract={generateContract}
                    />
                )
            case "contact":
                return <ContactPage selectedHostel={selectedHostel} onManagerAction={handleManagerAction} />
            case "analytics":
                return <AnalyticsPage chartData={chartData} />
            case "notifications":
                return <NotificationsPage notifications={notifications} />
            case "add-hostel":
                return (
                    <AddHostelPage
                        hostels={hostelList}
                        onDelete={(hostelId) => {
                            const updated = hostelList.filter(h => h.id !== hostelId)
                            setHostelList(updated)
                            if (selectedHostel?.id === hostelId) {
                                setSelectedHostel(updated[0] || null)
                            }
                        }}
                        onSubmit={(payload) => {
                            const newHostel = {
                                id: hostelList.length ? Math.max(...hostelList.map(h => h.id)) + 1 : 1,
                                name: payload.name,
                                address: payload.address,
                                rooms: payload.rooms,
                                occupancy: 0,
                                manager: {
                                    id: hostelList.length ? Math.max(...hostelList.map(h => h.manager?.id || 0)) + 1 : 1,
                                    name: payload.managerName || "Quản lý",
                                    phone: payload.managerPhone || "",
                                    email: "",
                                    avatar: "",
                                    experience: "",
                                    specialties: [],
                                },
                                type: payload.type,
                                note: payload.note,
                            }
                            const updated = [...hostelList, newHostel]
                            setHostelList(updated)
                            setSelectedHostel(newHostel)
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
