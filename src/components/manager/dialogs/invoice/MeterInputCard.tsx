import { Card, CardContent, CardHeader } from "@/components/admin/ui/card"
import { Zap, Droplets } from "lucide-react"
import { InvoiceData, BangGia } from "../../../../types/invoice.types"

interface MeterInputCardProps {
    type: 'electricity' | 'water'
    invoiceData: InvoiceData
    bangGia: BangGia
    onInputChange: (field: string, value: any) => void
}

export function MeterInputCard({ type, invoiceData, bangGia, onInputChange }: MeterInputCardProps) {
    const isElectricity = type === 'electricity'

    const config = {
        electricity: {
            icon: Zap,
            iconColor: 'text-yellow-500',
            title: 'Điện',
            oldField: 'chi_so_dien_cu',
            newField: 'chi_so_dien_moi',
            oldValue: invoiceData.chi_so_dien_cu,
            newValue: invoiceData.chi_so_dien_moi,
            price: bangGia.gia_dien || 0,
            unit: 'kWh',
            amount: invoiceData.tien_dien
        },
        water: {
            icon: Droplets,
            iconColor: 'text-blue-500',
            title: 'Nước',
            oldField: 'chi_so_nuoc_cu',
            newField: 'chi_so_nuoc_moi',
            oldValue: invoiceData.chi_so_nuoc_cu,
            newValue: invoiceData.chi_so_nuoc_moi,
            price: bangGia.gia_nuoc || 0,
            unit: 'm³',
            amount: invoiceData.tien_nuoc
        }
    }

    const { icon: Icon, iconColor, title, oldField, newField, oldValue, newValue, price, unit, amount } = config[type]

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center">
                    <Icon className={`h-5 w-5 ${iconColor} mr-2`} />
                    <h3 className="font-semibold">{title}</h3>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Chỉ số cũ</label>
                        <input
                            type="number"
                            value={oldValue}
                            onChange={(e) => onInputChange(oldField, parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Chỉ số mới</label>
                        <input
                            type="number"
                            value={newValue}
                            onChange={(e) => onInputChange(newField, parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">
                        {price.toLocaleString('vi-VN')}₫/{unit}
                    </span>
                    <span className="font-semibold text-green-600">
                        {amount.toLocaleString('vi-VN')}₫
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
