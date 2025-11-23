"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { updateCanHo } from "@/services/can-ho.service"
import { DollarSign } from "lucide-react"

interface UpdateRoomPriceDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    tenant: any
    onSuccess?: () => void
}

export function UpdateRoomPriceDialog({
    isOpen,
    onOpenChange,
    tenant,
    onSuccess
}: UpdateRoomPriceDialogProps) {
    const [price, setPrice] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (isOpen && tenant) {
            // Lấy giá hiện tại từ tenant hoặc room
            const currentPrice = tenant.rent_amount || tenant.room?.gia_thue || 0
            setPrice(currentPrice.toString())
            setError("")
        }
    }, [isOpen, tenant])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const priceNumber = Number(price.replace(/[^\d]/g, ""))

        if (!priceNumber || priceNumber <= 0) {
            setError("Vui lòng nhập giá phòng hợp lệ")
            return
        }

        if (!tenant.room_id) {
            setError("Không tìm thấy thông tin phòng")
            return
        }

        setIsLoading(true)
        try {
            await updateCanHo(tenant.room_id, { gia_thue: priceNumber })

            if (onSuccess) {
                onSuccess()
            }

            onOpenChange(false)
            alert(`Đã cập nhật giá phòng ${tenant.room_number || tenant.roomNumber} thành ${priceNumber.toLocaleString('vi-VN')}₫`)
        } catch (err: any) {
            console.error("Error updating room price:", err)
            setError(err.message || "Có lỗi xảy ra khi cập nhật giá phòng")
        } finally {
            setIsLoading(false)
        }
    }

    const formatPrice = (value: string) => {
        // Loại bỏ tất cả ký tự không phải số
        const numbers = value.replace(/[^\d]/g, "")
        if (!numbers) return ""

        // Format với dấu phẩy ngăn cách hàng nghìn
        return Number(numbers).toLocaleString('vi-VN')
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const numbers = value.replace(/[^\d]/g, "")
        setPrice(numbers)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl font-bold">
                        <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                        Thay đổi giá phòng
                    </DialogTitle>
                    <DialogDescription>
                        Cập nhật giá thuê cho phòng {tenant?.room_number || tenant?.roomNumber || ""}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium">
                            Giá thuê mới (VNĐ) *
                        </Label>
                        <Input
                            id="price"
                            type="text"
                            placeholder="Nhập giá thuê"
                            value={formatPrice(price)}
                            onChange={handlePriceChange}
                            className={error ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}
                        {tenant?.rent_amount && (
                            <p className="text-sm text-gray-500">
                                Giá hiện tại: {Number(tenant.rent_amount).toLocaleString('vi-VN')}₫
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

