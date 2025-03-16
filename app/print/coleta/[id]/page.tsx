"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ColetaTicket from "@/components/coletas/coleta-ticket"

export default function PrintColetaPage() {
  const params = useParams()
  const [coleta, setColeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar dados da coleta do localStorage
    const id = params.id as string
    const storedColetas = localStorage.getItem("coletas")

    if (storedColetas) {
      const coletas = JSON.parse(storedColetas)
      const foundColeta = coletas.find((c: any) => c.id === id)

      if (foundColeta) {
        setColeta(foundColeta)
      }
    }

    setLoading(false)

    // Imprimir automaticamente após carregar
    if (!loading && coleta) {
      setTimeout(() => {
        window.print()
      }, 500)
    }
  }, [params.id, loading])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!coleta) {
    return <div className="flex items-center justify-center min-h-screen">Coleta não encontrada</div>
  }

  return (
    <div className="p-4">
      <ColetaTicket coleta={coleta} />
    </div>
  )
}

