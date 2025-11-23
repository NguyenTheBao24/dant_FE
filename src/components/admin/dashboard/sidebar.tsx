"use client";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Bell,
  Building2,
  PlusSquare,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";

interface SidebarProps {
  activeTab: string;
  selectedHostel: any;
  occupiedRoomsCount: number;
  onTabChange: (tab: string) => void;
}

export function DashboardSidebar({
  activeTab,
  selectedHostel,
  occupiedRoomsCount,
  onTabChange,
}: SidebarProps) {
  return (
    console.log("selectedHostel", selectedHostel),
    (
      <aside className="w-80 border-r border-gray-200 bg-white">
        <div className="p-6">
          <Card className="mb-8 border-0 shadow-lg bg-blue-50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {selectedHostel?.address || ""}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-3 border border-gray-200">
                    <div className="font-bold text-lg text-gray-900">
                      {selectedHostel?.rooms || 0}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Tổng phòng
                    </div>
                  </div>
                  <div className="bg-blue-100 rounded-xl p-3 border border-blue-200">
                    <div className="font-bold text-lg text-blue-700">
                      {occupiedRoomsCount}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      Đã thuê
                    </div>
                  </div>
                </div>

                {/* Hiển thị tỷ lệ lấp đầy */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-green-600 font-medium">
                      Tỷ lệ lấp đầy
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {selectedHostel?.rooms > 0
                        ? Math.round(
                          (occupiedRoomsCount / selectedHostel.rooms) * 100
                        )
                        : 0}
                      %
                    </div>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${selectedHostel?.rooms > 0
                            ? Math.round(
                              (occupiedRoomsCount / selectedHostel.rooms) *
                              100
                            )
                            : 0
                          }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1 font-medium">
                    Quản lý
                  </div>
                  <div className="font-semibold text-gray-900">
                    {selectedHostel?.manager?.name || "Chưa có quản lý"}
                  </div>
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
              <span className="font-semibold">Quản lý khu trọ</span>
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
              <span className="font-semibold">Quản lý quản lý</span>
            </Button>

            <Button
              variant={activeTab === "expenses" ? "default" : "ghost"}
              className={`w-full justify-start h-12 transition-all duration-300 rounded-xl ${activeTab === "expenses"
                  ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
                  : "hover:bg-gray-100 hover:shadow-md"
                }`}
              onClick={() => onTabChange("expenses")}
            >
              <DollarSign className="mr-3 h-5 w-5" />
              <span className="font-semibold">Chi tiêu</span>
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
  );
}
