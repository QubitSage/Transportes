"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NovoProdutoDialog } from "@/components/produtos/novo-produto-dialog"
import { Search, FileUp, MoreVertical, Edit, Trash, Download, Plus, FileText, AlertTriangle } from "lucide-react"

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("todas")
  const [produtos, setProdutos] = useState<any[]>([])
  const [openNovoProduto, setOpenNovoProduto] = useState(false)

  // Carregar produtos do localStorage ao montar o componente
  useEffect(() => {
    const storedProdutos = localStorage.getItem("produtos")
    if (storedProdutos) {
      setProdutos(JSON.parse(storedProdutos))
    }
  }, [])

  // Função para atualizar a lista após criar um novo produto
  const handleProdutoCreated = () => {
    const storedProdutos = localStorage.getItem("produtos")
    if (storedProdutos) {
      setProdutos(JSON.parse(storedProdutos))
    }
  }

  // Função para excluir um produto
  const handleDeleteProduto = (id: string) => {
    const updatedProdutos = produtos.filter((produto) => produto.id !== id)
    setProdutos(updatedProdutos)
    localStorage.setItem("produtos", JSON.stringify(updatedProdutos))
  }

  // Obter categorias únicas para o filtro
  const categorias = ["todas", ...new Set(produtos.map((produto) => produto.categoria).filter(Boolean))]

  // Filtrar produtos com base nos filtros aplicados
  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch =
      produto.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.codigo?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategoria = categoriaFilter === "todas" || produto.categoria === categoriaFilter

    return matchesSearch && matchesCategoria
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpenNovoProduto(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((categoria, index) => (
              <SelectItem key={index} value={categoria}>
                {categoria === "todas" ? "Todas as categorias" : categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProdutos.length > 0 ? (
              filteredProdutos.map((produto, index) => {
                const estoqueAbaixoMinimo =
                  produto.estoque && produto.estoqueMinimo && Number(produto.estoque) <= Number(produto.estoqueMinimo)

                return (
                  <TableRow key={produto.id || index}>
                    <TableCell>{produto.codigo}</TableCell>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell>{produto.unidade}</TableCell>
                    <TableCell>{produto.preco ? `R$ ${Number(produto.preco).toFixed(2)}` : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {produto.estoque} {produto.unidade}
                        {estoqueAbaixoMinimo && <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell>{produto.fornecedor || "-"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteProduto(produto.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  Nenhum produto encontrado. Cadastre um novo produto para começar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <NovoProdutoDialog
        open={openNovoProduto}
        onOpenChange={setOpenNovoProduto}
        onProdutoCreated={handleProdutoCreated}
      />
    </div>
  )
}

