import { Card, CardContent } from "@/components/admin/ui/card"
import { FileText } from "lucide-react"

interface ContractsPageProps {
    userContracts: any[]
    invoiceData?: any
}

export function ContractsPage({ userContracts: _, invoiceData }: ContractsPageProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Hợp đồng thuê
                </h2>
                <p className="text-gray-600 mt-1">
                    Quản lý và theo dõi các hợp đồng thuê phòng của bạn
                </p>
            </div>

            {/* Placeholder */}
            <Card>
                <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Quản lý hợp đồng</h3>
                    <p className="text-gray-500">Tính năng đang được phát triển</p>
                </CardContent>
            </Card>
        </div>
    )
}