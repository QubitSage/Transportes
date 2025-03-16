"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, FileText, Download, Printer, Upload, AlertCircle, DollarSign, ChevronsUpDown, Eye } from "lucide-react"
import { parseExcelFile, generateExcelFile, type RelatorioRow } from "@/utils/excel-parser"
import { generatePDF } from "@/utils/pdf-generator"
import type { DadosPagamento } from "@/types/types"
import { ResumoCard } from "@/components/resumo-card"
import { PaginationControls } from "@/components/pagination-controls"

const ITEMS_PER_PAGE = 10

export default function RelatoriosPeriodoPage() {
  const [dataInicial, setDataInicial] = useState("")
  const [dataFinal, setDataFinal] = useState("")
  const [cliente, setCliente] = useState("")
  const [motorista, setMotorista] = useState("")
  const [error, setError] = useState("")
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isPagamentoDialogOpen, setIsPagamentoDialogOpen] = useState(false)
  const [isEditingPagamento, setIsEditingPagamento] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: keyof RelatorioRow; direction: "asc" | "desc" } | null>(null)
  const [isRelatorioDialogOpen, setIsRelatorioDialogOpen] = useState(false)
  const [selectedRelatorio, setSelectedRelatorio] = useState<RelatorioRow | null>(null)
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({})

  const { toast } = useToast()

  // Estado para dados de pagamento
  const [dadosPagamento, setDadosPagamento] = useState<DadosPagamento>({
    banco: "BANCO SANTANDER (033)",
    agencia: "3436",
    conta: "130053905",
    empresa: "FERTILIZANTES NORTE DO BRASIL LTDA",
    cnpj: "07.903.987/0001-01",
    pix: "07.903.987/0001-01",
  })

  // Estado para armazenar os relatórios
  const [relatorios, setRelatorios] = useState<RelatorioRow[]>([
    {
      entrega: 1,
      data: "2024-03-25",
      nf: "QZN2129",
      placa: "ABC1234",
      motorista: "LEANDRO",
      faturado: "EMILIO PALUDO",
      fazEntregue: "SERRA DA PRATA",
      ticketRF: "RF-5.607",
      pesoRF: 62.25,
      ticket: "T-1234",
      peso: 62.25,
      preco: 5450.0,
      total: 28102.5,
      deposito: 100000.0,
      dataDeposito: "2024-03-27",
      descricao: "FERTILIZANTES",
    },
    {
      entrega: 2,
      data: "2024-03-26",
      nf: "QZD1627",
      placa: "DEF5678",
      motorista: "GILMAR",
      faturado: "EMILIO PALUDO",
      fazEntregue: "SERRA DA PRATA",
      ticketRF: "RF-5.608",
      pesoRF: 64.73,
      ticket: "T-1235",
      peso: 64.73,
      preco: 5450.0,
      total: 29128.5,
      deposito: 32268.5,
      dataDeposito: "2024-03-28",
      descricao: "FERTILIZANTES",
    },
  ])

  // Função para aplicar os filtros
  const applyFilters = () => {
    setCurrentPage(1) // Reset para a primeira página ao aplicar filtros
    toast({
      title: "Filtros aplicados",
      description: "Os relatórios foram filtrados com sucesso.",
      duration: 3000,
    })
  }

  // Filtragem dos relatórios
  const filteredRelatorios = useMemo(() => {
    return relatorios.filter((relatorio) => {
      const dataMatch = (!dataInicial || relatorio.data >= dataInicial) && (!dataFinal || relatorio.data <= dataFinal)
      const clienteMatch =
        !cliente || cliente === "todos" || relatorio.faturado.toLowerCase().includes(cliente.toLowerCase())
      const motoristaMatch =
        !motorista || motorista === "todos" || relatorio.motorista.toLowerCase().includes(motorista.toLowerCase())

      return dataMatch && clienteMatch && motoristaMatch
    })
  }, [relatorios, dataInicial, dataFinal, cliente, motorista])

  // Ordenação dos relatórios filtrados
  const sortedRelatorios = useMemo(() => {
    const sortableItems = [...filteredRelatorios]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [filteredRelatorios, sortConfig])

  // Paginação
  const pageCount = Math.ceil(sortedRelatorios.length / ITEMS_PER_PAGE)
  const paginatedRelatorios = sortedRelatorios.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Cálculo dos totais
  const [totalPeso, setTotalPeso] = useState(0)
  const [totalValor, setTotalValor] = useState(0)
  const [totalDepositos, setTotalDepositos] = useState(0)
  const [saldoAtual, setSaldoAtual] = useState(0)

  useEffect(() => {
    const newTotalPeso = filteredRelatorios.reduce(
      (acc, item) => acc + (typeof item.peso === "number" ? item.peso : 0),
      0,
    )
    const newTotalValor = filteredRelatorios.reduce(
      (acc, item) => acc + (typeof item.total === "number" ? item.total : 0),
      0,
    )
    const newTotalDepositos = filteredRelatorios.reduce(
      (acc, item) => acc + (typeof item.deposito === "number" ? item.deposito : 0),
      0,
    )

    setTotalPeso(newTotalPeso)
    setTotalValor(newTotalValor)
    setTotalDepositos(newTotalDepositos)
    setSaldoAtual(newTotalValor - newTotalDepositos)
  }, [filteredRelatorios, relatorios, cliente, motorista, dataInicial, dataFinal])

  const handleOpenRelatorio = (relatorio: RelatorioRow) => {
    setSelectedRelatorio(relatorio)
    setSelectedFields(Object.keys(relatorio).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    setIsRelatorioDialogOpen(true)
  }

  const handleRelatorioChange = (key: string, value: string) => {
    if (selectedRelatorio) {
      let parsedValue: string | number = value

      if (["entrega", "pesoRF", "peso", "preco", "total", "deposito"].includes(key)) {
        parsedValue = value === "" ? 0 : Number(value)
      }

      const updatedRelatorio = {
        ...selectedRelatorio,
        [key]: parsedValue,
      }

      setSelectedRelatorio(updatedRelatorio)

      // Atualizar o estado dos relatórios imediatamente
      setRelatorios(relatorios.map((r) => (r.entrega === updatedRelatorio.entrega ? updatedRelatorio : r)))

      // Se o campo alterado for 'faturado', atualizar o filtro de cliente
      if (key === "faturado") {
        const updatedCliente = value.toLowerCase()
        if (!cliente || (cliente !== "todos" && !updatedCliente.includes(cliente.toLowerCase()))) {
          setCliente("todos")
        }
      }
    }
  }

  const handleSaveRelatorio = () => {
    if (selectedRelatorio) {
      setRelatorios(relatorios.map((r) => (r.entrega === selectedRelatorio.entrega ? selectedRelatorio : r)))
      setIsRelatorioDialogOpen(false)

      // Recalcular os filtros
      const updatedCliente = selectedRelatorio.faturado.toLowerCase()
      if (!cliente || (cliente !== "todos" && !updatedCliente.includes(cliente.toLowerCase()))) {
        setCliente("todos")
      }

      toast({
        title: "Relatório atualizado",
        description: "As alterações foram salvas com sucesso.",
        duration: 3000,
      })
    }
  }

  const handlePagamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDadosPagamento((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const importedData = await parseExcelFile(file)
      setRelatorios(importedData)
      setError("")
      setIsImportDialogOpen(false)
      toast({
        title: "Importação bem-sucedida",
        description: "Os dados foram importados com sucesso.",
        duration: 3000,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao importar arquivo")
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar o arquivo. Verifique o formato e tente novamente.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleFieldSelection = (field: string) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleExportCSV = () => {
    if (!selectedRelatorio) return

    const formattedData = Object.entries(selectedRelatorio)
      .filter(([key]) => selectedFields[key])
      .reduce(
        (acc, [key, value]) => {
          acc[key.toUpperCase()] = value
          return acc
        },
        {} as Record<string, any>,
      )

    const csvContent = generateExcelFile([formattedData], dadosPagamento)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `relatorio_${selectedRelatorio.entrega}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    toast({
      title: "Exportação concluída",
      description: "O arquivo CSV foi gerado e baixado com sucesso.",
      duration: 3000,
    })
  }

  const handleGeneratePDF = () => {
    generatePDF(filteredRelatorios, dataInicial, dataFinal, dadosPagamento)
    toast({
      title: "PDF gerado",
      description: "O relatório em PDF foi gerado e baixado com sucesso.",
      duration: 3000,
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const clienteOptions = useMemo(() => {
    const uniqueClientes = Array.from(new Set(relatorios.map((r) => r.faturado)))
    return ["todos", ...uniqueClientes]
  }, [relatorios])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Relatório por Período</h1>
          <p className="text-muted-foreground">Gere relatórios de pesagens por período</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setIsPagamentoDialogOpen(true)}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Dados de Pagamento
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualize ou edite os dados de pagamento</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Planilha
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Importe dados de uma planilha Excel ou CSV</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleGeneratePDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gere um relatório em formato PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Imprima o relatório atual</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResumoCard
          title="Total de Peso"
          value={`${totalPeso.toFixed(3)} kg`}
          icon={<ChevronsUpDown className="h-4 w-4" />}
        />
        <ResumoCard
          title="Valor Total"
          value={totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <ResumoCard
          title="Total de Depósitos"
          value={totalDepositos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          icon={<Download className="h-4 w-4" />}
        />
        <ResumoCard
          title="Saldo a Pagar"
          value={saldoAtual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          icon={<AlertCircle className="h-4 w-4" />}
          highlight={true}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Defina o período e outros filtros para o relatório</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Data Final</Label>
              <Input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={cliente} onValueChange={setCliente}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os clientes" />
                </SelectTrigger>
                <SelectContent>
                  {clienteOptions.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase()}>
                      {option === "todos" ? "Todos os clientes" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Motorista</Label>
              <Select value={motorista} onValueChange={setMotorista}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os motoristas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os motoristas</SelectItem>
                  <SelectItem value="leandro">LEANDRO</SelectItem>
                  <SelectItem value="gilmar">GILMAR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-[#007846] hover:bg-[#006038]" onClick={applyFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Relatórios</CardTitle>
              <CardDescription>Clique em um relatório para ver detalhes e editar</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Número NF</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRelatorios.map((relatorio, index) => (
                  <TableRow key={index}>
                    <TableCell>{relatorio.entrega}</TableCell>
                    <TableCell>{relatorio.data}</TableCell>
                    <TableCell>{relatorio.nf}</TableCell>
                    <TableCell>{relatorio.faturado}</TableCell>
                    <TableCell>
                      <Button variant="ghost" onClick={() => handleOpenRelatorio(relatorio)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationControls currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
        </CardContent>
      </Card>

      <Dialog open={isRelatorioDialogOpen} onOpenChange={setIsRelatorioDialogOpen}>
        <DialogContent className="sm:max-w-[90%] sm:h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 bg-[#1e366a] text-white">
            <DialogTitle className="text-2xl">Detalhes do Relatório</DialogTitle>
            <DialogDescription className="text-gray-200">
              Visualize, edite e selecione os dados do relatório para exportação
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-auto px-6 py-4">
            {selectedRelatorio && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(selectedRelatorio).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`select-${key}`}
                      checked={selectedFields[key]}
                      onCheckedChange={() => handleFieldSelection(key)}
                    />
                    <div className="flex-grow">
                      <Label htmlFor={`input-${key}`} className="text-sm font-medium text-gray-700">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Input
                        id={`input-${key}`}
                        value={value as string}
                        onChange={(e) => handleRelatorioChange(key, e.target.value)}
                        className="w-full mt-1"
                        type={["entrega", "pesoRF", "peso", "total", "deposito"].includes(key) ? "number" : "text"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="px-6 py-4 bg-gray-50">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsRelatorioDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
              <Button onClick={handleSaveRelatorio} className="bg-[#007846] hover:bg-[#006038]">
                Salvar Alterações
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mantenha os diálogos existentes (Dados de Pagamento, Importar Planilha) */}
    </div>
  )
}

