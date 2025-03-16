"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ClienteAtendido, fetchClientesMaisAtendidos } from "@/lib/data-service"
import { AlertTriangle } from "lucide-react"

export function ClientesAtendidos() {
  const [clientes, setClientes] = useState<ClienteAtendido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchClientesMaisAtendidos()
        setClientes(data)
      } catch (error) {
        console.error("Erro ao carregar clientes mais atendidos:", error)
        setError("Falha ao carregar clientes. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadClientes()
    // Atualizar a cada 5 minutos
    const interval = setInterval(loadClientes, 300000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes Mais Atendidos</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded animate-pulse w-40"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
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
          <CardTitle>Clientes Mais Atendidos</CardTitle>
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
        <CardTitle>Clientes Mais Atendidos</CardTitle>
        <CardDescription>Número de coletas por cliente este mês</CardDescription>
      </CardHeader>
      <CardContent>
        {clientes.length > 0 ? (
          <div className="space-y-4">
            {clientes.map((cliente, index) => (
              <div className="flex items-center justify-between" key={index}>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{cliente.nome}</p>
                </div>
                <div className="font-medium">{cliente.coletas} coletas</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">Nenhum dado de cliente disponível</p>
        )}
      </CardContent>
    </Card>
  )
}

