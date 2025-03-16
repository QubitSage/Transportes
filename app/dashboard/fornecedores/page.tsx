"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PlusCircle,
  Search,
  FileUp,
  Download,
  Printer,
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ImportPdfDialog } from "@/components/fornecedores/import-pdf-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Fornecedor {
  id?: number
  nome: string
  endereco: string
  bairro: string
  cidade: string
  contato: string
  cnpj: string
  status?: string
}

export default function FornecedoresPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentFornecedor, setCurrentFornecedor] = useState<Fornecedor | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const itemsPerPage = 15

  // Carregar fornecedores ao montar o componente
  useEffect(() => {
    fetchFornecedores()
  }, [])

  // Substituir a função fetchFornecedores por esta versão que carrega do localStorage
  const fetchFornecedores = async () => {
    setIsLoading(true)
    try {
      // Simular um pequeno atraso para mostrar o estado de carregamento
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Carregar fornecedores do localStorage
      const savedFornecedores = localStorage.getItem("fornecedores")
      if (savedFornecedores) {
        setFornecedores(JSON.parse(savedFornecedores))
      } else {
        setFornecedores([])
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fornecedores.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Função para adicionar fornecedores importados à lista
  const handleFornecedoresImported = (novosFornecedores: Fornecedor[]) => {
    // Adicionar IDs únicos aos novos fornecedores
    const fornecedoresComId = novosFornecedores.map((f, index) => ({
      ...f,
      id: Date.now() + index,
      status: "Ativo", // Definir status padrão como Ativo
    }))

    // Atualizar o estado
    const updatedFornecedores = [...fornecedores, ...fornecedoresComId]
    setFornecedores(updatedFornecedores)

    // Salvar no localStorage
    localStorage.setItem("fornecedores", JSON.stringify(updatedFornecedores))

    toast({
      title: "Importação concluída",
      description: `${novosFornecedores.length} fornecedores foram importados com sucesso.`,
    })
  }

  // Filtragem de fornecedores com base no termo de busca
  const filteredFornecedores = fornecedores.filter(
    (fornecedor) =>
      fornecedor.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj?.includes(searchTerm) ||
      fornecedor.contato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cidade?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Paginação
  const totalPages = Math.ceil(filteredFornecedores.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedFornecedores = filteredFornecedores.slice(startIndex, startIndex + itemsPerPage)

  // Funções para manipulação de fornecedores
  const handleEdit = (fornecedor: Fornecedor) => {
    setCurrentFornecedor(fornecedor)
    setIsEditDialogOpen(true)
  }

  const handleView = (fornecedor: Fornecedor) => {
    setCurrentFornecedor(fornecedor)
    setIsViewDialogOpen(true)
  }

  const handleDelete = (fornecedor: Fornecedor) => {
    setCurrentFornecedor(fornecedor)
    setIsDeleteDialogOpen(true)
  }

  // Substituir a função confirmDelete para atualizar o localStorage
  const confirmDelete = () => {
    if (!currentFornecedor) return

    const updatedFornecedores = fornecedores.filter((f) => f.id !== currentFornecedor.id)
    setFornecedores(updatedFornecedores)

    // Salvar no localStorage
    localStorage.setItem("fornecedores", JSON.stringify(updatedFornecedores))

    setIsDeleteDialogOpen(false)

    toast({
      title: "Fornecedor excluído",
      description: "O fornecedor foi excluído com sucesso.",
    })
  }

  // Substituir a função saveEditedFornecedor para atualizar o localStorage
  const saveEditedFornecedor = () => {
    if (!currentFornecedor) return

    const updatedFornecedores = fornecedores.map((f) => (f.id === currentFornecedor.id ? currentFornecedor : f))

    setFornecedores(updatedFornecedores)

    // Salvar no localStorage
    localStorage.setItem("fornecedores", JSON.stringify(updatedFornecedores))

    setIsEditDialogOpen(false)

    toast({
      title: "Fornecedor atualizado",
      description: "As informações do fornecedor foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/fornecedores/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Fornecedores</CardTitle>
          <CardDescription>Gerencie todos os fornecedores cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedor por nome, CNPJ, email ou cidade..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Resetar para a primeira página ao buscar
              }}
              className="max-w-sm"
            />
          </div>

          <Tabs defaultValue="todos">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
              <TabsTrigger value="inativos">Inativos</TabsTrigger>
            </TabsList>
            <TabsContent value="todos" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ/CPF</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Carregando fornecedores...
                      </TableCell>
                    </TableRow>
                  ) : paginatedFornecedores.length > 0 ? (
                    paginatedFornecedores.map((fornecedor) => (
                      <TableRow key={fornecedor.id}>
                        <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                        <TableCell>{fornecedor.cnpj}</TableCell>
                        <TableCell>{fornecedor.cidade}</TableCell>
                        <TableCell>{fornecedor.bairro}</TableCell>
                        <TableCell>{fornecedor.contato || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleView(fornecedor)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(fornecedor)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(fornecedor)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        {searchTerm
                          ? "Nenhum fornecedor encontrado com os critérios de busca."
                          : "Nenhum fornecedor cadastrado. Importe fornecedores ou adicione manualmente."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="ativos" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ/CPF</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Carregando fornecedores...
                      </TableCell>
                    </TableRow>
                  ) : filteredFornecedores
                      .filter((f) => f.status === "Ativo")
                      .slice(startIndex, startIndex + itemsPerPage).length > 0 ? (
                    filteredFornecedores
                      .filter((f) => f.status === "Ativo")
                      .slice(startIndex, startIndex + itemsPerPage)
                      .map((fornecedor) => (
                        <TableRow key={fornecedor.id}>
                          <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                          <TableCell>{fornecedor.cnpj}</TableCell>
                          <TableCell>{fornecedor.cidade}</TableCell>
                          <TableCell>{fornecedor.bairro}</TableCell>
                          <TableCell>{fornecedor.contato || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleView(fornecedor)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(fornecedor)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(fornecedor)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Nenhum fornecedor ativo encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="inativos" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ/CPF</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Carregando fornecedores...
                      </TableCell>
                    </TableRow>
                  ) : filteredFornecedores
                      .filter((f) => f.status === "Inativo")
                      .slice(startIndex, startIndex + itemsPerPage).length > 0 ? (
                    filteredFornecedores
                      .filter((f) => f.status === "Inativo")
                      .slice(startIndex, startIndex + itemsPerPage)
                      .map((fornecedor) => (
                        <TableRow key={fornecedor.id}>
                          <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                          <TableCell>{fornecedor.cnpj}</TableCell>
                          <TableCell>{fornecedor.cidade}</TableCell>
                          <TableCell>{fornecedor.bairro}</TableCell>
                          <TableCell>{fornecedor.contato || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleView(fornecedor)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(fornecedor)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(fornecedor)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Nenhum fornecedor inativo encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
        {filteredFornecedores.length > 0 && (
          <CardFooter className="flex justify-between items-center border-t p-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredFornecedores.length)} de{" "}
              {filteredFornecedores.length} fornecedores
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Página {currentPage} de {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <ImportPdfDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImportSuccess={handleFornecedoresImported}
      />

      {/* Diálogo de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Fornecedor</DialogTitle>
            <DialogDescription>Informações completas do fornecedor selecionado.</DialogDescription>
          </DialogHeader>

          {currentFornecedor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Nome:</Label>
                <div className="col-span-3">{currentFornecedor.nome}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">CNPJ/CPF:</Label>
                <div className="col-span-3">{currentFornecedor.cnpj}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Endereço:</Label>
                <div className="col-span-3">{currentFornecedor.endereco}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Bairro:</Label>
                <div className="col-span-3">{currentFornecedor.bairro}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Cidade:</Label>
                <div className="col-span-3">{currentFornecedor.cidade}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Contato:</Label>
                <div className="col-span-3">{currentFornecedor.contato || "-"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Status:</Label>
                <div className="col-span-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentFornecedor.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentFornecedor.status || "Ativo"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false)
                handleEdit(currentFornecedor!)
              }}
            >
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Fornecedor</DialogTitle>
            <DialogDescription>Faça as alterações necessárias e clique em salvar.</DialogDescription>
          </DialogHeader>

          {currentFornecedor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nome" className="text-right">
                  Nome:
                </Label>
                <Input
                  id="nome"
                  value={currentFornecedor.nome}
                  onChange={(e) => setCurrentFornecedor({ ...currentFornecedor, nome: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cnpj" className="text-right">
                  CNPJ/CPF:
                </Label>
                <Input
                  id="cnpj"
                  value={currentFornecedor.cnpj}
                  onChange={(e) => setCurrentFornecedor({ ...currentFornecedor, cnpj: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endereco" className="text-right">
                  Endereço:
                </Label>
                <Input
                  id="endereco"
                  value={currentFornecedor.endereco}
                  onChange={(e) => setCurrentFornecedor({ ...currentFornecedor, endereco: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bairro" className="text-right">
                  Bairro:
                </Label>
                <Input
                  id="bairro"
                  value={currentFornecedor.bairro}
                  onChange={(e) => setCurrentFornecedor({ ...currentFornecedor, bairro: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cidade" className="text-right">
                  Cidade:
                </Label>
                <Input
                  id="cidade"
                  value={currentFornecedor.cidade}
                  onChange={(e) => setCurrentFornecedor({ ...currentFornecedor, cidade: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contato" className="text-right">
                  Contato:
                </Label>
                <Input
                  id="contato"
                  value={currentFornecedor.contato || ""}
                  onChange={(e) => setCurrentFornecedor({ ...currentFornecedor, contato: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status:
                </Label>
                <select
                  id="status"
                  value={currentFornecedor.status || "Ativo"}
                  onChange={(e) => setCurrentFornecedor({ ...currentFornecedor, status: e.target.value })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditedFornecedor}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          {currentFornecedor && (
            <div className="py-4">
              <p className="font-medium">Você está prestes a excluir:</p>
              <p className="mt-2">{currentFornecedor.nome}</p>
              <p className="text-sm text-muted-foreground">{currentFornecedor.cnpj}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir Fornecedor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

