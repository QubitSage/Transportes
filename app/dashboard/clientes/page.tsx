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
import { Pencil, Trash2, Eye, FileUp, Plus, Search, Users, FileText, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import ImportPdfDialog from "@/components/clientes/import-pdf-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface Cliente {
  id: string
  codigo: string
  nome: string
  cnpjCpf: string
  inscricaoEstadual: string
  telefone: string
  email: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  status: "ativo" | "inativo"
}

export default function ClientesPage() {
  const { toast } = useToast()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [selectedClientFiles, setSelectedClientFiles] = useState<any>({ entrada: [], saida: [] })
  const [editedCliente, setEditedCliente] = useState<Cliente | null>(null)

  const itemsPerPage = 15

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = () => {
    setIsLoading(true)
    try {
      const storedClientes = localStorage.getItem("clientes")
      if (storedClientes) {
        setClientes(JSON.parse(storedClientes))
      } else {
        // Dados iniciais se não houver nada no localStorage
        const initialClientes: Cliente[] = [
          {
            id: "1",
            codigo: "C001",
            nome: "Empresa ABC Ltda",
            cnpjCpf: "12.345.678/0001-90",
            inscricaoEstadual: "123456789",
            telefone: "(11) 1234-5678",
            email: "contato@empresaabc.com",
            endereco: "Rua Principal, 123",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01234-567",
            status: "ativo",
          },
          {
            id: "2",
            codigo: "C002",
            nome: "Distribuidora XYZ",
            cnpjCpf: "98.765.432/0001-10",
            inscricaoEstadual: "987654321",
            telefone: "(11) 9876-5432",
            email: "contato@distribuidoraxyz.com",
            endereco: "Av. Comercial, 456",
            cidade: "Rio de Janeiro",
            estado: "RJ",
            cep: "20000-000",
            status: "ativo",
          },
        ]
        setClientes(initialClientes)
        localStorage.setItem("clientes", JSON.stringify(initialClientes))
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClientesImported = (importedClientes: Cliente[]) => {
    const updatedClientes = [...clientes]

    // Adicionar apenas clientes que não existem (baseado no CNPJ/CPF)
    importedClientes.forEach((importedCliente) => {
      const existingIndex = updatedClientes.findIndex((c) => c.cnpjCpf === importedCliente.cnpjCpf)

      if (existingIndex === -1) {
        updatedClientes.push(importedCliente)
      }
    })

    setClientes(updatedClientes)
    localStorage.setItem("clientes", JSON.stringify(updatedClientes))

    toast({
      title: "Importação concluída",
      description: `${importedClientes.length} clientes importados com sucesso.`,
    })

    setIsImportDialogOpen(false)
  }

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsViewDialogOpen(true)
  }

  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setEditedCliente({ ...cliente })
    setIsEditDialogOpen(true)
  }

  const handleDeleteCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedCliente) {
      const updatedClientes = clientes.filter((c) => c.id !== selectedCliente.id)
      setClientes(updatedClientes)
      localStorage.setItem("clientes", JSON.stringify(updatedClientes))

      toast({
        title: "Cliente excluído",
        description: `O cliente ${selectedCliente.nome} foi excluído com sucesso.`,
      })

      setIsDeleteDialogOpen(false)
    }
  }

  const saveEditedCliente = () => {
    if (editedCliente) {
      const updatedClientes = clientes.map((c) => (c.id === editedCliente.id ? editedCliente : c))
      setClientes(updatedClientes)
      localStorage.setItem("clientes", JSON.stringify(updatedClientes))

      toast({
        title: "Cliente atualizado",
        description: `O cliente ${editedCliente.nome} foi atualizado com sucesso.`,
      })

      setIsEditDialogOpen(false)
    }
  }

  const handleViewFiles = (cliente: any) => {
    setSelectedCliente(cliente)
    
    // Simular arquivos de entrada e saída para o cliente
    const mockFiles = {
      entrada: [
        { id: 1, nome: "Nota Fiscal 001", data: "10/03/2023", tipo: "PDF", tamanho: "1.2 MB" },
        { id: 2, nome: "Pedido 123", data: "15/03/2023", tipo: "PDF", tamanho: "0.8 MB" },
        { id: 3, nome: "Contrato", data: "01/02/2023", tipo: "DOCX", tamanho: "2.5 MB" },
      ],
      saida: [
        { id: 1, nome: "Comprovante de Entrega 001", data: "12/03/2023", tipo: "PDF", tamanho: "0.5 MB" },
        { id: 2, nome: "Relatório de Entrega", data: "16/03/2023", tipo: "PDF", tamanho: "1.1 MB" },
        { id: 3, nome: "Recibo", data: "17/03/2023", tipo: "PDF", tamanho: "0.3 MB" },
      ]
    }
    
    setSelectedClientFiles(mockFiles)
    setIsFilesDialogOpen(true)
  }

  const filteredClientes = clientes.filter((cliente) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      cliente.nome.toLowerCase().includes(searchTermLower) ||
      (cliente.cnpjCpf && cliente.cnpjCpf.toLowerCase().includes(searchTermLower)) ||
      (cliente.codigo && cliente.codigo.toLowerCase().includes(searchTermLower))
    )
  })

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage)

  const paginatedClientes = filteredClientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const activeClientes = filteredClientes.filter((cliente) => cliente.status === "ativo")

  const paginatedActiveClientes = activeClientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const inactiveClientes = filteredClientes.filter((cliente) => cliente.status === "inativo")

  const paginatedInactiveClientes = inactiveClientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
        <h1 className="text-3xl font-bold">Clientes</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Importar PDF
          </Button>
          <Link href="/dashboard/clientes/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
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
              placeholder="Buscar clientes..."
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
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              {isLoading
                ? "Carregando clientes..."
                : filteredClientes.length === 0
                  ? "Nenhum cliente encontrado."
                  : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredClientes.length,
                    )} de ${filteredClientes.length} clientes`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="todos">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Carregando...</p>
                </div>
              ) : paginatedClientes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Nenhum cliente encontrado. Importe clientes ou adicione um novo.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNPJ/CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Cidade/UF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.codigo}</TableCell>
                        <TableCell>{cliente.nome}</TableCell>
                        <TableCell>{cliente.cnpjCpf}</TableCell>
                        <TableCell>{cliente.telefone}</TableCell>
                        <TableCell>
                          {cliente.cidade}/{cliente.estado}
                        </TableCell>
                        <TableCell>
                          <Badge variant={cliente.status === "ativo" ? "default" : "secondary"}>
                            {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewCliente(cliente)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditCliente(cliente)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteCliente(cliente)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenuItem onClick={() => handleViewFiles(cliente)}>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Ver arquivos</span>
                            </DropdownMenuItem>
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
              ) : paginatedActiveClientes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum cliente ativo encontrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNPJ/CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Cidade/UF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedActiveClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.codigo}</TableCell>
                        <TableCell>{cliente.nome}</TableCell>
                        <TableCell>{cliente.cnpjCpf}</TableCell>
                        <TableCell>{cliente.telefone}</TableCell>
                        <TableCell>
                          {cliente.cidade}/{cliente.estado}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewCliente(cliente)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditCliente(cliente)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteCliente(cliente)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenuItem onClick={() => handleViewFiles(cliente)}>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Ver arquivos</span>
                            </DropdownMenuItem>
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
              ) : paginatedInactiveClientes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum cliente inativo encontrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNPJ/CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Cidade/UF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInactiveClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.codigo}</TableCell>
                        <TableCell>{cliente.nome}</TableCell>
                        <TableCell>{cliente.cnpjCpf}</TableCell>
                        <TableCell>{cliente.telefone}</TableCell>
                        <TableCell>
                          {cliente.cidade}/{cliente.estado}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Inativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewCliente(cliente)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditCliente(cliente)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteCliente(cliente)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenuItem onClick={() => handleViewFiles(cliente)}>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Ver arquivos</span>
                            </DropdownMenuItem>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {filteredClientes.length > 0 && (
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
        onImport={handleClientesImported}
      />

      {/* Diálogo de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>Informações completas do cliente selecionado.</DialogDescription>
          </DialogHeader>
          {selectedCliente && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Código</Label>
                <p className="font-medium">{selectedCliente.codigo}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Nome</Label>
                <p className="font-medium">{selectedCliente.nome}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">CNPJ/CPF</Label>
                <p className="font-medium">{selectedCliente.cnpjCpf}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Inscrição Estadual</Label>
                <p className="font-medium">{selectedCliente.inscricaoEstadual}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Telefone</Label>
                <p className="font-medium">{selectedCliente.telefone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{selectedCliente.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Endereço</Label>
                <p className="font-medium">{selectedCliente.endereco}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cidade/UF</Label>
                <p className="font-medium">
                  {selectedCliente.cidade}/{selectedCliente.estado}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">CEP</Label>
                <p className="font-medium">{selectedCliente.cep}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant={selectedCliente.status === "ativo" ? "default" : "secondary"}>
                  {selectedCliente.status === "ativo" ? "Ativo" : "Inativo"}
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
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Atualize as informações do cliente selecionado.</DialogDescription>
          </DialogHeader>
          {editedCliente && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={editedCliente.codigo}
                  onChange={(e) => setEditedCliente({ ...editedCliente, codigo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={editedCliente.nome}
                  onChange={(e) => setEditedCliente({ ...editedCliente, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpjCpf">CNPJ/CPF</Label>
                <Input
                  id="cnpjCpf"
                  value={editedCliente.cnpjCpf}
                  onChange={(e) => setEditedCliente({ ...editedCliente, cnpjCpf: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  value={editedCliente.inscricaoEstadual}
                  onChange={(e) => setEditedCliente({ ...editedCliente, inscricaoEstadual: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={editedCliente.telefone}
                  onChange={(e) => setEditedCliente({ ...editedCliente, telefone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editedCliente.email}
                  onChange={(e) => setEditedCliente({ ...editedCliente, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={editedCliente.endereco}
                  onChange={(e) => setEditedCliente({ ...editedCliente, endereco: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={editedCliente.cidade}
                  onChange={(e) => setEditedCliente({ ...editedCliente, cidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={editedCliente.estado}
                  onChange={(e) => setEditedCliente({ ...editedCliente, estado: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={editedCliente.cep}
                  onChange={(e) => setEditedCliente({ ...editedCliente, cep: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editedCliente.status}
                  onChange={(e) =>
                    setEditedCliente({
                      ...editedCliente,
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
            <Button onClick={saveEditedCliente}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente {selectedCliente?.nome}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para visualizar arquivos do cliente */}
      <Dialog open={isFilesDialogOpen} onOpenChange={setIsFilesDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Arquivos do Cliente: {selectedCliente?.nome}</DialogTitle>
            <DialogDescription>
              Visualize os arquivos de entrada e saída associados a este cliente.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="entrada" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="entrada">Arquivos de Entrada</TabsTrigger>
              <TabsTrigger value="saida">Arquivos de Saída</TabsTrigger>
            </TabsList>
            
            <TabsContent value="entrada">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClientFiles.entrada.length > 0 ? (
                      selectedClientFiles.entrada.map((file: any) => (
                        <TableRow key={file.id}>
                          <TableCell>{file.nome}</TableCell>
                          <TableCell>{file.data}</TableCell>
                          <TableCell>{file.tipo}</TableCell>
                          <TableCell>{file.tamanho}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Nenhum arquivo de entrada encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="saida">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClientFiles.saida.length > 0 ? (
                      selectedClientFiles.saida.map((file: any) => (
                        <TableRow key={file.id}>
                          <TableCell>{file.nome}</TableCell>
                          <TableCell>{file.data}</TableCell>
                          <TableCell>{file.tipo}</TableCell>
                          <TableCell>{file.tamanho}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Nenhum arquivo de saída encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilesDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

