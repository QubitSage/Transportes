// Tipos para os dados do dashboard
export type DashboardStats = {
  pesagensHoje: {
    total: number
    variacao: number
  }
  coletasAtivas: {
    total: number
    variacao: number
  }
  volumeTotal: {
    total: number
    variacao: number
  }
  motoristasAtivos: {
    total: number
    novos: number
  }
}

export type ProximaColeta = {
  id: string
  cliente: string
  produto: string
  quantidade: number
  unidade: string
  status: "agendada" | "em_andamento" | "atrasada"
  dataAgendada: string
}

export type ProdutoTransportado = {
  nome: string
  percentual: number
  volume: number
}

export type ClienteAtendido = {
  nome: string
  coletas: number
}

export type OperationalActivity = {
  id: string
  type:
    | "coleta_nova"
    | "coleta_finalizada"
    | "pesagem_nova"
    | "pesagem_finalizada"
    | "entrega_iniciada"
    | "entrega_finalizada"
    | "problema"
  entityId: string
  entityName: string
  details: string
  status: "pendente" | "em_andamento" | "concluido" | "atrasado" | "problema"
  timestamp: string
  userName: string
}

// Função para buscar estatísticas do dashboard
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch("/api/dashboard/stats")
    if (!response.ok) {
      throw new Error("Falha ao buscar estatísticas")
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error)
    // Retornando dados zerados em caso de erro
    return {
      pesagensHoje: { total: 0, variacao: 0 },
      coletasAtivas: { total: 0, variacao: 0 },
      volumeTotal: { total: 0, variacao: 0 },
      motoristasAtivos: { total: 0, novos: 0 },
    }
  }
}

// Função para buscar próximas coletas
export async function fetchProximasColetas(): Promise<ProximaColeta[]> {
  try {
    const response = await fetch("/api/coletas/proximas")
    if (!response.ok) {
      throw new Error("Falha ao buscar próximas coletas")
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar próximas coletas:", error)
    // Retornando array vazio em caso de erro
    return []
  }
}

// Função para buscar produtos mais transportados
export async function fetchProdutosMaisTransportados(): Promise<ProdutoTransportado[]> {
  try {
    const response = await fetch("/api/produtos/mais-transportados")
    if (!response.ok) {
      throw new Error("Falha ao buscar produtos mais transportados")
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar produtos mais transportados:", error)
    // Retornando array vazio em caso de erro
    return []
  }
}

// Função para buscar clientes mais atendidos
export async function fetchClientesMaisAtendidos(): Promise<ClienteAtendido[]> {
  try {
    const response = await fetch("/api/clientes/mais-atendidos")
    if (!response.ok) {
      throw new Error("Falha ao buscar clientes mais atendidos")
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar clientes mais atendidos:", error)
    // Retornando array vazio em caso de erro
    return []
  }
}

// Função para buscar atividades operacionais recentes
export async function fetchRecentOperationalActivities(): Promise<OperationalActivity[]> {
  try {
    const response = await fetch("/api/atividades/operacionais")
    if (!response.ok) {
      throw new Error("Falha ao buscar atividades operacionais")
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar atividades operacionais recentes:", error)
    // Retornando array vazio em caso de erro
    return []
  }
}

