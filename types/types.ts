export interface RelatorioRow {
  entrega: number
  data: string
  nf: string
  placa: string
  motorista: string
  faturado: string
  fazEntregue: string
  ticketRF: string
  pesoRF: number
  ticket: string
  peso: number
  preco: number
  total: number
  deposito: number
  dataDeposito: string
  descricao: string
}

export interface DadosPagamento {
  banco: string
  agencia: string
  conta: string
  empresa: string
  cnpj: string
  pix: string
}

