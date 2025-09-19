"use client"

import { Calendar, DollarSign, Users, Activity, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface OverviewTabProps {
    selectedHostel: any
    chartData: any[]
}

export function OverviewTab({ selectedHostel, chartData }: OverviewTabProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                        Tổng quan
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 text-lg">{selectedHostel.name}</p>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-slate-700">Tháng 12, 2024</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-green-800 dark:text-green-200">Tổng doanh thu</CardTitle>
                        <div className="p-2 bg-green-100 rounded-lg dark:bg-green-800/30">
                            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">328,000,000₫</div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">+20.1% so với tháng trước</p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-200">Khách thuê</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-800/30">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{selectedHostel.occupancy}</div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            +{selectedHostel.occupancy - 180} khách mới tháng này
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-purple-800 dark:text-purple-200">Tỷ lệ lấp đầy</CardTitle>
                        <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-800/30">
                            <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {Math.round((selectedHostel.occupancy / selectedHostel.rooms) * 100)}%
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">+5% so với tháng trước</p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-orange-800 dark:text-orange-200">Tăng trưởng</CardTitle>
                        <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-800/30">
                            <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">+12.5%</div>
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">So với cùng kỳ năm trước</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Doanh thu theo tháng</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="name" className="text-sm" />
                            <YAxis className="text-sm" />
                            <Tooltip
                                formatter={(value) => [`${value.toLocaleString()}₫`, "Doanh thu"]}
                                labelStyle={{ color: "#374151" }}
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    backdropFilter: "blur(8px)",
                                }}
                            />
                            <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#1d4ed8" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
