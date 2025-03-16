"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, Package, Upload } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { useToast } from "@/components/ui/use-toast"

export default function ProdutosPage() {
  const { produtos, addProduto, updateProduto, deleteProduto } = useAppContext()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valorUnitario: 0,
    unidade: "",
  })

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Modifique a função handleImportFile para processar todos os registros do PDF
  const handleImportFile = async () => {
    if (!importFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para importar.",
        variant: "destructive",
      })
      return
    }

    try {
      // Verificar o tipo de arquivo
      const fileType = importFile.name.split(".").pop()?.toLowerCase()

      toast({
        title: "Importação iniciada",
        description: `Processando arquivo ${fileType?.toUpperCase()} de importação...`,
      })

      // Simulando um tempo de processamento
      setTimeout(async () => {
        let novosProdutos = []

        if (fileType === "pdf") {
          // Usar o processador específico para PDFs tabulares
          toast({
            title: "Processando PDF",
            description: "Extraindo dados tabulares do PDF...",
          })

          try {
            // Importar o processador de PDF
            const { extractDataFromPDF } = await import("@/utils/pdf-parser")

            // Processar o PDF - para produtos, usamos um template específico
            const dadosExtraidos = await extractDataFromPDF(importFile, "produtos")

            // Mapear os dados extraídos para o formato de produtos
            novosProdutos = dadosExtraidos.map((item) => ({
              id: Date.now() + Math.floor(Math.random() * 1000) + Math.random(), // Garantir IDs únicos
              nome: item.nome || "",
              descricao: item.descricao || "",
              valorUnitario: item.valorUnitario || 0,
              unidade: item.unidade || "Unidade",
            }))
          } catch (error) {
            console.error("Erro ao processar PDF:", error)
            toast({
              title: "Erro no processamento do PDF",
              description: "Não foi possível extrair os dados do PDF. Verifique o formato.",
              variant: "destructive",
            })
            return
          }
        } else {
          // Simulação para CSV/Excel como antes
          novosProdutos = [
            {
              id: Date.now(),
              nome: "Produto Importado 1",
              descricao: "Descrição do produto importado 1",
              valorUnitario: 150.5,
              unidade: "Kg",
            },
            {
              id: Date.now() + 1,
              nome: "Produto Importado 2",
              descricao: "Descrição do produto importado 2",
              valorUnitario: 75.25,
              unidade: "Unidade",
            },
          ]
        }

        // Adicionar os produtos importados
        novosProdutos.forEach((produto) => addProduto(produto))

        toast({
          title: "Importação concluída",
          description: `${novosProdutos.length} produtos foram importados com sucesso.`,
        })
        setIsImportDialogOpen(false)
        setImportFile(null)
      }, 2000)
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os dados. Verifique o formato do arquivo.",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "valorUnitario" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = () => {
    if (editingId) {
      updateProduto(editingId, formData)
      toast({ title: "Produto atualizado", description: "Os dados do produto foram atualizados com sucesso." })
    } else {
      addProduto(formData)
      toast({ title: "Produto adicionado", description: "O novo produto foi adicionado com sucesso." })
    }
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProduto(id)
      toast({ title: "Produto excluído", description: "O produto foi removido com sucesso." })
    }
  }

  const handleEdit = (produto: any) => {
    setFormData(produto)
    setEditingId(produto.id)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      valorUnitario: 0,
      unidade: "",
    })
    setEditingId(null)
  }

  const filteredProdutos = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Produtos</h1>
          <p className="text-muted-foreground">Gerencie os produtos cadastrados no sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importar Dados
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#007846] hover:bg-[#006038]">
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Edite as informações do produto e clique em salvar quando terminar."
                    : "Preencha as informações do produto e clique em salvar quando terminar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Nome do Produto
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome do produto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Descrição
                  </Label>
                  <Input
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Descrição do produto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorUnitario" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Valor Unitário (R$)
                    </Label>
                    <Input
                      id="valorUnitario"
                      name="valorUnitario"
                      type="number"
                      step="0.01"
                      value={formData.valorUnitario}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Unidade
                    </Label>
                    <Input
                      id="unidade"
                      name="unidade"
                      value={formData.unidade}
                      onChange={handleChange}
                      placeholder="Ex: Tonelada, Kg, Unidade"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="bg-[#007846] hover:bg-[#006038]">
                  {editingId ? "Atualizar" : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>Visualize, edite ou exclua os produtos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome ou descrição..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Unitário</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.length > 0 ? (
                filteredProdutos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#007846] flex items-center justify-center">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        {produto.nome}
                      </div>
                    </TableCell>
                    <TableCell>{produto.descricao}</TableCell>
                    <TableCell>
                      {produto.valorUnitario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </TableCell>
                    <TableCell>{produto.unidade}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(produto)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(produto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Importação */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Produtos</DialogTitle>
            <DialogDescription>
              Selecione um arquivo CSV, Excel ou PDF contendo os dados dos produtos para importar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="importFile">Arquivo</Label>
            <Input
              id="importFile"
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-muted-foreground">
              O arquivo deve conter as colunas: nome, descricao, valorUnitario, unidade. Para arquivos PDF, o sistema
              tentará extrair automaticamente os dados usando OCR.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportFile} className="bg-[#007846] hover:bg-[#006038]">
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

