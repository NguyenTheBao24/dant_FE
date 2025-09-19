"use client"

import { LayoutDashboard, Users, UserCheck, TrendingUp, Bell, Building2, PlusSquare } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent } from "@/components/admin/ui/card"

interface SidebarProps {
    activeTab: string
    selectedHostel: any
    onTabChange: (tab: string) => void
}

export function DashboardSidebar({ activeTab, selectedHostel, onTabChange }: SidebarProps) {
    return (
        <aside className="w-80 border-r border-gray-200 bg-white">
            <div className="p-6">
                <Card className="mb-8 border-0 shadow-lg bg-blue-50">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-2">{selectedHostel.name}</h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selectedHostel.address}</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <div className="font-bold text-lg text-gray-900">{selectedHostel.rooms}</div>
                                    <div className="text-xs text-gray-600 font-medium">Tổng phòng</div>
                                </div>
                                <div className="bg-blue-100 rounded-xl p-3 border border-blue-200">
                                    <div className="font-bold text-lg text-blue-700">{selectedHostel.occupancy}</div>
                                    <div className="text-xs text-blue-600 font-medium">Đã thuê</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1 font-medium">Quản lý</div>
                                <div className="font-semibold text-gray-900">{selectedHostel.manager.name}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <nav className="space-y-3">
                    <Button
                        variant={activeTab === "overview" ? "default" : "ghost"}
                        className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "overview"
                            ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
                            : "hover:bg-gray-100 hover:shadow-md"
                            }`}
                        onClick={() => onTabChange("overview")}
                    >
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        <span className="font-semibold">Tổng quan</span>
                    </Button>

                    <Button
                        variant={activeTab === "add-hostel" ? "default" : "ghost"}
                        className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "add-hostel"
                            ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
                            : "hover:bg-gray-100 hover:shadow-md"
                            }`}
                        onClick={() => onTabChange("add-hostel")}
                    >
                        <PlusSquare className="mr-3 h-5 w-5" />
                        <span className="font-semibold">Thêm khu trọ mới</span>
                    </Button>

                    <Button
                        variant={activeTab === "customers" ? "default" : "ghost"}
                        className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "customers"
                            ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
                            : "hover:bg-gray-100 hover:shadow-md"
                            }`}
                        onClick={() => onTabChange("customers")}
                    >
                        <Users className="mr-3 h-5 w-5" />
                        <span className="font-semibold">Quản lý khách thuê</span>
                    </Button>

                    <Button
                        variant={activeTab === "contact" ? "default" : "ghost"}
                        className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "contact"
                            ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
                            : "hover:bg-gray-100 hover:shadow-md"
                            }`}
                        onClick={() => onTabChange("contact")}
                    >
                        <UserCheck className="mr-3 h-5 w-5" />
                        <span className="font-semibold">Nhân viên liên hệ</span>
                    </Button>

                    <Button
                        variant={activeTab === "analytics" ? "default" : "ghost"}
                        className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "analytics"
                            ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
                            : "hover:bg-gray-100 hover:shadow-md"
                            }`}
                        onClick={() => onTabChange("analytics")}
                    >
                        <TrendingUp className="mr-3 h-5 w-5" />
                        <span className="font-semibold">Thống kê & Báo cáo</span>
                    </Button>

                    <Button
                        variant={activeTab === "notifications" ? "default" : "ghost"}
                        className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "notifications"
                            ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
                            : "hover:bg-gray-100 hover:shadow-md"
                            }`}
                        onClick={() => onTabChange("notifications")}
                    >
                        <Bell className="mr-3 h-5 w-5" />
                        <span className="font-semibold">Thông báo</span>
                    </Button>
                </nav>
            </div>
        </aside>
    )
}
