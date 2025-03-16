"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ProdutoTransportado, fetchProdutosMaisTransportados } from "@/lib/data-service"
import { AlertTriangle } from "lucide-react"

export function ProdutosTransportados() {
  const [produtos, setProdutos] = useState<ProdutoTransportado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProdutos = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProdutosMaisTransportados()
        setProdutos(data)
      } catch (error) {
        console.error("Erro ao carregar produtos mais transportados:", error)
        setError("Falha ao carregar produtos. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadProdutos()
    // Atualizar a cada 5 minutos
    const interval = setInterval(loadProdutos, 300000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Transportados</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
                </div>
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
          <CardTitle>Produtos Mais Transportados</CardTitle>
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
        <CardTitle>Produtos Mais Transportados</CardTitle>
        <CardDescription>Volume por tipo de produto este mês</CardDescription>
      </CardHeader>
      <CardContent>
        {produtos.length > 0 ? (
          <div className="space-y-4">
            {produtos.map((produto, index) => (
              <div className="flex items-center justify-between" key={index}>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{produto.nome}</p>
                  <div className="text-sm text-muted-foreground">{produto.percentual}% do volume total</div>
                </div>
                <div className="font-medium">{produto.volume} ton</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">Nenhum dado de produto disponível</p>
        )}
      </CardContent>
    </Card>
  )
}

