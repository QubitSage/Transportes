"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, Building2, Mail, Phone, MapPin, FileText, Upload } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { useToast } from "@/components/ui/use-toast"

export default function ClientesPage() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useAppContext()
  const { toast } = useToast()

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    ie: "",
    contato: "",
    email: "",
    endereco: "",
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Modifique a função handleImportFile para processar todos os registros do PDF
  const handleImportFile = async () => {
    if (!importFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para importar.",
        variant: "destructive",
      })
      return
    }

    try {
      // Verificar o tipo de arquivo
      const fileType = importFile.name.split(".").pop()?.toLowerCase()

      toast({
        title: "Importação iniciada",
        description: `Processando arquivo ${fileType?.toUpperCase()} de importação...`,
      })

      // Simulando um tempo de processamento
      setTimeout(async () => {
        let novosClientes = []

        if (fileType === "pdf") {
          // Usar o processador específico para PDFs tabulares
          toast({
            title: "Processando PDF",
            description: "Extraindo dados tabulares do PDF...",
          })

          try {
            // Importar o processador de PDF
            const { processTabularPDF } = await import("@/utils/pdf-parser")

            // Processar o PDF
            const dadosExtraidos = await processTabularPDF(importFile)

            // Mapear os dados extraídos para o formato de clientes
            // Incluir tanto pessoas físicas quanto jurídicas
            novosClientes = dadosExtraidos.map((item) => ({
              id: Date.now() + Math.floor(Math.random() * 1000) + Math.random(), // Garantir IDs únicos
              nome: item.nome || "",
              cnpj: item.cnpj || "",
              ie: item.ie || "",
              contato: item.contato || "",
              email: item.email || "",
              endereco: `${item.endereco || ""}, ${item.bairro || ""}, ${item.cidade || ""}`.trim(),
            }))
          } catch (error) {
            console.error("Erro ao processar PDF:", error)
            toast({
              title: "Erro no processamento do PDF",
              description: "Não foi possível extrair os dados do PDF. Verifique o formato.",
              variant: "destructive",
            })
            return
          }
        } else {
          // Simulação para CSV/Excel como antes
          novosClientes = [
            {
              id: Date.now(),
              nome: "Cliente Importado 1",
              cnpj: "11.222.333/0001-44",
              ie: "123456789",
              contato: "(11) 98765-4321",
              email: "cliente1@exemplo.com",
              endereco: "Rua Importada, 123",
            },
            {
              id: Date.now() + 1,
              nome: "Cliente Importado 2",
              cnpj: "22.333.444/0001-55",
              ie: "987654321",
              contato: "(11) 91234-5678",
              email: "cliente2@exemplo.com",
              endereco: "Av. Importada, 456",
            },
          ]
        }

        // Adicionar os clientes importados
        novosClientes.forEach((cliente) => addCliente(cliente))

        toast({
          title: "Importação concluída",
          description: `${novosClientes.length} clientes foram importados com sucesso.`,
        })
        setIsImportDialogOpen(false)
        setImportFile(null)
      }, 2000)
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os dados. Verifique o formato do arquivo.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = () => {
    if (editingId) {
      updateCliente(editingId, formData)
      toast({ title: "Cliente atualizado", description: "Os dados do cliente foram atualizados com sucesso." })
    } else {
      addCliente(formData)
      toast({ title: "Cliente adicionado", description: "O novo cliente foi adicionado com sucesso." })
    }
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteCliente(id)
      toast({ title: "Cliente excluído", description: "O cliente foi removido com sucesso." })
    }
  }

  const handleEdit = (cliente: any) => {
    setFormData(cliente)
    setEditingId(cliente.id)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      cnpj: "",
      ie: "",
      contato: "",
      email: "",
      endereco: "",
    })
    setEditingId(null)
  }

  const filteredClientes = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cnpj.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Clientes</h1>
          <p className="text-muted-foreground">Gerencie os clientes cadastrados no sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importar Dados
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#007846] hover:bg-[#006038]">
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Edite as informações do cliente e clique em salvar quando terminar."
                    : "Preencha as informações do cliente e clique em salvar quando terminar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome do cliente"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CNPJ
                    </Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ie" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Inscrição Estadual
                    </Label>
                    <Input
                      id="ie"
                      name="ie"
                      value={formData.ie}
                      onChange={handleChange}
                      placeholder="Inscrição estadual"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contato" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contato
                    </Label>
                    <Input
                      id="contato"
                      name="contato"
                      value={formData.contato}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                      type="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Endereço completo"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="bg-[#007846] hover:bg-[#006038]">
                  {editingId ? "Atualizar" : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Visualize, edite ou exclua os clientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, CNPJ ou e-mail..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.length > 0 ? (
                filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1e366a] flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        {cliente.nome}
                      </div>
                    </TableCell>
                    <TableCell>{cliente.cnpj}</TableCell>
                    <TableCell>{cliente.contato}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cliente)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(cliente.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Importação */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Clientes</DialogTitle>
            <DialogDescription>
              Selecione um arquivo CSV, Excel ou PDF contendo os dados dos clientes para importar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="importFile">Arquivo</Label>
            <Input
              id="importFile"
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-muted-foreground">
              O arquivo deve conter as colunas: nome, cnpj, ie, contato, email, endereco. Para arquivos PDF, o sistema
              tentará extrair automaticamente os dados usando OCR.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportFile} className="bg-[#007846] hover:bg-[#006038]">
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

