"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImportPdfDialog, type ColetaData } from "@/components/coletas/import-pdf-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaginationControls } from "@/components/pagination-controls"
import { FileText, Plus, Search, FileUp, Download, Printer, MoreVertical, Edit, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Adicionar os imports para os componentes de diálogo
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { NovaColetaDialog } from "@/components/coletas/nova-coleta-dialog"

export default function ColetasPage() {
  const [coletas, setColetas] = useState<ColetaData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isNovaColetaDialogOpen, setIsNovaColetaDialogOpen] = useState(false)
  const [motoristasFilter, setMotoristasFilter] = useState<string>("todos")
  const [dateRangeStart, setDateRangeStart] = useState("")
  const [dateRangeEnd, setDateRangeEnd] = useState("")

  // Adicionar dentro da função ColetasPage, após as constantes existentes
  const [selectedColeta, setSelectedColeta] = useState<ColetaData | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  // Gerar dados de exemplo para a tabela
  useEffect(() => {
    const mockData = generateMockData()
    setColetas(mockData)
    setTotalItems(mockData.length)
  }, [])

  // Filtrar coletas com base nos critérios de pesquisa
  const filteredColetas = coletas.filter((coleta) => {
    const matchesSearch =
      coleta.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coleta.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coleta.remetente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coleta.destinatario.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMotorista = motoristasFilter === "todos" || coleta.motorista === motoristasFilter

    // Filtro de data
    let matchesDate = true
    if (dateRangeStart && dateRangeEnd) {
      const coletaDate = new Date(coleta.data.split("/").reverse().join("-"))
      const startDate = new Date(dateRangeStart)
      const endDate = new Date(dateRangeEnd)
      endDate.setHours(23, 59, 59) // Incluir todo o último dia

      matchesDate = coletaDate >= startDate && coletaDate <= endDate
    }

    return matchesSearch && matchesMotorista && matchesDate
  })

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredColetas.slice(indexOfFirstItem, indexOfLastItem)

  // Manipuladores de eventos
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleImportSuccess = (importedData: ColetaData[]) => {
    setColetas((prev) => [...importedData, ...prev])
    setTotalItems((prev) => prev + importedData.length)
  }

  // Adicionar as funções de manipulação após os manipuladores de eventos existentes
  const handleView = (coleta: ColetaData) => {
    setSelectedColeta(coleta)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (coleta: ColetaData) => {
    setSelectedColeta(coleta)
    setIsEditDialogOpen(true)
  }

  const handlePrint = (coleta: ColetaData) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Coleta ${coleta.numero}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; margin-bottom: 20px; }
          .info-group { margin-bottom: 20px; }
          .info-row { display: flex; margin-bottom: 8px; }
          .info-label { font-weight: bold; width: 150px; }
          .info-value { flex: 1; }
          .divider { border-top: 1px solid #ddd; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f3f4f6; }
          .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #666; }
          @media print {
            .no-print { display: none; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>Coleta Nº ${coleta.numero}</h1>
        
        <div class="info-group">
          <div class="info-row">
            <div class="info-label">Data:</div>
            <div class="info-value">${coleta.data}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Motorista:</div>
            <div class="info-value">${coleta.motorista}</div>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="info-group">
          <div class="info-row">
            <div class="info-label">Remetente:</div>
            <div class="info-value">${coleta.remetente}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Destinatário:</div>
            <div class="info-value">${coleta.destinatario}</div>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="info-group">
          <div class="info-row">
            <div class="info-label">Peso:</div>
            <div class="info-value">${coleta.peso.toLocaleString("pt-BR")} kg</div>
          </div>
          <div class="info-row">
            <div class="info-label">Volumes:</div>
            <div class="info-value">${coleta.volumes || 0}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Notas Fiscais:</div>
            <div class="info-value">${coleta.notasFiscais || "-"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CTRC:</div>
            <div class="info-value">${coleta.ctrc || "-"}</div>
          </div>
        </div>
        
        <div class="footer">
          Impresso em: ${new Date().toLocaleString("pt-BR")}
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()">Imprimir</button>
          <button onclick="window.close()">Fechar</button>
        </div>
      </body>
    </html>
  `)

    printWindow.document.close()
  }

  const handleDelete = (coleta: ColetaData) => {
    setSelectedColeta(coleta)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedColeta) return

    // Remover a coleta da lista
    setColetas((prev) => prev.filter((c) => c.id !== selectedColeta.id))
    setTotalItems((prev) => prev - 1)

    // Fechar o diálogo e mostrar notificação
    setIsDeleteDialogOpen(false)
    toast({
      title: "Coleta excluída",
      description: `A coleta ${selectedColeta.numero} foi excluída com sucesso.`,
    })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedColeta) return

    // Atualizar a coleta na lista
    setColetas((prev) => prev.map((c) => (c.id === selectedColeta.id ? selectedColeta : c)))

    // Fechar o diálogo e mostrar notificação
    setIsEditDialogOpen(false)
    toast({
      title: "Coleta atualizada",
      description: `A coleta ${selectedColeta.numero} foi atualizada com sucesso.`,
    })
  }

  // Função para imprimir a listagem atual
  const handlePrintList = () => {
    // Criar uma nova janela para impressão
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    // Cabeçalho da página de impressão
    const title =
      dateRangeStart && dateRangeEnd
        ? `Relatório de Coletas (${dateRangeStart} a ${dateRangeEnd})`
        : "Relatório de Coletas"

    // Filtros aplicados
    const filters = []
    if (motoristasFilter !== "todos") filters.push(`Motorista: ${motoristasFilter}`)
    if (searchTerm) filters.push(`Busca: ${searchTerm}`)

    // Construir a tabela HTML
    let tableHTML = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th>Nº Coleta</th>
            <th>Data</th>
            <th>Motorista</th>
            <th>Remetente</th>
            <th>Destinatário</th>
            <th>Peso</th>
            <th>Notas Fiscais</th>
          </tr>
        </thead>
        <tbody>
    `

    // Adicionar linhas da tabela
    filteredColetas.forEach((coleta) => {
      tableHTML += `
        <tr>
          <td>${coleta.numero}</td>
          <td>${coleta.data}</td>
          <td>${coleta.motorista}</td>
          <td>${coleta.remetente}</td>
          <td>${coleta.destinatario}</td>
          <td style="text-align: right;">${coleta.peso.toLocaleString("pt-BR")}</td>
          <td>${coleta.notasFiscais || "-"}</td>
        </tr>
      `
    })

    // Adicionar rodapé com totais
    tableHTML += `
        <tr style="font-weight: bold; background-color: #f3f4f6;">
          <td colspan="5">Total</td>
          <td style="text-align: right;">${filteredColetas.reduce((sum, coleta) => sum + coleta.peso, 0).toLocaleString("pt-BR")}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    `

    // Estatísticas
    const statsHTML = `
      <div style="margin-top: 20px; margin-bottom: 20px;">
        <p><strong>Total de Coletas:</strong> ${filteredColetas.length}</p>
        <p><strong>Peso Total:</strong> ${(filteredColetas.reduce((sum, coleta) => sum + coleta.peso, 0) / 1000).toFixed(2)} ton</p>
      </div>
    `

    // Escrever o conteúdo HTML completo
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 10px; }
            .filters { margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; }
            th { background-color: #f3f4f6; text-align: left; }
            .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #666; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${filters.length ? `<div class="filters">Filtros: ${filters.join(" | ")}</div>` : ""}
          ${tableHTML}
          ${statsHTML}
          <div class="footer">
            Gerado em: ${new Date().toLocaleString("pt-BR")}
          </div>
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Imprimir</button>
            <button onclick="window.close()">Fechar</button>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  // Função para exportar a listagem para CSV
  const handleExportCSV = () => {
    // Cabeçalho do CSV
    let csvContent = "Nº Coleta,Data,Motorista,Remetente,Destinatário,Peso,Notas Fiscais\n"

    // Adicionar linhas
    filteredColetas.forEach((coleta) => {
      // Escapar campos que possam conter vírgulas
      const escapeCsv = (field: string) => `"${field.replace(/"/g, '""')}"`

      csvContent +=
        [
          escapeCsv(coleta.numero),
          escapeCsv(coleta.data),
          escapeCsv(coleta.motorista),
          escapeCsv(coleta.remetente),
          escapeCsv(coleta.destinatario),
          coleta.peso,
          escapeCsv(coleta.notasFiscais || ""),
        ].join(",") + "\n"
    })

    // Criar um blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    // Nome do arquivo com data atual
    const fileName =
      dateRangeStart && dateRangeEnd
        ? `coletas_${dateRangeStart}_a_${dateRangeEnd}.csv`
        : `coletas_${new Date().toISOString().split("T")[0]}.csv`

    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Lista de motoristas únicos para o filtro
  const uniqueMotoristas = Array.from(new Set(coletas.map((coleta) => coleta.motorista))).sort()

  // Função para gerar dados de exemplo
  const generateMockData = (): ColetaData[] => {
    const motoristas = [
      "CLAUDEMIR ALVES FARIAS",
      "GILENE FERREIRA DE SOUSA",
      "ANTONIO SANTANA DE LIMA",
      "LEANDRO AUGUSTO LOPES",
      "MACIEL RODRIGUES DA SILVA",
    ]

    const remetentes = ["AGROINDUSTRIAL SERRA VERDE LTDA", "CALNORTE INDUSTRIA E COMERCIO DE", "AMAGGI EXP.E IMP.LTDA"]

    const destinatarios = ["ELZILENE DA SILVA", "RURAL FERTIL AGRONEGOCIOS LTDA", "AMAGGI EXPORTACAO E IMPORTACAO LTDA"]

    return Array.from({ length: 50 }, (_, i) => {
      const motorista = motoristas[Math.floor(Math.random() * motoristas.length)]
      const peso = Math.floor(Math.random() * 50000) + 30000
      const month = Math.floor(Math.random() * 12) + 1
      const day = Math.floor(Math.random() * 28) + 1

      return {
        id: `col-${i}`,
        numero: `0000${Math.floor(Math.random() * 500) + 1}`,
        data: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/2024`,
        motorista,
        remetente: remetentes[Math.floor(Math.random() * remetentes.length)],
        destinatario: destinatarios[Math.floor(Math.random() * destinatarios.length)],
        volumes: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 10),
        peso,
        valorFrete: 0,
        notasFiscais: Math.random() > 0.5 ? `${4000 + Math.floor(Math.random() * 2000)}` : "",
        ctrc: Math.random() > 0.7 ? `00${3000 + Math.floor(Math.random() * 100)}` : "",
        rateio: 0,
        adiantamento: 0,
        saldo: 0,
      }
    })
  }

  // Estatísticas para os cards
  const totalColetas = filteredColetas.length
  const totalPeso = filteredColetas.reduce((sum, coleta) => sum + coleta.peso, 0)
  const totalPorMotorista = uniqueMotoristas.map((motorista) => {
    const coletasDoMotorista = filteredColetas.filter((c) => c.motorista === motorista)
    return {
      motorista,
      quantidade: coletasDoMotorista.length,
      peso: coletasDoMotorista.reduce((sum, c) => sum + c.peso, 0),
    }
  })

  const handleColetaCreated = () => {
    // Recarregar dados após criar nova coleta
    const mockData = generateMockData()
    setColetas(mockData)
    setTotalItems(mockData.length)
    toast({
      title: "Coleta criada com sucesso",
      description: "A nova coleta foi adicionada ao sistema.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coletas</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Importar PDF
          </Button>
          <Button variant="outline" onClick={() => setIsNovaColetaDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Coleta
          </Button>
        </div>
      </div>

      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Coletas</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar coletas..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={motoristasFilter} onValueChange={setMotoristasFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Motorista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os motoristas</SelectItem>
                  {uniqueMotoristas.map((motorista) => (
                    <SelectItem key={motorista} value={motorista}>
                      {motorista}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <div>
                <Label htmlFor="date-start" className="sr-only">
                  Data Inicial
                </Label>
                <Input
                  id="date-start"
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  className="w-[140px]"
                />
              </div>
              <div>
                <Label htmlFor="date-end" className="sr-only">
                  Data Final
                </Label>
                <Input
                  id="date-end"
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  className="w-[140px]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Nº Coleta</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Remetente</TableHead>
                    <TableHead>Destinatário</TableHead>
                    <TableHead className="text-right">Peso</TableHead>
                    <TableHead>Notas Fiscais</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((coleta) => (
                      <TableRow key={coleta.id}>
                        <TableCell className="font-medium">{coleta.numero}</TableCell>
                        <TableCell>{coleta.data}</TableCell>
                        <TableCell>{coleta.motorista}</TableCell>
                        <TableCell>{coleta.remetente}</TableCell>
                        <TableCell>{coleta.destinatario}</TableCell>
                        <TableCell className="text-right">{coleta.peso.toLocaleString("pt-BR")}</TableCell>
                        <TableCell>{coleta.notasFiscais || "-"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => handleView(coleta)}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Visualizar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleEdit(coleta)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handlePrint(coleta)}>
                                <Printer className="mr-2 h-4 w-4" />
                                <span>Imprimir</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(coleta)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhuma coleta encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Mostrando {Math.min(filteredColetas.length, indexOfFirstItem + 1)}-
                {Math.min(filteredColetas.length, indexOfLastItem)} de {filteredColetas.length} coletas
              </p>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrintList}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.ceil(filteredColetas.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Coletas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalColetas}</div>
                <p className="text-xs text-muted-foreground">
                  {dateRangeStart && dateRangeEnd ? `No período selecionado` : `Total geral`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peso Total</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(totalPeso / 1000).toFixed(2)} ton</div>
                <p className="text-xs text-muted-foreground">
                  {dateRangeStart && dateRangeEnd ? `No período selecionado` : `Total geral`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média por Coleta</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalColetas > 0 ? (totalPeso / totalColetas / 1000).toFixed(2) : "0.00"} ton
                </div>
                <p className="text-xs text-muted-foreground">Peso médio por coleta</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coletas por Motorista</CardTitle>
              <CardDescription>Distribuição de coletas e peso por motorista</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Motorista</TableHead>
                      <TableHead className="text-right">Coletas</TableHead>
                      <TableHead className="text-right">Peso Total</TableHead>
                      <TableHead className="text-right">Média por Coleta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {totalPorMotorista.map((item) => (
                      <TableRow key={item.motorista}>
                        <TableCell>{item.motorista}</TableCell>
                        <TableCell className="text-right">{item.quantidade}</TableCell>
                        <TableCell className="text-right">{(item.peso / 1000).toFixed(2)} ton</TableCell>
                        <TableCell className="text-right">
                          {item.quantidade > 0 ? (item.peso / item.quantidade / 1000).toFixed(2) : "0.00"} ton
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ImportPdfDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImportSuccess={handleImportSuccess}
      />

      <NovaColetaDialog
        open={isNovaColetaDialogOpen}
        onOpenChange={setIsNovaColetaDialogOpen}
        onColetaCreated={handleColetaCreated}
      />

      {/* Adicionar os diálogos no final do componente, antes do fechamento do return */}
      {/* Adicionar antes do fechamento do return (antes do </div> final) */}
      {/* Diálogo de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Coleta Nº {selectedColeta?.numero}</DialogTitle>
            <DialogDescription>Detalhes da coleta</DialogDescription>
          </DialogHeader>
          {selectedColeta && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data</Label>
                  <div className="font-medium">{selectedColeta.data}</div>
                </div>
                <div>
                  <Label>Motorista</Label>
                  <div className="font-medium">{selectedColeta.motorista}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Remetente</Label>
                  <div className="font-medium">{selectedColeta.remetente}</div>
                </div>
                <div>
                  <Label>Destinatário</Label>
                  <div className="font-medium">{selectedColeta.destinatario}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Peso</Label>
                  <div className="font-medium">{selectedColeta.peso.toLocaleString("pt-BR")} kg</div>
                </div>
                <div>
                  <Label>Volumes</Label>
                  <div className="font-medium">{selectedColeta.volumes || 0}</div>
                </div>
                <div>
                  <Label>Notas Fiscais</Label>
                  <div className="font-medium">{selectedColeta.notasFiscais || "-"}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>CTRC</Label>
                  <div className="font-medium">{selectedColeta.ctrc || "-"}</div>
                </div>
                <div>
                  <Label>Valor Frete</Label>
                  <div className="font-medium">
                    {selectedColeta.valorFrete ? `R$ ${selectedColeta.valorFrete.toLocaleString("pt-BR")}` : "-"}
                  </div>
                </div>
                <div>
                  <Label>Adiantamento</Label>
                  <div className="font-medium">
                    {selectedColeta.adiantamento ? `R$ ${selectedColeta.adiantamento.toLocaleString("pt-BR")}` : "-"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            {selectedColeta && (
              <Button onClick={() => handlePrint(selectedColeta)}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Coleta</DialogTitle>
            <DialogDescription>Faça as alterações necessárias e clique em salvar.</DialogDescription>
          </DialogHeader>
          {selectedColeta && (
            <form onSubmit={handleSaveEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-data">Data</Label>
                    <Input
                      id="edit-data"
                      value={selectedColeta.data}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, data: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-motorista">Motorista</Label>
                    <Input
                      id="edit-motorista"
                      value={selectedColeta.motorista}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, motorista: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-remetente">Remetente</Label>
                    <Input
                      id="edit-remetente"
                      value={selectedColeta.remetente}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, remetente: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-destinatario">Destinatário</Label>
                    <Input
                      id="edit-destinatario"
                      value={selectedColeta.destinatario}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, destinatario: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-peso">Peso (kg)</Label>
                    <Input
                      id="edit-peso"
                      type="number"
                      value={selectedColeta.peso}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, peso: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-volumes">Volumes</Label>
                    <Input
                      id="edit-volumes"
                      type="number"
                      value={selectedColeta.volumes || 0}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, volumes: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-notas">Notas Fiscais</Label>
                    <Input
                      id="edit-notas"
                      value={selectedColeta.notasFiscais || ""}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, notasFiscais: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-ctrc">CTRC</Label>
                    <Input
                      id="edit-ctrc"
                      value={selectedColeta.ctrc || ""}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, ctrc: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-frete">Valor Frete</Label>
                    <Input
                      id="edit-frete"
                      type="number"
                      value={selectedColeta.valorFrete || 0}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, valorFrete: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-adiantamento">Adiantamento</Label>
                    <Input
                      id="edit-adiantamento"
                      type="number"
                      value={selectedColeta.adiantamento || 0}
                      onChange={(e) => setSelectedColeta({ ...selectedColeta, adiantamento: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar alterações</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a coleta {selectedColeta?.numero}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

