import { NotificationItem } from "@/components/admin/dashboard/notification-item"
import { Button } from "@/components/admin/ui/button"

interface NotificationsPageProps {
    notifications: Array<{
        id: number
        title: string
        message: string
        time: string
        type: string
    }>
    onSelect?: (n: any) => void
}

export function NotificationsPage({ notifications, onSelect }: NotificationsPageProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Thông báo</h2>
                <Button variant="outline">Đánh dấu tất cả đã đọc</Button>
            </div>

            <div className="grid gap-4">
                {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} onClick={onSelect} />
                ))}
            </div>
        </div>
    )
}
