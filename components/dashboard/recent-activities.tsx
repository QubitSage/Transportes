"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Truck, Weight, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { fetchRecentOperationalActivities, type OperationalActivity } from "@/lib/data-service"

export function RecentActivities() {
  const [activities, setActivities] = useState<OperationalActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load operational activities on mount and refresh every 30 seconds
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchRecentOperationalActivities()
        setActivities(data)
      } catch (error) {
        console.error("Erro ao carregar atividades recentes:", error)
        setError("Falha ao carregar atividades. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
    const interval = setInterval(loadActivities, 30000)

    return () => clearInterval(interval)
  }, [])

  // Function to get icon based on activity type
  const getActivityIcon = (activity: OperationalActivity) => {
    switch (activity.type) {
      case "coleta_nova":
        return <Truck className="h-4 w-4" />
      case "coleta_finalizada":
        return <CheckCircle className="h-4 w-4" />
      case "pesagem_nova":
      case "pesagem_finalizada":
        return <Weight className="h-4 w-4" />
      case "entrega_iniciada":
        return <Clock className="h-4 w-4" />
      case "entrega_finalizada":
        return <CheckCircle className="h-4 w-4" />
      case "problema":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="ml-2">
            Pendente
          </Badge>
        )
      case "em_andamento":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 ml-2">
            Em andamento
          </Badge>
        )
      case "concluido":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 ml-2">
            Concluído
          </Badge>
        )
      case "atrasado":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 ml-2">
            Atrasado
          </Badge>
        )
      case "problema":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 ml-2">
            Problema
          </Badge>
        )
      default:
        return null
    }
  }

  // Function to format time elapsed
  const formatTimeElapsed = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: ptBR,
    })
  }

  // Function to get activity title
  const getActivityTitle = (activity: OperationalActivity) => {
    switch (activity.type) {
      case "coleta_nova":
        return `Nova coleta: ${activity.entityName}`
      case "coleta_finalizada":
        return `Coleta finalizada: ${activity.entityName}`
      case "pesagem_nova":
        return `Nova pesagem: ${activity.entityName}`
      case "pesagem_finalizada":
        return `Pesagem finalizada: ${activity.entityName}`
      case "entrega_iniciada":
        return `Entrega iniciada: ${activity.entityName}`
      case "entrega_finalizada":
        return `Entrega concluída: ${activity.entityName}`
      case "problema":
        return `Problema reportado: ${activity.entityName}`
      default:
        return activity.entityName
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Operações em andamento e recentemente concluídas</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          {!loading && !error && activities.length > 0 ? (
            <div className="divide-y">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">{getActivityIcon(activity)}</div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">{getActivityTitle(activity)}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{activity.userName}</span>
                      <span className="text-xs text-muted-foreground">{formatTimeElapsed(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
              <div className="h-12 w-12 mb-4 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              <p>Carregando atividades...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mb-4 text-red-500" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mb-4 opacity-20" />
              <p>Nenhuma atividade operacional recente</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

