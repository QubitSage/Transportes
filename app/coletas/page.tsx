"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { NovaColetaDialog } from "@/components/coletas/nova-coleta-dialog"
import { Search, FileUp, MoreVertical, Edit, Trash, Download, Plus, FileText, Printer } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ColetasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [coletas, setColetas] = useState<any[]>([])
  const [openNovaColeta, setOpenNovaColeta] = useState(false)

  // Carregar coletas do localStorage ao montar o componente
  useEffect(() => {
    const storedColetas = localStorage.getItem("coletas")
    if (storedColetas) {
      setColetas(JSON.parse(storedColetas))
    }
  }, [])

  // Função para atualizar a lista após criar uma nova coleta
  const handleColetaCreated = () => {
    const storedColetas = localStorage.getItem("coletas")
    if (storedColetas) {
      setColetas(JSON.parse(storedColetas))
    }
  }

  // Função para excluir uma coleta
  const handleDeleteColeta = (id: string) => {
    const updatedColetas = coletas.filter((coleta) => coleta.id !== id)
    setColetas(updatedColetas)
    localStorage.setItem("coletas", JSON.stringify(updatedColetas))
  }

  // Filtrar coletas com base nos filtros aplicados
  const filteredColetas = coletas.filter((coleta) => {
    const matchesSearch =
      coleta.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coleta.endereco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coleta.motorista?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || coleta.status === statusFilter

    const matchesDate =
      !dateFilter || (coleta.dataColeta && new Date(coleta.dataColeta).toDateString() === dateFilter.toDateString())

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Coletas</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpenNovaColeta(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Coleta
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
            placeholder="Buscar coletas..."
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
            <SelectItem value="agendada">Agendada</SelectItem>
            <SelectItem value="em_andamento">Em andamento</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <div className="w-[180px]">
          <DatePicker date={dateFilter} setDate={setDateFilter} placeholder="Filtrar por data" />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredColetas.length > 0 ? (
              filteredColetas.map((coleta, index) => (
                <TableRow key={coleta.id || index}>
                  <TableCell className="font-medium">#{(index + 1).toString().padStart(3, "0")}</TableCell>
                  <TableCell>{coleta.cliente}</TableCell>
                  <TableCell>
                    {coleta.dataColeta ? format(new Date(coleta.dataColeta), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                  </TableCell>
                  <TableCell>{coleta.endereco}</TableCell>
                  <TableCell>{coleta.motorista}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${coleta.status === "agendada" ? "bg-blue-100 text-blue-800" : ""}
                      ${coleta.status === "em_andamento" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${coleta.status === "concluida" ? "bg-green-100 text-green-800" : ""}
                      ${coleta.status === "cancelada" ? "bg-red-100 text-red-800" : ""}
                    `}
                    >
                      {coleta.status === "agendada" && "Agendada"}
                      {coleta.status === "em_andamento" && "Em andamento"}
                      {coleta.status === "concluida" && "Concluída"}
                      {coleta.status === "cancelada" && "Cancelada"}
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
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
                          Imprimir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteColeta(coleta.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Nenhuma coleta encontrada. Crie uma nova coleta para começar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <NovaColetaDialog open={openNovaColeta} onOpenChange={setOpenNovaColeta} onColetaCreated={handleColetaCreated} />
    </div>
  )
}

