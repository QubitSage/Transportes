"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Printer, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import PesagemTicket from "@/components/pesagens/pesagem-ticket"

export default function PesagemDetalhes() {
  const router = useRouter()
  const params = useParams()
  const [pesagem, setPesagem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPesagem = () => {
      try {
        setLoading(true)
        // Recuperar dados do localStorage
        const pesagensData = localStorage.getItem("pesagens")
        if (pesagensData) {
          const pesagens = JSON.parse(pesagensData)
          const foundPesagem = pesagens.find((p) => p.id === params.id)
          if (foundPesagem) {
            setPesagem(foundPesagem)
          } else {
            console.error("Pesagem não encontrada")
            // Redirecionar para a lista se não encontrar
            router.push("/dashboard/pesagens")
          }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da pesagem:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPesagem()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007846]"></div>
      </div>
    )
  }

  if (!pesagem) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Pesagem não encontrada</h2>
          <p className="mt-2 text-gray-600">A pesagem solicitada não existe ou foi removida.</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      Concluída: "bg-green-500",
      "Em andamento": "bg-blue-500",
      Pendente: "bg-yellow-500",
      Cancelada: "bg-red-500",
    }

    return <Badge className={`${statusMap[status] || "bg-gray-500"}`}>{status}</Badge>
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })
    } catch (error) {
      return dateString || "Data não disponível"
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Visualizar Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <PesagemTicket pesagem={pesagem} />
            </DialogContent>
          </Dialog>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Detalhes da Pesagem #{pesagem.id}</CardTitle>
            {getStatusBadge(pesagem.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações Gerais</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Data e Hora</p>
                  <p>{formatDate(pesagem.dataHora)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Pesagem</p>
                  <p>{pesagem.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Operador</p>
                  <p>{pesagem.operador}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nota Fiscal</p>
                  <p>{pesagem.notaFiscal || "N/A"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Dados da Pesagem</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Peso Bruto</p>
                  <p>{pesagem.pesoBruto} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tara</p>
                  <p>{pesagem.tara} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Peso Líquido</p>
                  <p className="font-bold text-lg">{pesagem.pesoLiquido} kg</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Veículo e Motorista</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Placa do Veículo</p>
                  <p>{pesagem.placaVeiculo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Motorista</p>
                  <p>{pesagem.motorista}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transportadora</p>
                  <p>{pesagem.transportadora || "N/A"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Produto e Cliente</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Produto</p>
                  <p>{pesagem.produto}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cliente/Fornecedor</p>
                  <p>{pesagem.cliente || pesagem.fornecedor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Observações</p>
                  <p>{pesagem.observacoes || "Nenhuma observação"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

