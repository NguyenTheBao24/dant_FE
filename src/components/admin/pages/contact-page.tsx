"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/admin/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/admin/ui/dropdown"
import { MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Button } from "@/components/admin/ui/button"
import { listQuanLy, createQuanLy, updateQuanLy, deleteQuanLy } from "@/services/quan-ly.service"
import { createTaiKhoan, listTaiKhoan, deleteTaiKhoan } from "@/services/tai-khoan.service"
import { listToaNha } from "@/services/toa-nha.service"
import { updateToaNha } from "@/services/toa-nha.service"

interface ContactPageProps {
    selectedHostel: any
    onManagerAction: (action: string, manager: any) => void
}

export function ContactPage({ selectedHostel, onManagerAction }: ContactPageProps) {
    const [managers, setManagers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingManager, setEditingManager] = useState<any | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newManager, setNewManager] = useState<any>({ name: '', phone: '', email: '' })

    async function loadManagers() {
        setIsLoading(true)
        try {
            const rows = await listQuanLy()

            // Cleanup orphan managers: managers not linked to any existing building
            const buildings = await listToaNha()
            const validManagerIds = new Set((buildings || []).map((b: any) => b.quan_ly_id).filter(Boolean))
            const orphanManagers = (rows || []).filter((m: any) => !validManagerIds.has(m.id))

            if (orphanManagers.length) {
                for (const m of orphanManagers) {
                    try {
                        await deleteQuanLy(m.id)
                        if (m.tai_khoan?.id) {
                            await deleteTaiKhoan(m.tai_khoan.id)
                        }
                    } catch (e) {
                        console.warn('Failed to cleanup orphan manager', m.id, e)
                    }
                }
            }

            const filtered = (rows || []).filter((m: any) => validManagerIds.has(m.id))
            setManagers(filtered)
        } catch (e) {
            console.error('Failed to load managers:', e)
            // Fallback: nếu không tải được, thử dùng manager của selectedHostel
            if (selectedHostel?.manager?.id) setManagers([{
                id: selectedHostel.manager.id,
                ho_ten: selectedHostel.manager.name,
                sdt: selectedHostel.manager.phone,
                email: selectedHostel.manager.email,
                tai_khoan: selectedHostel.manager.username ? {
                    username: selectedHostel.manager.username,
                    role: selectedHostel.manager.role,
                    password: selectedHostel.manager.password,
                } : null,
            }])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadManagers()
        const onRemoved = (e: any) => {
            const id = e?.detail?.managerId
            if (id) setManagers(prev => prev.filter(m => m.id !== id))
        }
        window.addEventListener('manager-removed', onRemoved as any)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function openEdit(m: any) {
        setEditingManager({
            id: m.id,
            name: m.ho_ten || m.name || '',
            phone: m.sdt || m.phone || '',
            email: m.email || '',
        })
        setIsEditOpen(true)
    }

    async function saveEdit() {
        if (!editingManager?.id) return
        try {
            const updated = await updateQuanLy(editingManager.id, {
                ho_ten: editingManager.name,
                sdt: editingManager.phone,
                email: editingManager.email,
            })
            // Preserve existing building relation so 'Khu trọ' doesn't disappear after update
            setManagers(prev => prev.map(m => m.id === editingManager.id ? { ...m, ...updated, toa_nha: m.toa_nha } : m))
            // Nếu quản lý đang sửa là quản lý của tòa nhà hiện tại, cập nhật góc quản lý theo danh sách
            if (selectedHostel?.manager?.id === editingManager.id && onManagerAction) {
                onManagerAction('update_manager', {
                    id: updated.id || editingManager.id,
                    name: updated.ho_ten ?? editingManager.name,
                    phone: updated.sdt ?? editingManager.phone,
                    email: updated.email ?? editingManager.email,
                })
            }
            setIsEditOpen(false)
        } catch (e) {
            console.error('Failed to update manager:', e)
            setIsEditOpen(false)
        }
    }

    async function removeManager(m: any) {
        if (!confirm(`Xóa quản lý "${m.ho_ten || m.name}"?`)) return
        try {
            await deleteQuanLy(m.id)
            setManagers(prev => prev.filter(x => x.id !== m.id))
        } catch (e) {
            console.error('Failed to delete manager:', e)
        }
    }

    async function addManager() {
        try {
            if (!selectedHostel?.id) {
                alert('Vui lòng chọn tòa nhà trước khi thêm quản lý')
                return
            }
            if (selectedHostel?.manager?.id) {
                alert('Tòa nhà này đã có quản lý, không thể thêm mới')
                return
            }
            const created = await createQuanLy({
                ho_ten: newManager.name,
                sdt: newManager.phone,
                email: newManager.email,
            })
            if (created) {
                await updateToaNha(selectedHostel?.id, { quan_ly_id: created.id })
                const createdWithBuilding = {
                    ...created,
                    toa_nha: [{ id: selectedHostel?.id, ten_toa: selectedHostel?.name }],
                }
                setManagers(prev => [...prev, createdWithBuilding])
                // Cập nhật ngay góc quản lý và selectedHostel ở Dashboard thông qua callback
                if (onManagerAction) {
                    onManagerAction('update_manager', {
                        id: created.id,
                        name: created.ho_ten,
                        phone: created.sdt,
                        email: created.email,
                    })
                }
            }
            setIsAddOpen(false)
            setNewManager({ name: '', phone: '', email: '' })
        } catch (e) {
            console.error('Failed to create manager:', e)
        }
    }

    async function grantAccount(m: any) {
        if (m.tai_khoan?.username) {
            alert('Quản lý đã có tài khoản: ' + m.tai_khoan.username)
            return
        }
        try {
            // Tạo username duy nhất để tránh lỗi 409 (unique constraint)
            const allAccounts = await listTaiKhoan().catch(() => [])
            const existing = new Set((allAccounts || []).map((a: any) => a.username))
            const base = (m.email?.split('@')[0] || m.ho_ten || 'manager')
                .toString()
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9_]+/g, '_')
                .replace(/^_+|_+$/g, '') || 'manager'
            let username = base
            let suffix = 1
            while (existing.has(username)) {
                username = `${base}_${suffix++}`
            }
            const defaultPassword = 'manager@123'
            let account = await createTaiKhoan({ username, password: defaultPassword, role: 'quan_ly' })
            if (!account?.id) {
                alert('Không thể cấp tài khoản')
                return
            }
            // cập nhật liên kết tai_khoan cho quản lý
            const updated = await updateQuanLy(m.id, { tai_khoan_id: account.id })
            setManagers(prev => prev.map(x =>
                x.id === m.id
                    ? { ...x, ...updated, tai_khoan: account, toa_nha: x.toa_nha }
                    : x
            ))
            // Nếu là quản lý của tòa nhà hiện tại thì cập nhật ngay góc quản lý
            if (selectedHostel?.manager?.id === m.id && onManagerAction) {
                onManagerAction('update_manager', {
                    id: m.id,
                    name: m.ho_ten,
                    phone: m.sdt,
                    email: m.email,
                    username: account.username,
                    password: account.password,
                    role: account.role,
                })
            }
            alert('Đã cấp tài khoản: ' + account.username)
        } catch (e) {
            console.error('Failed to grant account:', e)
            alert('Cấp tài khoản thất bại')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Danh sách quản lý</h2>
                    <p className="text-muted-foreground">Quản lý toàn hệ thống</p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    disabled={!!selectedHostel?.manager?.id}
                    className={selectedHostel?.manager?.id ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    Thêm quản lý
                </Button>
            </div>

            {/* Danh sách quản lý */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-700">
                            <th className="text-left p-3">Họ tên</th>
                            <th className="text-left p-3">SĐT</th>
                            <th className="text-left p-3">Email</th>
                            <th className="text-left p-3">Username</th>
                            <th className="text-left p-3">Password</th>
                            <th className="text-left p-3">Khu trọ</th>
                            <th className="text-right p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!isLoading && managers.length === 0) && (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-slate-500">Chưa có quản lý</td>
                            </tr>
                        )}
                        {managers.map(m => (
                            <tr key={m.id} className="border-t">
                                <td className="p-3 font-medium">{m.ho_ten || '-'}</td>
                                <td className="p-3">{m.sdt || '-'}</td>
                                <td className="p-3">{m.email || '-'}</td>
                                <td className="p-3">{m.tai_khoan?.username || '-'}</td>
                                <td className="p-3">{m.tai_khoan?.password || '-'}</td>
                                <td className="p-3">
                                    {Array.isArray(m.toa_nha)
                                        ? (m.toa_nha.map((t: any) => t.ten_toa).join(', ') || '-')
                                        : (m.toa_nha?.ten_toa || '-')}
                                </td>
                                <td className="p-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-50">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEdit(m)}>Sửa</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => removeManager(m)}>Xóa</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => grantAccount(m)} disabled={!!m.tai_khoan?.username}>
                                                {m.tai_khoan?.username ? 'Đã có tài khoản' : 'Cấp tài khoản'}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Dialog thêm quản lý */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm quản lý</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Họ và tên</Label>
                            <Input value={newManager.name} onChange={e => setNewManager((v: any) => ({ ...v, name: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Số điện thoại</Label>
                                <Input value={newManager.phone} onChange={e => setNewManager((v: any) => ({ ...v, phone: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={newManager.email} onChange={e => setNewManager((v: any) => ({ ...v, email: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                        <Button onClick={addManager}>Thêm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog sửa quản lý */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật quản lý</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Họ và tên</Label>
                            <Input value={editingManager?.name || ''} onChange={e => setEditingManager((v: any) => ({ ...v, name: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Số điện thoại</Label>
                                <Input value={editingManager?.phone || ''} onChange={e => setEditingManager((v: any) => ({ ...v, phone: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={editingManager?.email || ''} onChange={e => setEditingManager((v: any) => ({ ...v, email: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                        <Button onClick={saveEdit}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
