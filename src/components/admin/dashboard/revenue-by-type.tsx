import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Badge } from "@/components/admin/ui/badge"
import { ChartCard } from "@/components/admin/dashboard/chart-card"
import { TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueByRoomType {
    roomType: string
    count: number
    totalRevenue: number
    avgRevenue: number
}

interface RevenueByTypeProps {
    revenueByRoomType: RevenueByRoomType[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function RevenueByType({ revenueByRoomType }: RevenueByTypeProps) {
    if (revenueByRoomType.length === 0) {
        return null
    }

    return (
        <>
            {/* Biểu đồ phân bổ doanh thu theo loại phòng */}
            <div className="grid gap-6">
                <ChartCard title="Phân bổ doanh thu theo loại phòng">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={revenueByRoomType}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="totalRevenue"
                            >
                                {revenueByRoomType.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')}₫`} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Chi tiết theo loại phòng */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                        Doanh thu theo loại phòng
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Phân tích doanh thu chi tiết theo từng loại phòng
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {revenueByRoomType.map((type, index) => (
                            <div key={type.roomType} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{type.roomType}</h3>
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                        {type.count} phòng
                                    </Badge>
                                </div>
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {type.totalRevenue.toLocaleString('vi-VN')}₫
                                </div>
                                <div className="text-sm text-gray-600">
                                    Trung bình: {type.avgRevenue.toLocaleString('vi-VN')}₫/phòng
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="h-2 rounded-full"
                                        style={{
                                            width: `${(type.totalRevenue / Math.max(...revenueByRoomType.map(t => t.totalRevenue))) * 100}%`,
                                            backgroundColor: COLORS[index % COLORS.length]
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
