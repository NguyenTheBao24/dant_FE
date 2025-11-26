import { useMemo, useState } from "react"
import { NotificationItem } from "@/components/admin/dashboard/notification-item"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/admin/ui/select"

interface NotificationsPageProps {
    notifications: Array<{
        id: number
        title: string
        message: string
        time: string
        type: string
        category?: string
        loai_thong_bao?: string
        trang_thai?: string
        room_label?: string
        _source?: any
    }>
    onSelect?: (n: any) => void
}

type FilterType = "all" | "order" | "lien_he" | "thanh_toan" | "khac" | "report" | "employee"
type StatusFilter = "all" | "chua_xu_ly" | "dang_xu_ly" | "da_xu_ly"

export function NotificationsPage({ notifications, onSelect }: NotificationsPageProps) {
    const [filterType, setFilterType] = useState<FilterType>("all")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    const [roomFilter, setRoomFilter] = useState("")

    const filteredNotifications = useMemo(() => {
        return notifications.filter(notification => {
            const matchesType = (() => {
                if (filterType === "all") return true
                if (notification.loai_thong_bao) {
                    if (filterType === "lien_he" && notification.loai_thong_bao === "lien_he") return true
                    if (filterType === "thanh_toan" && notification.loai_thong_bao === "thanh_toan") return true
                    if (filterType === "khac" && notification.loai_thong_bao === "khac") return true
                }

                if (filterType === "order" && notification.type === "order") return true
                if (filterType === "report" && notification.type === "report") return true
                if (filterType === "employee" && notification.type === "employee") return true

                return false
            })()

            if (!matchesType) return false

            const statusFromSource =
                notification.trang_thai ||
                notification._source?.trang_thai ||
                null
            const matchesStatus =
                statusFilter === "all" ||
                (statusFromSource && statusFromSource === statusFilter)

            if (!matchesStatus) return false

            const roomName =
                notification.room_label ||
                notification._source?.can_ho?.so_can ||
                notification._source?.room_number ||
                ""
            const matchesRoom =
                !roomFilter.trim() ||
                roomName.toLowerCase().includes(roomFilter.trim().toLowerCase())

            return matchesRoom
        })
    }, [notifications, filterType, statusFilter, roomFilter])

    const getFilterLabel = (type: FilterType) => {
        const labels: Record<FilterType, string> = {
            all: "Tất cả",
            order: "Hóa đơn",
            lien_he: "Liên hệ",
            thanh_toan: "Thanh toán",
            khac: "Khác",
            report: "Chưa xử lý",
            employee: "Đã xử lý"
        }
        return labels[type]
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Thông báo</h2>
                    <Button variant="outline">Đánh dấu tất cả đã đọc</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Lọc theo loại</label>
                        <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Lọc theo loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{getFilterLabel("all")}</SelectItem>
                                <SelectItem value="order">{getFilterLabel("order")}</SelectItem>
                                <SelectItem value="lien_he">{getFilterLabel("lien_he")}</SelectItem>
                                <SelectItem value="thanh_toan">{getFilterLabel("thanh_toan")}</SelectItem>
                                <SelectItem value="khac">{getFilterLabel("khac")}</SelectItem>
                                <SelectItem value="report">{getFilterLabel("report")}</SelectItem>
                                <SelectItem value="employee">{getFilterLabel("employee")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Lọc theo trạng thái xử lý</label>
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="chua_xu_ly">Chưa xử lý</SelectItem>
                                <SelectItem value="dang_xu_ly">Đang xử lý</SelectItem>
                                <SelectItem value="da_xu_ly">Đã xử lý</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Lọc theo phòng</label>
                        <Input
                            value={roomFilter}
                            onChange={(e) => setRoomFilter(e.target.value)}
                            placeholder="Nhập tên phòng (ví dụ: A101)"
                        />
                    </div>
                </div>
            </div>

            {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Không có thông báo nào thuộc loại "{getFilterLabel(filterType)}"</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredNotifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} onClick={onSelect} />
                    ))}
                </div>
            )}

            {filteredNotifications.length > 0 && (
                <div className="text-sm text-muted-foreground text-center">
                    Hiển thị {filteredNotifications.length} / {notifications.length} thông báo
                </div>
            )}
        </div>
    )
}
