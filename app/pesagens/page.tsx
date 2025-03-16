"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { NovaPesagemDialog } from "@/components/pesagens/nova-pesagem-dialog"
import { Search, FileUp, MoreVertical, Edit, Trash, Download, Plus, FileText, Printer } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function PesagensPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [pesagens, setPesagens] = useState<any[]>([])
  const [openNovaPesagem, setOpenNovaPesagem] = useState(false)

  // Carregar pesagens do localStorage ao montar o componente
  useEffect(() => {
    const storedPesagens = localStorage.getItem("pesagens")
    if (storedPesagens) {
      setPesagens(JSON.parse(storedPesagens))
    }
  }, [])

  // Função para atualizar a lista após criar uma nova pesagem
  const handlePesagemCreated = () => {
    const storedPesagens = localStorage.getItem("pesagens")
    if (storedPesagens) {
      setPesagens(JSON.parse(storedPesagens))
    }
  }

  // Função para excluir uma pesagem
  const handleDeletePesagem = (id: string) => {
    const updatedPesagens = pesagens.filter((pesagem) => pesagem.id !== id)
    setPesagens(updatedPesagens)
    localStorage.setItem("pesagens", JSON.stringify(updatedPesagens))
  }

  // Filtrar pesagens com base nos filtros aplicados
  const filteredPesagens = pesagens.filter((pesagem) => {
    const matchesSearch =
      pesagem.coleta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pesagem.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pesagem.produto?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || pesagem.status === statusFilter

    const matchesDate =
      !dateFilter || (pesagem.dataPesagem && new Date(pesagem.dataPesagem).toDateString() === dateFilter.toDateString())

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pesagens</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpenNovaPesagem(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Pesagem
          </Button>
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = "/dashboard/configuracoes"}>
            Configurar Banco
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pesagens..."
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
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_processamento">Em processamento</SelectItem>
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
              <TableHead>Coleta</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Peso Entrada</TableHead>
              <TableHead>Peso Saída</TableHead>
              <TableHead>Peso Líquido</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPesagens.length > 0 ? (
              filteredPesagens.map((pesagem, index) => (
                <TableRow key={pesagem.id || index}>
                  <TableCell className="font-medium">#{(index + 1).toString().padStart(3, "0")}</TableCell>
                  <TableCell>{pesagem.coleta}</TableCell>
                  <TableCell>{pesagem.produto}</TableCell>
                  <TableCell>
                    {pesagem.dataPesagem ? format(new Date(pesagem.dataPesagem), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                  </TableCell>
                  <TableCell>{pesagem.pesoEntrada} kg</TableCell>
                  <TableCell>{pesagem.pesoSaida} kg</TableCell>
                  <TableCell className="font-medium">{pesagem.pesoLiquido} kg</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${pesagem.status === "pendente" ? "bg-blue-100 text-blue-800" : ""}
                      ${pesagem.status === "em_processamento" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${pesagem.status === "concluida" ? "bg-green-100 text-green-800" : ""}
                      ${pesagem.status === "cancelada" ? "bg-red-100 text-red-800" : ""}
                    `}
                    >
                      {pesagem.status === "pendente" && "Pendente"}
                      {pesagem.status === "em_processamento" && "Em processamento"}
                      {pesagem.status === "concluida" && "Concluída"}
                      {pesagem.status === "cancelada" && "Cancelada"}
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
                          Imprimir ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeletePesagem(pesagem.id)}>
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
                <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                  Nenhuma pesagem encontrada. Crie uma nova pesagem para começar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <NovaPesagemDialog
        open={openNovaPesagem}
        onOpenChange={setOpenNovaPesagem}
        onPesagemCreated={handlePesagemCreated}
      />
    </div>
  )
}

