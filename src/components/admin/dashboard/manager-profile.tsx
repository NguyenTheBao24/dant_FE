"use client"

import { Card, CardContent } from "@/components/admin/ui/card"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar"
import { Phone, Mail } from "lucide-react"

interface ManagerProfileProps {
    manager: {
        id: number
        name: string
        phone: string
        email: string
        avatar: string
        experience: string
        specialties: string[]
        username?: string
        role?: string
        password?: string
    }
    hostel: {
        name: string
        rooms: number
        occupancy: number
    }
    onAction: (action: string, manager: any) => void
}

export function ManagerProfile({ manager, hostel }: ManagerProfileProps) {
    const managerName = manager?.name && manager.name.trim() !== '' ? manager.name : 'Chưa cập nhật'
    const managerPhone = manager?.phone && manager.phone.trim() !== '' ? manager.phone : 'Chưa cập nhật'
    const managerEmail = manager?.email && manager.email.trim() !== '' ? manager.email : 'Chưa cập nhật'
    const managerExperience = manager?.experience && manager.experience.trim() !== '' ? manager.experience : 'Chưa cập nhật'
    const accountUsername = manager?.username && manager.username.trim() !== '' ? manager.username : 'Chưa cập nhật'
    const accountPassword = manager?.password && manager.password.trim() !== '' ? manager.password : '********'
    const totalRooms = Number(hostel?.rooms || 0)
    const occupied = Number(hostel?.occupancy || 0)
    const occupancyPct = totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0
    const initials = managerName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('') || 'QL'
    return (
        <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
                    <div className="flex items-start space-x-6">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-4 ring-primary/20">
                            <AvatarImage src={manager.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{managerName}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg">{managerName}</p>
                                    <div className="flex items-center space-x-6 mt-3">
                                        <div className="flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-full">
                                            <Phone className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">{managerPhone}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-full">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">{managerEmail}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <h4 className="font-semibold mb-3">Thông tin cơ bản</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Kinh nghiệm:</span>
                                    <span className="font-medium">{managerExperience}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Khu trọ quản lý:</span>
                                    <span className="font-medium">{hostel.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tổng số phòng:</span>
                                    <span className="font-medium">{totalRooms} phòng</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tỷ lệ lấp đầy:</span>
                                    <span className="font-medium text-primary">
                                        {occupancyPct}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Tài khoản</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Username:</span>
                                    <span className="font-medium">{accountUsername}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground mr-2">Password:</span>
                                    <span className="font-medium">{accountPassword}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
