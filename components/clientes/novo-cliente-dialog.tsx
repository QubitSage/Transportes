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
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface NovoClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClienteCreated?: () => void
}

export function NovoClienteDialog({ open, onOpenChange, onClienteCreated }: NovoClienteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    cnpjCpf: "",
    tipo: "pj",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    contato: "",
    observacoes: "",
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Remover a chamada de API e substituir por armazenamento local
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validação básica
      if (!formData.nome || !formData.cnpjCpf || !formData.telefone || !formData.email) {
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
      const clientes = JSON.parse(localStorage.getItem("clientes") || "[]")
      const novoCliente = {
        id: `cliente-${Date.now()}`,
        ...formData,
        dataCriacao: new Date().toISOString(),
      }
      clientes.push(novoCliente)
      localStorage.setItem("clientes", JSON.stringify(clientes))

      toast({
        title: "Cliente cadastrado com sucesso",
        description: "O novo cliente foi registrado no sistema.",
      })

      // Resetar o formulário
      setFormData({
        nome: "",
        cnpjCpf: "",
        tipo: "pj",
        telefone: "",
        email: "",
        endereco: "",
        cidade: "",
        estado: "",
        cep: "",
        contato: "",
        observacoes: "",
      })

      // Fechar o diálogo
      onOpenChange(false)

      // Notificar o componente pai
      if (onClienteCreated) {
        onClienteCreated()
      }
    } catch (error) {
      console.error("Erro ao criar cliente:", error)
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Ocorreu um erro ao tentar cadastrar o cliente. Tente novamente.",
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
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>Cadastre um novo cliente no sistema.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome/Razão Social *</Label>
                <Input id="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Cliente</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                    <SelectItem value="pf">Pessoa Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpjCpf">{formData.tipo === "pj" ? "CNPJ" : "CPF"} *</Label>
              <Input id="cnpjCpf" value={formData.cnpjCpf} onChange={(e) => handleChange("cnpjCpf", e.target.value)} />
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
                <Label htmlFor="email">Email *</Label>
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
              <Label htmlFor="contato">Nome do Contato</Label>
              <Input id="contato" value={formData.contato} onChange={(e) => handleChange("contato", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Informações adicionais sobre o cliente"
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
                "Cadastrar Cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

