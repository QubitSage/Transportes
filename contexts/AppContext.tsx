"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Motorista {
  id: number
  nome: string
  cnh: string
  contato: string
  cpf: string
  endereco: string
}

interface Fornecedor {
  id: number
  nome: string
  cnpj: string
  contato: string
  email: string
  endereco: string
  ie: string
  razaoSocial: string
}

interface Caminhao {
  id: number
  modelo: string
  placa: string
  tipo: string
  ano: string
}

interface Produto {
  id: number
  nome: string
  descricao: string
  valorUnitario: number
  unidade: string
}

interface Cliente {
  id: number
  nome: string
  cnpj: string
  ie: string
  contato: string
  email: string
  endereco: string
}

interface Pesagem {
  id: number
  data: string
  motorista: string
  produto: string
  pesoInicial: number
  pesoLiquido: number
  pesoFinal: number
  cliente: string
  status: string
}

interface AppContextType {
  motoristas: Motorista[]
  fornecedores: Fornecedor[]
  caminhoes: Caminhao[]
  produtos: Produto[]
  clientes: Cliente[]
  pesagens: Pesagem[]
  addMotorista: (motorista: Omit<Motorista, "id">) => void
  addFornecedor: (fornecedor: Omit<Fornecedor, "id">) => void
  addCaminhao: (caminhao: Omit<Caminhao, "id">) => void
  addProduto: (produto: Omit<Produto, "id">) => void
  addCliente: (cliente: Omit<Cliente, "id">) => void
  addPesagem: (pesagem: Omit<Pesagem, "id">) => void
  updateMotorista: (id: number, motorista: Partial<Motorista>) => void
  updateFornecedor: (id: number, fornecedor: Partial<Fornecedor>) => void
  updateCaminhao: (id: number, caminhao: Partial<Caminhao>) => void
  updateProduto: (id: number, produto: Partial<Produto>) => void
  updateCliente: (id: number, cliente: Partial<Cliente>) => void
  updatePesagem: (id: number, pesagem: Partial<Pesagem>) => void
  deleteMotorista: (id: number) => void
  deleteFornecedor: (id: number) => void
  deleteCaminhao: (id: number) => void
  deleteProduto: (id: number) => void
  deleteCliente: (id: number) => void
  deletePesagem: (id: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [motoristas, setMotoristas] = useState<Motorista[]>([
    {
      id: Date.now() - 5000000,
      nome: "João Silva",
      cnh: "12345678901",
      contato: "(11) 98765-4321",
      cpf: "123.456.789-00",
      endereco: "Rua das Flores, 123, Centro, São Paulo - SP",
    },
    {
      id: Date.now() - 3000000,
      nome: "Maria Oliveira",
      cnh: "09876543210",
      contato: "(11) 91234-5678",
      cpf: "987.654.321-00",
      endereco: "Av. Paulista, 1000, Bela Vista, São Paulo - SP",
    },
  ])

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    {
      id: Date.now() - 4500000,
      nome: "Fornecedor A",
      cnpj: "12.345.678/0001-90",
      contato: "(11) 3333-4444",
      email: "contato@fornecedora.com",
      endereco: "Rua Comercial, 500, Centro, São Paulo - SP",
      ie: "123456789",
      razaoSocial: "Fornecedor A Ltda",
    },
    {
      id: Date.now() - 2500000,
      nome: "Fornecedor B",
      cnpj: "98.765.432/0001-10",
      contato: "(11) 5555-6666",
      email: "contato@fornecedorb.com",
      endereco: "Av. Industrial, 200, Distrito Industrial, Campinas - SP",
      ie: "987654321",
      razaoSocial: "Fornecedor B S.A.",
    },
  ])

  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([
    {
      id: Date.now() - 4000000,
      modelo: "Volvo FH 540",
      placa: "ABC-1234",
      tipo: "Cavalo",
      ano: "2022",
    },
    {
      id: Date.now() - 2000000,
      modelo: "Scania R450",
      placa: "DEF-5678",
      tipo: "Cavalo",
      ano: "2021",
    },
  ])

  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: Date.now() - 3500000,
      nome: "Areia Fina",
      descricao: "Areia fina para construção",
      valorUnitario: 120.5,
      unidade: "Tonelada",
    },
    {
      id: Date.now() - 1500000,
      nome: "Brita nº 1",
      descricao: "Brita para construção civil",
      valorUnitario: 95.75,
      unidade: "Tonelada",
    },
  ])

  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: Date.now() - 3000000,
      nome: "Construtora XYZ",
      cnpj: "11.222.333/0001-44",
      ie: "123456789",
      contato: "(11) 2222-3333",
      email: "contato@construtoraXYZ.com",
      endereco: "Rua das Obras, 100, Centro, São Paulo - SP",
    },
    {
      id: Date.now() - 1000000,
      nome: "Materiais de Construção ABC",
      cnpj: "44.555.666/0001-77",
      ie: "987654321",
      contato: "(11) 4444-5555",
      email: "contato@materiaisabc.com",
      endereco: "Av. do Comércio, 500, Centro, Campinas - SP",
    },
  ])

  const [pesagens, setPesagens] = useState<Pesagem[]>([
    {
      id: Date.now() - 500000,
      data: new Date().toISOString(),
      motorista: "João Silva",
      produto: "Areia Fina",
      pesoInicial: 15000,
      pesoLiquido: 25000,
      pesoFinal: 40000,
      cliente: "Construtora XYZ",
      status: "Concluído",
    },
    {
      id: Date.now() - 400000,
      data: new Date(Date.now() - 86400000).toISOString(), // Ontem
      motorista: "Maria Oliveira",
      produto: "Brita nº 1",
      pesoInicial: 14000,
      pesoLiquido: 22000,
      pesoFinal: 36000,
      cliente: "Materiais de Construção ABC",
      status: "Em andamento",
    },
  ])

  useEffect(() => {
    const loadedMotoristas = JSON.parse(localStorage.getItem("motoristas") || "[]")
    const loadedFornecedores = JSON.parse(localStorage.getItem("fornecedores") || "[]")
    const loadedCaminhoes = JSON.parse(localStorage.getItem("caminhoes") || "[]")
    const loadedProdutos = JSON.parse(localStorage.getItem("produtos") || "[]")
    const loadedClientes = JSON.parse(localStorage.getItem("clientes") || "[]")
    const loadedPesagens = JSON.parse(localStorage.getItem("pesagens") || "[]")

    if (loadedMotoristas.length > 0) setMotoristas(loadedMotoristas)
    if (loadedFornecedores.length > 0) setFornecedores(loadedFornecedores)
    if (loadedCaminhoes.length > 0) setCaminhoes(loadedCaminhoes)
    if (loadedProdutos.length > 0) setProdutos(loadedProdutos)
    if (loadedClientes.length > 0) setClientes(loadedClientes)
    if (loadedPesagens.length > 0) setPesagens(loadedPesagens)
  }, [])

  useEffect(() => {
    localStorage.setItem("motoristas", JSON.stringify(motoristas))
    localStorage.setItem("fornecedores", JSON.stringify(fornecedores))
    localStorage.setItem("caminhoes", JSON.stringify(caminhoes))
    localStorage.setItem("produtos", JSON.stringify(produtos))
    localStorage.setItem("clientes", JSON.stringify(clientes))
    localStorage.setItem("pesagens", JSON.stringify(pesagens))
  }, [motoristas, fornecedores, caminhoes, produtos, clientes, pesagens])

  const addMotorista = (motorista: Omit<Motorista, "id">) => {
    const newMotorista = { ...motorista, id: Date.now() }
    setMotoristas([...motoristas, newMotorista])
  }

  const addFornecedor = (fornecedor: Omit<Fornecedor, "id">) => {
    const newFornecedor = { ...fornecedor, id: Date.now() }
    setFornecedores([...fornecedores, newFornecedor])
  }

  const addCaminhao = (caminhao: Omit<Caminhao, "id">) => {
    const newCaminhao = { ...caminhao, id: Date.now() }
    setCaminhoes([...caminhoes, newCaminhao])
  }

  const addProduto = (produto: Omit<Produto, "id">) => {
    const newProduto = { ...produto, id: Date.now() }
    setProdutos([...produtos, newProduto])
  }

  const addCliente = (cliente: Omit<Cliente, "id">) => {
    const newCliente = { ...cliente, id: Date.now() }
    setClientes([...clientes, newCliente])
  }

  const addPesagem = (pesagem: Omit<Pesagem, "id">) => {
    const newPesagem = { ...pesagem, id: Date.now() }
    setPesagens([...pesagens, newPesagem])
  }

  const updateMotorista = (id: number, motorista: Partial<Motorista>) => {
    setMotoristas(motoristas.map((m) => (m.id === id ? { ...m, ...motorista } : m)))
  }

  const updateFornecedor = (id: number, fornecedor: Partial<Fornecedor>) => {
    setFornecedores(fornecedores.map((f) => (f.id === id ? { ...f, ...fornecedor } : f)))
  }

  const updateCaminhao = (id: number, caminhao: Partial<Caminhao>) => {
    setCaminhoes(caminhoes.map((c) => (c.id === id ? { ...c, ...caminhao } : c)))
  }

  const updateProduto = (id: number, produto: Partial<Produto>) => {
    setProdutos(produtos.map((p) => (p.id === id ? { ...p, ...produto } : p)))
  }

  const updateCliente = (id: number, cliente: Partial<Cliente>) => {
    setClientes(clientes.map((c) => (c.id === id ? { ...c, ...cliente } : c)))
  }

  const updatePesagem = (id: number, pesagem: Partial<Pesagem>) => {
    setPesagens(pesagens.map((p) => (p.id === id ? { ...p, ...pesagem } : p)))
  }

  const deleteMotorista = (id: number) => {
    setMotoristas(motoristas.filter((m) => m.id !== id))
  }

  const deleteFornecedor = (id: number) => {
    setFornecedores(fornecedores.filter((f) => f.id !== id))
  }

  const deleteCaminhao = (id: number) => {
    setCaminhoes(caminhoes.filter((c) => c.id !== id))
  }

  const deleteProduto = (id: number) => {
    setProdutos(produtos.filter((p) => p.id !== id))
  }

  const deleteCliente = (id: number) => {
    setClientes(clientes.filter((c) => c.id !== id))
  }

  const deletePesagem = (id: number) => {
    setPesagens(pesagens.filter((p) => p.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        motoristas,
        fornecedores,
        caminhoes,
        produtos,
        clientes,
        pesagens,
        addMotorista,
        addFornecedor,
        addCaminhao,
        addProduto,
        addCliente,
        addPesagem,
        updateMotorista,
        updateFornecedor,
        updateCaminhao,
        updateProduto,
        updateCliente,
        updatePesagem,
        deleteMotorista,
        deleteFornecedor,
        deleteCaminhao,
        deleteProduto,
        deleteCliente,
        deletePesagem,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

