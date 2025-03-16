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

interface Coleta {
  id: string
  numero: string
  data: string
  cliente: string
  fornecedor: string
  produto: string
  motorista: string
  placa: string
  origem: string
  destino: string
  status: string
  observacoes?: string
}

interface EditColetaDialogProps {
  coleta: Coleta | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (coleta: Coleta) => void
}

export function EditColetaDialog({ coleta, open, onOpenChange, onSave }: EditColetaDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Coleta | null>(coleta)

  // Reset form when coleta changes
  if (coleta && (!formData || formData.id !== coleta.id)) {
    setFormData(coleta)
  }

  if (!formData) return null

  const handleChange = (field: keyof Coleta, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData) return

    try {
      // Here you would typically make an API call to update the coleta
      // For now, we'll just simulate a successful update

      // Log the action
      await logUserAction({
        action: "update",
        resource: "coleta",
        resourceId: formData.id,
        details: `Coleta ${formData.numero} atualizada`,
      })

      onSave(formData)

      toast({
        title: "Coleta atualizada",
        description: `A coleta ${formData.numero} foi atualizada com sucesso.`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating coleta:", error)
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar a coleta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Coleta</DialogTitle>
            <DialogDescription>
              Atualize as informações da coleta {formData.numero}. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleChange("numero", e.target.value)}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleChange("data", e.target.value)}
                />
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

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agendada">Agendada</SelectItem>
                    <SelectItem value="Em Trânsito">Em Trânsito</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origem">Origem</Label>
                <Input id="origem" value={formData.origem} onChange={(e) => handleChange("origem", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destino">Destino</Label>
                <Input
                  id="destino"
                  value={formData.destino}
                  onChange={(e) => handleChange("destino", e.target.value)}
                />
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

