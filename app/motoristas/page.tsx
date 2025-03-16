"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NovoMotoristaDialog } from "@/components/motoristas/novo-motorista-dialog"
import { Search, FileUp, MoreVertical, Edit, Trash, Download, Plus, FileText, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function MotoristasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [motoristas, setMotoristas] = useState<any[]>([])
  const [openNovoMotorista, setOpenNovoMotorista] = useState(false)

  // Carregar motoristas do localStorage ao montar o componente
  useEffect(() => {
    const storedMotoristas = localStorage.getItem("motoristas")
    if (storedMotoristas) {
      setMotoristas(JSON.parse(storedMotoristas))
    }
  }, [])

  // Função para atualizar a lista após criar um novo motorista
  const handleMotoristaCreated = () => {
    const storedMotoristas = localStorage.getItem("motoristas")
    if (storedMotoristas) {
      setMotoristas(JSON.parse(storedMotoristas))
    }
  }

  // Função para excluir um motorista
  const handleDeleteMotorista = (id: string) => {
    const updatedMotoristas = motoristas.filter((motorista) => motorista.id !== id)
    setMotoristas(updatedMotoristas)
    localStorage.setItem("motoristas", JSON.stringify(updatedMotoristas))
  }

  // Filtrar motoristas com base nos filtros aplicados
  const filteredMotoristas = motoristas.filter((motorista) => {
    const matchesSearch =
      motorista.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motorista.cpf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motorista.cnh?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || motorista.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Motoristas</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpenNovoMotorista(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Motorista
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
            placeholder="Buscar motoristas..."
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
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="ferias">Em férias</SelectItem>
            <SelectItem value="licenca">Em licença</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>CNH</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Validade CNH</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMotoristas.length > 0 ? (
              filteredMotoristas.map((motorista, index) => {
                const validadeCnh = motorista.validadeCnh ? new Date(motorista.validadeCnh) : null
                const hoje = new Date()
                const cnhVencendo = validadeCnh && (validadeCnh.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24) < 30

                return (
                  <TableRow key={motorista.id || index}>
                    <TableCell className="font-medium">{motorista.nome}</TableCell>
                    <TableCell>{motorista.cpf}</TableCell>
                    <TableCell>{motorista.cnh}</TableCell>
                    <TableCell>{motorista.categoriaCnh}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {validadeCnh ? format(validadeCnh, "dd/MM/yyyy", { locale: ptBR }) : "-"}
                        {cnhVencendo && <AlertTriangle className="ml-2 h-4 w-4 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell>{motorista.telefone}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${motorista.status === "ativo" ? "bg-green-100 text-green-800" : ""}
                        ${motorista.status === "inativo" ? "bg-red-100 text-red-800" : ""}
                        ${motorista.status === "ferias" ? "bg-blue-100 text-blue-800" : ""}
                        ${motorista.status === "licenca" ? "bg-yellow-100 text-yellow-800" : ""}
                      `}
                      >
                        {motorista.status === "ativo" && "Ativo"}
                        {motorista.status === "inativo" && "Inativo"}
                        {motorista.status === "ferias" && "Em férias"}
                        {motorista.status === "licenca" && "Em licença"}
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
                          <DropdownMenuItem onClick={() => handleDeleteMotorista(motorista.id)}>
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
                  Nenhum motorista encontrado. Cadastre um novo motorista para começar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <NovoMotoristaDialog
        open={openNovoMotorista}
        onOpenChange={setOpenNovoMotorista}
        onMotoristaCreated={handleMotoristaCreated}
      />
    </div>
  )
}

