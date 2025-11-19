import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { TenantFormData } from "../../../../types/tenant.types"

interface TenantFormFieldsProps {
    formData: TenantFormData
    onFormFieldChange: (field: keyof TenantFormData, value: string | number) => void
}

export function TenantFormFields({ formData, onFormFieldChange }: TenantFormFieldsProps) {
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="tenant-name">Tên khách thuê</Label>
                    <Input
                        id="tenant-name"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => onFormFieldChange('name', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                        id="phone"
                        placeholder="0123456789"
                        value={formData.phone}
                        onChange={(e) => onFormFieldChange('phone', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ cư trú</Label>
                <Textarea
                    id="address"
                    placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                    value={formData.address}
                    onChange={(e) => onFormFieldChange('address', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email (tùy chọn)</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="nguyenvana@email.com"
                        value={formData.email || ''}
                        onChange={(e) => onFormFieldChange('email', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cccd">CCCD (tùy chọn)</Label>
                    <Input
                        id="cccd"
                        placeholder="123456789"
                        value={formData.cccd || ''}
                        onChange={(e) => onFormFieldChange('cccd', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="rent-months">Số tháng thuê</Label>
                <Input
                    id="rent-months"
                    type="number"
                    placeholder="12"
                    value={formData.rentMonths}
                    onChange={(e) => onFormFieldChange('rentMonths', Number(e.target.value) || 0)}
                />
            </div>
        </>
    )
}
