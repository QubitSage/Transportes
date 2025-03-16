import * as XLSX from "xlsx"

export interface RelatorioRow {
  Entrega: number
  Data: string
  NF: string
  Placa: string
  Motorista: string
  Faturado: string
  FazEntregue: string
  TicketRF: string
  PesoRF: number
  Ticket: string
  Peso: number
  Preco: number
  TotalR$: number
  DepositoR$: number
  DataDeposito: string
  Descricao: string
}

export interface DadosPagamento {
  banco: string
  agencia: string
  conta: string
  empresa: string
  cnpj: string
  pix: string
}

const HEADER_MAP: Record<string, keyof RelatorioRow> = {
  // Exact matches
  entrega: "Entrega",
  data: "Data",
  nf: "NF",
  "n.f.": "NF",
  "n. f.": "NF",
  placa: "Placa",
  motorista: "Motorista",
  faturado: "Faturado",
  "faz. entregue": "FazEntregue",
  "faz.entregue": "FazEntregue",
  fazentregue: "FazEntregue",
  "ticket rf": "TicketRF",
  "ticket.rf": "TicketRF",
  ticketrf: "TicketRF",
  "peso rf": "PesoRF",
  "peso.rf": "PesoRF",
  pesorf: "PesoRF",
  ticket: "Ticket",
  peso: "Peso",
  preço: "Preco",
  preco: "Preco",
  "total r$": "TotalR$",
  total: "TotalR$",
  "depósito r$": "DepositoR$",
  "deposito r$": "DepositoR$",
  deposito: "DepositoR$",
  "data deposito": "DataDeposito",
  "data.deposito": "DataDeposito",
  datadeposito: "DataDeposito",
  descrição: "Descricao",
  descricao: "Descricao",

  // Additional variations
  "número da nota": "NF",
  "nota fiscal": "NF",
  fazenda: "FazEntregue",
  "fazenda entregue": "FazEntregue",
  cliente: "Faturado",
  valor: "TotalR$",
  "valor total": "TotalR$",
  depósito: "DepositoR$",
  "valor depósito": "DepositoR$",
  "data do depósito": "DataDeposito",
  "preço unitário": "Preco",
  "valor unitário": "Preco",
}

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]/g, "") // Remove special characters
}

function parseNumericValue(value: any): number {
  if (typeof value === "number") {
    return value
  }
  if (typeof value === "string") {
    // Remove currency symbols, dots from thousand separators and convert comma to dot
    const normalized = value.replace(/[R$]/g, "").replace(/\./g, "").replace(",", ".").trim()

    const number = Number.parseFloat(normalized)
    return isNaN(number) ? 0 : number
  }
  return 0
}

function parseDate(value: any): string {
  if (typeof value === "number") {
    // Handle Excel date number
    const date = new Date((value - (25567 + 1)) * 86400 * 1000)
    return date.toISOString().split("T")[0]
  } else if (typeof value === "string") {
    // Try to parse various date formats
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0]
    }
  }
  return value ? String(value) : ""
}

export async function parseExcelFile(file: File): Promise<RelatorioRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convert to JSON with raw values and header mapping
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
          defval: null, // Use null for empty cells
          header: 1,
        }) as any[][]

        // Find header row
        let headerRowIndex = -1
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (
            row.some((cell) => {
              const normalizedCell = normalizeHeader(String(cell))
              return Object.keys(HEADER_MAP).some((key) => normalizeHeader(key) === normalizedCell)
            })
          ) {
            headerRowIndex = i
            break
          }
        }

        if (headerRowIndex === -1) {
          throw new Error("Formato de arquivo inválido. Cabeçalho não encontrado.")
        }

        // Map headers to their normalized versions
        const headers = jsonData[headerRowIndex].map((header: string) => {
          const normalizedHeader = normalizeHeader(String(header))
          const mappedHeader = Object.keys(HEADER_MAP).find((key) => normalizeHeader(key) === normalizedHeader)
          return mappedHeader ? HEADER_MAP[mappedHeader] : null
        })

        const relatorios: RelatorioRow[] = []

        // Process data rows
        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (row.every((cell: any) => cell === null)) continue

          const rowData: Partial<RelatorioRow> = {}

          headers.forEach((header, index) => {
            if (header) {
              const value = row[index]

              // Handle different types of values
              switch (header) {
                case "Entrega":
                  rowData[header] = value !== null ? Number.parseInt(value) || 0 : 0
                  break
                case "PesoRF":
                case "Peso":
                case "Preco":
                case "TotalR$":
                case "DepositoR$":
                  rowData[header] = value !== null ? parseNumericValue(value) : 0
                  break
                case "Data":
                case "DataDeposito":
                  rowData[header] = parseDate(value)
                  break
                default:
                  rowData[header] = value !== null ? String(value) : ""
              }
            }
          })

          // Create complete row with default values for missing fields
          const relatorio: RelatorioRow = {
            Entrega: rowData.Entrega ?? 0,
            Data: rowData.Data ?? "",
            NF: rowData.NF ?? "",
            Placa: rowData.Placa ?? "",
            Motorista: rowData.Motorista ?? "",
            Faturado: rowData.Faturado ?? "",
            FazEntregue: rowData.FazEntregue ?? "",
            TicketRF: rowData.TicketRF ?? "",
            PesoRF: rowData.PesoRF ?? 0,
            Ticket: rowData.Ticket ?? "",
            Peso: rowData.Peso ?? 0,
            Preco: rowData.Preco ?? 0,
            TotalR$: rowData.TotalR$ ?? 0,
            DepositoR$: rowData.DepositoR$ ?? 0,
            DataDeposito: rowData.DataDeposito ?? "",
            Descricao: rowData.Descricao ?? "",
          }

          relatorios.push(relatorio)
        }

        console.log("Dados importados:", relatorios)
        resolve(relatorios)
      } catch (error) {
        console.error("Erro ao processar arquivo:", error)
        reject(new Error("Erro ao processar arquivo. Verifique se o formato está correto."))
      }
    }

    reader.onerror = () => {
      reject(new Error("Erro ao ler arquivo."))
    }

    reader.readAsArrayBuffer(file)
  })
}

export function generateExcelFile(data: RelatorioRow[], dadosPagamento?: DadosPagamento): Blob {
  const wb = XLSX.utils.book_new()

  const headers = [
    ["RELATÓRIO DE VENDA DE CALCÁRIO - GIRLEI POLAZZO 2025"],
    [],
    [
      "ENTREGA",
      "DATA",
      "N. F.",
      "PLACA",
      "MOTORISTA",
      "FATURADO",
      "FAZ. ENTREGUE",
      "TICKET RF",
      "PESO RF",
      "TICKET",
      "PESO",
      "PREÇO",
      "TOTAL R$",
      "DEPÓSITO R$",
      "DATA",
      "DESCRIÇÃO",
    ],
  ]

  const rows = data.map((row) => [
    row.Entrega,
    row.Data,
    row.NF,
    row.Placa,
    row.Motorista,
    row.Faturado,
    row.FazEntregue,
    row.TicketRF,
    row.PesoRF,
    row.Ticket,
    row.Peso,
    row.Preco,
    row.TotalR$,
    row.DepositoR$,
    row.DataDeposito,
    row.Descricao,
  ])

  const totalPeso = data.reduce((sum, row) => sum + row.Peso, 0)
  const totalValor = data.reduce((sum, row) => sum + row.TotalR$, 0)
  const totalDepositos = data.reduce((sum, row) => sum + (row.DepositoR$ || 0), 0)

  rows.push(["", "", "", "", "", "", "", "", totalPeso, "", "", "", totalValor, totalDepositos, "", ""])

  const wsData = [...headers, ...rows]

  const ws = XLSX.utils.aoa_to_sheet(wsData)

  if (dadosPagamento) {
    const pagamentoData = [
      ["DADOS PARA PAGAMENTO:"],
      [`BANCO SANTANDER (033): ${dadosPagamento.banco}`],
      [`AG: ${dadosPagamento.agencia}`],
      [`CC: ${dadosPagamento.conta}`],
      [dadosPagamento.empresa],
      [`CNPJ: ${dadosPagamento.cnpj}`],
      [`PIX CNPJ: ${dadosPagamento.pix}`],
    ]

    const pagamentoRange = XLSX.utils.decode_range(ws["!ref"] as string)
    const startRow = pagamentoRange.e.r + 2
    pagamentoData.forEach((row, index) => {
      XLSX.utils.sheet_add_aoa(ws, [row], { origin: { r: startRow + index, c: 0 } })
    })
  }

  XLSX.utils.book_append_sheet(wb, ws, "Relatório")

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
}

