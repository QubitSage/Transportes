"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ProximaColeta, fetchProximasColetas } from "@/lib/data-service"
import { AlertTriangle } from "lucide-react"

export function ProximasColetas() {
  const [coletas, setColetas] = useState<ProximaColeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadColetas = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProximasColetas()
        setColetas(data)
      } catch (error) {
        console.error("Erro ao carregar próximas coletas:", error)
        setError("Falha ao carregar coletas. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadColetas()
    // Atualizar a cada 5 minutos
    const interval = setInterval(loadColetas, 300000)

    return () => clearInterval(interval)
  }, [])

  // Função para formatar a data de forma relativa
  const formatarDataRelativa = (dataString: string) => {
    const data = new Date(dataString)
    const hoje = new Date()
    const amanha = new Date(hoje)
    amanha.setDate(hoje.getDate() + 1)

    if (data.toDateString() === hoje.toDateString()) {
      return "Hoje"
    } else if (data.toDateString() === amanha.toDateString()) {
      return "Amanhã"
    } else {
      const diffTime = Math.abs(data.getTime() - hoje.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return `Em ${diffDays} dias`
    }
  }

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada":
        return "bg-green-500"
      case "em_andamento":
        return "bg-blue-500"
      case "atrasada":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximas Coletas</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-muted mr-2"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                </div>
                <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximas Coletas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Coletas</CardTitle>
        <CardDescription>Coletas agendadas para os próximos dias</CardDescription>
      </CardHeader>
      <CardContent>
        {coletas.length > 0 ? (
          <div className="space-y-4">
            {coletas.map((coleta) => (
              <div className="flex items-center" key={coleta.id}>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(coleta.status)} mr-2`}></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{coleta.cliente}</p>
                  <p className="text-sm text-muted-foreground">
                    {coleta.produto} - {coleta.quantidade} {coleta.unidade}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{formatarDataRelativa(coleta.dataAgendada)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">Nenhuma coleta agendada para os próximos dias</p>
        )}
      </CardContent>
    </Card>
  )
}

