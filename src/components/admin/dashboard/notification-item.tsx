import { Card, CardContent } from "@/components/admin/ui/card"
import { ShoppingCart, Users, TrendingUp, UserCheck } from "lucide-react"

interface NotificationItemProps {
  notification: {
    id: number
    title: string
    message: string
    time: string
    type: string
  }
  onClick?: (notification: any) => void
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-primary" />
      case "customer":
        return <Users className="h-5 w-5 text-primary" />
      case "report":
        return <TrendingUp className="h-5 w-5 text-primary" />
      case "employee":
        return <UserCheck className="h-5 w-5 text-primary" />
      default:
        return <Users className="h-5 w-5 text-primary" />
    }
  }

  return (
    <Card className="transition-all hover:shadow-md cursor-pointer" onClick={() => onClick && onClick(notification)}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              {getIcon(notification.type)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.time}</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
