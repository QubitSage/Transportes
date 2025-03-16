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
import { Pencil, Trash2, Eye, FileUp, Plus, Search, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import ImportPdfDialog from "@/components/caminhoes/import-pdf-dialog"

interface Caminhao {
  id: string
  placa: string
  renavan: string
  chassi: string
  cor: string
  modelo: string
  anoModelo: string
  anoFabricacao: string
  tipoVeiculo: string
  tipoFrota: string
  capacidade: string
  marca: string
  proprietario: string
  cidade: string
  estado: string
  status: "ativo" | "inativo"
}

export default function CaminhoesPage() {
  const { toast } = useToast()
  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCaminhao, setSelectedCaminhao] = useState<Caminhao | null>(null)
  const [editedCaminhao, setEditedCaminhao] = useState<Caminhao | null>(null)

  const itemsPerPage = 15
  const totalPages = Math.ceil(caminhoes.length / itemsPerPage)

  useEffect(() => {
    fetchCaminhoes()
  }, [])

  const fetchCaminhoes = () => {
    setIsLoading(true)
    try {
      const storedCaminhoes = localStorage.getItem("caminhoes")
      if (storedCaminhoes) {
        setCaminhoes(JSON.parse(storedCaminhoes))
      }
    } catch (error) {
      console.error("Erro ao carregar caminhões:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os caminhões.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCaminhoesImported = (importedCaminhoes: Caminhao[]) => {
    const updatedCaminhoes = [...caminhoes]

    // Adicionar apenas caminhões que não existem (baseado na placa)
    importedCaminhoes.forEach((importedCaminhao) => {
      const existingIndex = updatedCaminhoes.findIndex((c) => c.placa === importedCaminhao.placa)

      if (existingIndex === -1) {
        updatedCaminhoes.push(importedCaminhao)
      }
    })

    setCaminhoes(updatedCaminhoes)
    localStorage.setItem("caminhoes", JSON.stringify(updatedCaminhoes))

    toast({
      title: "Importação concluída",
      description: `${importedCaminhoes.length} caminhões importados com sucesso.`,
    })

    setIsImportDialogOpen(false)
  }

  const handleViewCaminhao = (caminhao: Caminhao) => {
    setSelectedCaminhao(caminhao)
    setIsViewDialogOpen(true)
  }

  const handleEditCaminhao = (caminhao: Caminhao) => {
    setSelectedCaminhao(caminhao)
    setEditedCaminhao({ ...caminhao })
    setIsEditDialogOpen(true)
  }

  const handleDeleteCaminhao = (caminhao: Caminhao) => {
    setSelectedCaminhao(caminhao)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedCaminhao) {
      const updatedCaminhoes = caminhoes.filter((c) => c.id !== selectedCaminhao.id)
      setCaminhoes(updatedCaminhoes)
      localStorage.setItem("caminhoes", JSON.stringify(updatedCaminhoes))

      toast({
        title: "Caminhão excluído",
        description: `O caminhão ${selectedCaminhao.placa} foi excluído com sucesso.`,
      })

      setIsDeleteDialogOpen(false)
    }
  }

  const saveEditedCaminhao = () => {
    if (editedCaminhao) {
      const updatedCaminhoes = caminhoes.map((c) => (c.id === editedCaminhao.id ? editedCaminhao : c))
      setCaminhoes(updatedCaminhoes)
      localStorage.setItem("caminhoes", JSON.stringify(updatedCaminhoes))

      toast({
        title: "Caminhão atualizado",
        description: `O caminhão ${editedCaminhao.placa} foi atualizado com sucesso.`,
      })

      setIsEditDialogOpen(false)
    }
  }

  const filteredCaminhoes = caminhoes.filter((caminhao) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      caminhao.placa.toLowerCase().includes(searchTermLower) ||
      caminhao.modelo.toLowerCase().includes(searchTermLower) ||
      caminhao.proprietario.toLowerCase().includes(searchTermLower)
    )
  })

  const paginatedCaminhoes = filteredCaminhoes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const activeCaminhoes = filteredCaminhoes.filter((caminhao) => caminhao.status === "ativo")

  const paginatedActiveCaminhoes = activeCaminhoes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const inactiveCaminhoes = filteredCaminhoes.filter((caminhao) => caminhao.status === "inativo")

  const paginatedInactiveCaminhoes = inactiveCaminhoes.slice(
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
        <h1 className="text-3xl font-bold">Caminhões</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Importar PDF
          </Button>
          <Link href="/dashboard/caminhoes/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Caminhão
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
              placeholder="Buscar caminhões..."
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
            <CardTitle>Lista de Caminhões</CardTitle>
            <CardDescription>
              {isLoading
                ? "Carregando caminhões..."
                : filteredCaminhoes.length === 0
                  ? "Nenhum caminhão encontrado."
                  : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredCaminhoes.length,
                    )} de ${filteredCaminhoes.length} caminhões`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="todos">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Carregando...</p>
                </div>
              ) : paginatedCaminhoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Truck className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Nenhum caminhão encontrado. Importe caminhões ou adicione um novo.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Placa</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCaminhoes.map((caminhao) => (
                      <TableRow key={caminhao.id}>
                        <TableCell className="font-medium">{caminhao.placa}</TableCell>
                        <TableCell>{caminhao.modelo}</TableCell>
                        <TableCell>{caminhao.marca}</TableCell>
                        <TableCell>{caminhao.proprietario}</TableCell>
                        <TableCell>
                          <Badge variant={caminhao.status === "ativo" ? "default" : "secondary"}>
                            {caminhao.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewCaminhao(caminhao)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditCaminhao(caminhao)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteCaminhao(caminhao)}>
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
              ) : paginatedActiveCaminhoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Truck className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum caminhão ativo encontrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Placa</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedActiveCaminhoes.map((caminhao) => (
                      <TableRow key={caminhao.id}>
                        <TableCell className="font-medium">{caminhao.placa}</TableCell>
                        <TableCell>{caminhao.modelo}</TableCell>
                        <TableCell>{caminhao.marca}</TableCell>
                        <TableCell>{caminhao.proprietario}</TableCell>
                        <TableCell>
                          <Badge variant="default">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewCaminhao(caminhao)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditCaminhao(caminhao)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteCaminhao(caminhao)}>
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
              ) : paginatedInactiveCaminhoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Truck className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum caminhão inativo encontrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Placa</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInactiveCaminhoes.map((caminhao) => (
                      <TableRow key={caminhao.id}>
                        <TableCell className="font-medium">{caminhao.placa}</TableCell>
                        <TableCell>{caminhao.modelo}</TableCell>
                        <TableCell>{caminhao.marca}</TableCell>
                        <TableCell>{caminhao.proprietario}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Inativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewCaminhao(caminhao)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditCaminhao(caminhao)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteCaminhao(caminhao)}>
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

            {filteredCaminhoes.length > 0 && (
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
        onImport={handleCaminhoesImported}
      />

      {/* Diálogo de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Caminhão</DialogTitle>
            <DialogDescription>Informações completas do caminhão selecionado.</DialogDescription>
          </DialogHeader>
          {selectedCaminhao && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Placa</Label>
                <p className="font-medium">{selectedCaminhao.placa}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Renavan</Label>
                <p className="font-medium">{selectedCaminhao.renavan}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Chassi</Label>
                <p className="font-medium">{selectedCaminhao.chassi}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cor</Label>
                <p className="font-medium">{selectedCaminhao.cor}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Modelo</Label>
                <p className="font-medium">{selectedCaminhao.modelo}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Marca</Label>
                <p className="font-medium">{selectedCaminhao.marca}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Ano Modelo</Label>
                <p className="font-medium">{selectedCaminhao.anoModelo}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Ano Fabricação</Label>
                <p className="font-medium">{selectedCaminhao.anoFabricacao}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tipo de Veículo</Label>
                <p className="font-medium">{selectedCaminhao.tipoVeiculo}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tipo de Frota</Label>
                <p className="font-medium">{selectedCaminhao.tipoFrota}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Capacidade</Label>
                <p className="font-medium">{selectedCaminhao.capacidade} Kg</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Proprietário</Label>
                <p className="font-medium">{selectedCaminhao.proprietario}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cidade/Estado</Label>
                <p className="font-medium">
                  {selectedCaminhao.cidade}/{selectedCaminhao.estado}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant={selectedCaminhao.status === "ativo" ? "default" : "secondary"}>
                  {selectedCaminhao.status === "ativo" ? "Ativo" : "Inativo"}
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
            <DialogTitle>Editar Caminhão</DialogTitle>
            <DialogDescription>Atualize as informações do caminhão selecionado.</DialogDescription>
          </DialogHeader>
          {editedCaminhao && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={editedCaminhao.placa}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, placa: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="renavan">Renavan</Label>
                <Input
                  id="renavan"
                  value={editedCaminhao.renavan}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, renavan: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chassi">Chassi</Label>
                <Input
                  id="chassi"
                  value={editedCaminhao.chassi}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, chassi: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor">Cor</Label>
                <Input
                  id="cor"
                  value={editedCaminhao.cor}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, cor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={editedCaminhao.modelo}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, modelo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={editedCaminhao.marca}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, marca: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anoModelo">Ano Modelo</Label>
                <Input
                  id="anoModelo"
                  value={editedCaminhao.anoModelo}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, anoModelo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anoFabricacao">Ano Fabricação</Label>
                <Input
                  id="anoFabricacao"
                  value={editedCaminhao.anoFabricacao}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, anoFabricacao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoVeiculo">Tipo de Veículo</Label>
                <Input
                  id="tipoVeiculo"
                  value={editedCaminhao.tipoVeiculo}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, tipoVeiculo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoFrota">Tipo de Frota</Label>
                <Input
                  id="tipoFrota"
                  value={editedCaminhao.tipoFrota}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, tipoFrota: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade (Kg)</Label>
                <Input
                  id="capacidade"
                  value={editedCaminhao.capacidade}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, capacidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proprietario">Proprietário</Label>
                <Input
                  id="proprietario"
                  value={editedCaminhao.proprietario}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, proprietario: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={editedCaminhao.cidade}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, cidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={editedCaminhao.estado}
                  onChange={(e) => setEditedCaminhao({ ...editedCaminhao, estado: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editedCaminhao.status}
                  onChange={(e) =>
                    setEditedCaminhao({
                      ...editedCaminhao,
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
            <Button onClick={saveEditedCaminhao}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o caminhão {selectedCaminhao?.placa}? Esta ação não pode ser desfeita.
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

