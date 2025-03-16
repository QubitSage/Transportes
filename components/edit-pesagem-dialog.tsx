"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { logUserAction } from "@/lib/logging"

interface Pesagem {
  id: string
  data: string
  ticket: string
  produto: string
  fornecedor: string
  cliente: string
  motorista: string
  placa: string
  pesoEntrada: number
  pesoSaida: number
  pesoLiquido: number
  status: "Pendente" | "Concluída" | "Cancelada"
  observacoes?: string
}

interface EditPesagemDialogProps {
  pesagem: Pesagem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (pesagem: Pesagem) => void
}

export function EditPesagemDialog({ pesagem, open, onOpenChange, onSave }: EditPesagemDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Pesagem | null>(pesagem)

  // Reset form when pesagem changes
  if (pesagem && (!formData || formData.id !== pesagem.id)) {
    setFormData(pesagem)
  }

  if (!formData) return null

  const handleChange = (field: keyof Pesagem, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleNumberChange = (field: keyof Pesagem, value: string) => {
    const numValue = value === "" ? 0 : Number(value)
    handleChange(field, numValue)

    // If we're updating pesoEntrada or pesoSaida, recalculate pesoLiquido
    if (field === "pesoEntrada" || field === "pesoSaida") {
      const pesoEntrada = field === "pesoEntrada" ? numValue : formData.pesoEntrada
      const pesoSaida = field === "pesoSaida" ? numValue : formData.pesoSaida

      // Only calculate if both weights are greater than 0
      if (pesoEntrada > 0 && pesoSaida > 0) {
        const pesoLiquido = Math.abs(pesoEntrada - pesoSaida)
        handleChange("pesoLiquido", pesoLiquido)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData) return

    try {
      // Here you would typically make an API call to update the pesagem
      // For now, we'll just simulate a successful update

      // Log the action
      await logUserAction({
        action: "update",
        resource: "pesagem",
        resourceId: formData.id,
        details: `Pesagem ${formData.ticket} atualizada`,
      })

      onSave(formData)

      toast({
        title: "Pesagem atualizada",
        description: `A pesagem ${formData.ticket} foi atualizada com sucesso.`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating pesagem:", error)
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar a pesagem. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Pesagem</DialogTitle>
            <DialogDescription>
              Atualize as informações da pesagem {formData.ticket}. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">ID</Label>
                <Input id="id" value={formData.id} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket">Ticket</Label>
                <Input id="ticket" value={formData.ticket} onChange={(e) => handleChange("ticket", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleChange("data", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Pendente" | "Concluída" | "Cancelada") => handleChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select value={formData.cliente} onValueChange={(value) => handleChange("cliente", value)}>
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fazenda Serra da Prata">Fazenda Serra da Prata</SelectItem>
                    <SelectItem value="Fazenda Boa Esperança">Fazenda Boa Esperança</SelectItem>
                    <SelectItem value="Fazenda Novo Horizonte">Fazenda Novo Horizonte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Select value={formData.fornecedor} onValueChange={(value) => handleChange("fornecedor", value)}>
                  <SelectTrigger id="fornecedor">
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fertilizantes Norte do Brasil LTDA">
                      Fertilizantes Norte do Brasil LTDA
                    </SelectItem>
                    <SelectItem value="Distribuidora Central LTDA">Distribuidora Central LTDA</SelectItem>
                    <SelectItem value="Agropecuária Sul LTDA">Agropecuária Sul LTDA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Select value={formData.produto} onValueChange={(value) => handleChange("produto", value)}>
                  <SelectTrigger id="produto">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fertilizantes">Fertilizantes</SelectItem>
                    <SelectItem value="Calcário">Calcário</SelectItem>
                    <SelectItem value="Sementes">Sementes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motorista">Motorista</Label>
                <Select value={formData.motorista} onValueChange={(value) => handleChange("motorista", value)}>
                  <SelectTrigger id="motorista">
                    <SelectValue placeholder="Selecione um motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEANDRO">LEANDRO</SelectItem>
                    <SelectItem value="GILMAR">GILMAR</SelectItem>
                    <SelectItem value="MARCOS">MARCOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input id="placa" value={formData.placa} onChange={(e) => handleChange("placa", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pesoEntrada">Peso de Entrada (kg)</Label>
                <Input
                  id="pesoEntrada"
                  type="number"
                  value={formData.pesoEntrada}
                  onChange={(e) => handleNumberChange("pesoEntrada", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesoSaida">Peso de Saída (kg)</Label>
                <Input
                  id="pesoSaida"
                  type="number"
                  value={formData.pesoSaida}
                  onChange={(e) => handleNumberChange("pesoSaida", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesoLiquido">Peso Líquido (kg)</Label>
                <Input id="pesoLiquido" type="number" value={formData.pesoLiquido} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes || ""}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#007846] hover:bg-[#006038]">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

