"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImportPdfDialog, type PesagemData } from "@/components/pesagens/import-pdf-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { NovaPesagemDialog } from "@/components/pesagens/nova-pesagem-dialog"

export default function PesagensPage() {
  const [pesagens, setPesagens] = useState<PesagemData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isNovaPesagemDialogOpen, setIsNovaPesagemDialogOpen] = useState(false)
  const [produtoFilter, setProdutoFilter] = useState<string>("todos")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [dateRangeStart, setDateRangeStart] = useState("")
  const [dateRangeEnd, setDateRangeEnd] = useState("")

  // Adicionar dentro da função PesagensPage, após as constantes existentes
  const [selectedPesagem, setSelectedPesagem] = useState<PesagemData | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isScanWeightDialogOpen, setIsScanWeightDialogOpen] = useState(false)
  const [scanWeight, setScanWeight] = useState("")
  const { toast } = useToast()

  // Gerar dados de exemplo para a tabela
  useEffect(() => {
    const mockData = generateMockData()
    setPesagens(mockData)
    setTotalItems(mockData.length)
  }, [])

  // Filtrar pesagens com base nos critérios de pesquisa
  const filteredPesagens = pesagens.filter((pesagem) => {
    const matchesSearch =
      pesagem.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pesagem.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pesagem.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pesagem.placa.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProduto = produtoFilter === "todos" || pesagem.produto === produtoFilter

    const matchesStatus = statusFilter === "todos" || pesagem.status === statusFilter

    // Filtro de data
    let matchesDate = true
    if (dateRangeStart && dateRangeEnd) {
      const pesagemDate = new Date(pesagem.data.split("/").reverse().join("-"))
      const startDate = new Date(dateRangeStart)
      const endDate = new Date(dateRangeEnd)
      endDate.setHours(23, 59, 59) // Incluir todo o último dia

      matchesDate = pesagemDate >= startDate && pesagemDate <= endDate
    }

    return matchesSearch && matchesProduto && matchesStatus && matchesDate
  })

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPesagens.slice(indexOfFirstItem, indexOfLastItem)

  // Manipuladores de eventos
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleImportSuccess = (importedData: PesagemData[]) => {
    setPesagens((prev) => [...importedData, ...prev])
    setTotalItems((prev) => prev + importedData.length)
  }

  const handleNovaPesagemCreated = () => {
    // Recarregar dados após criar nova pesagem
    const mockData = generateMockData()
    setPesagens(mockData)
    setTotalItems(mockData.length)
    toast({
      title: "Pesagem criada com sucesso",
      description: "A nova pesagem foi adicionada ao sistema.",
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
        ? `Relatório de Pesagens (${dateRangeStart} a ${dateRangeEnd})`
        : "Relatório de Pesagens"

    // Filtros aplicados
    const filters = []
    if (produtoFilter !== "todos") filters.push(`Produto: ${produtoFilter}`)
    if (statusFilter !== "todos") filters.push(`Status: ${statusFilter}`)
    if (searchTerm) filters.push(`Busca: ${searchTerm}`)

    // Construir a tabela HTML
    let tableHTML = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th>Nº</th>
            <th>Data</th>
            <th>Placa</th>
            <th>Motorista</th>
            <th>Produto</th>
            <th>Peso Entrada</th>
            <th>Peso Saída</th>
            <th>Peso Líquido</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `

    // Adicionar linhas da tabela
    filteredPesagens.forEach((pesagem) => {
      tableHTML += `
        <tr>
          <td>${pesagem.numero}</td>
          <td>${pesagem.data}</td>
          <td>${pesagem.placa}</td>
          <td>${pesagem.motorista}</td>
          <td>${pesagem.produto}</td>
          <td style="text-align: right;">${pesagem.pesoEntrada.toLocaleString("pt-BR")} kg</td>
          <td style="text-align: right;">${pesagem.pesoSaida.toLocaleString("pt-BR")} kg</td>
          <td style="text-align: right;">${pesagem.pesoLiquido.toLocaleString("pt-BR")} kg</td>
          <td>${pesagem.status}</td>
        </tr>
      `
    })

    // Adicionar rodapé com totais
    tableHTML += `
        <tr style="font-weight: bold; background-color: #f3f4f6;">
          <td colspan="7">Total</td>
          <td style="text-align: right;">${filteredPesagens.reduce((sum, pesagem) => sum + pesagem.pesoLiquido, 0).toLocaleString("pt-BR")} kg</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    `

    // Estatísticas
    const statsHTML = `
      <div style="margin-top: 20px; margin-bottom: 20px;">
        <p><strong>Total de Pesagens:</strong> ${filteredPesagens.length}</p>
        <p><strong>Peso Líquido Total:</strong> ${(filteredPesagens.reduce((sum, pesagem) => sum + pesagem.pesoLiquido, 0) / 1000).toFixed(2)} ton</p>
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
    let csvContent = "Nº,Data,Placa,Motorista,Produto,Peso Entrada,Peso Saída,Peso Líquido,Status\n"

    // Adicionar linhas
    filteredPesagens.forEach((pesagem) => {
      // Escapar campos que possam conter vírgulas
      const escapeCsv = (field: string) => `"${field.replace(/"/g, '""')}"`

      csvContent +=
        [
          escapeCsv(pesagem.numero),
          escapeCsv(pesagem.data),
          escapeCsv(pesagem.placa),
          escapeCsv(pesagem.motorista),
          escapeCsv(pesagem.produto),
          pesagem.pesoEntrada,
          pesagem.pesoSaida,
          pesagem.pesoLiquido,
          escapeCsv(pesagem.status),
        ].join(",") + "\n"
    })

    // Criar um blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    // Nome do arquivo com data atual
    const fileName =
      dateRangeStart && dateRangeEnd
        ? `pesagens_${dateRangeStart}_a_${dateRangeEnd}.csv`
        : `pesagens_${new Date().toISOString().split("T")[0]}.csv`

    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Adicionar as funções de manipulação após os manipuladores de eventos existentes
  const handleView = (pesagem: PesagemData) => {
    setSelectedPesagem(pesagem)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (pesagem: PesagemData) => {
    setSelectedPesagem(pesagem)
    setIsEditDialogOpen(true)
  }

  const handlePrint = (pesagem: PesagemData) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ticket de Pesagem ${pesagem.numero}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 15px;
            max-width: 210mm;
            font-size: 12px;
            line-height: 1.3;
          }
          .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 10px;
            position: relative;
          }
          .header-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .company-info {
            text-align: left;
            margin-bottom: 10px;
          }
          .company-info p {
            margin: 0;
            line-height: 1.4;
          }
          .ticket-info {
            position: absolute;
            top: 0;
            right: 0;
            text-align: right;
          }
          .ticket-info p {
            margin: 0;
            line-height: 1.4;
          }
          .client-box {
            border: 1px solid #000;
            padding: 10px;
            margin-bottom: 10px;
            position: relative;
          }
          .client-label {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .weights {
            position: absolute;
            top: 10px;
            right: 10px;
          }
          .weight-box {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
            width: 120px;
            margin-bottom: 5px;
            display: flex;
            flex-direction: column;
          }
          .weight-label {
            font-weight: bold;
            margin-bottom: 2px;
            text-align: center;
          }
          .weight-box div:last-child {
            text-align: center;
            font-size: 13px;
          }
          .info-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
          }
          .info-box {
            flex: 1;
            border: 1px solid #000;
            padding: 8px;
          }
          .info-label {
            font-weight: bold;
            margin-bottom: 3px;
          }
          .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .product-table th,
          .product-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding-top: 10px;
          }
          .signature {
            text-align: center;
            flex: 1;
            max-width: 200px;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-bottom: 5px;
          }
          @media print {
            .no-print { display: none; }
            body { margin: 0; padding: 0; }
            .container { max-width: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-title">TICKET DE PESAGEM</div>
            <div class="ticket-info">
              <p>Número: ${pesagem.numero}</p>
              <p>Data/Hora Inicial: ${pesagem.data} ${pesagem.hora}</p>
              <p>Data/Hora Final: ${pesagem.data} ${pesagem.hora}</p>
            </div>
          </div>

          <div class="company-info">
            <p>RURAL FÉRTIL AGRONEGÓCIOS</p>
            <p>ROD. AM 070 KM65, S/N - DISTRITO</p>
            <p>MANACAPURU/AM CNPJ: 09.041.790/0004-70</p>
          </div>

          <div class="client-box">
            <div class="weights">
              <div class="weight-box">
                <div class="weight-label">Tara:</div>
                <div>${pesagem.pesoSaida.toLocaleString("pt-BR")} kg</div>
              </div>
              <div class="weight-box">
                <div class="weight-label">Bruto:</div>
                <div>${pesagem.pesoEntrada.toLocaleString("pt-BR")} kg</div>
              </div>
              <div class="weight-box">
                <div class="weight-label">Líquido:</div>
                <div>${pesagem.pesoLiquido.toLocaleString("pt-BR")} kg</div>
              </div>
            </div>
            
            <div style="margin-right: 120px;">
              <div class="client-label">Cliente:</div>
              <div>${pesagem.cliente}</div>
              <div style="margin-top: 8px;">
                <div class="client-label">Endereço:</div>
                <div>${pesagem.fornecedor}</div>
              </div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-box">
              <div class="info-label">Motorista:</div>
              <div>${pesagem.motorista}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Placa:</div>
              <div>${pesagem.placa}</div>
            </div>
          </div>

          <table class="product-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th style="width: 150px;">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${pesagem.produto}</td>
                <td>${(pesagem.pesoLiquido / 1000).toFixed(3)} TON</td>
              </tr>
            </tbody>
          </table>

          <div class="signatures">
            <div class="signature">
              <div class="signature-line"></div>
              <div>Assinatura Expedição</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div>Assinatura Motorista</div>
            </div>
          </div>
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

  const handleDelete = (pesagem: PesagemData) => {
    setSelectedPesagem(pesagem)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedPesagem) return

    // Remover a pesagem da lista
    setPesagens((prev) => prev.filter((p) => p.id !== selectedPesagem.id))
    setTotalItems((prev) => prev - 1)

    // Fechar o diálogo e mostrar notificação
    setIsDeleteDialogOpen(false)
    toast({
      title: "Pesagem excluída",
      description: `A pesagem ${selectedPesagem.numero} foi excluída com sucesso.`,
    })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPesagem) return

    // Recalcular o peso líquido
    const pesoLiquido = selectedPesagem.pesoEntrada - selectedPesagem.pesoSaida
    const updatedPesagem = { ...selectedPesagem, pesoLiquido }

    // Atualizar a pesagem na lista
    setPesagens((prev) => prev.map((p) => (p.id === updatedPesagem.id ? updatedPesagem : p)))

    // Fechar o diálogo e mostrar notificação
    setIsEditDialogOpen(false)
    toast({
      title: "Pesagem atualizada",
      description: `A pesagem ${updatedPesagem.numero} foi atualizada com sucesso.`,
    })
  }

  // Adicionar função para escanear peso de retorno
  const handleScanWeight = (pesagem: PesagemData) => {
    setSelectedPesagem(pesagem)
    setIsScanWeightDialogOpen(true)
  }

  const confirmScanWeight = () => {
    if (!selectedPesagem || !scanWeight) return

    const updatedPesagens = pesagens.map((p) => {
      if (p.id === selectedPesagem.id) {
        const pesoSaida = parseFloat(scanWeight)
        const pesoEntrada = parseFloat(p.pesoEntrada)
        const pesoLiquido = Math.abs(pesoEntrada - pesoSaida).toFixed(2)
        
        return {
          ...p,
          pesoSaida: scanWeight,
          pesoLiquido,
          status: "concluida"
        }
      }
      return p
    })

    setPesagens(updatedPesagens)
    setIsScanWeightDialogOpen(false)
    setScanWeight("")
    
    toast({
      title: "Peso de saída registrado",
      description: "O peso de saída foi registrado com sucesso.",
    })
  }

  // Lista de produtos únicos para o filtro
  const uniqueProdutos = Array.from(new Set(pesagens.map((pesagem) => pesagem.produto))).sort()

  // Função para gerar dados de exemplo
  const generateMockData = (): PesagemData[] => {
    const motoristas = [
      "CLAUDEMIR ALVES FARIAS",
      "GILENE FERREIRA DE SOUSA",
      "ANTONIO SANTANA DE LIMA",
      "LEANDRO AUGUSTO LOPES",
      "MACIEL RODRIGUES DA SILVA",
    ]

    const produtos = ["CALCÁRIO AGRÍCOLA", "FERTILIZANTE NPK", "ADUBO ORGÂNICO", "UREIA", "SUPERFOSFATO"]

    const fornecedores = [
      "AGROINDUSTRIAL SERRA VERDE LTDA",
      "CALNORTE INDUSTRIA E COMERCIO DE",
      "AMAGGI EXP.E IMP.LTDA",
    ]

    const clientes = [
      "ELZILENE DA SILVA",
      "RURAL FERTIL AGRONEGOCIOS LTDA",
      "AMAGGI EXPORTACAO E IMPORTACAO LTDA",
      "KOICHI ETO",
    ]

    const placas = ["ABC1D23", "XYZ9F87", "QWE4R56", "JKL7M89", "ZXC2V34"]

    return Array.from({ length: 50 }, (_, i) => {
      const pesoEntrada = Math.floor(Math.random() * 30000) + 10000
      const pesoSaida = Math.floor(Math.random() * 10000) + 5000
      const pesoLiquido = pesoEntrada - pesoSaida
      const month = Math.floor(Math.random() * 12) + 1
      const day = Math.floor(Math.random() * 28) + 1

      return {
        id: `pes-${i}`,
        numero: `${Math.floor(Math.random() * 10000) + 1}`,
        data: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/2024`,
        hora: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
        placa: placas[Math.floor(Math.random() * placas.length)],
        motorista: motoristas[Math.floor(Math.random() * motoristas.length)],
        produto: produtos[Math.floor(Math.random() * produtos.length)],
        fornecedor: fornecedores[Math.floor(Math.random() * fornecedores.length)],
        cliente: clientes[Math.floor(Math.random() * clientes.length)],
        pesoEntrada,
        pesoSaida,
        pesoLiquido,
        status: Math.random() > 0.2 ? "Concluída" : "Pendente",
      }
    })
  }

  // Estatísticas para os cards
  const totalPesagens = filteredPesagens.length
  const totalPesoLiquido = filteredPesagens.reduce((sum, pesagem) => sum + pesagem.pesoLiquido, 0)
  const totalPorProduto = uniqueProdutos.map((produto) => {
    const pesagensDoProduto = filteredPesagens.filter((p) => p.produto === produto)
    return {
      produto,
      quantidade: pesagensDoProduto.length,
      peso: pesagensDoProduto.reduce((sum, p) => sum + p.pesoLiquido, 0),
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pesagens</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Importar PDF
          </Button>
          <Button variant="outline" onClick={() => setIsNovaPesagemDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Pesagem
          </Button>
        </div>
      </div>

      <Tabs defaultValue="lista" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista de Pesagens</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar pesagens..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={produtoFilter} onValueChange={setProdutoFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os produtos</SelectItem>
                  {uniqueProdutos.map((produto) => (
                    <SelectItem key={produto} value={produto}>
                      {produto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
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
                    <TableHead className="w-[80px]">Nº</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Peso Entrada</TableHead>
                    <TableHead className="text-right">Peso Saída</TableHead>
                    <TableHead className="text-right">Peso Líquido</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((pesagem) => (
                      <TableRow key={pesagem.id}>
                        <TableCell className="font-medium">{pesagem.numero}</TableCell>
                        <TableCell>{pesagem.data}</TableCell>
                        <TableCell>{pesagem.placa}</TableCell>
                        <TableCell>{pesagem.motorista}</TableCell>
                        <TableCell>{pesagem.produto}</TableCell>
                        <TableCell className="text-right">{pesagem.pesoEntrada.toLocaleString("pt-BR")} kg</TableCell>
                        <TableCell className="text-right">{pesagem.pesoSaida.toLocaleString("pt-BR")} kg</TableCell>
                        <TableCell className="text-right">{pesagem.pesoLiquido.toLocaleString("pt-BR")} kg</TableCell>
                        <TableCell>
                          <Badge variant={pesagem.status === "Concluída" ? "success" : "outline"}>
                            {pesagem.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => handleView(pesagem)}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Visualizar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(pesagem)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScanWeight(pesagem)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Escanear Peso de Retorno
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handlePrint(pesagem)}>
                                <Printer className="mr-2 h-4 w-4" />
                                <span>Imprimir</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(pesagem)}>
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
                      <TableCell colSpan={10} className="h-24 text-center">
                        Nenhuma pesagem encontrada.
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
                Mostrando {Math.min(filteredPesagens.length, indexOfFirstItem + 1)}-
                {Math.min(filteredPesagens.length, indexOfLastItem)} de {filteredPesagens.length} pesagens
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
              totalPages={Math.ceil(filteredPesagens.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Pesagens</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPesagens}</div>
                <p className="text-xs text-muted-foreground">
                  {dateRangeStart && dateRangeEnd ? `No período selecionado` : `Total geral`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peso Líquido Total</CardTitle>
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
                <div className="text-2xl font-bold">{(totalPesoLiquido / 1000).toFixed(2)} ton</div>
                <p className="text-xs text-muted-foreground">
                  {dateRangeStart && dateRangeEnd ? `No período selecionado` : `Total geral`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média por Pesagem</CardTitle>
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
                  {totalPesagens > 0 ? (totalPesoLiquido / totalPesagens / 1000).toFixed(2) : "0.00"} ton
                </div>
                <p className="text-xs text-muted-foreground">Peso médio por pesagem</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pesagens por Produto</CardTitle>
              <CardDescription>Distribuição de pesagens e peso por produto</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Pesagens</TableHead>
                      <TableHead className="text-right">Peso Total</TableHead>
                      <TableHead className="text-right">Média por Pesagem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {totalPorProduto.map((item) => (
                      <TableRow key={item.produto}>
                        <TableCell>{item.produto}</TableCell>
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

      <NovaPesagemDialog
        open={isNovaPesagemDialogOpen}
        onOpenChange={setIsNovaPesagemDialogOpen}
        onPesagemCreated={handleNovaPesagemCreated}
      />

      {/* Diálogo de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pesagem Nº {selectedPesagem?.numero}</DialogTitle>
            <DialogDescription>Detalhes da pesagem</DialogDescription>
          </DialogHeader>
          {selectedPesagem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Data</Label>
                  <div className="font-medium">{selectedPesagem.data}</div>
                </div>
                <div>
                  <Label>Hora</Label>
                  <div className="font-medium">{selectedPesagem.hora}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="font-medium">
                    <Badge variant={selectedPesagem.status === "Concluída" ? "success" : "outline"}>
                      {selectedPesagem.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Placa</Label>
                  <div className="font-medium">{selectedPesagem.placa}</div>
                </div>
                <div>
                  <Label>Motorista</Label>
                  <div className="font-medium">{selectedPesagem.motorista}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Produto</Label>
                  <div className="font-medium">{selectedPesagem.produto}</div>
                </div>
                <div>
                  <Label>Fornecedor</Label>
                  <div className="font-medium">{selectedPesagem.fornecedor}</div>
                </div>
                <div>
                  <Label>Cliente</Label>
                  <div className="font-medium">{selectedPesagem.cliente}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Peso Entrada</Label>
                  <div className="font-medium">{selectedPesagem.pesoEntrada.toLocaleString("pt-BR")} kg</div>
                </div>
                <div>
                  <Label>Peso Saída</Label>
                  <div className="font-medium">{selectedPesagem.pesoSaida.toLocaleString("pt-BR")} kg</div>
                </div>
                <div>
                  <Label>Peso Líquido</Label>
                  <div className="font-medium">{selectedPesagem.pesoLiquido.toLocaleString("pt-BR")} kg</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            {selectedPesagem && (
              <Button onClick={() => handlePrint(selectedPesagem)}>
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
            <DialogTitle>Editar Pesagem</DialogTitle>
            <DialogDescription>Faça as alterações necessárias e clique em salvar.</DialogDescription>
          </DialogHeader>
          {selectedPesagem && (
            <form onSubmit={handleSaveEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-data">Data</Label>
                    <Input
                      id="edit-data"
                      value={selectedPesagem.data}
                      onChange={(e) => setSelectedPesagem({ ...selectedPesagem, data: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-hora">Hora</Label>
                    <Input
                      id="edit-hora"
                      value={selectedPesagem.hora}
                      onChange={(e) => setSelectedPesagem({ ...selectedPesagem, hora: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={selectedPesagem.status}
                      onChange={(value) => setSelectedPesagem({ ...selectedPesagem, status: value })}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Concluída">Concluída</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-placa">Placa</Label>
                    <Input
                      id="edit-placa"
                      value={selectedPesagem.placa}
                      onChange={(e) => setSelectedPesagem({ ...selectedPesagem, placa: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-motorista">Motorista</Label>
                    <Input
                      id="edit-motorista"
                      value={selectedPesagem.motorista}
                      onChange={(e) => setSelectedPesagem({ ...selectedPesagem, motorista: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-produto">Produto</Label>
                    <Input
                      id="edit-produto"
                      value={selectedPesagem.produto}
                      onChange={(e) => setSelectedPesagem({ ...selectedPesagem, produto: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-fornecedor">Fornecedor</Label>
                    <Input
                      id="edit-fornecedor"
                      value={selectedPesagem.fornecedor}
                      onChange={(e) => setSelectedPesagem({ ...selectedPesagem, fornecedor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cliente">Cliente</Label>
                    <Input
                      id="edit-cliente"
                      value={selectedPesagem.cliente}
                      onChange={(e) => setSelectedPesagem({ ...selectedPesagem, cliente: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-peso-entrada">Peso Entrada (kg)</Label>
                    <Input
                      id="edit-peso-entrada"
                      type="number"
                      value={selectedPesagem.pesoEntrada}
                      onChange={(e) => setSelectedPesagem({ ...selectedPesagem, pesoEntrada: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-peso-saida">Peso Saída (kg)</Label>
                    <Input
                      id="edit-peso-saida"
                      type="number"
                      value={selectedPesagem.pesoSaida}
                      onChange={(e) => setSelectedPesagem({ ...selectedPesagem, pesoSaida: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Peso Líquido: {(selectedPesagem.pesoEntrada - selectedPesagem.pesoSaida).toLocaleString("pt-BR")} kg
                    (calculado automaticamente)
                  </p>
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
              Tem certeza que deseja excluir a pesagem {selectedPesagem?.numero}? Esta ação não pode ser desfeita.
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

      {/* Diálogo para escanear peso de retorno */}
      <Dialog open={isScanWeightDialogOpen} onOpenChange={setIsScanWeightDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escanear Peso de Retorno</DialogTitle>
            <DialogDescription>
              Insira o peso de saída para a pesagem #{selectedPesagem?.numero}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scanWeight">Peso de Saída (kg)</Label>
              <Input
                id="scanWeight"
                type="number"
                value={scanWeight}
                onChange={(e) => setScanWeight(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScanWeightDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmScanWeight}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

