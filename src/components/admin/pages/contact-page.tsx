"use client"

import { useEffect, useState } from "react"
import { ManagerProfile } from "@/components/admin/dashboard/manager-profile"
import { Card, CardContent } from "@/components/admin/ui/card"
import { Settings } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Button } from "@/components/admin/ui/button"

interface ContactPageProps {
    selectedHostel: any
    onManagerAction: (action: string, manager: any) => void
}

export function ContactPage({ selectedHostel, onManagerAction }: ContactPageProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [editableManager, setEditableManager] = useState<any>(selectedHostel?.manager || {})

    useEffect(() => {
        setEditableManager(selectedHostel?.manager || {})
    }, [selectedHostel])

    function handleOpenSettings() {
        setEditableManager(selectedHostel?.manager || {})
        setIsSettingsOpen(true)
    }

    function handleChange(key: string, value: any) {
        setEditableManager((prev: any) => ({ ...prev, [key]: value }))
    }

    function handleSubmitUpdate() {
        const updated = {
            ...editableManager,
        }

        // Optimistic local update for immediate UI feedback
        setEditableManager(updated)

        // Notify parent to persist and refresh upstream state
        onManagerAction("update_manager", updated)

        setIsSettingsOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Nhân viên liên hệ</h2>
                    <p className="text-muted-foreground">Quản lý khu trọ: {selectedHostel.name}</p>
                </div>
            </div>

            <ManagerProfile manager={editableManager} hostel={selectedHostel} onAction={onManagerAction} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={handleOpenSettings}
                >
                    <CardContent className="p-6 text-center">
                        <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-semibold">Cài đặt quản lý</h3>
                        <p className="text-sm text-muted-foreground">Chỉnh sửa thông tin quản lý</p>
                    </CardContent>
                </Card>


            </div>

            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật thông tin quản lý</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="manager-name">Họ và tên</Label>
                            <Input
                                id="manager-name"
                                value={editableManager?.name || ""}
                                onChange={e => handleChange("name", e.target.value)}
                                placeholder="Nhập họ và tên"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="manager-phone">Số điện thoại</Label>
                                <Input
                                    id="manager-phone"
                                    value={editableManager?.phone || ""}
                                    onChange={e => handleChange("phone", e.target.value)}
                                    placeholder="VD: 0901234567"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="manager-email">Email</Label>
                                <Input
                                    id="manager-email"
                                    type="email"
                                    value={editableManager?.email || ""}
                                    onChange={e => handleChange("email", e.target.value)}
                                    placeholder="nhanvien@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="manager-experience">Kinh nghiệm</Label>
                            <Input
                                id="manager-experience"
                                value={editableManager?.experience || ""}
                                onChange={e => handleChange("experience", e.target.value)}
                                placeholder="VD: 5 năm quản lý khu trọ"
                            />
                        </div>

                        {/* Field removed as per request: specialties */}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Hủy</Button>
                        <Button onClick={handleSubmitUpdate}>Cập nhật</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
