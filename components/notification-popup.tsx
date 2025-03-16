"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, AlertTriangle, Info, X, Bell, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAlert } from "@/contexts/alert-context"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface NotificationPopupProps {
  open: boolean
  onClose: () => void
}

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  time: string
  read: boolean
}

export function NotificationPopup({ open, onClose }: NotificationPopupProps) {
  const { showAlert } = useAlert()
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const { hasPermission } = useAuth()

  // Exemplos de notificações para demonstração
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Pesagem concluída",
      message: "A pesagem #1234 foi registrada com sucesso no sistema.",
      time: "Agora mesmo",
      read: false,
    },
    {
      id: "2",
      type: "error",
      title: "Falha na conexão",
      message: "Não foi possível conectar com a balança. Verifique o equipamento.",
      time: "5 minutos atrás",
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Estoque baixo",
      message: "O produto 'Fertilizante NPK' está com estoque abaixo do mínimo.",
      time: "30 minutos atrás",
      read: false,
    },
    {
      id: "4",
      type: "info",
      title: "Manutenção programada",
      message: "O sistema entrará em manutenção hoje às 22h00. Duração estimada: 1 hora.",
      time: "2 horas atrás",
      read: true,
    },
    {
      id: "5",
      type: "success",
      title: "Ordem de coleta emitida",
      message: "A ordem de coleta #OS-2024-004 foi emitida com sucesso.",
      time: "3 horas atrás",
      read: true,
    },
  ])

  // Fechar o popup quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (open && !target.closest(".notification-popup") && !target.closest("button")) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((notification) => notification.type === activeTab)

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)

    // Mostrar o alerta correspondente ao tipo de notificação
    showAlert({
      message: notification.title,
      description: notification.message,
      type: notification.type,
      duration: 5000,
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "success":
        return "Sucesso"
      case "error":
        return "Erro"
      case "warning":
        return "Aviso"
      case "info":
        return "Informação"
      default:
        return "Notificação"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card className="notification-popup absolute right-0 top-12 w-[380px] max-h-[90vh] shadow-lg z-50 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 h-5">
                {unreadCount} nova{unreadCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Demonstração dos tipos de notificações do sistema</CardDescription>
      </CardHeader>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="success">Sucesso</TabsTrigger>
            <TabsTrigger value="error">Erro</TabsTrigger>
            <TabsTrigger value="warning">Aviso</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0 max-h-[50vh] overflow-y-auto">
          <TabsContent value={activeTab} className="m-0">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                      !notification.read && "bg-blue-50/50",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-normal",
                              notification.type === "success" && "border-green-200 text-green-700",
                              notification.type === "error" && "border-red-200 text-red-700",
                              notification.type === "warning" && "border-amber-200 text-amber-700",
                              notification.type === "info" && "border-blue-200 text-blue-700",
                            )}
                          >
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </span>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            Ver detalhes
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
              </div>
            )}
          </TabsContent>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
            >
              Marcar todas como lidas
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/notificacoes")}>
            Ver todas
          </Button>
        </CardFooter>
      </Tabs>

      <div className="p-4 border-t bg-gray-50">
        <h4 className="text-sm font-medium mb-2">Sobre os tipos de notificações:</h4>
        <ul className="text-xs space-y-1.5 text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            <span>
              <strong>Sucesso:</strong> Operações concluídas com êxito, como registros salvos ou processos finalizados
            </span>
          </li>
          <li className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span>
              <strong>Erro:</strong> Falhas que impedem a conclusão de uma operação, como problemas de conexão
            </span>
          </li>
          <li className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>
              <strong>Aviso:</strong> Situações que requerem atenção, como estoque baixo ou vencimentos próximos
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-blue-500" />
            <span>
              <strong>Informação:</strong> Comunicados gerais, como atualizações do sistema ou lembretes
            </span>
          </li>
        </ul>
      </div>
    </Card>
  )
}

