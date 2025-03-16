"use client"

import type React from "react"

import { useState } from "react"
import {
  Printer,
  FileText,
  Settings,
  History,
  Eye,
  Download,
  Truck,
  BarChart,
  Tag,
  FileCheck,
  Clock,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { PrintPreviewDialog } from "@/components/print-preview-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Tipos de documentos disponíveis para impressão
interface DocumentType {
  id: string
  name: string
  icon: React.ReactNode
  category: "logistica" | "financeiro" | "estoque" | "relatorios"
  description: string
  templates: Template[]
}

interface Template {
  id: string
  name: string
  description: string
  previewImage: string
  default: boolean
}

interface PrintHistory {
  id: string
  documentName: string
  date: string
  user: string
  status: "success" | "error"
  copies: number
}

export default function ImpressaoPage() {
  const { toast } = useToast()
  const { hasPermission } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("documentos")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<DocumentType | null>(null)
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)

  // Verificar permissões
  if (!hasPermission("admin_print")) {
    router.push("/dashboard")
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta página.",
      variant: "destructive",
    })
    return null
  }

  // Dados mockados para documentos
  const documentTypes: DocumentType[] = [
    {
      id: "nf",
      name: "Nota Fiscal",
      icon: <FileCheck className="h-5 w-5" />,
      category: "financeiro",
      description: "Impressão de notas fiscais de entrada e saída",
      templates: [
        {
          id: "nf-padrao",
          name: "Padrão DANFE",
          description: "Modelo padrão de DANFE conforme legislação",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: true,
        },
        {
          id: "nf-simplificada",
          name: "Simplificada",
          description: "Versão simplificada para uso interno",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: false,
        },
      ],
    },
    {
      id: "ordem-coleta",
      name: "Ordem de Coleta",
      icon: <Truck className="h-5 w-5" />,
      category: "logistica",
      description: "Impressão de ordens de coleta para motoristas",
      templates: [
        {
          id: "oc-completa",
          name: "Completa",
          description: "Ordem de coleta com todas as informações",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: true,
        },
        {
          id: "oc-simplificada",
          name: "Simplificada",
          description: "Versão simplificada para motoristas",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: false,
        },
      ],
    },
    {
      id: "etiquetas",
      name: "Etiquetas",
      icon: <Tag className="h-5 w-5" />,
      category: "estoque",
      description: "Impressão de etiquetas para produtos e embalagens",
      templates: [
        {
          id: "etq-produto",
          name: "Etiqueta de Produto",
          description: "Etiqueta padrão para identificação de produtos",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: true,
        },
        {
          id: "etq-pallet",
          name: "Etiqueta de Pallet",
          description: "Etiqueta para identificação de pallets",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: false,
        },
      ],
    },
    {
      id: "relatorio-estoque",
      name: "Relatório de Estoque",
      icon: <BarChart className="h-5 w-5" />,
      category: "relatorios",
      description: "Relatórios de posição de estoque e movimentações",
      templates: [
        {
          id: "rel-estoque-completo",
          name: "Completo",
          description: "Relatório detalhado com todas as movimentações",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: true,
        },
        {
          id: "rel-estoque-resumido",
          name: "Resumido",
          description: "Versão resumida com totais por produto",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: false,
        },
      ],
    },
    {
      id: "romaneio",
      name: "Romaneio",
      icon: <FileText className="h-5 w-5" />,
      category: "logistica",
      description: "Impressão de romaneios de carga",
      templates: [
        {
          id: "romaneio-padrao",
          name: "Padrão",
          description: "Modelo padrão de romaneio",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: true,
        },
      ],
    },
    {
      id: "recibo-pesagem",
      name: "Recibo de Pesagem",
      icon: <FileCheck className="h-5 w-5" />,
      category: "logistica",
      description: "Impressão de recibos de pesagem",
      templates: [
        {
          id: "recibo-pesagem-padrao",
          name: "Padrão",
          description: "Modelo padrão de recibo de pesagem",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: true,
        },
        {
          id: "recibo-pesagem-detalhado",
          name: "Detalhado",
          description: "Versão detalhada com histórico de pesagens",
          previewImage: "/placeholder.svg?height=400&width=300",
          default: false,
        },
      ],
    },
  ]

  // Histórico de impressões mockado
  const printHistory: PrintHistory[] = [
    {
      id: "1",
      documentName: "Nota Fiscal #12345",
      date: "12/03/2024 14:32",
      user: "João Silva",
      status: "success",
      copies: 2,
    },
    {
      id: "2",
      documentName: "Ordem de Coleta #OC-2024-001",
      date: "12/03/2024 11:15",
      user: "Maria Oliveira",
      status: "success",
      copies: 1,
    },
    {
      id: "3",
      documentName: "Relatório de Estoque",
      date: "11/03/2024 17:45",
      user: "Carlos Santos",
      status: "error",
      copies: 1,
    },
    {
      id: "4",
      documentName: "Etiquetas de Produto (10 unidades)",
      date: "11/03/2024 09:22",
      user: "Ana Pereira",
      status: "success",
      copies: 10,
    },
    {
      id: "5",
      documentName: "Romaneio #ROM-2024-015",
      date: "10/03/2024 16:30",
      user: "João Silva",
      status: "success",
      copies: 3,
    },
  ]

  // Filtrar documentos por categoria e termo de busca
  const filteredDocuments = documentTypes.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Manipular seleção de documentos
  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  // Selecionar todos os documentos filtrados
  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id))
    }
  }

  // Abrir visualização prévia
  const openPreview = (document: DocumentType) => {
    setCurrentDocument(document)
    setCurrentTemplate(document.templates.find((t) => t.default) || document.templates[0])
    setPreviewOpen(true)
  }

  // Imprimir documento
  const printDocument = (document: DocumentType) => {
    toast({
      title: "Imprimindo documento",
      description: `${document.name} enviado para impressão.`,
    })

    // Simulação de impressão
    setTimeout(() => {
      toast({
        title: "Impressão concluída",
        description: `${document.name} impresso com sucesso.`,
        variant: "success",
      })
    }, 2000)
  }

  // Imprimir documentos selecionados
  const printSelectedDocuments = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "Nenhum documento selecionado",
        description: "Selecione pelo menos um documento para imprimir.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Imprimindo documentos",
      description: `${selectedDocuments.length} documento(s) enviado(s) para impressão.`,
    })

    // Simulação de impressão
    setTimeout(() => {
      toast({
        title: "Impressão concluída",
        description: `${selectedDocuments.length} documento(s) impresso(s) com sucesso.`,
        variant: "success",
      })
      setSelectedDocuments([])
    }, 2000)
  }

  // Exportar para PDF
  const exportToPdf = (document: DocumentType) => {
    toast({
      title: "Exportando documento",
      description: `${document.name} está sendo exportado para PDF.`,
    })

    // Simulação de exportação
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: `${document.name} exportado com sucesso.`,
        variant: "success",
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Impressão</h1>
          <p className="text-muted-foreground">Gerencie e configure todas as opções de impressão do sistema</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="documentos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Aba de Documentos */}
        <TabsContent value="documentos" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="logistica">Logística</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="estoque">Estoque</SelectItem>
                  <SelectItem value="relatorios">Relatórios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex items-center gap-2" onClick={selectAllDocuments}>
                <Checkbox
                  checked={selectedDocuments.length > 0 && selectedDocuments.length === filteredDocuments.length}
                  className="h-4 w-4"
                />
                Selecionar todos
              </Button>

              <Button
                className="bg-[#007846] hover:bg-[#006038] flex-1 md:flex-none"
                onClick={printSelectedDocuments}
                disabled={selectedDocuments.length === 0}
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir selecionados
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-primary/10">{doc.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{doc.name}</CardTitle>
                          <CardDescription className="line-clamp-1">{doc.description}</CardDescription>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => toggleDocumentSelection(doc.id)}
                        className="h-5 w-5"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Modelos disponíveis:</span> {doc.templates.length}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        doc.category === "logistica"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : doc.category === "financeiro"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : doc.category === "estoque"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                      }
                    >
                      {doc.category === "logistica"
                        ? "Logística"
                        : doc.category === "financeiro"
                          ? "Financeiro"
                          : doc.category === "estoque"
                            ? "Estoque"
                            : "Relatórios"}
                    </Badge>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => openPreview(doc)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => exportToPdf(doc)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button size="sm" className="bg-[#007846] hover:bg-[#006038]" onClick={() => printDocument(doc)}>
                        <Printer className="h-4 w-4 mr-1" />
                        Imprimir
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full p-8 text-center border rounded-lg">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Search className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Nenhum documento encontrado</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tente ajustar os filtros ou termos de busca para encontrar o que procura.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Aba de Configurações */}
        <TabsContent value="configuracoes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Impressoras
                </CardTitle>
                <CardDescription>Configure as impressoras disponíveis no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label className="font-medium">HP LaserJet Pro M404</Label>
                      <span className="text-xs text-muted-foreground">Impressora principal</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 border-green-200">
                        Online
                      </Badge>
                      <Switch checked={true} />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label className="font-medium">Zebra ZT411</Label>
                      <span className="text-xs text-muted-foreground">Impressora de etiquetas</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 border-green-200">
                        Online
                      </Badge>
                      <Switch checked={true} />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label className="font-medium">Epson L3150</Label>
                      <span className="text-xs text-muted-foreground">Impressora de relatórios</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 bg-red-50 text-red-700 border-red-200">
                        Offline
                      </Badge>
                      <Switch checked={false} />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2">
                  Adicionar impressora
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações de Impressão
                </CardTitle>
                <CardDescription>Defina as configurações padrão para impressão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-printer">Impressora padrão</Label>
                  <Select defaultValue="hp-laserjet">
                    <SelectTrigger id="default-printer">
                      <SelectValue placeholder="Selecione uma impressora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hp-laserjet">HP LaserJet Pro M404</SelectItem>
                      <SelectItem value="zebra-zt411">Zebra ZT411</SelectItem>
                      <SelectItem value="epson-l3150">Epson L3150</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paper-size">Tamanho do papel</Label>
                  <Select defaultValue="a4">
                    <SelectTrigger id="paper-size">
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                      <SelectItem value="letter">Carta (216 x 279 mm)</SelectItem>
                      <SelectItem value="legal">Ofício (216 x 356 mm)</SelectItem>
                      <SelectItem value="a5">A5 (148 x 210 mm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orientation">Orientação</Label>
                  <Select defaultValue="portrait">
                    <SelectTrigger id="orientation">
                      <SelectValue placeholder="Selecione a orientação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Retrato</SelectItem>
                      <SelectItem value="landscape">Paisagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="duplex" />
                  <Label htmlFor="duplex">Impressão frente e verso</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="grayscale" checked />
                  <Label htmlFor="grayscale">Imprimir em preto e branco</Label>
                </div>

                <Button className="w-full mt-2 bg-[#007846] hover:bg-[#006038]">Salvar configurações</Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Modelos de Documentos
                </CardTitle>
                <CardDescription>Gerencie os modelos de documentos disponíveis para impressão</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Padrão</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentTypes.slice(0, 4).flatMap((doc) =>
                      doc.templates.map((template) => (
                        <TableRow key={`${doc.id}-${template.id}`}>
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>{template.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{template.description}</TableCell>
                          <TableCell>
                            {template.default && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Padrão
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                {!template.default && (
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Definir como padrão
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Ver todos os modelos</Button>
                <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  Adicionar novo modelo
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Histórico */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Impressões
              </CardTitle>
              <CardDescription>Visualize o histórico de documentos impressos no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar no histórico..." className="pl-8" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Cópias</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {printHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.documentName}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.user}</TableCell>
                        <TableCell>{item.copies}</TableCell>
                        <TableCell>
                          {item.status === "success" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Sucesso
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <AlertCircle className="h-3.5 w-3.5 mr-1" />
                              Erro
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Printer className="h-4 w-4" />
                            <span className="sr-only">Reimprimir</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {printHistory.length} de {printHistory.length} registros
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Ver histórico completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Visualização Prévia */}
      {currentDocument && currentTemplate && (
        <PrintPreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          document={currentDocument}
          template={currentTemplate}
          onPrint={() => {
            setPreviewOpen(false)
            printDocument(currentDocument)
          }}
        />
      )}
    </div>
  )
}

