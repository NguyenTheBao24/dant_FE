import { StatsCard } from "@/components/admin/dashboard/stats-card"
import { ChartCard } from "@/components/admin/dashboard/chart-card"
import { Button } from "@/components/admin/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"
import { DollarSign, CreditCard, TrendingUp, Activity, Filter } from "lucide-react"

interface AnalyticsPageProps {
    chartData: {
        revenue: any[]
        expenseCategories: any[]
    }
}

export function AnalyticsPage({ chartData }: AnalyticsPageProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Thống kê & Báo cáo</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Bộ lọc
                    </Button>
                    <Button>Xuất báo cáo</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Doanh thu tháng này" value="67,000,000₫" change="+12% so với tháng trước" icon={DollarSign} />
                <StatsCard title="Chi phí tháng này" value="42,000,000₫" change="+8% so với tháng trước" icon={CreditCard} />
                <StatsCard title="Lợi nhuận" value="25,000,000₫" change="+18% so với tháng trước" icon={TrendingUp} />
                <StatsCard title="Tỷ suất lợi nhuận" value="37.3%" change="+2.1% so với tháng trước" icon={Activity} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <ChartCard title="Xu hướng doanh thu">
                    <LineChart data={chartData.revenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
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
