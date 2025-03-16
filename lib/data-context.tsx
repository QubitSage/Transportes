"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Interfaces para os diferentes tipos de dados
interface OrdemColeta {
  id: string
  dataEmissao: string
  dataPrevista: string
  tipo: string
  status: "Pendente" | "Em andamento" | "Concluída" | "Cancelada"
  remetente: string
  destinatario: string
  produto: string
  valorFrete: number
  motorista?: string
  veiculo?: string
  observacoes?: string
}

interface Fornecedor {
  id: string
  nome: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
  contato: string
  status: "Ativo" | "Inativo"
}

interface Caminhao {
  id: string
  placa: string
  modelo: string
  marca: string
  ano: number
  capacidade: string
  status: "Disponível" | "Em manutenção" | "Em viagem"
  motorista: string
}

interface Produto {
  id: string
  nome: string
  categoria: string
  unidade: string
  preco: number
  estoque: number
  fornecedor: string
}

interface Cliente {
  id: string
  nome: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
  contato: string
  status: "Ativo" | "Inativo"
}

// Interface para o contexto
interface DataContextType {
  ordensColeta: OrdemColeta[]
  fornecedores: Fornecedor[]
  caminhoes: Caminhao[]
  produtos: Produto[]
  clientes: Cliente[]
  addOrdemColeta: (ordem: OrdemColeta) => void
  updateOrdemColeta: (ordem: OrdemColeta) => void
  deleteOrdemColeta: (id: string) => void
  addFornecedor: (fornecedor: Fornecedor) => void
  updateFornecedor: (fornecedor: Fornecedor) => void
  deleteFornecedor: (id: string) => void
  addCaminhao: (caminhao: Caminhao) => void
  updateCaminhao: (caminhao: Caminhao) => void
  deleteCaminhao: (id: string) => void
  addProduto: (produto: Produto) => void
  updateProduto: (produto: Produto) => void
  deleteProduto: (id: string) => void
  addCliente: (cliente: Cliente) => void
  updateCliente: (cliente: Cliente) => void
  deleteCliente: (id: string) => void
  clearAllData: () => void
}

// Dados iniciais
const initialOrdensColeta: OrdemColeta[] = [
  {
    id: "OS-2024-001",
    dataEmissao: "2024-03-15",
    dataPrevista: "2024-03-18",
    tipo: "Coleta",
    status: "Concluída",
    remetente: "Fertilizantes Norte do Brasil LTDA",
    destinatario: "Fazenda Serra da Prata",
    produto: "Fertilizantes",
    valorFrete: 2500.0,
    motorista: "LEANDRO",
    veiculo: "ABC-1234",
    observacoes: "Entregar no galpão principal",
  },
  {
    id: "OS-2024-002",
    dataEmissao: "2024-03-20",
    dataPrevista: "2024-03-22",
    tipo: "Entrega",
    status: "Em andamento",
    remetente: "Distribuidora Central LTDA",
    destinatario: "Fazenda Boa Esperança",
    produto: "Calcário",
    valorFrete: 1800.0,
    motorista: "GILMAR",
    veiculo: "DEF-5678",
  },
  {
    id: "OS-2024-003",
    dataEmissao: "2024-03-25",
    dataPrevista: "2024-03-26",
    tipo: "Coleta",
    status: "Pendente",
    remetente: "Agropecuária Sul LTDA",
    destinatario: "Fazenda Novo Horizonte",
    produto: "Sementes",
    valorFrete: 1200.0,
  },
]

const initialFornecedores: Fornecedor[] = [
  {
    id: "F001",
    nome: "Fertilizantes Norte do Brasil LTDA",
    cnpj: "12.345.678/0001-90",
    endereco: "Av. Industrial, 1000, Manaus - AM",
    telefone: "(92) 3234-5678",
    email: "contato@fertilizantesnorte.com.br",
    contato: "Carlos Silva",
    status: "Ativo",
  },
  {
    id: "F002",
    nome: "Agro Insumos S.A.",
    cnpj: "98.765.432/0001-10",
    endereco: "Rod. BR-174, Km 20, Manaus - AM",
    telefone: "(92) 3345-6789",
    email: "vendas@agroinsumos.com.br",
    contato: "Maria Oliveira",
    status: "Ativo",
  },
]

const initialCaminhoes: Caminhao[] = [
  {
    id: "C001",
    placa: "ABC-1234",
    modelo: "FH 540",
    marca: "Volvo",
    ano: 2020,
    capacidade: "30 toneladas",
    status: "Disponível",
    motorista: "LEANDRO",
  },
  {
    id: "C002",
    placa: "DEF-5678",
    modelo: "Axor 2544",
    marca: "Mercedes-Benz",
    ano: 2019,
    capacidade: "28 toneladas",
    status: "Em viagem",
    motorista: "GILMAR",
  },
]

const initialProdutos: Produto[] = [
  {
    id: "P001",
    nome: "Fertilizante NPK 10-10-10",
    categoria: "Fertilizantes",
    unidade: "Tonelada",
    preco: 2500,
    estoque: 150,
    fornecedor: "Fertilizantes Norte do Brasil LTDA",
  },
  {
    id: "P002",
    nome: "Calcário Dolomítico",
    categoria: "Corretivos",
    unidade: "Tonelada",
    preco: 180,
    estoque: 300,
    fornecedor: "Agro Insumos S.A.",
  },
]

const initialClientes: Cliente[] = [
  {
    id: "CL001",
    nome: "Fazenda Serra da Prata",
    cnpj: "11.222.333/0001-44",
    endereco: "Estrada Vicinal, Km 15, Zona Rural, Manacapuru - AM",
    telefone: "(92) 99876-5432",
    email: "contato@serradaprata.com.br",
    contato: "João Mendes",
    status: "Ativo",
  },
  {
    id: "CL002",
    nome: "Fazenda Boa Esperança",
    cnpj: "55.666.777/0001-88",
    endereco: "Rod. AM-070, Km 83, Zona Rural, Iranduba - AM",
    telefone: "(92) 99765-4321",
    email: "financeiro@boaesperanca.com.br",
    contato: "Ana Souza",
    status: "Ativo",
  },
]

// Criação do contexto com valor padrão
const DataContext = createContext<DataContextType>({
  ordensColeta: [],
  fornecedores: [],
  caminhoes: [],
  produtos: [],
  clientes: [],
  addOrdemColeta: () => {},
  updateOrdemColeta: () => {},
  deleteOrdemColeta: () => {},
  addFornecedor: () => {},
  updateFornecedor: () => {},
  deleteFornecedor: () => {},
  addCaminhao: () => {},
  updateCaminhao: () => {},
  deleteCaminhao: () => {},
  addProduto: () => {},
  updateProduto: () => {},
  deleteProduto: () => {},
  addCliente: () => {},
  updateCliente: () => {},
  deleteCliente: () => {},
  clearAllData: () => {},
})

// Hook personalizado para usar o contexto
export const useData = () => {
  const context = useContext(DataContext)
  return context
}

// Provedor do contexto
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados para armazenar os dados
  const [ordensColeta, setOrdensColeta] = useState<OrdemColeta[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const storedOrdensColeta = localStorage.getItem("ordensColeta")
      const storedFornecedores = localStorage.getItem("fornecedores")
      const storedCaminhoes = localStorage.getItem("caminhoes")
      const storedProdutos = localStorage.getItem("produtos")
      const storedClientes = localStorage.getItem("clientes")

      setOrdensColeta(storedOrdensColeta ? JSON.parse(storedOrdensColeta) : initialOrdensColeta)
      setFornecedores(storedFornecedores ? JSON.parse(storedFornecedores) : initialFornecedores)
      setCaminhoes(storedCaminhoes ? JSON.parse(storedCaminhoes) : initialCaminhoes)
      setProdutos(storedProdutos ? JSON.parse(storedProdutos) : initialProdutos)
      setClientes(storedClientes ? JSON.parse(storedClientes) : initialClientes)
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error)
      // Em caso de erro, use os dados iniciais
      setOrdensColeta(initialOrdensColeta)
      setFornecedores(initialFornecedores)
      setCaminhoes(initialCaminhoes)
      setProdutos(initialProdutos)
      setClientes(initialClientes)
    }
  }, [])

  // Salvar dados no localStorage quando mudam
  useEffect(() => {
    try {
      localStorage.setItem("ordensColeta", JSON.stringify(ordensColeta))
    } catch (error) {
      console.error("Erro ao salvar ordensColeta no localStorage:", error)
    }
  }, [ordensColeta])

  useEffect(() => {
    try {
      localStorage.setItem("fornecedores", JSON.stringify(fornecedores))
    } catch (error) {
      console.error("Erro ao salvar fornecedores no localStorage:", error)
    }
  }, [fornecedores])

  useEffect(() => {
    try {
      localStorage.setItem("caminhoes", JSON.stringify(caminhoes))
    } catch (error) {
      console.error("Erro ao salvar caminhoes no localStorage:", error)
    }
  }, [caminhoes])

  useEffect(() => {
    try {
      localStorage.setItem("produtos", JSON.stringify(produtos))
    } catch (error) {
      console.error("Erro ao salvar produtos no localStorage:", error)
    }
  }, [produtos])

  useEffect(() => {
    try {
      localStorage.setItem("clientes", JSON.stringify(clientes))
    } catch (error) {
      console.error("Erro ao salvar clientes no localStorage:", error)
    }
  }, [clientes])

  // Funções para manipular ordens de coleta
  const addOrdemColeta = (ordem: OrdemColeta) => {
    setOrdensColeta((prev) => [...prev, ordem])
  }

  const updateOrdemColeta = (ordem: OrdemColeta) => {
    setOrdensColeta((prev) => prev.map((o) => (o.id === ordem.id ? ordem : o)))
  }

  const deleteOrdemColeta = (id: string) => {
    setOrdensColeta((prev) => prev.filter((o) => o.id !== id))
  }

  // Funções para manipular fornecedores
  const addFornecedor = (fornecedor: Fornecedor) => {
    setFornecedores((prev) => [...prev, fornecedor])
  }

  const updateFornecedor = (fornecedor: Fornecedor) => {
    setFornecedores((prev) => prev.map((f) => (f.id === fornecedor.id ? fornecedor : f)))
  }

  const deleteFornecedor = (id: string) => {
    setFornecedores((prev) => prev.filter((f) => f.id !== id))
  }

  // Funções para manipular caminhões
  const addCaminhao = (caminhao: Caminhao) => {
    setCaminhoes((prev) => [...prev, caminhao])
  }

  const updateCaminhao = (caminhao: Caminhao) => {
    setCaminhoes((prev) => prev.map((c) => (c.id === caminhao.id ? caminhao : c)))
  }

  const deleteCaminhao = (id: string) => {
    setCaminhoes((prev) => prev.filter((c) => c.id !== id))
  }

  // Funções para manipular produtos
  const addProduto = (produto: Produto) => {
    setProdutos((prev) => [...prev, produto])
  }

  const updateProduto = (produto: Produto) => {
    setProdutos((prev) => prev.map((p) => (p.id === produto.id ? produto : p)))
  }

  const deleteProduto = (id: string) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id))
  }

  // Funções para manipular clientes
  const addCliente = (cliente: Cliente) => {
    setClientes((prev) => [...prev, cliente])
  }

  const updateCliente = (cliente: Cliente) => {
    setClientes((prev) => prev.map((c) => (c.id === cliente.id ? cliente : c)))
  }

  const deleteCliente = (id: string) => {
    setClientes((prev) => prev.filter((c) => c.id !== id))
  }

  // Função para limpar todos os dados
  const clearAllData = () => {
    // Limpar estados
    setOrdensColeta([])
    setFornecedores([])
    setCaminhoes([])
    setProdutos([])
    setClientes([])
    
    // Limpar localStorage
    try {
      localStorage.removeItem("ordensColeta")
      localStorage.removeItem("fornecedores")
      localStorage.removeItem("caminhoes")
      localStorage.removeItem("produtos")
      localStorage.removeItem("clientes")
      console.log("Todos os dados foram removidos com sucesso")
    } catch (error) {
      console.error("Erro ao limpar dados do localStorage:", error)
    }
  }

  // Valor do contexto
  const value = {
    ordensColeta,
    fornecedores,
    caminhoes,
    produtos,
    clientes,
    addOrdemColeta,
    updateOrdemColeta,
    deleteOrdemColeta,
    addFornecedor,
    updateFornecedor,
    deleteFornecedor,
    addCaminhao,
    updateCaminhao,
    deleteCaminhao,
    addProduto,
    updateProduto,
    deleteProduto,
    addCliente,
    updateCliente,
    deleteCliente,
    clearAllData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

