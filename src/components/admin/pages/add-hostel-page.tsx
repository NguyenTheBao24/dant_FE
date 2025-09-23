"use client"

import { Card, CardContent } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Button } from "@/components/admin/ui/button"
import { Building2, PlusCircle, Trash2 } from "lucide-react"
import { useState } from "react"

interface AddHostelPageProps {
    hostels?: any[]
    onSubmit?: (payload: any) => void
    onDelete?: (hostelId: number) => void
}

export function AddHostelPage({ hostels = [], onSubmit, onDelete }: AddHostelPageProps) {
    const [form, setForm] = useState({
        ten_toa: "",
        dia_chi: "",
        quan_ly_id: "",
        so_can_ho: "10",
    })

    function handleChange(field: string, value: string) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    function handleSubmit() {
        const payload = {
            ten_toa: form.ten_toa.trim(),
            dia_chi: form.dia_chi.trim(),
            quan_ly_id: form.quan_ly_id ? Number(form.quan_ly_id) : null,
            so_can_ho: Number(form.so_can_ho || 10),
        }
        if (onSubmit) onSubmit(payload)
        alert("Đã tạo tòa nhà mới thành công!")
        setForm({
            ten_toa: "",
            dia_chi: "",
            quan_ly_id: "",
            so_can_ho: "10",
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-blue-600">Thêm tòa nhà mới</h2>
                    <p className="text-gray-600">Nhập thông tin tòa nhà để khởi tạo quản lý</p>
                </div>
            </div>

            <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="ten_toa">Tên tòa nhà</Label>
                            <Input
                                id="ten_toa"
                                placeholder="Toà nhà An Bình"
                                value={form.ten_toa}
                                onChange={e => handleChange("ten_toa", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="dia_chi">Địa chỉ</Label>
                            <Input
                                id="dia_chi"
                                placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                                value={form.dia_chi}
                                onChange={e => handleChange("dia_chi", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="so_can_ho">Số lượng căn hộ cố định</Label>
                            <Input
                                id="so_can_ho"
                                type="number"
                                min={1}
                                placeholder="10"
                                value={form.so_can_ho}
                                onChange={e => handleChange("so_can_ho", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quan_ly_id">Mã quản lý (tuỳ chọn)</Label>
                            <Input
                                id="quan_ly_id"
                                type="number"
                                placeholder="Nhập ID quản lý nếu có"
                                value={form.quan_ly_id}
                                onChange={e => handleChange("quan_ly_id", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-6">
                        <Button onClick={handleSubmit} className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Tạo tòa nhà
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {hostels.length > 0 && (
                <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Danh sách tòa nhà hiện có</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {hostels.map((h) => (
                                <div key={h.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="font-semibold text-gray-900">{h.ten_toa || h.name}</div>
                                            <div className="text-sm text-gray-600">{h.dia_chi || h.address}</div>
                                        </div>
                                        {onDelete && (
                                            <Button
                                                variant="outline"
                                                className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() => {
                                                    if (confirm(`Xóa tòa nhà "${h.ten_toa || h.name}"?`)) onDelete(h.id)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex items-center gap-3 text-sm text-gray-500">
                <Building2 className="h-4 w-4" />
                Thông tin có thể chỉnh sửa sau trong phần quản trị.
            </div>
        </div>
    )
}


