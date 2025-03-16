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
import ColetaTicket from "@/components/coletas/coleta-ticket"

export default function ColetaDetalhes() {
  const router = useRouter()
  const params = useParams()
  const [coleta, setColeta] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchColeta = () => {
      try {
        setLoading(true)
        // Recuperar dados do localStorage
        const coletasData = localStorage.getItem("coletas")
        if (coletasData) {
          const coletas = JSON.parse(coletasData)
          const foundColeta = coletas.find((c) => c.id === params.id)
          if (foundColeta) {
            setColeta(foundColeta)
          } else {
            console.error("Coleta não encontrada")
            // Redirecionar para a lista se não encontrar
            router.push("/dashboard/coletas")
          }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da coleta:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchColeta()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007846]"></div>
      </div>
    )
  }

  if (!coleta) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Coleta não encontrada</h2>
          <p className="mt-2 text-gray-600">A coleta solicitada não existe ou foi removida.</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      Concluída: "bg-green-500",
      "Em andamento": "bg-blue-500",
      Agendada: "bg-yellow-500",
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
              <ColetaTicket coleta={coleta} />
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
            <CardTitle>Detalhes da Coleta #{coleta.id}</CardTitle>
            {getStatusBadge(coleta.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações Gerais</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Data Agendada</p>
                  <p>{formatDate(coleta.dataAgendada)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Conclusão</p>
                  <p>{coleta.dataConclusao ? formatDate(coleta.dataConclusao) : "Não concluída"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Coleta</p>
                  <p>{coleta.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Responsável</p>
                  <p>{coleta.responsavel}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Cliente e Endereço</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p>{coleta.cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p>{coleta.endereco}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contato</p>
                  <p>{coleta.contato || "N/A"}</p>
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
                  <p>{coleta.placaVeiculo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Motorista</p>
                  <p>{coleta.motorista}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Materiais e Observações</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Materiais</p>
                  <p>{coleta.materiais}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantidade Estimada</p>
                  <p>{coleta.quantidadeEstimada} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Observações</p>
                  <p>{coleta.observacoes || "Nenhuma observação"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

