"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { v4 as uuidv4 } from "uuid"

interface NovaColetaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onColetaCreated: () => void
  editMode?: boolean
  coletaData?: any
}

export function NovaColetaDialog({
  open,
  onOpenChange,
  onColetaCreated,
  editMode = false,
  coletaData,
}: NovaColetaDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    cliente: "",
    dataAgendada: new Date(),
    dataConclusao: null,
    endereco: "",
    tipo: "",
    responsavel: "",
    placaVeiculo: "",
    motorista: "",
    materiais: "",
    quantidadeEstimada: "",
    contato: "",
    status: "Agendada",
    observacoes: "",
  })

  // Carregar dados para edição se estiver em modo de edição
  useEffect(() => {
    if (editMode && coletaData) {
      setFormData({
        ...coletaData,
        dataAgendada: coletaData.dataAgendada ? new Date(coletaData.dataAgendada) : new Date(),
        dataConclusao: coletaData.dataConclusao ? new Date(coletaData.dataConclusao) : null,
      })
    } else {
      // Reset form quando abrir em modo de criação
      setFormData({
        id: "",
        cliente: "",
        dataAgendada: new Date(),
        dataConclusao: null,
        endereco: "",
        tipo: "",
        responsavel: "",
        placaVeiculo: "",
        motorista: "",
        materiais: "",
        quantidadeEstimada: "",
        contato: "",
        status: "Agendada",
        observacoes: "",
      })
    }
  }, [editMode, coletaData, open])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    // Carregar coletas existentes
    const storedColetas = localStorage.getItem("coletas")
    let coletas = storedColetas ? JSON.parse(storedColetas) : []

    if (editMode) {
      // Atualizar coleta existente
      coletas = coletas.map((coleta: any) =>
        coleta.id === formData.id
          ? {
              ...formData,
              dataAgendada: formData.dataAgendada.toISOString(),
              dataConclusao: formData.dataConclusao ? formData.dataConclusao.toISOString() : null,
            }
          : coleta,
      )
    } else {
      // Adicionar nova coleta
      coletas.push({
        ...formData,
        id: `coleta-${uuidv4().substring(0, 8)}`,
        dataAgendada: formData.dataAgendada.toISOString(),
        dataConclusao: formData.dataConclusao ? formData.dataConclusao.toISOString() : null,
      })
    }

    // Salvar no localStorage
    localStorage.setItem("coletas", JSON.stringify(coletas))

    // Fechar diálogo e notificar componente pai
    onOpenChange(false)
    onColetaCreated()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{editMode ? "Editar Coleta" : "Nova Coleta"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Select value={formData.cliente} onValueChange={(value) => handleChange("cliente", value)}>
              <SelectTrigger id="cliente">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cliente 1">Cliente 1</SelectItem>
                <SelectItem value="Cliente 2">Cliente 2</SelectItem>
                <SelectItem value="Cliente 3">Cliente 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataAgendada">Data Agendada</Label>
            <DatePicker date={formData.dataAgendada} setDate={(date) => handleChange("dataAgendada", date)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" value={formData.endereco} onChange={(e) => handleChange("endereco", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Resíduo</Label>
            <Select value={formData.tipo} onValueChange={(value) => handleChange("tipo", value)}>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Resíduos Sólidos">Resíduos Sólidos</SelectItem>
                <SelectItem value="Resíduos Orgânicos">Resíduos Orgânicos</SelectItem>
                <SelectItem value="Resíduos Recicláveis">Resíduos Recicláveis</SelectItem>
                <SelectItem value="Resíduos Perigosos">Resíduos Perigosos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              value={formData.responsavel}
              onChange={(e) => handleChange("responsavel", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placaVeiculo">Placa do Veículo</Label>
            <Input
              id="placaVeiculo"
              value={formData.placaVeiculo}
              onChange={(e) => handleChange("placaVeiculo", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motorista">Motorista</Label>
            <Select value={formData.motorista} onValueChange={(value) => handleChange("motorista", value)}>
              <SelectTrigger id="motorista">
                <SelectValue placeholder="Selecione o motorista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="João Silva">João Silva</SelectItem>
                <SelectItem value="Pedro Motorista">Pedro Motorista</SelectItem>
                <SelectItem value="Carlos Oliveira">Carlos Oliveira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="materiais">Materiais</Label>
            <Input
              id="materiais"
              value={formData.materiais}
              onChange={(e) => handleChange("materiais", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidadeEstimada">Quantidade Estimada (kg)</Label>
            <Input
              id="quantidadeEstimada"
              type="number"
              value={formData.quantidadeEstimada}
              onChange={(e) => handleChange("quantidadeEstimada", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contato">Contato</Label>
            <Input id="contato" value={formData.contato} onChange={(e) => handleChange("contato", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agendada">Agendada</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-[#007846] hover:bg-[#006038]">
            {editMode ? "Salvar Alterações" : "Criar Coleta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

