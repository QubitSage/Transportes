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
import { Plus, Search, Edit, Trash2, User, Phone, MapPin, FileText, Truck, Upload } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { useToast } from "@/components/ui/use-toast"

export default function MotoristasPage() {
  const { motoristas, addMotorista, updateMotorista, deleteMotorista } = useAppContext()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    cnh: "",
    contato: "",
    cpf: "",
    endereco: "",
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
        let novosMotoristas = []

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

            // Filtrar apenas pessoas físicas (com CPF) e mapear para o formato de motoristas
            novosMotoristas = dadosExtraidos
              .filter((item) => item.cpf && !item.cnpj) // Apenas pessoas físicas
              .map((item) => ({
                id: Date.now() + Math.floor(Math.random() * 1000) + Math.random(), // Garantir IDs únicos
                nome: item.nome || "",
                cnh: item.cnh || "Pendente",
                contato: item.contato || "",
                cpf: item.cpf || "",
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
          novosMotoristas = [
            {
              id: Date.now(),
              nome: "Motorista Importado 1",
              cnh: "12345678901",
              contato: "(11) 98765-4321",
              cpf: "123.456.789-01",
              endereco: "Rua Importada, 123",
            },
            {
              id: Date.now() + 1,
              nome: "Motorista Importado 2",
              cnh: "10987654321",
              contato: "(11) 91234-5678",
              cpf: "987.654.321-09",
              endereco: "Av. Importada, 456",
            },
          ]
        }

        // Adicionar os motoristas importados
        novosMotoristas.forEach((motorista) => addMotorista(motorista))

        toast({
          title: "Importação concluída",
          description: `${novosMotoristas.length} motoristas foram importados com sucesso.`,
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
      updateMotorista(editingId, formData)
      toast({ title: "Motorista atualizado", description: "Os dados do motorista foram atualizados com sucesso." })
    } else {
      addMotorista(formData)
      toast({ title: "Motorista adicionado", description: "O novo motorista foi adicionado com sucesso." })
    }
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este motorista?")) {
      deleteMotorista(id)
      toast({ title: "Motorista excluído", description: "O motorista foi removido com sucesso." })
    }
  }

  const handleEdit = (motorista: any) => {
    setFormData(motorista)
    setEditingId(motorista.id)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      cnh: "",
      contato: "",
      cpf: "",
      endereco: "",
    })
    setEditingId(null)
  }

  const filteredMotoristas = motoristas.filter(
    (m) =>
      m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.cnh.includes(searchTerm) ||
      m.cpf.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Motoristas</h1>
          <p className="text-muted-foreground">Gerencie os motoristas cadastrados no sistema</p>
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
                Novo Motorista
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Motorista" : "Novo Motorista"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Edite as informações do motorista e clique em salvar quando terminar."
                    : "Preencha as informações do motorista e clique em salvar quando terminar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome completo do motorista"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnh" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CNH
                    </Label>
                    <Input
                      id="cnh"
                      name="cnh"
                      value={formData.cnh}
                      onChange={handleChange}
                      placeholder="Número da CNH"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CPF
                    </Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

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
          <CardTitle>Lista de Motoristas</CardTitle>
          <CardDescription>Visualize, edite ou exclua os motoristas cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, CNH ou CPF..."
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
                <TableHead>CNH</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMotoristas.length > 0 ? (
                filteredMotoristas.map((motorista) => (
                  <TableRow key={motorista.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                          <Truck className="h-4 w-4 text-white" />
                        </div>
                        {motorista.nome}
                      </div>
                    </TableCell>
                    <TableCell>{motorista.cnh}</TableCell>
                    <TableCell>{motorista.cpf}</TableCell>
                    <TableCell>{motorista.contato}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(motorista)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(motorista.id)}
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
                    Nenhum motorista encontrado
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
            <DialogTitle>Importar Motoristas</DialogTitle>
            <DialogDescription>
              Selecione um arquivo CSV, Excel ou PDF contendo os dados dos motoristas para importar.
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
              O arquivo deve conter as colunas: nome, cnh, contato, cpf, endereco. Para arquivos PDF, o sistema tentará
              extrair automaticamente os dados usando OCR.
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

