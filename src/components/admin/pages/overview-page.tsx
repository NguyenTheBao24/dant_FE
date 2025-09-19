import { StatsCard } from "@/components/admin/dashboard/stats-card"
import { ChartCard } from "@/components/admin/dashboard/chart-card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"
import { DollarSign, Users, TrendingUp, Building2 } from "lucide-react"

interface OverviewPageProps {
    selectedHostel: any
    chartData: {
        revenue: any[]
        expenseCategories: any[]
    }
}

export function OverviewPage({ selectedHostel, chartData }: OverviewPageProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-blue-600">
                        Tổng quan
                    </h2>
                    <p className="text-gray-600">Thống kê tổng quan khu trọ {selectedHostel.name}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Tổng khách thuê"
                    value="24"
                    change="+12% so với tháng trước"
                    icon={Users}
                    gradient="bg-gradient-to-br from-blue-100 to-blue-200"
                />
                <StatsCard
                    title="Doanh thu tháng"
                    value="67,000,000₫"
                    change="+8% so với tháng trước"
                    icon={DollarSign}
                    gradient="bg-gradient-to-br from-green-100 to-green-200"
                />
                <StatsCard
                    title="Tỷ lệ lấp đầy"
                    value={`${Math.round((selectedHostel.occupancy / selectedHostel.rooms) * 100)}%`}
                    change="+5% so với tháng trước"
                    icon={Building2}
                    gradient="bg-gradient-to-br from-purple-100 to-purple-200"
                />
                <StatsCard
                    title="Tăng trưởng"
                    value="+15.2%"
                    change="Tăng đều trong 3 tháng"
                    icon={TrendingUp}
                    gradient="bg-gradient-to-br from-orange-100 to-orange-200"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title="Xu hướng doanh thu">
                    <LineChart data={chartData.revenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="expense" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                </ChartCard>

                <ChartCard title="Phân bổ chi phí">
                    <PieChart>
                        <Pie
                            data={chartData.expenseCategories}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.expenseCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
                    </PieChart>
                </ChartCard>
            </div>
        </div>
    )
}
