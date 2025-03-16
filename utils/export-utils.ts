import jsPDF from "jspdf"
import "jspdf-autotable"
import type { ExportConfig } from "@/components/export-config-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import * as XLSX from "xlsx"

// Função para formatar valores com base no tipo e configuração
export const formatValue = (value: any, format?: string, config?: ExportConfig): string => {
  if (value === null || value === undefined) return ""

  if (!config) {
    // Formatação padrão se não houver configuração
    if (format === "date" && value) {
      if (typeof value === "string") {
        const date = new Date(value)
        return isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR")
      }
      return value.toLocaleDateString("pt-BR")
    }

    if (format === "currency" && typeof value === "number") {
      return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }

    if (format === "number" && typeof value === "number") {
      return value.toLocaleString("pt-BR")
    }

    return String(value)
  }

  // Formatação com base na configuração
  try {
    if (format === "date" && value) {
      const date = typeof value === "string" ? new Date(value) : value
      if (isNaN(date.getTime())) return String(value)

      return formatDate(date, config.dateFormat)
    }

    if (format === "currency" && typeof value === "number") {
      return formatCurrency(value, config.currencyFormat)
    }

    if (format === "number" && typeof value === "number") {
      return formatNumber(value, config.numberFormat)
    }
  } catch (error) {
    console.error("Erro ao formatar valor:", error)
  }

  return String(value)
}

// Função auxiliar para formatar datas
const formatDate = (date: Date, formatString: string): string => {
  try {
    return format(date, formatString, { locale: ptBR })
  } catch (error) {
    return date.toLocaleDateString("pt-BR")
  }
}

// Função auxiliar para formatar números
const formatNumber = (value: number, formatString: string): string => {
  // Implementação básica - pode ser expandida para suportar mais formatos
  if (formatString === "#,##0.00") {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  if (formatString === "#,##0") {
    return value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })
  }
  if (formatString === "#,##0.000") {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
  }
  if (formatString === "#.##0,00") {
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return value.toLocaleString("pt-BR")
}

// Função auxiliar para formatar moeda
const formatCurrency = (value: number, formatString: string): string => {
  if (formatString === "R$ #,##0.00") {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }
  if (formatString === "#,##0.00 R$") {
    return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} R$`
  }
  if (formatString === "$ #,##0.00") {
    return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
  }
  if (formatString === "€ #,##0.00") {
    return value.toLocaleString("de-DE", { style: "currency", currency: "EUR" })
  }

  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

// Função para gerar CSV
export const generateCSV = (data: any[], config: ExportConfig): string => {
  // Filtrar apenas as colunas incluídas e na ordem correta
  const columns = config.columns.filter((col) => col.include)

  // Criar cabeçalho
  let csv = config.showHeaders ? columns.map((col) => `"${col.header}"`).join(",") + "\n" : ""

  // Adicionar linhas de dados
  data.forEach((item) => {
    const row = columns.map((col) => {
      const value = formatValue(item[col.field], col.format, config)
      // Escapar aspas duplas e envolver em aspas
      return `"${String(value).replace(/"/g, '""')}"`
    })
    csv += row.join(",") + "\n"
  })

  return csv
}

// Função para gerar Excel
export const generateExcel = (data: any[], config: ExportConfig): Blob => {
  // Filtrar apenas as colunas incluídas e na ordem correta
  const columns = config.columns.filter((col) => col.include)

  // Preparar dados para o Excel
  const excelData = config.showHeaders ? [columns.map((col) => col.header)] : []

  // Adicionar linhas de dados
  data.forEach((item) => {
    const row = columns.map((col) => formatValue(item[col.field], col.format, config))
    excelData.push(row)
  })

  // Criar planilha e workbook
  const ws = XLSX.utils.aoa_to_sheet(excelData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Dados")

  // Configurar larguras das colunas
  const colWidths = columns.map((col) => ({ wch: col.width / 7 })) // Converter pixels para unidades de largura do Excel
  ws["!cols"] = colWidths

  // Gerar arquivo
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
}

// Função para gerar PDF
export const generatePDF = (data: any[], config: ExportConfig): jsPDF => {
  // Criar documento PDF com orientação correta
  const doc = new jsPDF({
    orientation: config.orientation,
    unit: "mm",
    format: config.paperSize,
  })

  // Filtrar apenas as colunas incluídas e na ordem correta
  const columns = config.columns.filter((col) => col.include)

  // Preparar cabeçalhos e colunas para a tabela
  const headers = columns.map((col) => col.header)
  const columnStyles: any = {}

  // Configurar estilos de coluna com base nas larguras
  columns.forEach((col, index) => {
    const width = col.width / 6 // Converter pixels para unidades do PDF
    columnStyles[index] = {
      cellWidth: width,
      halign: col.format === "number" || col.format === "currency" ? "right" : "left",
    }
  })

  // Preparar dados para a tabela
  const pdfData = data.map((item) => columns.map((col) => formatValue(item[col.field], col.format, config)))

  // Adicionar logo se configurado
  if (config.logo) {
    try {
      // Aqui você adicionaria o código para inserir o logo da empresa
      // doc.addImage(logoData, 'PNG', 10, 10, 30, 15)
      doc.setFontSize(10)
      doc.text("RURAL FÉRTIL AGRONEGÓCIOS", 10, 10)
      doc.setFontSize(8)
      doc.text("Sistema de Gestão Logística", 10, 15)
    } catch (error) {
      console.error("Erro ao adicionar logo:", error)
    }
  }

  // Adicionar título
  const title = `Relatório de ${config.type.charAt(0).toUpperCase() + config.type.slice(1)}`
  const date = new Date()

  doc.setFontSize(16)
  doc.text(title, config.orientation === "landscape" ? 150 : 105, 20, { align: "center" })

  doc.setFontSize(10)
  doc.text(`Gerado em: ${formatDate(date, "dd/MM/yyyy HH:mm")}`, config.orientation === "landscape" ? 150 : 105, 27, {
    align: "center",
  })

  // Adicionar tabela
  doc.autoTable({
    head: config.showHeaders ? [headers] : [],
    body: pdfData,
    startY: 35,
    columnStyles: columnStyles,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [30, 54, 106], // Cor azul do tema
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    // Adicionar linhas de grade se configurado
    showHead: config.showHeaders ? "firstPage" : "never",
    theme: config.showGridLines ? "grid" : "plain",
  })

  // Adicionar totais se configurado
  if (config.showTotals) {
    try {
      const totals: any = {}

      // Calcular totais para colunas numéricas
      columns.forEach((col) => {
        if (col.format === "number" || col.format === "currency") {
          totals[col.field] = data.reduce((sum, item) => {
            const value = Number.parseFloat(item[col.field]) || 0
            return sum + value
          }, 0)
        }
      })

      // Adicionar linha de totais
      const totalRow = columns.map((col) => {
        if (col.format === "number" || col.format === "currency") {
          return formatValue(totals[col.field], col.format, config)
        }
        return col.field === "id" ? "TOTAL" : ""
      })

      // Adicionar linha de totais à tabela
      doc.autoTable({
        body: [totalRow],
        startY: (doc as any).lastAutoTable.finalY + 1,
        columnStyles: columnStyles,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          fontStyle: "bold",
        },
        theme: config.showGridLines ? "grid" : "plain",
      })
    } catch (error) {
      console.error("Erro ao adicionar totais:", error)
    }
  }

  // Adicionar rodapé
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
      align: "center",
    })
  }

  return doc
}

// Função para exportar dados com base na configuração
export const exportData = (data: any[], config: ExportConfig, format: "csv" | "pdf" | "excel"): void => {
  try {
    if (format === "csv") {
      const csvContent = generateCSV(data, config)
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `${config.type}_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === "excel") {
      const excelBlob = generateExcel(data, config)
      const link = document.createElement("a")
      const url = URL.createObjectURL(excelBlob)

      link.setAttribute("href", url)
      link.setAttribute("download", `${config.type}_${new Date().toISOString().split("T")[0]}.xlsx`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === "pdf") {
      const doc = generatePDF(data, config)
      doc.save(`${config.type}_${new Date().toISOString().split("T")[0]}.pdf`)
    }
  } catch (error) {
    console.error("Erro ao exportar dados:", error)
    alert("Ocorreu um erro ao exportar os dados. Por favor, tente novamente.")
  }
}

