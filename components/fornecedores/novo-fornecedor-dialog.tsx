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
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface NovoFornecedorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFornecedorCreated?: () => void
}

export function NovoFornecedorDialog({ open, onOpenChange, onFornecedorCreated }: NovoFornecedorDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
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
      if (!formData.nome || !formData.cnpj || !formData.telefone || !formData.email) {
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
      const fornecedores = JSON.parse(localStorage.getItem("fornecedores") || "[]")
      const novoFornecedor = {
        id: `fornecedor-${Date.now()}`,
        ...formData,
        dataCriacao: new Date().toISOString(),
      }
      fornecedores.push(novoFornecedor)
      localStorage.setItem("fornecedores", JSON.stringify(fornecedores))

      toast({
        title: "Fornecedor criado com sucesso",
        description: "O novo fornecedor foi registrado no sistema.",
      })

      // Resetar o formulário
      setFormData({
        nome: "",
        cnpj: "",
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
      if (onFornecedorCreated) {
        onFornecedorCreated()
      }
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error)
      toast({
        title: "Erro ao criar fornecedor",
        description: "Ocorreu um erro ao tentar criar o fornecedor. Tente novamente.",
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
            <DialogTitle>Novo Fornecedor</DialogTitle>
            <DialogDescription>Cadastre um novo fornecedor no sistema.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome/Razão Social *</Label>
                <Input id="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input id="cnpj" value={formData.cnpj} onChange={(e) => handleChange("cnpj", e.target.value)} />
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
                placeholder="Informações adicionais sobre o fornecedor"
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
                "Cadastrar Fornecedor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

