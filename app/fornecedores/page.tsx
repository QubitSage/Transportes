"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NovoFornecedorDialog } from "@/components/fornecedores/novo-fornecedor-dialog"
import { Search, FileUp, MoreVertical, Edit, Trash, Download, Plus, FileText } from "lucide-react"

export default function FornecedoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const [openNovoFornecedor, setOpenNovoFornecedor] = useState(false)

  // Carregar fornecedores do localStorage ao montar o componente
  useEffect(() => {
    const storedFornecedores = localStorage.getItem("fornecedores")
    if (storedFornecedores) {
      setFornecedores(JSON.parse(storedFornecedores))
    }
  }, [])

  // Função para atualizar a lista após criar um novo fornecedor
  const handleFornecedorCreated = () => {
    const storedFornecedores = localStorage.getItem("fornecedores")
    if (storedFornecedores) {
      setFornecedores(JSON.parse(storedFornecedores))
    }
  }

  // Função para excluir um fornecedor
  const handleDeleteFornecedor = (id: string) => {
    const updatedFornecedores = fornecedores.filter((fornecedor) => fornecedor.id !== id)
    setFornecedores(updatedFornecedores)
    localStorage.setItem("fornecedores", JSON.stringify(updatedFornecedores))
  }

  // Filtrar fornecedores com base na busca
  const filteredFornecedores = fornecedores.filter(
    (fornecedor) =>
      fornecedor.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fornecedores</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpenNovoFornecedor(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Fornecedor
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
            placeholder="Buscar fornecedores..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome/Razão Social</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFornecedores.length > 0 ? (
              filteredFornecedores.map((fornecedor, index) => (
                <TableRow key={fornecedor.id || index}>
                  <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                  <TableCell>{fornecedor.cnpj}</TableCell>
                  <TableCell>{fornecedor.telefone}</TableCell>
                  <TableCell>{fornecedor.email}</TableCell>
                  <TableCell>{fornecedor.cidade}</TableCell>
                  <TableCell>{fornecedor.contato}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleDeleteFornecedor(fornecedor.id)}>
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
                  Nenhum fornecedor encontrado. Cadastre um novo fornecedor para começar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <NovoFornecedorDialog
        open={openNovoFornecedor}
        onOpenChange={setOpenNovoFornecedor}
        onFornecedorCreated={handleFornecedorCreated}
      />
    </div>
  )
}

