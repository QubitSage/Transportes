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

interface NovoMotoristaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMotoristaCreated?: () => void
}

export function NovoMotoristaDialog({ open, onOpenChange, onMotoristaCreated }: NovoMotoristaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    cnh: "",
    categoriaCnh: "C",
    validadeCnh: new Date(),
    dataNascimento: new Date(),
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    status: "ativo",
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
      if (!formData.nome || !formData.cpf || !formData.cnh || !formData.telefone) {
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
      const motoristas = JSON.parse(localStorage.getItem("motoristas") || "[]")
      const novoMotorista = {
        id: `motorista-${Date.now()}`,
        ...formData,
        dataCriacao: new Date().toISOString(),
      }
      motoristas.push(novoMotorista)
      localStorage.setItem("motoristas", JSON.stringify(motoristas))

      toast({
        title: "Motorista cadastrado com sucesso",
        description: "O novo motorista foi registrado no sistema.",
      })

      // Resetar o formulário
      setFormData({
        nome: "",
        cpf: "",
        rg: "",
        cnh: "",
        categoriaCnh: "C",
        validadeCnh: new Date(),
        dataNascimento: new Date(),
        telefone: "",
        email: "",
        endereco: "",
        cidade: "",
        estado: "",
        cep: "",
        status: "ativo",
        observacoes: "",
      })

      // Fechar o diálogo
      onOpenChange(false)

      // Notificar o componente pai
      if (onMotoristaCreated) {
        onMotoristaCreated()
      }
    } catch (error) {
      console.error("Erro ao criar motorista:", error)
      toast({
        title: "Erro ao cadastrar motorista",
        description: "Ocorreu um erro ao tentar cadastrar o motorista. Tente novamente.",
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
            <DialogTitle>Novo Motorista</DialogTitle>
            <DialogDescription>Cadastre um novo motorista no sistema.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input id="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input id="cpf" value={formData.cpf} onChange={(e) => handleChange("cpf", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" value={formData.rg} onChange={(e) => handleChange("rg", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <DatePicker date={formData.dataNascimento} setDate={(date) => handleChange("dataNascimento", date)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnh">CNH *</Label>
                <Input id="cnh" value={formData.cnh} onChange={(e) => handleChange("cnh", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoriaCnh">Categoria CNH</Label>
                <Select value={formData.categoriaCnh} onValueChange={(value) => handleChange("categoriaCnh", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validadeCnh">Validade CNH</Label>
                <DatePicker date={formData.validadeCnh} setDate={(date) => handleChange("validadeCnh", date)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleChange("endereco", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" value={formData.cidade} onChange={(e) => handleChange("cidade", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" value={formData.estado} onChange={(e) => handleChange("estado", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" value={formData.cep} onChange={(e) => handleChange("cep", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="ferias">Em férias</SelectItem>
                  <SelectItem value="licenca">Em licença</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Informações adicionais sobre o motorista"
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
                "Cadastrar Motorista"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

