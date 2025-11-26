import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { CreateInvoiceDialog } from "@/components/manager/dialogs/CreateInvoiceDialog"
import { ContractViewDialog } from "@/components/manager/dialogs/ContractViewDialog"
// @ts-ignore
import { realtimeService } from "@/services/realtime.service"
// @ts-ignore
import { listCanHoByToaNha } from "@/services/can-ho.service"
// @ts-ignore
import { listHopDongByToaNha } from "@/services/hop-dong.service"
import {
    Home,
    Users,
    Receipt,
    FileText
} from "lucide-react"
import {
    getRoomStatusLabel,
    getRoomStatusColor,
    getRoomType,
} from "@/utils/translations"

interface RoomsPageProps {
    selectedHostel: any
}

export function RoomsPage({ selectedHostel }: RoomsPageProps) {
    const [rooms, setRooms] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateInvoiceDialog, setShowCreateInvoiceDialog] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<any>(null)
    const [showContractDialog, setShowContractDialog] = useState(false)
    const [selectedContract, setSelectedContract] = useState<any>(null)
    const [contracts, setContracts] = useState<any[]>([])
    const [loadingContract, setLoadingContract] = useState(false)

    useEffect(() => {
        async function loadRooms() {
            if (!selectedHostel?.id) {
                setRooms([])
                setIsLoading(false)
                return
            }
            setIsLoading(true)
            try {
                const fresh = await listCanHoByToaNha(selectedHostel.id)
                setRooms(fresh)
            } catch (e) {
                console.error('Failed to load rooms:', e)
                setRooms(selectedHostel?.can_ho || [])
            } finally {
                setIsLoading(false)
            }
        }
        loadRooms()
    }, [selectedHostel?.id])

    // Load contracts when hostel changes
    useEffect(() => {
        async function loadContracts() {
            if (!selectedHostel?.id) {
                setContracts([])
                return
            }
            try {
                const contractsList = await listHopDongByToaNha(selectedHostel.id)
                setContracts(contractsList || [])
            } catch (e) {
                console.error('Failed to load contracts:', e)
                setContracts([])
            }
        }
        loadContracts()
    }, [selectedHostel?.id])

    // Realtime updates: cập nhật danh sách phòng ngay khi có thay đổi
    useEffect(() => {
        if (!selectedHostel?.id) return

        const applyRoomChange = (evt: any) => {
            const payload = evt.new || evt.data
            if (!payload) return
            setRooms(prev => {
                const idx = prev.findIndex((r: any) => r.id === payload.id)
                if (evt.event === 'DELETE') {
                    if (idx === -1) return prev
                    const clone = [...prev]
                    clone.splice(idx, 1)
                    return clone
                }
                // INSERT/UPDATE
                if (idx === -1) return [...prev, payload]
                const clone = [...prev]
                clone[idx] = { ...clone[idx], ...payload }
                return clone
            })
        }

        const chRooms = realtimeService.subscribe('can_ho', 'toa_nha_id', selectedHostel.id, applyRoomChange)

        // Khi có hợp đồng mới/ cập nhật, phản ánh trạng thái phòng ngay
        const chContracts = realtimeService.subscribeToAll('hop_dong', (evt: any) => {
            const data = evt.new || evt.data
            if (!data?.can_ho_id) return
            setRooms(prev => prev.map((r: any) => {
                if (r.id !== data.can_ho_id) return r
                if (evt.event === 'INSERT' || (evt.event === 'UPDATE' && data.trang_thai === 'hieu_luc')) {
                    return { ...r, trang_thai: 'da_thue' }
                }
                if (evt.event === 'UPDATE' && data.trang_thai !== 'hieu_luc') {
                    return { ...r, trang_thai: 'trong' }
                }
                if (evt.event === 'DELETE') {
                    return { ...r, trang_thai: 'trong' }
                }
                return r
            }))
        })

        return () => {
            try { chRooms && chRooms.unsubscribe && chRooms.unsubscribe() } catch { }
            try { chContracts && chContracts.unsubscribe && chContracts.unsubscribe() } catch { }
        }
    }, [selectedHostel?.id])

    const getRoomTypeInfo = (dienTich: number, giaThue: number) => {
        return getRoomType(dienTich, giaThue)
    }

    const getStatusBadge = (trangThai: string) => {
        const label = getRoomStatusLabel(trangThai)
        const colorClass = getRoomStatusColor(trangThai)
        return <Badge className={colorClass}>{label}</Badge>
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    if (!selectedHostel) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa chọn khu trọ</h3>
                    <p className="text-gray-500">Vui lòng chọn một khu trọ để xem danh sách phòng</p>
                </div>
            </div>
        )
    }

    const occupiedRooms = rooms.filter((room: any) =>
        room.trang_thai === 'da_thue' || room.trang_thai === 'occupied'
    ).length

    const availableRooms = rooms.filter((room: any) =>
        room.trang_thai === 'trong' || room.trang_thai === 'available'
    ).length

    const maintenanceRooms = rooms.filter((room: any) =>
        room.trang_thai === 'sua_chua' || room.trang_thai === 'maintenance'
    ).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Quản lý phòng
                </h2>
                <p className="text-gray-600 mt-1">
                    Danh sách phòng của khu trọ <span className="font-semibold">
                        {selectedHostel.ten_toa || selectedHostel.ten || selectedHostel.name || 'Không có tên'}
                    </span>
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Tổng phòng</p>
                                <p className="text-2xl font-bold text-blue-700">{rooms.length}</p>
                            </div>
                            <Home className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Phòng trống</p>
                                <p className="text-2xl font-bold text-green-700">{availableRooms}</p>
                            </div>
                            <Home className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Phòng đã thuê</p>
                                <p className="text-2xl font-bold text-red-700">{occupiedRooms}</p>
                            </div>
                            <Users className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-600">Đang sửa chữa</p>
                                <p className="text-2xl font-bold text-yellow-700">{maintenanceRooms}</p>
                            </div>
                            <Home className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rooms Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))
                ) : rooms.length === 0 ? (
                    <div className="col-span-full">
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có phòng nào</h3>
                                <p className="text-gray-500">Khu trọ này chưa có phòng nào được tạo</p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    rooms.map((room: any) => {
                        const roomType = getRoomTypeInfo(room.dien_tich, room.gia_thue)
                        return (
                            <Card key={room.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{room.so_can || `Phòng ${room.id}`}</CardTitle>
                                        <Badge className={roomType.color}>{roomType.type}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Diện tích:</span>
                                        <span className="font-medium">{room.dien_tich}m²</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Giá thuê:</span>
                                        <span className="font-medium text-green-600">
                                            {formatCurrency(room.gia_thue)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Trạng thái:</span>
                                        {getStatusBadge(room.trang_thai)}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            disabled={room.trang_thai !== 'da_thue' && room.trang_thai !== 'occupied'}
                                            title={room.trang_thai !== 'da_thue' && room.trang_thai !== 'occupied' ? 'Chỉ tạo hóa đơn cho phòng đã thuê' : 'Tạo hóa đơn thanh toán hàng tháng'}
                                            onClick={() => {
                                                setSelectedRoom(room)
                                                setShowCreateInvoiceDialog(true)
                                            }}
                                        >
                                            <Receipt className="h-3 w-3 mr-1" />
                                            Tạo hóa đơn
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={async () => {
                                                // Tìm hợp đồng hiệu lực của phòng này
                                                const roomContract = contracts.find((c: any) =>
                                                    c.can_ho_id === room.id &&
                                                    (c.trang_thai === 'hieu_luc' || c.trang_thai === 'active')
                                                )
                                                if (roomContract) {
                                                    // Thêm thông tin tòa nhà và quản lý từ selectedHostel
                                                    const contractWithDetails = {
                                                        ...roomContract,
                                                        toa_nha: selectedHostel?.ten_toa ? {
                                                            ten_toa: selectedHostel.ten_toa || selectedHostel.ten || selectedHostel.name,
                                                            quan_ly: selectedHostel.quan_ly
                                                        } : null
                                                    }
                                                    setSelectedContract(contractWithDetails)
                                                    setShowContractDialog(true)
                                                } else {
                                                    alert('Phòng này chưa có hợp đồng hiệu lực')
                                                }
                                            }}
                                            title="Xem hợp đồng thuê phòng"
                                        >
                                            <FileText className="h-3 w-3 mr-1" />
                                            Hợp đồng
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>

            {/* Create Invoice Dialog */}
            <CreateInvoiceDialog
                isOpen={showCreateInvoiceDialog}
                onOpenChange={setShowCreateInvoiceDialog}
                room={selectedRoom}
                selectedHostel={selectedHostel}
                onInvoiceCreated={() => {
                    console.log('Invoice created successfully')
                    // Có thể reload data hoặc thực hiện action khác
                }}
            />

            {/* Contract View Dialog */}
            <ContractViewDialog
                isOpen={showContractDialog}
                onOpenChange={setShowContractDialog}
                contract={selectedContract}
            />
        </div>
    )
}
