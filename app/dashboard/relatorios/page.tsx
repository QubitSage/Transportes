"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, FileText, Printer } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PrintReport from "@/components/print-report"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

export default function RelatoriosPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [selectedReport, setSelectedReport] = useState("entregas")
  const [reportData, setReportData] = useState<any[]>([])
  const [isPrintView, setIsPrintView] = useState(false)
  const [excludePaidItems, setExcludePaidItems] = useState(false)
  const [savedReports, setSavedReports] = useState<any[]>([])
  const [reportName, setReportName] = useState("")
  const [produtoFilter, setProdutoFilter] = useState("todos")
  const [statusPagamentoFilter, setStatusPagamentoFilter] = useState("todos")

  // Dados de exemplo para os relatórios
  const mockEntregasData = [
    {
      id: 1,
      cliente: "Supermercado ABC",
      motorista: "João Silva",
      data: "10/03/2023",
      status: "Entregue",
      valor: "R$ 1.250,00",
    },
    {
      id: 2,
      cliente: "Farmácia Saúde",
      motorista: "Carlos Oliveira",
      data: "11/03/2023",
      status: "Em trânsito",
      valor: "R$ 850,00",
    },
    {
      id: 3,
      cliente: "Loja de Materiais",
      motorista: "Pedro Santos",
      data: "12/03/2023",
      status: "Agendada",
      valor: "R$ 2.100,00",
    },
    {
      id: 4,
      cliente: "Distribuidora XYZ",
      motorista: "Ana Costa",
      data: "13/03/2023",
      status: "Entregue",
      valor: "R$ 1.750,00",
    },
    {
      id: 5,
      cliente: "Mercado Central",
      motorista: "João Silva",
      data: "14/03/2023",
      status: "Cancelada",
      valor: "R$ 950,00",
    },
  ]

  const mockFinanceiroData = [
    { id: 1, tipo: "Receita", descricao: "Pagamento Entrega #1242", data: "10/03/2023", valor: "R$ 1.250,00" },
    { id: 2, tipo: "Despesa", descricao: "Combustível", data: "11/03/2023", valor: "R$ 350,00" },
    { id: 3, tipo: "Receita", descricao: "Pagamento Entrega #1243", data: "12/03/2023", valor: "R$ 2.100,00" },
    { id: 4, tipo: "Despesa", descricao: "Manutenção Caminhão", data: "13/03/2023", valor: "R$ 750,00" },
    { id: 5, tipo: "Receita", descricao: "Pagamento Entrega #1244", data: "14/03/2023", valor: "R$ 950,00" },
  ]

  const mockClientesData = [
    { id: 1, nome: "Supermercado ABC", entregas: 15, valorTotal: "R$ 18.250,00", ultimaEntrega: "10/03/2023" },
    { id: 2, nome: "Farmácia Saúde", entregas: 8, valorTotal: "R$ 7.850,00", ultimaEntrega: "11/03/2023" },
    { id: 3, nome: "Loja de Materiais", entregas: 12, valorTotal: "R$ 15.100,00", ultimaEntrega: "12/03/2023" },
    { id: 4, nome: "Distribuidora XYZ", entregas: 20, valorTotal: "R$ 22.750,00", ultimaEntrega: "13/03/2023" },
    { id: 5, nome: "Mercado Central", entregas: 10, valorTotal: "R$ 12.950,00", ultimaEntrega: "14/03/2023" },
  ]

  const mockMotoristasData = [
    { id: 1, nome: "João Silva", entregas: 25, valorTotal: "R$ 28.250,00", ultimaEntrega: "10/03/2023" },
    { id: 2, nome: "Carlos Oliveira", entregas: 18, valorTotal: "R$ 17.850,00", ultimaEntrega: "11/03/2023" },
    { id: 3, nome: "Pedro Santos", entregas: 22, valorTotal: "R$ 25.100,00", ultimaEntrega: "12/03/2023" },
    { id: 4, nome: "Ana Costa", entregas: 30, valorTotal: "R$ 32.750,00", ultimaEntrega: "13/03/2023" },
    { id: 5, nome: "Mariana Souza", entregas: 20, valorTotal: "R$ 22.950,00", ultimaEntrega: "14/03/2023" },
  ]

  // Adicionar dados de exemplo para pesagens
  const mockPesagensData = [
    {
      id: 1,
      coleta: "Coleta #001",
      cliente: "Supermercado ABC",
      produto: "Arroz",
      data: "10/03/2023",
      pesoLiquido: "1500 kg",
      valor: "R$ 1.250,00",
      pago: true
    },
    {
      id: 2,
      coleta: "Coleta #002",
      cliente: "Farmácia Saúde",
      produto: "Medicamentos",
      data: "11/03/2023",
      pesoLiquido: "850 kg",
      valor: "R$ 850,00",
      pago: false
    },
    {
      id: 3,
      coleta: "Coleta #003",
      cliente: "Loja de Materiais",
      produto: "Cimento",
      data: "12/03/2023",
      pesoLiquido: "2100 kg",
      valor: "R$ 2.100,00",
      pago: true
    },
    {
      id: 4,
      coleta: "Coleta #004",
      cliente: "Distribuidora XYZ",
      produto: "Bebidas",
      data: "13/03/2023",
      pesoLiquido: "1750 kg",
      valor: "R$ 1.750,00",
      pago: false
    },
    {
      id: 5,
      coleta: "Coleta #005",
      cliente: "Mercado Central",
      produto: "Frutas",
      data: "14/03/2023",
      pesoLiquido: "950 kg",
      valor: "R$ 950,00",
      pago: true
    },
  ]

  // Obter lista de produtos únicos para o filtro
  const getUniqueProducts = () => {
    const produtos = mockPesagensData.map(item => item.produto);
    return ["todos", ...Array.from(new Set(produtos))];
  };

  // Filtrar dados com base no período selecionado e outros filtros
  const filterByDate = (items: any[]) => {
    if (!startDate || !endDate) return items;
    
    console.log("Filtering dates:", { startDate, endDate });
    console.log("Original items:", items);
    
    const filteredItems = items.filter(item => {
      if (!item.data) return false;
      
      try {
        // Converter a data do formato DD/MM/YYYY para um objeto Date
        const parts = item.data.split('/');
        const itemDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        
        // Ajustar as datas de comparação para ignorar o horário
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        const result = itemDate >= start && itemDate <= end;
        console.log(`Item date: ${item.data}, parsed: ${itemDate}, in range: ${result}`);
        return result;
      } catch (error) {
        console.error("Error parsing date:", item.data, error);
        return false;
      }
    });
    
    console.log("Filtered items:", filteredItems);
    return filteredItems;
  };

  // Aplicar filtros adicionais para pesagens
  const applyPesagensFilters = (items: any[]) => {
    return items.filter(item => {
      // Filtro de produto
      const matchesProduto = produtoFilter === "todos" || item.produto === produtoFilter;
      
      // Filtro de status de pagamento
      const matchesStatusPagamento = 
        statusPagamentoFilter === "todos" || 
        (statusPagamentoFilter === "pago" && item.pago) || 
        (statusPagamentoFilter === "nao_pago" && !item.pago);
      
      return matchesProduto && matchesStatusPagamento;
    });
  };

  const generateReport = () => {
    // Verificar se as datas são válidas
    if (!startDate || !endDate) {
      toast({
        title: "Aviso",
        description: "Selecione um período válido para gerar o relatório.",
      });
      return;
    }
    
    // Garantir que a data final seja posterior à data inicial
    if (startDate > endDate) {
      toast({
        title: "Erro de validação",
        description: "A data final deve ser posterior à data inicial.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulando a geração de relatório com base no tipo selecionado
    switch (selectedReport) {
      case "entregas":
        setReportData(filterByDate(mockEntregasData));
        break;
      case "financeiro":
        setReportData(filterByDate(mockFinanceiroData));
        break;
      case "clientes":
        // Para clientes e motoristas, não filtramos por data diretamente
        setReportData(mockClientesData);
        break;
      case "motoristas":
        setReportData(mockMotoristasData);
        break;
      case "pesagens":
        // Aplicar filtros adicionais para pesagens
        setReportData(applyPesagensFilters(filterByDate(mockPesagensData)));
        break;
      default:
        setReportData([]);
    }
  }

  const handlePrint = () => {
    setIsPrintView(true)
    setTimeout(() => {
      window.print()
      setTimeout(() => {
        setIsPrintView(false)
      }, 500)
    }, 100)
  }

  const handleExportPDF = () => {
    // Simulação de exportação para PDF
    toast({
      title: "Exportando relatório",
      description: "O relatório está sendo exportado para PDF.",
    });
    
    // Em uma implementação real, aqui seria chamada uma biblioteca como jsPDF
    setTimeout(() => {
      toast({
        title: "Relatório exportado",
        description: "O relatório foi exportado com sucesso.",
      });
    }, 1500);
  }

  const getReportTitle = () => {
    switch (selectedReport) {
      case "entregas":
        return "Relatório de Entregas"
      case "financeiro":
        return "Relatório Financeiro"
      case "clientes":
        return "Relatório de Clientes"
      case "motoristas":
        return "Relatório de Motoristas"
      case "pesagens":
        return "Relatório de Pesagens"
      default:
        return "Relatório"
    }
  }

  const renderReportTable = () => {
    if (reportData.length === 0) {
      return <p className="text-center py-4">Nenhum dado disponível. Gere um relatório primeiro.</p>
    }

    switch (selectedReport) {
      case "entregas":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.cliente}</TableCell>
                  <TableCell>{item.motorista}</TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "financeiro":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.tipo}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "clientes":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Entregas</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Última Entrega</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.entregas}</TableCell>
                  <TableCell>{item.valorTotal}</TableCell>
                  <TableCell>{item.ultimaEntrega}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "motoristas":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Entregas</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Última Entrega</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.entregas}</TableCell>
                  <TableCell>{item.valorTotal}</TableCell>
                  <TableCell>{item.ultimaEntrega}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "pesagens":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Coleta</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Peso Líquido</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.coleta}</TableCell>
                  <TableCell>{item.cliente}</TableCell>
                  <TableCell>{item.produto}</TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.pesoLiquido}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${item.pago ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    `}
                    >
                      {item.pago ? "Pago" : "Não pago"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      default:
        return null
    }
  }

  // Calcular totais para relatórios financeiros
  const calculateTotals = () => {
    if (selectedReport === "pesagens") {
      const total = reportData.reduce((sum, item) => {
        const value = parseFloat(item.valor.replace("R$ ", "").replace(".", "").replace(",", "."))
        return sum + value
      }, 0)
      
      const totalUnpaid = reportData.reduce((sum, item) => {
        if (!item.pago) {
          const value = parseFloat(item.valor.replace("R$ ", "").replace(".", "").replace(",", "."))
          return sum + value
        }
        return sum
      }, 0)
      
      // Calcular estatísticas adicionais
      const totalPesoLiquido = reportData.reduce((sum, item) => {
        const peso = parseFloat(item.pesoLiquido.replace(" kg", "").replace(".", "").replace(",", "."))
        return sum + peso
      }, 0)
      
      const totalPagos = reportData.filter(item => item.pago).length
      const totalNaoPagos = reportData.filter(item => !item.pago).length
      
      // Agrupar por produto
      const produtosAgrupados = reportData.reduce((acc: any, item) => {
        const produto = item.produto
        if (!acc[produto]) {
          acc[produto] = {
            quantidade: 0,
            pesoTotal: 0,
            valorTotal: 0
          }
        }
        
        acc[produto].quantidade += 1
        acc[produto].pesoTotal += parseFloat(item.pesoLiquido.replace(" kg", "").replace(".", "").replace(",", "."))
        acc[produto].valorTotal += parseFloat(item.valor.replace("R$ ", "").replace(".", "").replace(",", "."))
        
        return acc
      }, {})
      
      return {
        total: `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        totalUnpaid: `R$ ${totalUnpaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        totalPesoLiquido: `${totalPesoLiquido.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`,
        totalPagos,
        totalNaoPagos,
        produtosAgrupados
      }
    } else if (selectedReport === "financeiro") {
      const receitas = reportData
        .filter(item => item.tipo === "Receita")
        .reduce((sum, item) => {
          const value = parseFloat(item.valor.replace("R$ ", "").replace(".", "").replace(",", "."))
          return sum + value
        }, 0)
      
      const despesas = reportData
        .filter(item => item.tipo === "Despesa")
        .reduce((sum, item) => {
          const value = parseFloat(item.valor.replace("R$ ", "").replace(".", "").replace(",", "."))
          return sum + value
        }, 0)
      
      const saldo = receitas - despesas
      
      return {
        receitas: `R$ ${receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        despesas: `R$ ${despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        saldo: `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        total: `R$ ${receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        totalUnpaid: `R$ 0,00`
      }
    }
    
    return { total: "R$ 0,00", totalUnpaid: "R$ 0,00", receitas: "R$ 0,00", despesas: "R$ 0,00", saldo: "R$ 0,00" }
  }

  const handleSaveReport = () => {
    if (!reportData.length) {
      toast({
        title: "Erro ao salvar",
        description: "Gere um relatório antes de salvá-lo.",
        variant: "destructive",
      });
      return;
    }

    if (!reportName.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "Digite um nome para o relatório.",
        variant: "destructive",
      });
      return;
    }

    const newSavedReport = {
      id: Date.now(),
      name: reportName,
      type: selectedReport,
      data: reportData,
      startDate,
      endDate,
      createdAt: new Date(),
    };

    setSavedReports([...savedReports, newSavedReport]);
    setReportName("");

    toast({
      title: "Relatório salvo",
      description: "O relatório foi salvo com sucesso.",
    });
  };

  const handleLoadReport = (report: any) => {
    setSelectedReport(report.type);
    setReportData(report.data);
    setStartDate(new Date(report.startDate));
    setEndDate(new Date(report.endDate));
  };

  const handleDeleteSavedReport = (id: number) => {
    setSavedReports(savedReports.filter(report => report.id !== id));
    
    toast({
      title: "Relatório excluído",
      description: "O relatório foi excluído com sucesso.",
    });
  };

  if (isPrintView) {
    return (
      <PrintReport
        reportType={selectedReport}
        startDate={startDate}
        endDate={endDate}
        data={reportData}
        companyName="LogTech Sistemas"
        companyLogo="/placeholder.svg?height=50&width=120"
        totals={calculateTotals()}
        excludePaidItems={excludePaidItems}
      />
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Relatórios</h1>

      <Tabs defaultValue="gerar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gerar">Gerar Relatório</TabsTrigger>
          <TabsTrigger value="salvos">Relatórios Salvos</TabsTrigger>
        </TabsList>

        <TabsContent value="gerar">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Novo Relatório</CardTitle>
              <CardDescription>Selecione o tipo de relatório e o período desejado.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Relatório</label>
                    <Select value={selectedReport} onValueChange={setSelectedReport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entregas">Entregas</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="clientes">Clientes</SelectItem>
                        <SelectItem value="motoristas">Motoristas</SelectItem>
                        <SelectItem value="pesagens">Pesagens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Inicial</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={ptBR} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Final</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={ptBR} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {selectedReport === "pesagens" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Filtrar por Produto</label>
                      <Select value={produtoFilter} onValueChange={setProdutoFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {getUniqueProducts().map(produto => (
                            <SelectItem key={produto} value={produto}>
                              {produto === "todos" ? "Todos os produtos" : produto}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Filtrar por Status de Pagamento</label>
                      <Select value={statusPagamentoFilter} onValueChange={setStatusPagamentoFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="pago">Pagos</SelectItem>
                          <SelectItem value="nao_pago">Não pagos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Button onClick={generateReport} className="w-full md:w-auto">
                  Gerar Relatório
                </Button>

                {reportData.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">{getReportTitle()}</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir
                        </Button>
                        <Button variant="outline" onClick={handleExportPDF}>
                          <FileText className="h-4 w-4 mr-2" />
                          Exportar PDF
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md">{renderReportTable()}</div>

                    <div className="flex justify-between items-center mt-4">
                      {selectedReport === "pesagens" && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="excludePaid"
                            checked={excludePaidItems}
                            onChange={(e) => setExcludePaidItems(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label htmlFor="excludePaid" className="text-sm font-medium">
                            Excluir itens pagos do valor total
                          </label>
                        </div>
                      )}
                      {selectedReport === "pesagens" && reportData.length > 0 && (
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Valor Total: <span className="font-bold">{calculateTotals().total}</span>
                          </p>
                          {excludePaidItems && (
                            <p className="text-sm font-medium">
                              Valor Total (Excluindo Pagos): <span className="font-bold">{calculateTotals().totalUnpaid}</span>
                            </p>
                          )}
                        </div>
                      )}
                      {selectedReport === "financeiro" && reportData.length > 0 && (
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Total Receitas: <span className="font-bold text-green-600">{calculateTotals().receitas}</span>
                          </p>
                          <p className="text-sm font-medium">
                            Total Despesas: <span className="font-bold text-red-600">{calculateTotals().despesas}</span>
                          </p>
                          <p className="text-sm font-medium mt-1">
                            Saldo: <span className={`font-bold ${parseFloat(calculateTotals().saldo?.replace("R$ ", "").replace(".", "").replace(",", ".") || "0") >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {calculateTotals().saldo}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedReport === "pesagens" && reportData.length > 0 && (
                      <div className="mt-6 border rounded-md p-4">
                        <h4 className="font-medium mb-3">Resumo Estatístico</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border rounded-md p-3">
                            <p className="text-sm text-muted-foreground">Total de Pesagens</p>
                            <p className="text-xl font-bold">{reportData.length}</p>
                          </div>
                          <div className="border rounded-md p-3">
                            <p className="text-sm text-muted-foreground">Peso Líquido Total</p>
                            <p className="text-xl font-bold">{calculateTotals().totalPesoLiquido}</p>
                          </div>
                          <div className="border rounded-md p-3">
                            <p className="text-sm text-muted-foreground">Status de Pagamento</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm">Pagos: <span className="font-bold text-green-600">{calculateTotals().totalPagos}</span></p>
                                <p className="text-sm">Não Pagos: <span className="font-bold text-red-600">{calculateTotals().totalNaoPagos}</span></p>
                              </div>
                              <div className="h-10 w-10 rounded-full bg-gray-200 relative">
                                <div 
                                  className="absolute inset-0 rounded-full bg-green-500"
                                  style={{ 
                                    clipPath: reportData.length > 0 ? 
                                      `inset(0 ${100 - (calculateTotals().totalPagos || 0) / reportData.length * 100}% 0 0)` :
                                      'none'
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {Object.keys(calculateTotals().produtosAgrupados || {}).length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium mb-2">Detalhamento por Produto</h5>
                            <div className="border rounded-md overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Produto</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead>Peso Total</TableHead>
                                    <TableHead>Valor Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Object.entries(calculateTotals().produtosAgrupados || {}).map(([produto, dados]: [string, any]) => (
                                    <TableRow key={produto}>
                                      <TableCell>{produto}</TableCell>
                                      <TableCell>{dados.quantidade}</TableCell>
                                      <TableCell>{dados.pesoTotal.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</TableCell>
                                      <TableCell>R$ {dados.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {reportData.length > 0 && (
                      <div className="mt-6 flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="text-sm font-medium">Nome do Relatório</label>
                          <Input 
                            value={reportName} 
                            onChange={(e) => setReportName(e.target.value)} 
                            placeholder="Digite um nome para salvar este relatório"
                            className="mt-1"
                          />
                        </div>
                        <Button onClick={handleSaveReport}>Salvar Relatório</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salvos">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Salvos</CardTitle>
              <CardDescription>Acesse seus relatórios salvos anteriormente.</CardDescription>
            </CardHeader>
            <CardContent>
              {savedReports.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhum relatório salvo. Gere e salve um relatório na aba "Gerar Relatório".
                </p>
              ) : (
                <div className="space-y-4">
                  {savedReports.map((report) => (
                    <div key={report.id} className="border rounded-md p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)} • 
                          {report.startDate && report.endDate ? 
                            ` ${format(new Date(report.startDate), "dd/MM/yyyy", { locale: ptBR })} a ${format(new Date(report.endDate), "dd/MM/yyyy", { locale: ptBR })}` : 
                            " Sem período definido"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Criado em {format(new Date(report.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleLoadReport(report)}>
                          Carregar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteSavedReport(report.id)}>
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estilos para impressão */}
      <style jsx global>{`
        .print-only {
          display: none;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .print-only,
          .print-only * {
            visibility: visible;
            display: block;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}