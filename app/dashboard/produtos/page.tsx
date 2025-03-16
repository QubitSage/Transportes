"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, Eye, FileUp, Plus, Search, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import ImportPdfDialog from "@/components/produtos/import-pdf-dialog"

interface Produto {
  id: string
  codigo: string
  nome: string
  descricao: string
  categoria: string
  unidade: string
  precoUnitario: string
  estoque: string
  fornecedor: string
  status: "ativo" | "inativo"
}

export default function ProdutosPage() {
  const { toast } = useToast()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const [editedProduto, setEditedProduto] = useState<Produto | null>(null)

  const itemsPerPage = 15
  const totalPages = Math.ceil(produtos.length / itemsPerPage)

  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = () => {
    setIsLoading(true)
    try {
      const storedProdutos = localStorage.getItem("produtos")
      if (storedProdutos) {
        setProdutos(JSON.parse(storedProdutos))
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProdutosImported = (importedProdutos: Produto[]) => {
    const updatedProdutos = [...produtos]

    // Adicionar apenas produtos que não existem (baseado no código)
    importedProdutos.forEach((importedProduto) => {
      const existingIndex = updatedProdutos.findIndex((p) => p.codigo === importedProduto.codigo)

      if (existingIndex === -1) {
        updatedProdutos.push(importedProduto)
      }
    })

    setProdutos(updatedProdutos)
    localStorage.setItem("produtos", JSON.stringify(updatedProdutos))

    toast({
      title: "Importação concluída",
      description: `${importedProdutos.length} produtos importados com sucesso.`,
    })

    setIsImportDialogOpen(false)
  }

  const handleViewProduto = (produto: Produto) => {
    setSelectedProduto(produto)
    setIsViewDialogOpen(true)
  }

  const handleEditProduto = (produto: Produto) => {
    setSelectedProduto(produto)
    setEditedProduto({ ...produto })
    setIsEditDialogOpen(true)
  }

  const handleDeleteProduto = (produto: Produto) => {
    setSelectedProduto(produto)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedProduto) {
      const updatedProdutos = produtos.filter((p) => p.id !== selectedProduto.id)
      setProdutos(updatedProdutos)
      localStorage.setItem("produtos", JSON.stringify(updatedProdutos))

      toast({
        title: "Produto excluído",
        description: `O produto ${selectedProduto.nome} foi excluído com sucesso.`,
      })

      setIsDeleteDialogOpen(false)
    }
  }

  const saveEditedProduto = () => {
    if (editedProduto) {
      const updatedProdutos = produtos.map((p) => (p.id === editedProduto.id ? editedProduto : p))
      setProdutos(updatedProdutos)
      localStorage.setItem("produtos", JSON.stringify(updatedProdutos))

      toast({
        title: "Produto atualizado",
        description: `O produto ${editedProduto.nome} foi atualizado com sucesso.`,
      })

      setIsEditDialogOpen(false)
    }
  }

  const filteredProdutos = produtos.filter((produto) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      produto.nome.toLowerCase().includes(searchTermLower) ||
      produto.codigo.toLowerCase().includes(searchTermLower) ||
      produto.categoria.toLowerCase().includes(searchTermLower)
    )
  })

  const paginatedProdutos = filteredProdutos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const activeProdutos = filteredProdutos.filter((produto) => produto.status === "ativo")

  const paginatedActiveProdutos = activeProdutos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const inactiveProdutos = filteredProdutos.filter((produto) => produto.status === "inativo")

  const paginatedInactiveProdutos = inactiveProdutos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Importar PDF
          </Button>
          <Link href="/dashboard/produtos/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="inativos">Inativos</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Lista de Produtos</CardTitle>
            <CardDescription>
              {isLoading
                ? "Carregando produtos..."
                : filteredProdutos.length === 0
                  ? "Nenhum produto encontrado."
                  : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredProdutos.length,
                    )} de ${filteredProdutos.length} produtos`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="todos">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Carregando...</p>
                </div>
              ) : paginatedProdutos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Nenhum produto encontrado. Importe produtos ou adicione um novo.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProdutos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">{produto.codigo}</TableCell>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell>{produto.categoria}</TableCell>
                        <TableCell>R$ {produto.precoUnitario}</TableCell>
                        <TableCell>
                          {produto.estoque} {produto.unidade}
                        </TableCell>
                        <TableCell>
                          <Badge variant={produto.status === "ativo" ? "default" : "secondary"}>
                            {produto.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewProduto(produto)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditProduto(produto)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteProduto(produto)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="ativos">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Carregando...</p>
                </div>
              ) : paginatedActiveProdutos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum produto ativo encontrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedActiveProdutos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">{produto.codigo}</TableCell>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell>{produto.categoria}</TableCell>
                        <TableCell>R$ {produto.precoUnitario}</TableCell>
                        <TableCell>
                          {produto.estoque} {produto.unidade}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewProduto(produto)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditProduto(produto)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteProduto(produto)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="inativos">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Carregando...</p>
                </div>
              ) : paginatedInactiveProdutos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum produto inativo encontrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInactiveProdutos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">{produto.codigo}</TableCell>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell>{produto.categoria}</TableCell>
                        <TableCell>R$ {produto.precoUnitario}</TableCell>
                        <TableCell>
                          {produto.estoque} {produto.unidade}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Inativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewProduto(produto)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditProduto(produto)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteProduto(produto)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {filteredProdutos.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Anterior
                  </Button>
                  <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Diálogo de Importação */}
      <ImportPdfDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleProdutosImported}
      />

      {/* Diálogo de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Produto</DialogTitle>
            <DialogDescription>Informações completas do produto selecionado.</DialogDescription>
          </DialogHeader>
          {selectedProduto && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Código</Label>
                <p className="font-medium">{selectedProduto.codigo}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Nome</Label>
                <p className="font-medium">{selectedProduto.nome}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p className="font-medium">{selectedProduto.descricao}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Categoria</Label>
                <p className="font-medium">{selectedProduto.categoria}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unidade</Label>
                <p className="font-medium">{selectedProduto.unidade}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Preço Unitário</Label>
                <p className="font-medium">R$ {selectedProduto.precoUnitario}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Estoque</Label>
                <p className="font-medium">
                  {selectedProduto.estoque} {selectedProduto.unidade}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fornecedor</Label>
                <p className="font-medium">{selectedProduto.fornecedor}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant={selectedProduto.status === "ativo" ? "default" : "secondary"}>
                  {selectedProduto.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>Atualize as informações do produto selecionado.</DialogDescription>
          </DialogHeader>
          {editedProduto && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={editedProduto.codigo}
                  onChange={(e) => setEditedProduto({ ...editedProduto, codigo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={editedProduto.nome}
                  onChange={(e) => setEditedProduto({ ...editedProduto, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={editedProduto.descricao}
                  onChange={(e) => setEditedProduto({ ...editedProduto, descricao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={editedProduto.categoria}
                  onChange={(e) => setEditedProduto({ ...editedProduto, categoria: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  value={editedProduto.unidade}
                  onChange={(e) => setEditedProduto({ ...editedProduto, unidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precoUnitario">Preço Unitário</Label>
                <Input
                  id="precoUnitario"
                  value={editedProduto.precoUnitario}
                  onChange={(e) => setEditedProduto({ ...editedProduto, precoUnitario: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque">Estoque</Label>
                <Input
                  id="estoque"
                  value={editedProduto.estoque}
                  onChange={(e) => setEditedProduto({ ...editedProduto, estoque: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={editedProduto.fornecedor}
                  onChange={(e) => setEditedProduto({ ...editedProduto, fornecedor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editedProduto.status}
                  onChange={(e) =>
                    setEditedProduto({
                      ...editedProduto,
                      status: e.target.value as "ativo" | "inativo",
                    })
                  }
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditedProduto}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto {selectedProduto?.nome}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

