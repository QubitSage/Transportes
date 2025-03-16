"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type DashboardStats as DashboardStatsType, fetchDashboardStats } from "@/lib/data-service"
import { ArrowUpIcon, ArrowDownIcon, DollarSign, Users, Weight, Truck, AlertTriangle } from "lucide-react"

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
        setError("Falha ao carregar estatísticas. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
    // Atualizar a cada 5 minutos
    const interval = setInterval(loadStats, 300000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardContent className="pt-6 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Nenhuma estatística disponível</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pesagens Hoje</CardTitle>
          <Weight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pesagensHoje.total}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {stats.pesagensHoje.variacao > 0 ? (
              <>
                <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />+{stats.pesagensHoje.variacao}% em relação a
                ontem
              </>
            ) : stats.pesagensHoje.variacao < 0 ? (
              <>
                <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                {stats.pesagensHoje.variacao}% em relação a ontem
              </>
            ) : (
              "Sem variação em relação a ontem"
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Coletas Ativas</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.coletasAtivas.total}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {stats.coletasAtivas.variacao > 0 ? (
              <>
                <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />+{stats.coletasAtivas.variacao}% em relação à
                semana passada
              </>
            ) : stats.coletasAtivas.variacao < 0 ? (
              <>
                <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                {stats.coletasAtivas.variacao}% em relação à semana passada
              </>
            ) : (
              "Sem variação em relação à semana passada"
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volume Total (ton)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.volumeTotal.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {stats.volumeTotal.variacao > 0 ? (
              <>
                <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />+{stats.volumeTotal.variacao}% em relação ao mês
                passado
              </>
            ) : stats.volumeTotal.variacao < 0 ? (
              <>
                <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                {stats.volumeTotal.variacao}% em relação ao mês passado
              </>
            ) : (
              "Sem variação em relação ao mês passado"
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Motoristas Ativos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.motoristasAtivos.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.motoristasAtivos.novos > 0
              ? `+${stats.motoristasAtivos.novos} novos motoristas este mês`
              : "Nenhum novo motorista este mês"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

