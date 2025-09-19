"use client"

import { Card, CardContent } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
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
    }
    hostel: {
        name: string
        rooms: number
        occupancy: number
    }
    onAction: (action: string, manager: any) => void
}

export function ManagerProfile({ manager, hostel, onAction }: ManagerProfileProps) {
    return (
        <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
                    <div className="flex items-start space-x-6">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-4 ring-primary/20">
                            <AvatarImage src={manager.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                                {manager.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{manager.name}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg">Quản lý khu trọ</p>
                                    <div className="flex items-center space-x-6 mt-3">
                                        <div className="flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-full">
                                            <Phone className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">{manager.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-full">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">{manager.email}</span>
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
                                    <span className="font-medium">{manager.experience}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Khu trọ quản lý:</span>
                                    <span className="font-medium">{hostel.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tổng số phòng:</span>
                                    <span className="font-medium">{hostel.rooms} phòng</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tỷ lệ lấp đầy:</span>
                                    <span className="font-medium text-primary">
                                        {Math.round((hostel.occupancy / hostel.rooms) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
