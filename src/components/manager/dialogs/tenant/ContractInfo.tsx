import { Label } from "@/components/admin/ui/label"
import { formatDate } from "../../../../utils/tenant.utils"

interface ContractInfoProps {
    rentMonths: number
}

export function ContractInfo({ rentMonths }: ContractInfoProps) {
    const today = new Date()
    const endDate = new Date(today.getFullYear(), today.getMonth() + rentMonths, today.getDate())

    return (
        <div className="space-y-2">
            <Label>Thông tin hợp đồng</Label>
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="text-sm font-medium text-green-800">
                    Ngày bắt đầu: {formatDate(today.toISOString())}
                </div>
                <div className="text-sm font-medium text-green-800">
                    Ngày kết thúc: {formatDate(endDate.toISOString())}
                </div>
                <div className="text-xs text-green-600">
                    Hợp đồng sẽ được tạo tự động khi lưu
                </div>
            </div>
        </div>
    )
}
