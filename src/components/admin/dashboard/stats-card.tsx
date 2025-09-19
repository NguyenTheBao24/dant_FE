import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string
    change: string
    icon: LucideIcon
    gradient?: string
}

export function StatsCard({ title, value, change, icon: Icon, gradient }: StatsCardProps) {
    return (
        <Card
            className={`overflow-hidden border-0 shadow-lg ${gradient || "bg-white"} hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-blue-700">{title}</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-md">
                    <Icon className="h-5 w-5 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                    {value}
                </div>
                <p className="text-xs text-green-600 font-semibold flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    {change}
                </p>
            </CardContent>
        </Card>
    )
}
