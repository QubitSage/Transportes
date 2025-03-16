"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSocketStore } from "@/lib/socket"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

export function NotificationBell() {
  const { activities, unreadActivities, markActivityAsRead, markAllActivitiesAsRead } = useSocketStore()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Function to format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `${diffMins}m atrás`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h atrás`

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Handle notification click
  const handleNotificationClick = (activity: any) => {
    markActivityAsRead(activity.id)
    setOpen(false)

    // Navigate based on activity type
    if (activity.type.includes("pesagem")) {
      router.push(`/dashboard/pesagens`)
    } else if (activity.type.includes("coleta")) {
      router.push(`/dashboard/coletas`)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadActivities > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadActivities > 9 ? "9+" : unreadActivities}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadActivities > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => markAllActivitiesAsRead()}>
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {activities.length > 0 ? (
              activities.slice(0, 10).map((activity) => (
                <DropdownMenuItem
                  key={activity.id}
                  className="flex flex-col items-start p-3 cursor-pointer"
                  onClick={() => handleNotificationClick(activity)}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="font-medium">{activity.message}</span>
                    {!activity.read && (
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                        Nova
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{formatTime(activity.timestamp)}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                <p>Nenhuma notificação</p>
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center text-center cursor-pointer"
          onClick={() => {
            setOpen(false)
            router.push("/dashboard")
          }}
        >
          Ver todas as atividades
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

