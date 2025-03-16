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

export default function FornecedoresPage() {
  const { fornecedores, addFornecedor, updateFornecedor, deleteFornecedor } = useAppContext()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    contato: "",
    email: "",
    endereco: "",
    ie: "",
    razaoSocial: "",
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    if (editingId) {
      updateFornecedor(editingId, formData)
      toast({ title: "Fornecedor atualizado", description: "Os dados do fornecedor foram atualizados com sucesso." })
    } else {
      addFornecedor(formData)
      toast({ title: "Fornecedor adicionado", description: "O novo fornecedor foi adicionado com sucesso." })
    }
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      deleteFornecedor(id)
      toast({ title: "Fornecedor excluído", description: "O fornecedor foi removido com sucesso." })
    }
  }

  const handleEdit = (fornecedor: any) => {
    setFormData(fornecedor)
    setEditingId(fornecedor.id)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      cnpj: "",
      contato: "",
      email: "",
      endereco: "",
      ie: "",
      razaoSocial: "",
    })
    setEditingId(null)
  }

  const filteredFornecedores = fornecedores.filter(
    (f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cnpj.includes(searchTerm) ||
      f.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        let novosFornecedores = []

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

            // Mapear os dados extraídos para o formato de fornecedores
            // Filtrar apenas empresas (com CNPJ)
            novosFornecedores = dadosExtraidos
              .filter((item) => item.cnpj && !item.cpf) // Apenas empresas
              .map((item) => ({
                id: Date.now() + Math.floor(Math.random() * 1000) + Math.random(), // Garantir IDs únicos
                nome: item.nome || "",
                cnpj: item.cnpj || "",
                contato: item.contato || "",
                email: item.email || "",
                endereco: `${item.endereco || ""}, ${item.bairro || ""}, ${item.cidade || ""}`.trim(),
                ie: item.ie || "",
                razaoSocial: item.razaoSocial || item.nome || "",
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
          novosFornecedores = [
            {
              id: Date.now(),
              nome: "Fornecedor Importado 1",
              cnpj: "11.222.333/0001-44",
              contato: "(11) 98765-4321",
              email: "importado1@exemplo.com",
              endereco: "Rua Importada, 123",
              ie: "123456789",
              razaoSocial: "Fornecedor Importado LTDA",
            },
            {
              id: Date.now() + 1,
              nome: "Fornecedor Importado 2",
              cnpj: "22.333.444/0001-55",
              contato: "(11) 91234-5678",
              email: "importado2@exemplo.com",
              endereco: "Av. Importada, 456",
              ie: "987654321",
              razaoSocial: "Importação & CIA LTDA",
            },
          ]
        }

        // Adicionar os fornecedores importados
        novosFornecedores.forEach((fornecedor) => addFornecedor(fornecedor))

        toast({
          title: "Importação concluída",
          description: `${novosFornecedores.length} fornecedores foram importados com sucesso.`,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie os fornecedores cadastrados no sistema</p>
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
                Novo Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Edite as informações do fornecedor e clique em salvar quando terminar."
                    : "Preencha as informações do fornecedor e clique em salvar quando terminar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
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
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Razão Social
                    </Label>
                    <Input
                      id="razaoSocial"
                      name="razaoSocial"
                      value={formData.razaoSocial}
                      onChange={handleChange}
                      placeholder="Razão social do fornecedor"
                    />
                  </div>
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
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>Visualize, edite ou exclua os fornecedores cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, CNPJ ou razão social..."
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
              {filteredFornecedores.length > 0 ? (
                filteredFornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1e366a] flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        {fornecedor.nome}
                      </div>
                    </TableCell>
                    <TableCell>{fornecedor.cnpj}</TableCell>
                    <TableCell>{fornecedor.contato}</TableCell>
                    <TableCell>{fornecedor.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(fornecedor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(fornecedor.id)}
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
                    Nenhum fornecedor encontrado
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
            <DialogTitle>Importar Fornecedores</DialogTitle>
            <DialogDescription>
              Selecione um arquivo CSV, Excel ou PDF contendo os dados dos fornecedores para importar.
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
              O arquivo deve conter as colunas: nome, razaoSocial, cnpj, ie, contato, email, endereco. Para arquivos
              PDF, o sistema tentará extrair automaticamente os dados usando OCR.
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

