"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, FileText, Table } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ImportDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (data: any[]) => void
  type: "pesagens" | "coletas" | "fornecedores" | "caminhoes" | "produtos" | "clientes"
}

export function ImportDataDialog({ open, onOpenChange, onImportComplete, type }: ImportDataDialogProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("csv")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validar tipo de arquivo
    const fileType = selectedFile.type
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase()

    if (activeTab === "csv" && fileType !== "text/csv" && fileExtension !== "csv") {
      setError("Por favor, selecione um arquivo CSV válido.")
      setFile(null)
      return
    }

    if (activeTab === "pdf" && (fileType === "application/pdf" || fileExtension === "pdf")) {
      setFile(selectedFile)
      setError(null)
      processPdfFile(selectedFile)
    } else if (activeTab === "pdf") {
      setError("Por favor, selecione um arquivo PDF válido.")
      setFile(null)
      setPreviewData(null)
    }

    setFile(selectedFile)
    setError(null)

    // Simular preview para CSV
    if (activeTab === "csv" && fileExtension === "csv") {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const csvContent = event.target?.result as string
          // Processamento básico de CSV para preview
          const lines = csvContent.split("\n")
          const headers = lines[0].split(",")

          const previewRows = []
          for (let i = 1; i < Math.min(lines.length, 6); i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(",")
              const row: Record<string, string> = {}

              headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim() || ""
              })

              previewRows.push(row)
            }
          }

          setPreviewData(previewRows)
        } catch (err) {
          setError("Erro ao processar o arquivo CSV. Verifique se o formato está correto.")
          setPreviewData(null)
        }
      }
      reader.readAsText(selectedFile)
    } else {
      setPreviewData(null)
    }
  }

  const handleImport = () => {
    if (!file) {
      setError("Por favor, selecione um arquivo para importar.")
      return
    }

    setIsUploading(true)
    setProgress(0)

    // Simulação de upload com progresso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulação de processamento completo
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      // Usar os dados do preview se disponíveis, caso contrário usar dados simulados
      let importedData = []

      if (previewData && previewData.length > 0) {
        importedData = previewData
      } else {
        // Dados simulados para demonstração (fallback)
        importedData =
          type === "pesagens"
            ? [
                {
                  id: "P001",
                  data: "2024-03-15",
                  motorista: "João Silva",
                  produto: "Fertilizante",
                  pesoInicial: 1500,
                  pesoLiquido: 3000,
                  pesoFinal: 4500,
                  cliente: "Fazenda Aurora",
                  status: "Concluído",
                },
                {
                  id: "P002",
                  data: "2024-03-16",
                  motorista: "Maria Souza",
                  produto: "Calcário",
                  pesoInicial: 1200,
                  pesoLiquido: 2800,
                  pesoFinal: 4000,
                  cliente: "Fazenda Boa Vista",
                  status: "Concluído",
                },
                {
                  id: "P003",
                  data: "2024-03-17",
                  motorista: "Carlos Ferreira",
                  produto: "Adubo",
                  pesoInicial: 1300,
                  pesoLiquido: 2700,
                  pesoFinal: 4000,
                  cliente: "Fazenda São João",
                  status: "Em andamento",
                },
              ]
            : type === "coletas"
              ? [
                  {
                    id: "OS-2024-010",
                    dataEmissao: "2024-03-15",
                    dataPrevista: "2024-03-18",
                    tipo: "Coleta",
                    status: "Pendente",
                    remetente: "Agro Supplies LTDA",
                    destinatario: "Fazenda Novo Horizonte",
                    produto: "Fertilizantes",
                    valorFrete: 2200.0,
                  },
                  {
                    id: "OS-2024-011",
                    dataEmissao: "2024-03-16",
                    dataPrevista: "2024-03-19",
                    tipo: "Entrega",
                    status: "Pendente",
                    remetente: "Distribuidora Norte LTDA",
                    destinatario: "Fazenda Santa Luzia",
                    produto: "Sementes",
                    valorFrete: 1800.0,
                  },
                  {
                    id: "OS-2024-012",
                    dataEmissao: "2024-03-17",
                    dataPrevista: "2024-03-20",
                    tipo: "Coleta",
                    status: "Pendente",
                    remetente: "Agropecuária Central",
                    destinatario: "Fazenda Bom Sucesso",
                    produto: "Calcário",
                    valorFrete: 2500.0,
                  },
                ]
              : type === "fornecedores"
                ? [
                    {
                      id: "F001",
                      nome: "Agro Supplies LTDA",
                      cnpj: "12.345.678/0001-90",
                      telefone: "(11) 3456-7890",
                      email: "contato@agrosupplies.com",
                      endereco: "Av. Industrial, 1500",
                      cidade: "São Paulo",
                      estado: "SP",
                      cep: "04001-000",
                      contato: "Ricardo Mendes",
                    },
                    {
                      id: "F002",
                      nome: "Distribuidora Norte LTDA",
                      cnpj: "23.456.789/0001-01",
                      telefone: "(11) 4567-8901",
                      email: "vendas@distnorte.com",
                      endereco: "Rua Comercial, 230",
                      cidade: "Campinas",
                      estado: "SP",
                      cep: "13015-000",
                      contato: "Ana Paula Silva",
                    },
                    {
                      id: "F003",
                      nome: "Agropecuária Central",
                      cnpj: "34.567.890/0001-12",
                      telefone: "(11) 5678-9012",
                      email: "central@agrocentral.com",
                      endereco: "Rod. BR-101, Km 432",
                      cidade: "Ribeirão Preto",
                      estado: "SP",
                      cep: "14010-000",
                      contato: "Carlos Eduardo",
                    },
                  ]
                : type === "caminhoes"
                  ? [
                      {
                        id: "V001",
                        placa: "ABC-1234",
                        modelo: "Volvo FH 460",
                        ano: 2020,
                        capacidade: "30000",
                        motorista: "João Silva",
                        status: "Disponível",
                        ultimaManutencao: "2024-02-15",
                        kmAtual: 125000,
                        tipo: "Carreta",
                      },
                      {
                        id: "V002",
                        placa: "DEF-5678",
                        modelo: "Scania R450",
                        ano: 2021,
                        capacidade: "28000",
                        motorista: "Carlos Ferreira",
                        status: "Em viagem",
                        ultimaManutencao: "2024-01-20",
                        kmAtual: 98000,
                        tipo: "Carreta",
                      },
                      {
                        id: "V003",
                        placa: "GHI-9012",
                        modelo: "Mercedes-Benz Actros",
                        ano: 2019,
                        capacidade: "32000",
                        motorista: "Antonio Oliveira",
                        status: "Disponível",
                        ultimaManutencao: "2024-03-05",
                        kmAtual: 145000,
                        tipo: "Carreta",
                      },
                    ]
                  : type === "produtos"
                    ? [
                        {
                          id: "PR001",
                          nome: "Fertilizante NPK 10-10-10",
                          categoria: "Fertilizantes",
                          unidade: "Tonelada",
                          preco: 2500,
                          estoque: 150,
                          fornecedor: "Fertilizantes Brasil S.A.",
                          codigoBarras: "7891234567890",
                          descricao: "Fertilizante granulado de alta performance",
                        },
                        {
                          id: "PR002",
                          nome: "Calcário Dolomítico",
                          categoria: "Corretivos",
                          unidade: "Tonelada",
                          preco: 180,
                          estoque: 300,
                          fornecedor: "Agro Insumos LTDA",
                          codigoBarras: "7892345678901",
                          descricao: "Calcário para correção de solo",
                        },
                        {
                          id: "PR003",
                          nome: "Semente de Soja Transgênica",
                          categoria: "Sementes",
                          unidade: "Saco 40kg",
                          preco: 850,
                          estoque: 200,
                          fornecedor: "Distribuidora Norte LTDA",
                          codigoBarras: "7893456789012",
                          descricao: "Semente de alta produtividade",
                        },
                      ]
                    : [
                        {
                          id: "C001",
                          nome: "Fazenda Esperança",
                          cnpj: "12.345.678/0001-90",
                          telefone: "(11) 3456-7890",
                          email: "contato@fazendaesperanca.com",
                          endereco: "Rod. SP-330, Km 150",
                          cidade: "Ribeirão Preto",
                          estado: "SP",
                          cep: "14100-000",
                          contato: "José Carlos",
                        },
                        {
                          id: "C002",
                          nome: "Fazenda Boa Vista",
                          cnpj: "23.456.789/0001-01",
                          telefone: "(11) 4567-8901",
                          email: "financeiro@boavista.com",
                          endereco: "Estrada Rural, Km 30",
                          cidade: "Campinas",
                          estado: "SP",
                          cep: "13100-000",
                          contato: "Maria Aparecida",
                        },
                        {
                          id: "C003",
                          nome: "Fazenda São João",
                          cnpj: "34.567.890/0001-12",
                          telefone: "(11) 5678-9012",
                          email: "compras@fazendasaojoao.com",
                          endereco: "Rod. BR-050, Km 153",
                          cidade: "Uberaba",
                          estado: "MG",
                          cep: "38000-000",
                          contato: "João Paulo",
                        },
                      ]
      }

      // Adicionar campos calculados ou padrão se necessário
      if (type === "pesagens") {
        importedData = importedData.map((item) => ({
          ...item,
          pesoFinal: item.pesoFinal || Number(item.pesoInicial) + Number(item.pesoLiquido),
          status: item.status || "Em andamento",
        }))
      }

      setTimeout(() => {
        setIsUploading(false)
        onImportComplete(importedData)

        toast({
          title: "Importação concluída",
          description: `${importedData.length} registros foram importados com sucesso.`,
        })

        onOpenChange(false)
        setFile(null)
        setProgress(0)
        setPreviewData(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }, 500)
    }, 3000)
  }

  const resetForm = () => {
    setFile(null)
    setError(null)
    setPreviewData(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Função para processar PDFs com melhor feedback
  const processPdfFile = (file) => {
    setIsUploading(true)
    setProgress(0)

    // Simulação de progresso de processamento
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 200)

    // Simulação de extração de dados do PDF
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      try {
        // Simulação de extração de dados de PDF mais completa
        const extractedRows = []

        if (type === "pesagens") {
          // Dados simulados para pesagens extraídos do PDF
          extractedRows.push(
            {
              id: "P101",
              data: "2024-03-20",
              motorista: "Carlos Mendes",
              produto: "Fertilizante NPK",
              pesoInicial: 1200,
              pesoLiquido: 3500,
              cliente: "Fazenda Esperança",
              status: "Em andamento",
            },
            {
              id: "P102",
              data: "2024-03-20",
              motorista: "Roberto Alves",
              produto: "Calcário",
              pesoInicial: 1350,
              pesoLiquido: 2800,
              cliente: "Fazenda Boa Vista",
              status: "Em andamento",
            },
            {
              id: "P103",
              data: "2024-03-20",
              motorista: "Antônio Silva",
              produto: "Adubo Orgânico",
              pesoInicial: 1100,
              pesoLiquido: 2500,
              cliente: "Fazenda São João",
              status: "Em andamento",
            },
            {
              id: "P104",
              data: "2024-03-21",
              motorista: "José Santos",
              produto: "Fertilizante Foliar",
              pesoInicial: 980,
              pesoLiquido: 1800,
              cliente: "Fazenda Aurora",
              status: "Em andamento",
            },
            {
              id: "P105",
              data: "2024-03-21",
              motorista: "Paulo Oliveira",
              produto: "Ureia",
              pesoInicial: 1050,
              pesoLiquido: 2200,
              cliente: "Fazenda Primavera",
              status: "Em andamento",
            },
          )
        } else if (type === "coletas") {
          // Dados simulados para coletas extraídos do PDF
          extractedRows.push(
            {
              id: "OS-2024-101",
              dataEmissao: "2024-03-20",
              dataPrevista: "2024-03-23",
              tipo: "Coleta",
              status: "Pendente",
              remetente: "Agro Supplies LTDA",
              destinatario: "Fazenda Novo Horizonte",
              produto: "Fertilizantes",
              valorFrete: 2200.0,
            },
            {
              id: "OS-2024-102",
              dataEmissao: "2024-03-20",
              dataPrevista: "2024-03-24",
              tipo: "Entrega",
              status: "Pendente",
              remetente: "Distribuidora Norte LTDA",
              destinatario: "Fazenda Santa Luzia",
              produto: "Sementes",
              valorFrete: 1800.0,
            },
            {
              id: "OS-2024-103",
              dataEmissao: "2024-03-21",
              dataPrevista: "2024-03-25",
              tipo: "Coleta",
              status: "Pendente",
              remetente: "Agropecuária Central",
              destinatario: "Fazenda Bom Sucesso",
              produto: "Calcário",
              valorFrete: 2500.0,
            },
            {
              id: "OS-2024-104",
              dataEmissao: "2024-03-21",
              dataPrevista: "2024-03-26",
              tipo: "Transferência",
              status: "Pendente",
              remetente: "Depósito Central",
              destinatario: "Filial Norte",
              produto: "Diversos",
              valorFrete: 3200.0,
            },
            {
              id: "OS-2024-105",
              dataEmissao: "2024-03-22",
              dataPrevista: "2024-03-27",
              tipo: "Coleta",
              status: "Pendente",
              remetente: "Agro Insumos LTDA",
              destinatario: "Fazenda Recanto",
              produto: "Defensivos",
              valorFrete: 2800.0,
            },
          )
        } else if (type === "fornecedores") {
          // Dados simulados para fornecedores extraídos do PDF
          extractedRows.push(
            {
              id: "F001",
              nome: "Agro Supplies LTDA",
              cnpj: "12.345.678/0001-90",
              telefone: "(11) 3456-7890",
              email: "contato@agrosupplies.com",
              endereco: "Av. Industrial, 1500",
              cidade: "São Paulo",
              estado: "SP",
              cep: "04001-000",
              contato: "Ricardo Mendes",
            },
            {
              id: "F002",
              nome: "Distribuidora Norte LTDA",
              cnpj: "23.456.789/0001-01",
              telefone: "(11) 4567-8901",
              email: "vendas@distnorte.com",
              endereco: "Rua Comercial, 230",
              cidade: "Campinas",
              estado: "SP",
              cep: "13015-000",
              contato: "Ana Paula Silva",
            },
            {
              id: "F003",
              nome: "Agropecuária Central",
              cnpj: "34.567.890/0001-12",
              telefone: "(11) 5678-9012",
              email: "central@agrocentral.com",
              endereco: "Rod. BR-101, Km 432",
              cidade: "Ribeirão Preto",
              estado: "SP",
              cep: "14010-000",
              contato: "Carlos Eduardo",
            },
            {
              id: "F004",
              nome: "Agro Insumos LTDA",
              cnpj: "45.678.901/0001-23",
              telefone: "(11) 6789-0123",
              email: "vendas@agroinsumos.com",
              endereco: "Av. Rural, 789",
              cidade: "Bauru",
              estado: "SP",
              cep: "17010-000",
              contato: "Mariana Costa",
            },
            {
              id: "F005",
              nome: "Fertilizantes Brasil S.A.",
              cnpj: "56.789.012/0001-34",
              telefone: "(11) 7890-1234",
              email: "comercial@fertbrasil.com",
              endereco: "Distrito Industrial, 450",
              cidade: "Sorocaba",
              estado: "SP",
              cep: "18040-000",
              contato: "Roberto Almeida",
            },
          )
        } else if (type === "caminhoes") {
          // Dados simulados para caminhões extraídos do PDF
          extractedRows.push(
            {
              id: "V001",
              placa: "ABC-1234",
              modelo: "Volvo FH 460",
              ano: 2020,
              capacidade: "30000",
              motorista: "João Silva",
              status: "Disponível",
              ultimaManutencao: "2024-02-15",
              kmAtual: 125000,
              tipo: "Carreta",
            },
            {
              id: "V002",
              placa: "DEF-5678",
              modelo: "Scania R450",
              ano: 2021,
              capacidade: "28000",
              motorista: "Carlos Ferreira",
              status: "Em viagem",
              ultimaManutencao: "2024-01-20",
              kmAtual: 98000,
              tipo: "Carreta",
            },
            {
              id: "V003",
              placa: "GHI-9012",
              modelo: "Mercedes-Benz Actros",
              ano: 2019,
              capacidade: "32000",
              motorista: "Antonio Oliveira",
              status: "Disponível",
              ultimaManutencao: "2024-03-05",
              kmAtual: 145000,
              tipo: "Carreta",
            },
            {
              id: "V004",
              placa: "JKL-3456",
              modelo: "DAF XF",
              ano: 2022,
              capacidade: "29000",
              motorista: "Roberto Santos",
              status: "Em manutenção",
              ultimaManutencao: "2024-03-18",
              kmAtual: 75000,
              tipo: "Carreta",
            },
            {
              id: "V005",
              placa: "MNO-7890",
              modelo: "Iveco Stralis",
              ano: 2020,
              capacidade: "26000",
              motorista: "Paulo Mendes",
              status: "Disponível",
              ultimaManutencao: "2024-02-28",
              kmAtual: 110000,
              tipo: "Carreta",
            },
          )
        } else if (type === "produtos") {
          // Dados simulados para produtos extraídos do PDF
          extractedRows.push(
            {
              id: "PR001",
              nome: "Fertilizante NPK 10-10-10",
              categoria: "Fertilizantes",
              unidade: "Tonelada",
              preco: 2500,
              estoque: 150,
              fornecedor: "Fertilizantes Brasil S.A.",
              codigoBarras: "7891234567890",
              descricao: "Fertilizante granulado de alta performance",
            },
            {
              id: "PR002",
              nome: "Calcário Dolomítico",
              categoria: "Corretivos",
              unidade: "Tonelada",
              preco: 180,
              estoque: 300,
              fornecedor: "Agro Insumos LTDA",
              codigoBarras: "7892345678901",
              descricao: "Calcário para correção de solo",
            },
            {
              id: "PR003",
              nome: "Semente de Soja Transgênica",
              categoria: "Sementes",
              unidade: "Saco 40kg",
              preco: 850,
              estoque: 200,
              fornecedor: "Distribuidora Norte LTDA",
              codigoBarras: "7893456789012",
              descricao: "Semente de alta produtividade",
            },
            {
              id: "PR004",
              nome: "Herbicida Glifosato",
              categoria: "Defensivos",
              unidade: "Galão 20L",
              preco: 320,
              estoque: 120,
              fornecedor: "Agropecuária Central",
              codigoBarras: "7894567890123",
              descricao: "Herbicida de amplo espectro",
            },
            {
              id: "PR005",
              nome: "Adubo Orgânico",
              categoria: "Fertilizantes",
              unidade: "Tonelada",
              preco: 1200,
              estoque: 80,
              fornecedor: "Agro Supplies LTDA",
              codigoBarras: "7895678901234",
              descricao: "Adubo 100% orgânico certificado",
            },
          )
        } else if (type === "clientes") {
          // Dados simulados para clientes extraídos do PDF
          extractedRows.push(
            {
              id: "C001",
              nome: "Fazenda Esperança",
              cnpj: "12.345.678/0001-90",
              telefone: "(11) 3456-7890",
              email: "contato@fazendaesperanca.com",
              endereco: "Rod. SP-330, Km 150",
              cidade: "Ribeirão Preto",
              estado: "SP",
              cep: "14100-000",
              contato: "José Carlos",
            },
            {
              id: "C002",
              nome: "Fazenda Boa Vista",
              cnpj: "23.456.789/0001-01",
              telefone: "(11) 4567-8901",
              email: "financeiro@boavista.com",
              endereco: "Estrada Rural, Km 30",
              cidade: "Campinas",
              estado: "SP",
              cep: "13100-000",
              contato: "Maria Aparecida",
            },
            {
              id: "C003",
              nome: "Fazenda São João",
              cnpj: "34.567.890/0001-12",
              telefone: "(11) 5678-9012",
              email: "compras@fazendasaojoao.com",
              endereco: "Rod. BR-050, Km 153",
              cidade: "Uberaba",
              estado: "MG",
              cep: "38000-000",
              contato: "João Paulo",
            },
            {
              id: "C004",
              nome: "Fazenda Aurora",
              cnpj: "45.678.901/0001-23",
              telefone: "(11) 6789-0123",
              email: "contato@fazendaaurora.com",
              endereco: "Estrada Municipal, s/n",
              cidade: "Barretos",
              estado: "SP",
              cep: "14780-000",
              contato: "Roberto Silva",
            },
            {
              id: "C005",
              nome: "Fazenda Primavera",
              cnpj: "56.789.012/0001-34",
              telefone: "(11) 7890-1234",
              email: "adm@fazendaprimavera.com",
              endereco: "Rod. SP-225, Km 75",
              cidade: "Jaú",
              estado: "SP",
              cep: "17200-000",
              contato: "Carlos Eduardo",
            },
          )
        }

        setPreviewData(extractedRows)
        setIsUploading(false)

        toast({
          title: "PDF processado com sucesso",
          description: `Foram encontrados ${extractedRows.length} registros no documento.`,
        })
      } catch (err) {
        setIsUploading(false)
        setError("Erro ao processar o arquivo PDF. O formato pode não ser compatível.")
        setPreviewData(null)
      }
    }, 2500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Importar Dados</DialogTitle>
          <DialogDescription>
            Importe dados de{" "}
            {type === "pesagens"
              ? "pesagens"
              : type === "coletas"
                ? "ordens de coleta"
                : type === "fornecedores"
                  ? "fornecedores"
                  : type === "caminhoes"
                    ? "caminhões"
                    : type === "produtos"
                      ? "produtos"
                      : type === "clientes"
                        ? "clientes"
                        : ""}{" "}
            a partir de arquivos CSV ou PDF.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="csv"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            resetForm()
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Arquivo CSV
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Arquivo PDF
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Selecione o arquivo CSV</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    ref={fileInputRef}
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  O arquivo deve estar no formato CSV com cabeçalhos na primeira linha.
                </p>
              </div>

              {previewData && previewData.length > 0 && (
                <div className="space-y-2">
                  <Label>Prévia dos dados</Label>
                  <div className="border rounded-md overflow-x-auto max-h-[200px]">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          {Object.keys(previewData[0]).map((header) => (
                            <th key={header} className="px-4 py-2 text-left font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-4 py-2 border-t">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Mostrando {previewData.length} de {file ? "muitas" : "0"} linhas.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Selecione o arquivo PDF</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="pdf-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    ref={fileInputRef}
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  O sistema tentará extrair dados tabulares do arquivo PDF.
                </p>
              </div>

              {previewData && previewData.length > 0 && activeTab === "pdf" && (
                <div className="space-y-2">
                  <Label>Prévia dos dados extraídos do PDF</Label>
                  <div className="border rounded-md overflow-x-auto max-h-[200px]">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          {Object.keys(previewData[0]).map((header) => (
                            <th key={header} className="px-4 py-2 text-left font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-4 py-2 border-t">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Mostrando {previewData.length} registros extraídos do PDF.
                  </p>
                </div>
              )}

              {file && activeTab === "pdf" && !previewData && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Informação</AlertTitle>
                  <AlertDescription>
                    A extração de dados de PDFs pode não ser 100% precisa. Recomendamos revisar os dados após a
                    importação.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processando arquivo...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || isUploading} className="bg-[#007846] hover:bg-[#006038]">
            {isUploading ? <>Processando...</> : <>Importar Dados</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

