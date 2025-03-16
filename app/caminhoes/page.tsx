"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NovoCaminhaoDialog } from "@/components/caminhoes/novo-caminhao-dialog"
import { Search, FileUp, MoreVertical, Edit, Trash, Download, Plus, FileText, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function CaminhoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [caminhoes, setCaminhoes] = useState<any[]>([])
  const [openNovoCaminhao, setOpenNovoCaminhao] = useState(false)

  // Carregar caminhões do localStorage ao montar o componente
  useEffect(() => {
    const storedCaminhoes = localStorage.getItem("caminhoes")
    if (storedCaminhoes) {
      setCaminhoes(JSON.parse(storedCaminhoes))
    }
  }, [])

  // Função para atualizar a lista após criar um novo caminhão
  const handleCaminhaoCreated = () => {
    const storedCaminhoes = localStorage.getItem("caminhoes")
    if (storedCaminhoes) {
      setCaminhoes(JSON.parse(storedCaminhoes))
    }
  }

  // Função para excluir um caminhão
  const handleDeleteCaminhao = (id: string) => {
    const updatedCaminhoes = caminhoes.filter((caminhao) => caminhao.id !== id)
    setCaminhoes(updatedCaminhoes)
    localStorage.setItem("caminhoes", JSON.stringify(updatedCaminhoes))
  }

  // Filtrar caminhões com base nos filtros aplicados
  const filteredCaminhoes = caminhoes.filter((caminhao) => {
    const matchesSearch =
      caminhao.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caminhao.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caminhao.marca?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || caminhao.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Caminhões</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpenNovoCaminhao(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Caminhão
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
            placeholder="Buscar caminhões..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="disponivel">Disponível</SelectItem>
            <SelectItem value="em_uso">Em uso</SelectItem>
            <SelectItem value="manutencao">Em manutenção</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>Próxima Manutenção</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCaminhoes.length > 0 ? (
              filteredCaminhoes.map((caminhao, index) => {
                const proximaManutencao = caminhao.proximaManutencao ? new Date(caminhao.proximaManutencao) : null
                const hoje = new Date()
                const manutencaoProxima =
                  proximaManutencao && (proximaManutencao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24) < 7

                return (
                  <TableRow key={caminhao.id || index}>
                    <TableCell className="font-medium">{caminhao.placa}</TableCell>
                    <TableCell>{caminhao.modelo}</TableCell>
                    <TableCell>{caminhao.marca}</TableCell>
                    <TableCell>
                      {caminhao.tipo === "truck" && "Caminhão"}
                      {caminhao.tipo === "carreta" && "Carreta"}
                      {caminhao.tipo === "bitrem" && "Bitrem"}
                      {caminhao.tipo === "rodotrem" && "Rodotrem"}
                      {caminhao.tipo === "van" && "Van"}
                    </TableCell>
                    <TableCell>{caminhao.capacidade} kg</TableCell>
                    <TableCell>{caminhao.motorista || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {proximaManutencao ? format(proximaManutencao, "dd/MM/yyyy", { locale: ptBR }) : "-"}
                        {manutencaoProxima && <AlertTriangle className="ml-2 h-4 w-4 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${caminhao.status === "disponivel" ? "bg-green-100 text-green-800" : ""}
                        ${caminhao.status === "em_uso" ? "bg-blue-100 text-blue-800" : ""}
                        ${caminhao.status === "manutencao" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${caminhao.status === "inativo" ? "bg-red-100 text-red-800" : ""}
                      `}
                      >
                        {caminhao.status === "disponivel" && "Disponível"}
                        {caminhao.status === "em_uso" && "Em uso"}
                        {caminhao.status === "manutencao" && "Em manutenção"}
                        {caminhao.status === "inativo" && "Inativo"}
                      </div>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleDeleteCaminhao(caminhao.id)}>
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
                <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                  Nenhum caminhão encontrado. Cadastre um novo caminhão para começar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <NovoCaminhaoDialog
        open={openNovoCaminhao}
        onOpenChange={setOpenNovoCaminhao}
        onCaminhaoCreated={handleCaminhaoCreated}
      />
    </div>
  )
}

