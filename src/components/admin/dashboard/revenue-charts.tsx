import { ChartCard } from "@/components/admin/dashboard/chart-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

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
            <div className="grid gap-6">
                <ChartCard title="Doanh thu – Chi tiêu – Lợi nhuận theo tháng">
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: number, name: string) => [
                                `${Number(value).toLocaleString('vi-VN')}₫`,
                                name === 'revenue' ? 'Doanh thu' : name === 'expenses' ? 'Chi tiêu' : 'Lợi nhuận'
                            ]} />
                            <Legend formatter={(value) => (
                                value === 'revenue' ? 'Doanh thu' : value === 'expenses' ? 'Chi tiêu' : 'Lợi nhuận'
                            )} />
                            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="profit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </>
    )
}
