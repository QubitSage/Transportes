"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import PesagemTicket from "@/components/pesagens/pesagem-ticket"

export default function PrintPesagemPage() {
  const params = useParams()
  const [pesagem, setPesagem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar dados da pesagem do localStorage
    const id = params.id as string
    const storedPesagens = localStorage.getItem("pesagens")

    if (storedPesagens) {
      const pesagens = JSON.parse(storedPesagens)
      const foundPesagem = pesagens.find((p: any) => p.id === id)

      if (foundPesagem) {
        setPesagem(foundPesagem)
      }
    }

    setLoading(false)

    // Imprimir automaticamente após carregar
    if (!loading && pesagem) {
      setTimeout(() => {
        window.print()
      }, 500)
    }
  }, [params.id, loading])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!pesagem) {
    return <div className="flex items-center justify-center min-h-screen">Pesagem não encontrada</div>
  }

  return (
    <div className="p-4">
      <PesagemTicket pesagem={pesagem} />
    </div>
  )
}

