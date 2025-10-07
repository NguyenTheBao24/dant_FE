import { ChartCard } from "@/components/admin/dashboard/chart-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MonthlyStats {
    month: string
    revenue: number
    expenses: number
    profit: number
    occupancy: number
}

interface RevenueChartsProps {
    monthlyStats: MonthlyStats[]
}

export function RevenueCharts({ monthlyStats }: RevenueChartsProps) {
    return (
        <>
            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Biểu đồ Doanh thu */}
                <ChartCard title="Doanh thu theo tháng">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [
                                    `${Number(value).toLocaleString('vi-VN')}₫`,
                                    'Doanh thu'
                                ]}
                            />
                            <Bar
                                dataKey="revenue"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Biểu đồ Chi phí */}
                <ChartCard title="Chi phí theo tháng">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [
                                    `${Number(value).toLocaleString('vi-VN')}₫`,
                                    'Chi phí'
                                ]}
                            />
                            <Bar
                                dataKey="expenses"
                                fill="#ef4444"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Biểu đồ Lợi nhuận */}
            <div className="grid gap-6">
                <ChartCard title="Lợi nhuận theo tháng">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [
                                    `${Number(value).toLocaleString('vi-VN')}₫`,
                                    'Lợi nhuận'
                                ]}
                            />
                            <Bar
                                dataKey="profit"
                                fill="#f59e0b"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </>
    )
}
