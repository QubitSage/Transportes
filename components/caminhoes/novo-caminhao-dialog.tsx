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

interface NovoCaminhaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCaminhaoCreated?: () => void
}

export function NovoCaminhaoDialog({ open, onOpenChange, onCaminhaoCreated }: NovoCaminhaoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    marca: "",
    ano: "",
    capacidade: "",
    tipo: "truck",
    motorista: "",
    status: "disponivel",
    ultimaManutencao: new Date(),
    proximaManutencao: new Date(),
    observacoes: "",
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validação básica
      if (!formData.placa || !formData.modelo || !formData.marca || !formData.capacidade) {
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
      const caminhoes = JSON.parse(localStorage.getItem("caminhoes") || "[]")
      const novoCaminhao = {
        id: `caminhao-${Date.now()}`,
        ...formData,
        dataCriacao: new Date().toISOString(),
      }
      caminhoes.push(novoCaminhao)
      localStorage.setItem("caminhoes", JSON.stringify(caminhoes))

      toast({
        title: "Caminhão cadastrado com sucesso",
        description: "O novo caminhão foi registrado no sistema.",
      })

      // Resetar o formulário
      setFormData({
        placa: "",
        modelo: "",
        marca: "",
        ano: "",
        capacidade: "",
        tipo: "truck",
        motorista: "",
        status: "disponivel",
        ultimaManutencao: new Date(),
        proximaManutencao: new Date(),
        observacoes: "",
      })

      // Fechar o diálogo
      onOpenChange(false)

      // Notificar o componente pai
      if (onCaminhaoCreated) {
        onCaminhaoCreated()
      }
    } catch (error) {
      console.error("Erro ao criar caminhão:", error)
      toast({
        title: "Erro ao cadastrar caminhão",
        description: "Ocorreu um erro ao tentar cadastrar o caminhão. Tente novamente.",
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
            <DialogTitle>Novo Caminhão</DialogTitle>
            <DialogDescription>Cadastre um novo caminhão no sistema.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa *</Label>
                <Input id="placa" value={formData.placa} onChange={(e) => handleChange("placa", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Veículo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Caminhão</SelectItem>
                    <SelectItem value="carreta">Carreta</SelectItem>
                    <SelectItem value="bitrem">Bitrem</SelectItem>
                    <SelectItem value="rodotrem">Rodotrem</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca">Marca *</Label>
                <Input id="marca" value={formData.marca} onChange={(e) => handleChange("marca", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo *</Label>
                <Input id="modelo" value={formData.modelo} onChange={(e) => handleChange("modelo", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Input id="ano" value={formData.ano} onChange={(e) => handleChange("ano", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade (kg) *</Label>
                <Input
                  id="capacidade"
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) => handleChange("capacidade", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motorista">Motorista Designado</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="em_uso">Em uso</SelectItem>
                  <SelectItem value="manutencao">Em manutenção</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ultimaManutencao">Última Manutenção</Label>
                <DatePicker
                  date={formData.ultimaManutencao}
                  setDate={(date) => handleChange("ultimaManutencao", date)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proximaManutencao">Próxima Manutenção</Label>
                <DatePicker
                  date={formData.proximaManutencao}
                  setDate={(date) => handleChange("proximaManutencao", date)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Informações adicionais sobre o caminhão"
              />
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
                "Cadastrar Caminhão"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

