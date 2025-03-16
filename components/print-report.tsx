import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PrintReportProps {
  reportType: string
  startDate?: Date
  endDate?: Date
  data: any[]
  companyName: string
  companyLogo?: string
  totals?: {
    total: string
    totalUnpaid: string
    receitas?: string
    despesas?: string
    saldo?: string
    totalPesoLiquido?: string
    totalPagos?: number
    totalNaoPagos?: number
    produtosAgrupados?: Record<string, any>
  }
  excludePaidItems?: boolean
}

export default function PrintReport({
  reportType,
  startDate,
  endDate,
  data,
  companyName,
  companyLogo,
  totals,
  excludePaidItems = false,
}: PrintReportProps) {
  const getReportTitle = () => {
    switch (reportType) {
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
    if (data.length === 0) {
      return <p className="text-center py-4">Nenhum dado disponível.</p>
    }

    switch (reportType) {
      case "entregas":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="border px-4 py-2">ID</TableHead>
                <TableHead className="border px-4 py-2">Cliente</TableHead>
                <TableHead className="border px-4 py-2">Motorista</TableHead>
                <TableHead className="border px-4 py-2">Data</TableHead>
                <TableHead className="border px-4 py-2">Status</TableHead>
                <TableHead className="border px-4 py-2">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border px-4 py-2">{item.id}</TableCell>
                  <TableCell className="border px-4 py-2">{item.cliente}</TableCell>
                  <TableCell className="border px-4 py-2">{item.motorista}</TableCell>
                  <TableCell className="border px-4 py-2">{item.data}</TableCell>
                  <TableCell className="border px-4 py-2">{item.status}</TableCell>
                  <TableCell className="border px-4 py-2">{item.valor}</TableCell>
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
                <TableHead className="border px-4 py-2">ID</TableHead>
                <TableHead className="border px-4 py-2">Tipo</TableHead>
                <TableHead className="border px-4 py-2">Descrição</TableHead>
                <TableHead className="border px-4 py-2">Data</TableHead>
                <TableHead className="border px-4 py-2">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border px-4 py-2">{item.id}</TableCell>
                  <TableCell className="border px-4 py-2">{item.tipo}</TableCell>
                  <TableCell className="border px-4 py-2">{item.descricao}</TableCell>
                  <TableCell className="border px-4 py-2">{item.data}</TableCell>
                  <TableCell className="border px-4 py-2">{item.valor}</TableCell>
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
                <TableHead className="border px-4 py-2">ID</TableHead>
                <TableHead className="border px-4 py-2">Nome</TableHead>
                <TableHead className="border px-4 py-2">Entregas</TableHead>
                <TableHead className="border px-4 py-2">Valor Total</TableHead>
                <TableHead className="border px-4 py-2">Última Entrega</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border px-4 py-2">{item.id}</TableCell>
                  <TableCell className="border px-4 py-2">{item.nome}</TableCell>
                  <TableCell className="border px-4 py-2">{item.entregas}</TableCell>
                  <TableCell className="border px-4 py-2">{item.valorTotal}</TableCell>
                  <TableCell className="border px-4 py-2">{item.ultimaEntrega}</TableCell>
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
                <TableHead className="border px-4 py-2">ID</TableHead>
                <TableHead className="border px-4 py-2">Nome</TableHead>
                <TableHead className="border px-4 py-2">Entregas</TableHead>
                <TableHead className="border px-4 py-2">Valor Total</TableHead>
                <TableHead className="border px-4 py-2">Última Entrega</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border px-4 py-2">{item.id}</TableCell>
                  <TableCell className="border px-4 py-2">{item.nome}</TableCell>
                  <TableCell className="border px-4 py-2">{item.entregas}</TableCell>
                  <TableCell className="border px-4 py-2">{item.valorTotal}</TableCell>
                  <TableCell className="border px-4 py-2">{item.ultimaEntrega}</TableCell>
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
                <TableHead className="border px-4 py-2">ID</TableHead>
                <TableHead className="border px-4 py-2">Coleta</TableHead>
                <TableHead className="border px-4 py-2">Cliente</TableHead>
                <TableHead className="border px-4 py-2">Produto</TableHead>
                <TableHead className="border px-4 py-2">Data</TableHead>
                <TableHead className="border px-4 py-2">Peso Líquido</TableHead>
                <TableHead className="border px-4 py-2">Valor</TableHead>
                <TableHead className="border px-4 py-2">Status Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border px-4 py-2">{item.id}</TableCell>
                  <TableCell className="border px-4 py-2">{item.coleta}</TableCell>
                  <TableCell className="border px-4 py-2">{item.cliente}</TableCell>
                  <TableCell className="border px-4 py-2">{item.produto}</TableCell>
                  <TableCell className="border px-4 py-2">{item.data}</TableCell>
                  <TableCell className="border px-4 py-2">{item.pesoLiquido}</TableCell>
                  <TableCell className="border px-4 py-2">{item.valor}</TableCell>
                  <TableCell className="border px-4 py-2">
                    {item.pago ? "Pago" : "Não pago"}
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

  const renderTotals = () => {
    if (!totals) return null;

    switch (reportType) {
      case "pesagens":
        return (
          <div className="mt-4">
            <div className="text-right mb-4">
              <p className="font-medium">
                Valor Total: <span className="font-bold">{totals.total}</span>
              </p>
              {excludePaidItems && (
                <p className="font-medium">
                  Valor Total (Excluindo Pagos): <span className="font-bold">{totals.totalUnpaid}</span>
                </p>
              )}
            </div>
            
            {/* Resumo Estatístico */}
            <div className="mt-6 border rounded-md p-4">
              <h4 className="font-medium mb-3">Resumo Estatístico</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Total de Pesagens</p>
                  <p className="text-xl font-bold">{data.length}</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Peso Líquido Total</p>
                  <p className="text-xl font-bold">{totals.totalPesoLiquido}</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Status de Pagamento</p>
                  <div>
                    <p className="text-sm">Pagos: <span className="font-bold">{totals.totalPagos}</span></p>
                    <p className="text-sm">Não Pagos: <span className="font-bold">{totals.totalNaoPagos}</span></p>
                  </div>
                </div>
              </div>

              {totals.produtosAgrupados && Object.keys(totals.produtosAgrupados).length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Detalhamento por Produto</h5>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border px-4 py-2">Produto</TableHead>
                          <TableHead className="border px-4 py-2">Quantidade</TableHead>
                          <TableHead className="border px-4 py-2">Peso Total</TableHead>
                          <TableHead className="border px-4 py-2">Valor Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(totals.produtosAgrupados).map(([produto, dados]: [string, any]) => (
                          <TableRow key={produto}>
                            <TableCell className="border px-4 py-2">{produto}</TableCell>
                            <TableCell className="border px-4 py-2">{dados.quantidade}</TableCell>
                            <TableCell className="border px-4 py-2">{dados.pesoTotal.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</TableCell>
                            <TableCell className="border px-4 py-2">R$ {dados.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "financeiro":
        return (
          <div className="mt-4 text-right">
            <p className="font-medium">
              Total Receitas: <span className="font-bold text-green-600">{totals.receitas}</span>
            </p>
            <p className="font-medium">
              Total Despesas: <span className="font-bold text-red-600">{totals.despesas}</span>
            </p>
            <p className="font-medium mt-1">
              Saldo: <span className={`font-bold ${totals.saldo?.startsWith('-') ? "text-red-600" : "text-green-600"}`}>
                {totals.saldo}
              </span>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="print-only p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {companyLogo && (
            <img src={companyLogo || "/placeholder.svg"} alt={`${companyName} Logo`} className="h-12 mr-4" />
          )}
          <h1 className="text-2xl font-bold">{companyName}</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Data de impressão:</p>
          <p className="font-medium">{format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{getReportTitle()}</h2>
        <p className="text-sm">
          Período: {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : ""} a{" "}
          {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : ""}
        </p>
      </div>

      <div className="mb-6">{renderReportTable()}</div>
      
      {renderTotals()}

      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>Este relatório foi gerado automaticamente pelo sistema de logística.</p>
        <p>
          © {new Date().getFullYear()} {companyName} - Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}

