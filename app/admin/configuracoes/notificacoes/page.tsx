"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  Send,
  Users,
  History,
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SendPushDialog } from "@/components/send-push-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Dados simulados para histórico de notificações
const notificationHistory = [
  {
    id: 1,
    title: "Atualização do Sistema",
    message: "O sistema será atualizado hoje às 22h. Pode haver instabilidade durante o processo.",
    type: "info",
    sentBy: "admin@logistica.com",
    sentTo: "Todos os usuários",
    sentAt: "2023-11-15 14:30",
    readCount: 42,
    totalCount: 50,
  },
  {
    id: 2,
    title: "Erro no Módulo de Entregas",
    message: "Identificamos um erro no módulo de entregas que foi corrigido. Por favor, atualize a página.",
    type: "error",
    sentBy: "suporte@logistica.com",
    sentTo: "Departamento de Logística",
    sentAt: "2023-11-14 09:15",
    readCount: 12,
    totalCount: 15,
  },
  {
    id: 3,
    title: "Nova Funcionalidade Disponível",
    message: "A funcionalidade de rastreamento em tempo real já está disponível para todos os usuários.",
    type: "success",
    sentBy: "admin@logistica.com",
    sentTo: "Todos os usuários",
    sentAt: "2023-11-10 11:45",
    readCount: 38,
    totalCount: 50,
  },
  {
    id: 4,
    title: "Manutenção Programada",
    message: "Haverá manutenção programada no próximo domingo, das 8h às 12h.",
    type: "warning",
    sentBy: "sistema@logistica.com",
    sentTo: "Todos os usuários",
    sentAt: "2023-11-08 16:20",
    readCount: 45,
    totalCount: 50,
  },
]

// Estatísticas simuladas
const notificationStats = {
  total: 120,
  read: 98,
  unread: 22,
  success: 45,
  error: 15,
  warning: 30,
  info: 30,
}

export default function NotificacoesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user, hasPermission } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Verificar permissões
  if (!hasPermission("admin_notifications")) {
    // Redirecionar se não tiver permissão
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta página.",
      variant: "destructive",
    })
    router.push("/dashboard")
    return null
  }

  // Função para obter o ícone com base no tipo de notificação
  const getNotificationIcon = (type: string) => {
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
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Notificações</h1>
          <p className="text-muted-foreground mt-1">Envie e gerencie notificações para os usuários do sistema</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-[#007846] hover:bg-[#006038]">
          <Send className="h-4 w-4 mr-2" />
          Enviar Notificação Push
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{notificationStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Leitura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((notificationStats.read / notificationStats.total) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {notificationStats.read} lidas de {notificationStats.total}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Não Lidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{notificationStats.unread}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enviadas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history" className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            Histórico de Notificações
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Estatísticas Detalhadas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Notificações Enviadas</CardTitle>
              <CardDescription>Visualize todas as notificações enviadas e suas estatísticas de leitura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationHistory.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="mr-4 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">{notification.sentAt}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="h-3 w-3 mr-1" />
                          <span>Enviado para: {notification.sentTo}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">{notification.readCount}</span>
                          <span className="text-muted-foreground"> de </span>
                          <span className="font-medium">{notification.totalCount}</span>
                          <span className="text-muted-foreground"> lidas </span>(
                          {Math.round((notification.readCount / notification.totalCount) * 100)}%)
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Notificações Anteriores</Button>
              <div className="text-sm text-muted-foreground">
                Mostrando 4 de {notificationHistory.length} notificações
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas por Tipo de Notificação</CardTitle>
              <CardDescription>Análise detalhada das notificações enviadas por tipo e taxa de leitura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Sucesso</div>
                    <div className="text-2xl font-bold">{notificationStats.success}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((notificationStats.success / notificationStats.total) * 100)}% do total
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg">
                  <AlertCircle className="h-8 w-8 text-red-500 mr-4" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Erro</div>
                    <div className="text-2xl font-bold">{notificationStats.error}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((notificationStats.error / notificationStats.total) * 100)}% do total
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mr-4" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Aviso</div>
                    <div className="text-2xl font-bold">{notificationStats.warning}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((notificationStats.warning / notificationStats.total) * 100)}% do total
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg">
                  <Info className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Informação</div>
                    <div className="text-2xl font-bold">{notificationStats.info}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((notificationStats.info / notificationStats.total) * 100)}% do total
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Taxa de Leitura por Departamento</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Administração</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Logística</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Financeiro</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Operacional</span>
                      <span className="font-medium">64%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "64%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para enviar notificações */}
      <SendPushDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      {/* Overlay de Fase Beta */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-black/70 p-8 rounded-lg transform rotate-[-5deg] border-4 border-yellow-400">
          <h2 className="text-5xl font-black text-yellow-400 tracking-wider">FASE BETA</h2>
        </div>
      </div>
    </div>
  )
}

