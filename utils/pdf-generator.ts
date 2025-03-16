import jsPDF from "jspdf"
import "jspdf-autotable"
import type { RelatorioRow } from "./excel-parser"

interface DadosPagamento {
  banco: string
  agencia: string
  conta: string
  empresa: string
  cnpj: string
  pix: string
}

export function generatePDF(
  data: RelatorioRow[],
  dataInicial: string,
  dataFinal: string,
  dadosPagamento: DadosPagamento,
) {
  const doc = new jsPDF("landscape")

  // Adicionar título
  doc.setFontSize(18)
  doc.text("Relatório de Pesagens", 14, 20)

  // Adicionar período
  doc.setFontSize(12)
  doc.text(`Período: ${dataInicial || "Todos"} a ${dataFinal || "Todos"}`, 14, 30)

  // Adicionar tabela
  doc.autoTable({
    head: [
      [
        "Entrega",
        "Data",
        "N.F.",
        "Placa",
        "Motorista",
        "Faturado",
        "Faz. Entregue",
        "Ticket RF",
        "Peso RF",
        "Ticket",
        "Peso",
        "Preço",
        "Total R$",
        "Depósito R$",
        "Data",
        "Descrição",
      ],
    ],
    body: data.map((row) => [
      row.entrega,
      row.data,
      row.nf,
      row.placa,
      row.motorista,
      row.faturado,
      row.fazEntregue,
      row.ticketRF,
      row.pesoRF.toFixed(3),
      row.ticket,
      row.peso.toFixed(3),
      row.preco.toFixed(2),
      row.total.toFixed(2),
      row.deposito?.toFixed(2) || "",
      row.dataDeposito,
      row.descricao,
    ]),
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [144, 238, 144] },
  })

  // Calcular totais
  const totalPeso = data.reduce((acc, row) => acc + row.peso, 0)
  const totalValor = data.reduce((acc, row) => acc + row.total, 0)
  const totalDepositos = data.reduce((acc, row) => acc + (row.deposito || 0), 0)
  const saldoAtual = totalValor - totalDepositos

  // Adicionar totais
  const finalY = (doc as any).lastAutoTable.finalY || 40
  doc.text("Totais:", 14, finalY + 10)
  doc.text(`Peso Total: ${totalPeso.toFixed(3)} kg`, 14, finalY + 20)
  doc.text(`Valor Total: R$ ${totalValor.toFixed(2)}`, 14, finalY + 30)
  doc.text(`Total Depósitos: R$ ${totalDepositos.toFixed(2)}`, 14, finalY + 40)
  doc.text(`Saldo a Pagar: R$ ${saldoAtual.toFixed(2)}`, 14, finalY + 50)

  // Adicionar dados de pagamento
  doc.text("Dados para Pagamento:", 150, finalY + 10)
  doc.text(`Banco: ${dadosPagamento.banco}`, 150, finalY + 20)
  doc.text(`Agência: ${dadosPagamento.agencia}`, 150, finalY + 30)
  doc.text(`Conta: ${dadosPagamento.conta}`, 150, finalY + 40)
  doc.text(`Empresa: ${dadosPagamento.empresa}`, 150, finalY + 50)
  doc.text(`CNPJ: ${dadosPagamento.cnpj}`, 150, finalY + 60)
  doc.text(`PIX: ${dadosPagamento.pix}`, 150, finalY + 70)

  // Salvar o PDF
  doc.save("relatorio_pesagens.pdf")
}

