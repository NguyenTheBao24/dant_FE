import { useState, useMemo } from "react"
import { NotificationItem } from "@/components/admin/dashboard/notification-item"
import { Button } from "@/components/admin/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"

interface NotificationsPageProps {
    notifications: Array<{
        id: number
        title: string
        message: string
        time: string
        type: string
        category?: string
        loai_thong_bao?: string
    }>
    onSelect?: (n: any) => void
}

type FilterType = "all" | "order" | "lien_he" | "thanh_toan" | "khac" | "report" | "employee"

export function NotificationsPage({ notifications, onSelect }: NotificationsPageProps) {
    const [filterType, setFilterType] = useState<FilterType>("all")

    const filteredNotifications = useMemo(() => {
        if (filterType === "all") {
            return notifications
        }

        return notifications.filter((notification) => {
            // Lọc theo loại thông báo từ database
            if (notification.loai_thong_bao) {
                if (filterType === "lien_he" && notification.loai_thong_bao === "lien_he") return true
                if (filterType === "thanh_toan" && notification.loai_thong_bao === "thanh_toan") return true
                if (filterType === "khac" && notification.loai_thong_bao === "khac") return true
            }

            // Lọc theo type (order, report, employee)
            if (filterType === "order" && notification.type === "order") return true
            if (filterType === "report" && notification.type === "report") return true
            if (filterType === "employee" && notification.type === "employee") return true

            return false
        })
    }, [notifications, filterType])

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
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Thông báo</h2>
                <div className="flex items-center gap-3">
                    <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                        <SelectTrigger className="w-[180px]">
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
                    <Button variant="outline">Đánh dấu tất cả đã đọc</Button>
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
