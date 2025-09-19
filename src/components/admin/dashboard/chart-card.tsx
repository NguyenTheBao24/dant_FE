import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { ResponsiveContainer } from "recharts"

interface ChartCardProps {
    title: string
    children: React.ReactElement
}

export function ChartCard({ title, children }: ChartCardProps) {
    return (
        <Card className="overflow-hidden border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-xl font-bold text-gray-900">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={320}>
                    {children}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
