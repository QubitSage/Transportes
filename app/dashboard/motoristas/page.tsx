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
import { Pencil, Trash2, Eye, FileUp, Plus, Search, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import ImportPdfDialog from "@/components/motoristas/import-pdf-dialog"

interface Motorista {
  id: string
  nome: string
  prontuario: string
  cnh: string
  categoria: string
  liberacao: string
  validade: string
  cpf: string
  rg: string
  pisPasep: string
  dataNascimento: string
  status: "ativo" | "inativo"
}

export default function MotoristasPage() {
  const { toast } = useToast()
  const [motoristas, setMotoristas] = useState<Motorista[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMotorista, setSelectedMotorista] = useState<Motorista | null>(null)
  const [editedMotorista, setEditedMotorista] = useState<Motorista | null>(null)

  const itemsPerPage = 15

  useEffect(() => {
    fetchMotoristas()
  }, [])

  const fetchMotoristas = () => {
    setIsLoading(true)
    try {
      const storedMotoristas = localStorage.getItem("motoristas")
      if (storedMotoristas) {
        setMotoristas(JSON.parse(storedMotoristas))
      } else {
        // Dados iniciais se não houver nada no localStorage
        const initialMotoristas: Motorista[] = [
          {
            id: "1",
            nome: "Francisco Rodrigues da Silva",
            prontuario: "",
            cnh: "00821729483",
            categoria: "AE",
            liberacao: "",
            validade: "",
            cpf: "199.723.422-04",
            rg: "63516 SSP",
            pisPasep: "",
            dataNascimento: "15/10/1977",
            status: "ativo",
          },
          {
            id: "2",
            nome: "Adão de Souza",
            prontuario: "",
            cnh: "03765403574",
            categoria: "AE",
            liberacao: "",
            validade: "",
            cpf: "971.082.782-00",
            rg: "251682",
            pisPasep: "",
            dataNascimento: "",
            status: "ativo",
          },
        ]
        setMotoristas(initialMotoristas)
        localStorage.setItem("motoristas", JSON.stringify(initialMotoristas))
      }
    } catch (error) {
      console.error("Erro ao carregar motoristas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os motoristas.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMotoristasImported = (importedMotoristas: Motorista[]) => {
    const updatedMotoristas = [...motoristas]

    // Adicionar apenas motoristas que não existem (baseado no CPF)
    importedMotoristas.forEach((importedMotorista) => {
      const existingIndex = updatedMotoristas.findIndex((m) => m.cpf === importedMotorista.cpf)

      if (existingIndex === -1) {
        updatedMotoristas.push(importedMotorista)
      }
    })

    setMotoristas(updatedMotoristas)
    localStorage.setItem("motoristas", JSON.stringify(updatedMotoristas))

    toast({
      title: "Importação concluída",
      description: `${importedMotoristas.length} motoristas importados com sucesso.`,
    })

    setIsImportDialogOpen(false)
  }

  const handleViewMotorista = (motorista: Motorista) => {
    setSelectedMotorista(motorista)
    setIsViewDialogOpen(true)
  }

  const handleEditMotorista = (motorista: Motorista) => {
    setSelectedMotorista(motorista)
    setEditedMotorista({ ...motorista })
    setIsEditDialogOpen(true)
  }

  const handleDeleteMotorista = (motorista: Motorista) => {
    setSelectedMotorista(motorista)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedMotorista) {
      const updatedMotoristas = motoristas.filter((m) => m.id !== selectedMotorista.id)
      setMotoristas(updatedMotoristas)
      localStorage.setItem("motoristas", JSON.stringify(updatedMotoristas))

      toast({
        title: "Motorista excluído",
        description: `O motorista ${selectedMotorista.nome} foi excluído com sucesso.`,
      })

      setIsDeleteDialogOpen(false)
    }
  }

  const saveEditedMotorista = () => {
    if (editedMotorista) {
      const updatedMotoristas = motoristas.map((m) => (m.id === editedMotorista.id ? editedMotorista : m))
      setMotoristas(updatedMotoristas)
      localStorage.setItem("motoristas", JSON.stringify(updatedMotoristas))

      toast({
        title: "Motorista atualizado",
        description: `O motorista ${editedMotorista.nome} foi atualizado com sucesso.`,
      })

      setIsEditDialogOpen(false)
    }
  }

  const filteredMotoristas = motoristas.filter((motorista) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      motorista.nome.toLowerCase().includes(searchTermLower) ||
      (motorista.cpf && motorista.cpf.toLowerCase().includes(searchTermLower)) ||
      (motorista.cnh && motorista.cnh.toLowerCase().includes(searchTermLower))
    )
  })

  const totalPages = Math.ceil(filteredMotoristas.length / itemsPerPage)

  const paginatedMotoristas = filteredMotoristas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const activeMotoristas = filteredMotoristas.filter((motorista) => motorista.status === "ativo")

  const paginatedActiveMotoristas = activeMotoristas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const inactiveMotoristas = filteredMotoristas.filter((motorista) => motorista.status === "inativo")

  const paginatedInactiveMotoristas = inactiveMotoristas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

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
        <h1 className="text-3xl font-bold">Motoristas</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Importar PDF
          </Button>
          <Link href="/dashboard/motoristas/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Motorista
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
              placeholder="Buscar motoristas..."
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
            <CardTitle>Lista de Motoristas</CardTitle>
            <CardDescription>
              {isLoading
                ? "Carregando motoristas..."
                : filteredMotoristas.length === 0
                  ? "Nenhum motorista encontrado."
                  : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredMotoristas.length,
                    )} de ${filteredMotoristas.length} motoristas`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="todos">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Carregando...</p>
                </div>
              ) : paginatedMotoristas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <User className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Nenhum motorista encontrado. Importe motoristas ou adicione um novo.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNH</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMotoristas.map((motorista) => (
                      <TableRow key={motorista.id}>
                        <TableCell className="font-medium">{motorista.nome}</TableCell>
                        <TableCell>{motorista.cnh}</TableCell>
                        <TableCell>{motorista.categoria}</TableCell>
                        <TableCell>{motorista.cpf}</TableCell>
                        <TableCell>
                          <Badge variant={motorista.status === "ativo" ? "default" : "secondary"}>
                            {motorista.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewMotorista(motorista)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditMotorista(motorista)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteMotorista(motorista)}>
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
              ) : paginatedActiveMotoristas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <User className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum motorista ativo encontrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNH</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedActiveMotoristas.map((motorista) => (
                      <TableRow key={motorista.id}>
                        <TableCell className="font-medium">{motorista.nome}</TableCell>
                        <TableCell>{motorista.cnh}</TableCell>
                        <TableCell>{motorista.categoria}</TableCell>
                        <TableCell>{motorista.cpf}</TableCell>
                        <TableCell>
                          <Badge variant="default">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewMotorista(motorista)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditMotorista(motorista)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteMotorista(motorista)}>
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
              ) : paginatedInactiveMotoristas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <User className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum motorista inativo encontrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNH</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInactiveMotoristas.map((motorista) => (
                      <TableRow key={motorista.id}>
                        <TableCell className="font-medium">{motorista.nome}</TableCell>
                        <TableCell>{motorista.cnh}</TableCell>
                        <TableCell>{motorista.categoria}</TableCell>
                        <TableCell>{motorista.cpf}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Inativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewMotorista(motorista)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditMotorista(motorista)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteMotorista(motorista)}>
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

            {filteredMotoristas.length > 0 && (
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
        onImport={handleMotoristasImported}
      />

      {/* Diálogo de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Motorista</DialogTitle>
            <DialogDescription>Informações completas do motorista selecionado.</DialogDescription>
          </DialogHeader>
          {selectedMotorista && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Nome</Label>
                <p className="font-medium">{selectedMotorista.nome}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Prontuário</Label>
                <p className="font-medium">{selectedMotorista.prontuario}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">CNH</Label>
                <p className="font-medium">{selectedMotorista.cnh}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Categoria</Label>
                <p className="font-medium">{selectedMotorista.categoria}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Liberação</Label>
                <p className="font-medium">{selectedMotorista.liberacao}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Validade</Label>
                <p className="font-medium">{selectedMotorista.validade}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">CPF</Label>
                <p className="font-medium">{selectedMotorista.cpf}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">RG</Label>
                <p className="font-medium">{selectedMotorista.rg}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">PIS/PASEP</Label>
                <p className="font-medium">{selectedMotorista.pisPasep}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data de Nascimento</Label>
                <p className="font-medium">{selectedMotorista.dataNascimento}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant={selectedMotorista.status === "ativo" ? "default" : "secondary"}>
                  {selectedMotorista.status === "ativo" ? "Ativo" : "Inativo"}
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
            <DialogTitle>Editar Motorista</DialogTitle>
            <DialogDescription>Atualize as informações do motorista selecionado.</DialogDescription>
          </DialogHeader>
          {editedMotorista && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={editedMotorista.nome}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prontuario">Prontuário</Label>
                <Input
                  id="prontuario"
                  value={editedMotorista.prontuario}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, prontuario: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnh">CNH</Label>
                <Input
                  id="cnh"
                  value={editedMotorista.cnh}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, cnh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={editedMotorista.categoria}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, categoria: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="liberacao">Liberação</Label>
                <Input
                  id="liberacao"
                  value={editedMotorista.liberacao}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, liberacao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validade">Validade</Label>
                <Input
                  id="validade"
                  value={editedMotorista.validade}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, validade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={editedMotorista.cpf}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, cpf: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={editedMotorista.rg}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, rg: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pisPasep">PIS/PASEP</Label>
                <Input
                  id="pisPasep"
                  value={editedMotorista.pisPasep}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, pisPasep: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  value={editedMotorista.dataNascimento}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, dataNascimento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editedMotorista.status}
                  onChange={(e) =>
                    setEditedMotorista({
                      ...editedMotorista,
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
            <Button onClick={saveEditedMotorista}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o motorista {selectedMotorista?.nome}? Esta ação não pode ser desfeita.
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

