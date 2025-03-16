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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Truck, FileText, Upload } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { useToast } from "@/components/ui/use-toast"

export default function CaminhoesPage() {
  const { caminhoes, addCaminhao, updateCaminhao, deleteCaminhao } = useAppContext()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    modelo: "",
    placa: "",
    tipo: "",
    ano: "",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    if (editingId) {
      updateCaminhao(editingId, formData)
      toast({ title: "Caminhão atualizado", description: "Os dados do caminhão foram atualizados com sucesso." })
    } else {
      addCaminhao(formData)
      toast({ title: "Caminhão adicionado", description: "O novo caminhão foi adicionado com sucesso." })
    }
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este caminhão?")) {
      deleteCaminhao(id)
      toast({ title: "Caminhão excluído", description: "O caminhão foi removido com sucesso." })
    }
  }

  const handleEdit = (caminhao: any) => {
    setFormData(caminhao)
    setEditingId(caminhao.id)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      modelo: "",
      placa: "",
      tipo: "",
      ano: "",
    })
    setEditingId(null)
  }

  const filteredCaminhoes = caminhoes.filter(
    (c) =>
      c.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
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
        let novosCaminhoes = []

        if (fileType === "pdf") {
          // Usar o processador específico para PDFs tabulares
          toast({
            title: "Processando PDF",
            description: "Extraindo dados tabulares do PDF...",
          })

          try {
            // Importar o processador de PDF
            const { extractDataFromPDF } = await import("@/utils/pdf-parser")

            // Processar o PDF - para caminhões, usamos um template específico
            const dadosExtraidos = await extractDataFromPDF(importFile, "caminhoes")

            // Mapear os dados extraídos para o formato de caminhões
            novosCaminhoes = dadosExtraidos.map((item) => ({
              id: Date.now() + Math.floor(Math.random() * 1000) + Math.random(), // Garantir IDs únicos
              modelo: item.modelo || "",
              placa: item.placa || "",
              tipo: item.tipo || "Cavalo",
              ano: item.ano || new Date().getFullYear().toString(),
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
          novosCaminhoes = [
            {
              id: Date.now(),
              modelo: "Volvo FH 540",
              placa: "ABC-1234",
              tipo: "Cavalo",
              ano: "2022",
            },
            {
              id: Date.now() + 1,
              modelo: "Scania R450",
              placa: "DEF-5678",
              tipo: "Cavalo",
              ano: "2021",
            },
          ]
        }

        // Adicionar os caminhões importados
        novosCaminhoes.forEach((caminhao) => addCaminhao(caminhao))

        toast({
          title: "Importação concluída",
          description: `${novosCaminhoes.length} caminhões foram importados com sucesso.`,
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
          <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Caminhões</h1>
          <p className="text-muted-foreground">Gerencie os caminhões cadastrados no sistema</p>
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
                Novo Caminhão
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Caminhão" : "Novo Caminhão"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Edite as informações do caminhão e clique em salvar quando terminar."
                    : "Preencha as informações do caminhão e clique em salvar quando terminar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="modelo" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Modelo
                  </Label>
                  <Input
                    id="modelo"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    placeholder="Modelo do caminhão"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placa" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Placa
                    </Label>
                    <Input
                      id="placa"
                      name="placa"
                      value={formData.placa}
                      onChange={handleChange}
                      placeholder="AAA-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ano" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Ano
                    </Label>
                    <Input id="ano" name="ano" value={formData.ano} onChange={handleChange} placeholder="AAAA" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Tipo
                  </Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cavalo">Cavalo</SelectItem>
                      <SelectItem value="Carreta">Carreta</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="VUC">VUC</SelectItem>
                    </SelectContent>
                  </Select>
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
          <CardTitle>Lista de Caminhões</CardTitle>
          <CardDescription>Visualize, edite ou exclua os caminhões cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por modelo, placa ou tipo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCaminhoes.length > 0 ? (
                filteredCaminhoes.map((caminhao) => (
                  <TableRow key={caminhao.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full ${caminhao.tipo === "Cavalo" ? "bg-[#1e366a]" : "bg-[#007846]"} flex items-center justify-center`}
                        >
                          <Truck className="h-4 w-4 text-white" />
                        </div>
                        {caminhao.modelo}
                      </div>
                    </TableCell>
                    <TableCell>{caminhao.placa}</TableCell>
                    <TableCell>
                      <div
                        className={`rounded-full px-2 py-1 text-xs inline-block
                        ${
                          caminhao.tipo === "Cavalo"
                            ? "bg-[#1e366a]/10 text-[#1e366a]"
                            : caminhao.tipo === "Carreta"
                              ? "bg-[#007846]/10 text-[#007846]"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {caminhao.tipo}
                      </div>
                    </TableCell>
                    <TableCell>{caminhao.ano}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(caminhao)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(caminhao.id)}
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
                    Nenhum caminhão encontrado
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
            <DialogTitle>Importar Caminhões</DialogTitle>
            <DialogDescription>
              Selecione um arquivo CSV, Excel ou PDF contendo os dados dos caminhões para importar.
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
              O arquivo deve conter as colunas: modelo, placa, tipo, ano. Para arquivos PDF, o sistema tentará extrair
              automaticamente os dados usando OCR.
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

