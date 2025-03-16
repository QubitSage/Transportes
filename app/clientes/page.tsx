"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NovoClienteDialog } from "@/components/clientes/novo-cliente-dialog"
import { Search, FileUp, MoreVertical, Edit, Trash, Download, Plus, FileText } from "lucide-react"

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState("todos")
  const [clientes, setClientes] = useState<any[]>([])
  const [openNovoCliente, setOpenNovoCliente] = useState(false)

  // Carregar clientes do localStorage ao montar o componente
  useEffect(() => {
    const storedClientes = localStorage.getItem("clientes")
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes))
    }
  }, [])

  // Função para atualizar a lista após criar um novo cliente
  const handleClienteCreated = () => {
    const storedClientes = localStorage.getItem("clientes")
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes))
    }
  }

  // Função para excluir um cliente
  const handleDeleteCliente = (id: string) => {
    const updatedClientes = clientes.filter((cliente) => cliente.id !== id)
    setClientes(updatedClientes)
    localStorage.setItem("clientes", JSON.stringify(updatedClientes))
  }

  // Filtrar clientes com base nos filtros aplicados
  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cnpjCpf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTipo = tipoFilter === "todos" || cliente.tipo === tipoFilter

    return matchesSearch && matchesTipo
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpenNovoCliente(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
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
            placeholder="Buscar clientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="pj">Pessoa Jurídica</SelectItem>
            <SelectItem value="pf">Pessoa Física</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome/Razão Social</TableHead>
              <TableHead>CNPJ/CPF</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente, index) => (
                <TableRow key={cliente.id || index}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.cnpjCpf}</TableCell>
                  <TableCell>{cliente.tipo === "pj" ? "Pessoa Jurídica" : "Pessoa Física"}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.cidade}</TableCell>
                  <TableCell>{cliente.contato}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleDeleteCliente(cliente.id)}>
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
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  Nenhum cliente encontrado. Cadastre um novo cliente para começar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <NovoClienteDialog
        open={openNovoCliente}
        onOpenChange={setOpenNovoCliente}
        onClienteCreated={handleClienteCreated}
      />
    </div>
  )
}

