"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface NovaPesagemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPesagemCreated?: () => void
}

export function NovaPesagemDialog({ open, onOpenChange, onPesagemCreated }: NovaPesagemDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    coleta: "",
    cliente: "",
    motorista: "",
    caminhao: "",
    produto: "",
    dataPesagem: new Date(),
    pesoEntrada: "",
    pesoSaida: "",
    pesoLiquido: "",
    observacoes: "",
    status: "pendente",
    valor: "",
    pago: false,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Calcular peso líquido automaticamente
      if (field === "pesoEntrada" || field === "pesoSaida") {
        const pesoEntrada =
          field === "pesoEntrada" ? Number.parseFloat(value) || 0 : Number.parseFloat(prev.pesoEntrada) || 0
        const pesoSaida = field === "pesoSaida" ? Number.parseFloat(value) || 0 : Number.parseFloat(prev.pesoSaida) || 0

        if (pesoEntrada && pesoSaida) {
          newData.pesoLiquido = Math.abs(pesoEntrada - pesoSaida).toString()
        }
      }

      return newData
    })
  }

  // Remover a chamada de API e substituir por armazenamento local
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validação básica
      if (!formData.coleta || !formData.produto || !formData.pesoEntrada || !formData.pesoSaida) {
        toast({
          title: "Erro de validação",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Simular um pequeno atraso para feedback visual
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Salvar no localStorage
      const pesagens = JSON.parse(localStorage.getItem("pesagens") || "[]")
      const novaPesagem = {
        id: `pesagem-${Date.now()}`,
        ...formData,
        dataCriacao: new Date().toISOString(),
      }
      pesagens.push(novaPesagem)
      localStorage.setItem("pesagens", JSON.stringify(pesagens))

      toast({
        title: "Pesagem registrada com sucesso",
        description: "A nova pesagem foi registrada no sistema.",
      })

      // Resetar o formulário
      setFormData({
        coleta: "",
        cliente: "",
        motorista: "",
        caminhao: "",
        produto: "",
        dataPesagem: new Date(),
        pesoEntrada: "",
        pesoSaida: "",
        pesoLiquido: "",
        observacoes: "",
        status: "pendente",
        valor: "",
        pago: false,
      })

      // Fechar o diálogo
      onOpenChange(false)

      // Notificar o componente pai
      if (onPesagemCreated) {
        onPesagemCreated()
      }
    } catch (error) {
      console.error("Erro ao criar pesagem:", error)
      toast({
        title: "Erro ao registrar pesagem",
        description: "Ocorreu um erro ao tentar registrar a pesagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Pesagem</DialogTitle>
            <DialogDescription>Registre uma nova pesagem no sistema.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coleta">Coleta *</Label>
                <Select value={formData.coleta} onValueChange={(value) => handleChange("coleta", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coleta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coleta1">Coleta #001</SelectItem>
                    <SelectItem value="coleta2">Coleta #002</SelectItem>
                    <SelectItem value="coleta3">Coleta #003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataPesagem">Data da Pesagem *</Label>
                <DatePicker date={formData.dataPesagem} setDate={(date) => handleChange("dataPesagem", date)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select value={formData.cliente} onValueChange={(value) => handleChange("cliente", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente1">Cliente 1</SelectItem>
                    <SelectItem value="cliente2">Cliente 2</SelectItem>
                    <SelectItem value="cliente3">Cliente 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motorista">Motorista</Label>
                <Select value={formData.motorista} onValueChange={(value) => handleChange("motorista", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorista1">Motorista 1</SelectItem>
                    <SelectItem value="motorista2">Motorista 2</SelectItem>
                    <SelectItem value="motorista3">Motorista 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caminhao">Caminhão</Label>
                <Select value={formData.caminhao} onValueChange={(value) => handleChange("caminhao", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o caminhão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caminhao1">Caminhão 1</SelectItem>
                    <SelectItem value="caminhao2">Caminhão 2</SelectItem>
                    <SelectItem value="caminhao3">Caminhão 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="produto">Produto *</Label>
              <Select value={formData.produto} onValueChange={(value) => handleChange("produto", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produto1">Produto 1</SelectItem>
                  <SelectItem value="produto2">Produto 2</SelectItem>
                  <SelectItem value="produto3">Produto 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pesoEntrada">Peso de Entrada (kg) *</Label>
                <Input
                  id="pesoEntrada"
                  type="number"
                  value={formData.pesoEntrada}
                  onChange={(e) => handleChange("pesoEntrada", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pesoSaida">Peso de Saída (kg) *</Label>
                <Input
                  id="pesoSaida"
                  type="number"
                  value={formData.pesoSaida}
                  onChange={(e) => handleChange("pesoSaida", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pesoLiquido">Peso Líquido (kg)</Label>
                <Input id="pesoLiquido" type="number" value={formData.pesoLiquido} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Informações adicionais sobre a pesagem"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_processamento">Em processamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                value={formData.valor}
                onChange={(e) => handleChange("valor", e.target.value)}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pago">Status de Pagamento</Label>
              <Select value={formData.pago ? "sim" : "nao"} onValueChange={(value) => handleChange("pago", value === "sim")}>
                <SelectTrigger>
                  <SelectValue placeholder="Status de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao">Não pago</SelectItem>
                  <SelectItem value="sim">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Registrar Pesagem"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

