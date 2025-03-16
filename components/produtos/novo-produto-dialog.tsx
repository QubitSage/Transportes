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

interface NovoProdutoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProdutoCreated?: () => void
}

export function NovoProdutoDialog({ open, onOpenChange, onProdutoCreated }: NovoProdutoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    categoria: "",
    unidade: "kg",
    fornecedor: "",
    preco: "",
    estoque: "",
    estoqueMinimo: "",
    descricao: "",
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
      if (!formData.nome || !formData.codigo || !formData.categoria) {
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
      const produtos = JSON.parse(localStorage.getItem("produtos") || "[]")
      const novoProduto = {
        id: `produto-${Date.now()}`,
        ...formData,
        dataCriacao: new Date().toISOString(),
      }
      produtos.push(novoProduto)
      localStorage.setItem("produtos", JSON.stringify(produtos))

      toast({
        title: "Produto cadastrado com sucesso",
        description: "O novo produto foi registrado no sistema.",
      })

      // Resetar o formulário
      setFormData({
        nome: "",
        codigo: "",
        categoria: "",
        unidade: "kg",
        fornecedor: "",
        preco: "",
        estoque: "",
        estoqueMinimo: "",
        descricao: "",
      })

      // Fechar o diálogo
      onOpenChange(false)

      // Notificar o componente pai
      if (onProdutoCreated) {
        onProdutoCreated()
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error)
      toast({
        title: "Erro ao cadastrar produto",
        description: "Ocorreu um erro ao tentar cadastrar o produto. Tente novamente.",
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
            <DialogTitle>Novo Produto</DialogTitle>
            <DialogDescription>Cadastre um novo produto no sistema.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input id="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input id="codigo" value={formData.codigo} onChange={(e) => handleChange("codigo", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleChange("categoria", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="categoria1">Categoria 1</SelectItem>
                    <SelectItem value="categoria2">Categoria 2</SelectItem>
                    <SelectItem value="categoria3">Categoria 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade de Medida</Label>
                <Select value={formData.unidade} onValueChange={(value) => handleChange("unidade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Quilograma (kg)</SelectItem>
                    <SelectItem value="ton">Tonelada (ton)</SelectItem>
                    <SelectItem value="l">Litro (l)</SelectItem>
                    <SelectItem value="m3">Metro cúbico (m³)</SelectItem>
                    <SelectItem value="un">Unidade (un)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Select value={formData.fornecedor} onValueChange={(value) => handleChange("fornecedor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fornecedor1">Fornecedor 1</SelectItem>
                  <SelectItem value="fornecedor2">Fornecedor 2</SelectItem>
                  <SelectItem value="fornecedor3">Fornecedor 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preco">Preço Unitário (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => handleChange("preco", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque">Estoque Atual</Label>
                <Input
                  id="estoque"
                  type="number"
                  value={formData.estoque}
                  onChange={(e) => handleChange("estoque", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                <Input
                  id="estoqueMinimo"
                  type="number"
                  value={formData.estoqueMinimo}
                  onChange={(e) => handleChange("estoqueMinimo", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Descrição detalhada do produto"
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
                "Cadastrar Produto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

