"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import logoHome from "@/assets/logoHome.png"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

interface HeaderProps {
    selectedHostel: any
    hostels: any[]
    searchTerm: string
    onHostelChange: (hostel: any) => void
    onSearchChange: (term: string) => void
}

export function DashboardHeader({ selectedHostel, hostels, onHostelChange, }: HeaderProps) {
    const navigate = useNavigate()
    return (
        <header className="border-b border-gray-200 bg-white shadow-sm">
            <div className="flex h-16 items-center px-6">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-1 rounded-xl bg-white shadow-lg">
                            <img src={logoHome} alt="Logo" className="h-8 w-8 object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="h-6 w-px bg-gray-300"></div>
                        <Select
                            value={selectedHostel?.id.toString()}
                            onValueChange={(value) => {
                                const hostel = hostels.find((h) => h.id === Number.parseInt(value))
                                if (hostel) onHostelChange(hostel)
                            }}
                        >
                            <SelectTrigger className="w-72 border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                                position="item-aligned"
                                side="bottom"
                                align="start"
                                avoidCollisions={false} className="border-slate-200 bg-white/95 backdrop-blur-md translate-y-10 ">
                                {hostels.map((hostel) => (
                                    <SelectItem key={hostel.id} value={hostel.id.toString()} className="hover:bg-slate-50">
                                        <div className="flex flex-col py-1">
                                            <span className="font-medium text-slate-900">{hostel.name}</span>
                                            <span className="text-xs text-slate-500">{hostel.address}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="ml-auto">
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 transition-colors shadow-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                    </button>
                </div>

            </div>
        </header>
    )
}
