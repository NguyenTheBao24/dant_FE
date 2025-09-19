"use client"

import { Card, CardContent } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Textarea } from "@/components/admin/ui/textarea"
import { Label } from "@/components/admin/ui/label"
import { Button } from "@/components/admin/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Building2, PlusCircle, Trash2 } from "lucide-react"
import { useState } from "react"

interface AddHostelPageProps {
    hostels?: any[]
    onSubmit?: (payload: any) => void
    onDelete?: (hostelId: number) => void
}

export function AddHostelPage({ hostels = [], onSubmit, onDelete }: AddHostelPageProps) {
    const [form, setForm] = useState({
        name: "",
        address: "",
        rooms: "",
        managerName: "",
        managerPhone: "",
        type: "standard",
        note: "",
    })

    function handleChange(field: string, value: string) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    function handleSubmit() {
        const payload = {
            ...form,
            rooms: Number(form.rooms || 0),
        }
        if (onSubmit) onSubmit(payload)
        alert("Đã tạo khu trọ mới thành công!")
        setForm({
            name: "",
            address: "",
            rooms: "",
            managerName: "",
            managerPhone: "",
            type: "standard",
            note: "",
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-blue-600">Thêm khu trọ mới</h2>
                    <p className="text-gray-600">Nhập thông tin khu trọ để khởi tạo quản lý</p>
                </div>
            </div>

            <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên khu trọ</Label>
                            <Input
                                id="name"
                                placeholder="Khu trọ An Bình"
                                value={form.name}
                                onChange={e => handleChange("name", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rooms">Tổng số phòng</Label>
                            <Input
                                id="rooms"
                                type="number"
                                min={0}
                                placeholder="20"
                                value={form.rooms}
                                onChange={e => handleChange("rooms", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input
                                id="address"
                                placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                                value={form.address}
                                onChange={e => handleChange("address", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="managerName">Tên quản lý</Label>
                            <Input
                                id="managerName"
                                placeholder="Nguyễn Văn A"
                                value={form.managerName}
                                onChange={e => handleChange("managerName", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="managerPhone">SĐT quản lý</Label>
                            <Input
                                id="managerPhone"
                                placeholder="0912 345 678"
                                value={form.managerPhone}
                                onChange={e => handleChange("managerPhone", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Loại hình</Label>
                            <Select value={form.type} onValueChange={v => handleChange("type", v)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Tiêu chuẩn</SelectItem>
                                    <SelectItem value="premium">Cao cấp</SelectItem>
                                    <SelectItem value="vip">VIP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="note">Ghi chú</Label>
                            <Textarea
                                id="note"
                                placeholder="Ghi chú thêm (tuỳ chọn)"
                                value={form.note}
                                onChange={e => handleChange("note", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-6">
                        <Button onClick={handleSubmit} className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Tạo khu trọ
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {hostels.length > 0 && (
                <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Danh sách khu trọ hiện có</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {hostels.map((h) => (
                                <div key={h.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="font-semibold text-gray-900">{h.name}</div>
                                            <div className="text-sm text-gray-600">{h.address}</div>
                                            <div className="text-sm text-gray-600 mt-1">Phòng: {h.rooms} | Đã thuê: {h.occupancy || 0}</div>
                                        </div>
                                        {onDelete && (
                                            <Button
                                                variant="outline"
                                                className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() => {
                                                    if (confirm(`Xóa khu trọ "${h.name}"?`)) onDelete(h.id)
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


