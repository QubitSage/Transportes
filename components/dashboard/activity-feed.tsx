"use client"

import type React from "react"

import { useState } from "react"
import { type Activity, useSocketStore } from "@/lib/socket"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Check, Truck, Weight, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function ActivityFeed() {
  const { activities, markAllActivitiesAsRead, markActivityAsRead, unreadActivities } = useSocketStore()
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")

  const displayActivities = activeTab === "all" ? activities : activities.filter((activity) => !activity.read)

  // Function to get icon based on activity type
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "pesagem_created":
      case "pesagem_updated":
        return <Weight className="h-4 w-4" />
      case "coleta_created":
      case "coleta_updated":
      case "coleta_status_changed":
        return <Truck className="h-4 w-4" />
      case "user_login":
        return <User className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // Function to format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(date)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Acompanhe as últimas atividades do sistema</CardDescription>
          </div>
          {unreadActivities > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadActivities} nova{unreadActivities !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "unread")}>
          <div className="px-6 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">Não lidas {unreadActivities > 0 && `(${unreadActivities})`}</TabsTrigger>
            </TabsList>
            {unreadActivities > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllActivitiesAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Marcar todas como lidas
              </Button>
            )}
          </div>

          <TabsContent value="all" className="m-0">
            <ActivityList
              activities={displayActivities}
              onMarkAsRead={markActivityAsRead}
              getActivityIcon={getActivityIcon}
              formatTime={formatTime}
            />
          </TabsContent>

          <TabsContent value="unread" className="m-0">
            <ActivityList
              activities={displayActivities}
              onMarkAsRead={markActivityAsRead}
              getActivityIcon={getActivityIcon}
              formatTime={formatTime}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface ActivityListProps {
  activities: Activity[]
  onMarkAsRead: (id: string) => void
  getActivityIcon: (type: Activity["type"]) => React.ReactNode
  formatTime: (timestamp: string) => string
}

function ActivityList({ activities, onMarkAsRead, getActivityIcon, formatTime }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
        <Bell className="h-12 w-12 mb-4 opacity-20" />
        <p>Nenhuma atividade para exibir</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="divide-y">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
              !activity.read && "bg-muted/30",
            )}
            onClick={() => !activity.read && onMarkAsRead(activity.id)}
          >
            <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">{getActivityIcon(activity.type)}</div>

            <div className="flex-1 space-y-1">
              {activity.user && (
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{activity.user.name}</span>
                </div>
              )}
              <p className="text-sm">{activity.message}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</span>
                {!activity.read && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Nova
                  </Badge>
                )}
              </div>
            </div>

            {!activity.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkAsRead(activity.id)
                }}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Marcar como lida</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

