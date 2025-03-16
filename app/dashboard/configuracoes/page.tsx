"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { logUserAction } from "@/lib/logging"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Tipos de permissões disponíveis no sistema
type Permissao = {
  id: string
  nome: string
  descricao: string
  modulo: string
}

// Lista de permissões disponíveis
const permissoesDisponiveis: Permissao[] = [
  // Módulo de Coletas
  {
    id: "coletas_visualizar",
    nome: "Visualizar Coletas",
    descricao: "Permite visualizar todas as coletas",
    modulo: "Coletas",
  },
  {
    id: "coletas_adicionar",
    nome: "Adicionar Coletas",
    descricao: "Permite adicionar novas coletas",
    modulo: "Coletas",
  },
  { id: "coletas_editar", nome: "Editar Coletas", descricao: "Permite editar coletas existentes", modulo: "Coletas" },
  { id: "coletas_excluir", nome: "Excluir Coletas", descricao: "Permite excluir coletas", modulo: "Coletas" },
  { id: "coletas_imprimir", nome: "Imprimir Coletas", descricao: "Permite imprimir coletas", modulo: "Coletas" },

  // Módulo de Pesagens
  {
    id: "pesagens_visualizar",
    nome: "Visualizar Pesagens",
    descricao: "Permite visualizar todas as pesagens",
    modulo: "Pesagens",
  },
  {
    id: "pesagens_adicionar",
    nome: "Adicionar Pesagens",
    descricao: "Permite adicionar novas pesagens",
    modulo: "Pesagens",
  },
  {
    id: "pesagens_editar",
    nome: "Editar Pesagens",
    descricao: "Permite editar pesagens existentes",
    modulo: "Pesagens",
  },
  { id: "pesagens_excluir", nome: "Excluir Pesagens", descricao: "Permite excluir pesagens", modulo: "Pesagens" },
  { id: "pesagens_imprimir", nome: "Imprimir Pesagens", descricao: "Permite imprimir pesagens", modulo: "Pesagens" },

  // Módulo de Motoristas
  {
    id: "motoristas_visualizar",
    nome: "Visualizar Motoristas",
    descricao: "Permite visualizar todos os motoristas",
    modulo: "Motoristas",
  },
  {
    id: "motoristas_adicionar",
    nome: "Adicionar Motoristas",
    descricao: "Permite adicionar novos motoristas",
    modulo: "Motoristas",
  },
  {
    id: "motoristas_editar",
    nome: "Editar Motoristas",
    descricao: "Permite editar motoristas existentes",
    modulo: "Motoristas",
  },
  {
    id: "motoristas_excluir",
    nome: "Excluir Motoristas",
    descricao: "Permite excluir motoristas",
    modulo: "Motoristas",
  },

  // Módulo de Caminhões
  {
    id: "caminhoes_visualizar",
    nome: "Visualizar Caminhões",
    descricao: "Permite visualizar todos os caminhões",
    modulo: "Caminhões",
  },
  {
    id: "caminhoes_adicionar",
    nome: "Adicionar Caminhões",
    descricao: "Permite adicionar novos caminhões",
    modulo: "Caminhões",
  },
  {
    id: "caminhoes_editar",
    nome: "Editar Caminhões",
    descricao: "Permite editar caminhões existentes",
    modulo: "Caminhões",
  },
  { id: "caminhoes_excluir", nome: "Excluir Caminhões", descricao: "Permite excluir caminhões", modulo: "Caminhões" },

  // Módulo de Produtos
  {
    id: "produtos_visualizar",
    nome: "Visualizar Produtos",
    descricao: "Permite visualizar todos os produtos",
    modulo: "Produtos",
  },
  {
    id: "produtos_adicionar",
    nome: "Adicionar Produtos",
    descricao: "Permite adicionar novos produtos",
    modulo: "Produtos",
  },
  {
    id: "produtos_editar",
    nome: "Editar Produtos",
    descricao: "Permite editar produtos existentes",
    modulo: "Produtos",
  },
  { id: "produtos_excluir", nome: "Excluir Produtos", descricao: "Permite excluir produtos", modulo: "Produtos" },

  // Módulo de Clientes
  {
    id: "clientes_visualizar",
    nome: "Visualizar Clientes",
    descricao: "Permite visualizar todos os clientes",
    modulo: "Clientes",
  },
  {
    id: "clientes_adicionar",
    nome: "Adicionar Clientes",
    descricao: "Permite adicionar novos clientes",
    modulo: "Clientes",
  },
  {
    id: "clientes_editar",
    nome: "Editar Clientes",
    descricao: "Permite editar clientes existentes",
    modulo: "Clientes",
  },
  { id: "clientes_excluir", nome: "Excluir Clientes", descricao: "Permite excluir clientes", modulo: "Clientes" },

  // Módulo de Relatórios
  {
    id: "relatorios_visualizar",
    nome: "Visualizar Relatórios",
    descricao: "Permite visualizar relatórios",
    modulo: "Relatórios",
  },
  {
    id: "relatorios_exportar",
    nome: "Exportar Relatórios",
    descricao: "Permite exportar relatórios",
    modulo: "Relatórios",
  },

  // Módulo de Configurações
  {
    id: "config_empresa",
    nome: "Configurações da Empresa",
    descricao: "Permite alterar configurações da empresa",
    modulo: "Configurações",
  },
  {
    id: "config_sistema",
    nome: "Configurações do Sistema",
    descricao: "Permite alterar configurações do sistema",
    modulo: "Configurações",
  },
  {
    id: "config_usuarios",
    nome: "Gerenciar Usuários",
    descricao: "Permite gerenciar usuários",
    modulo: "Configurações",
  },
  { id: "config_backup", nome: "Gerenciar Backups", descricao: "Permite gerenciar backups", modulo: "Configurações" },
]

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Estado para armazenar as informações da empresa
  const [empresaInfo, setEmpresaInfo] = useState({
    nome: "Logística Transporte Ltda.",
    cnpj: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@logisticatransporte.com.br",
    endereco: "Av. Paulista, 1000, São Paulo - SP, 01310-100",
    logo: "/placeholder.svg?height=160&width=320",
  })

  // Estado para armazenar as configurações de impressão
  const [configImpressao, setConfigImpressao] = useState({
    tamanhoPapel: "a4",
    orientacao: "portrait",
    incluirLogo: true,
    incluirRodape: true,
  })

  // Função para atualizar os dados da empresa
  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setEmpresaInfo((prev) => ({
      ...prev,
      [id.replace("company-", "")]: value,
    }))
  }

  // Função para atualizar as configurações de impressão
  const handleImpressaoChange = (key: string, value: any) => {
    setConfigImpressao((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Função para lidar com o upload de logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar o tipo e tamanho do arquivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo de imagem.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive",
      })
      return
    }

    // Criar uma URL para a imagem selecionada
    const imageUrl = URL.createObjectURL(file)
    setEmpresaInfo((prev) => ({
      ...prev,
      logo: imageUrl,
    }))

    toast({
      title: "Logo carregado",
      description: "A nova logo foi carregada com sucesso.",
    })
  }

  // Função para abrir o seletor de arquivo
  const handleLogoButtonClick = () => {
    logoInputRef.current?.click()
  }

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Administrador",
      email: "admin@ruralfertil.com.br",
      cargo: "Gerente",
      perfil: "Administrador",
      ativo: true,
      avatar: "/placeholder.svg?height=40&width=40",
      permissoes: permissoesDisponiveis.map((p) => p.id), // Admin tem todas as permissões
    },
    {
      id: 2,
      nome: "João Silva",
      email: "joao@ruralfertil.com.br",
      cargo: "Operador",
      perfil: "Operador",
      ativo: true,
      avatar: "/placeholder.svg?height=40&width=40",
      permissoes: ["coletas_visualizar", "coletas_adicionar", "pesagens_visualizar", "pesagens_adicionar"],
    },
    {
      id: 3,
      nome: "Maria Oliveira",
      email: "maria@ruralfertil.com.br",
      cargo: "Recepcionista",
      perfil: "Básico",
      ativo: false,
      avatar: "/placeholder.svg?height=40&width=40",
      permissoes: ["coletas_visualizar", "pesagens_visualizar"],
    },
  ])
  const [busca, setBusca] = useState("")
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    cargo: "",
    perfil: "",
    senha: "",
    confirmarSenha: "",
  })
  const [novoUsuarioDialogOpen, setNovoUsuarioDialogOpen] = useState(false)
  const [editarUsuarioDialogOpen, setEditarUsuarioDialogOpen] = useState(false)
  const [excluirUsuarioDialogOpen, setExcluirUsuarioDialogOpen] = useState(false)
  const [permissoesDialogOpen, setPermissoesDialogOpen] = useState(false)
  const [usuarioAtual, setUsuarioAtual] = useState<any>(null)
  const [permissoesUsuario, setPermissoesUsuario] = useState<string[]>([])

  // Agrupar permissões por módulo
  const permissoesPorModulo = permissoesDisponiveis.reduce(
    (acc, permissao) => {
      if (!acc[permissao.modulo]) {
        acc[permissao.modulo] = []
      }
      acc[permissao.modulo].push(permissao)
      return acc
    },
    {} as Record<string, Permissao[]>,
  )

  // Filtrar usuários com base na busca
  const usuariosFiltrados = usuarios.filter((usuario) => {
    if (!busca) return true

    const buscaLowerCase = busca.toLowerCase()
    return (
      (usuario.nome && usuario.nome.toLowerCase().includes(buscaLowerCase)) ||
      (usuario.email && usuario.email.toLowerCase().includes(buscaLowerCase)) ||
      (usuario.cargo && usuario.cargo.toLowerCase().includes(buscaLowerCase)) ||
      (usuario.perfil && usuario.perfil.toLowerCase().includes(buscaLowerCase))
    )
  })

  const handleNovoUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNovoUsuario((prev) => ({ ...prev, [name]: value }))
  }

  const handlePerfilChange = (value: string) => {
    setNovoUsuario((prev) => ({ ...prev, perfil: value }))
  }

  const handleAdicionarUsuario = () => {
    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.perfil || !novoUsuario.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (novoUsuario.senha !== novoUsuario.confirmarSenha) {
      toast({
        title: "Senhas não conferem",
        description: "A senha e a confirmação de senha devem ser iguais.",
        variant: "destructive",
      })
      return
    }

    const novoId = Math.max(...usuarios.map((u) => u.id)) + 1

    setUsuarios((prev) => [
      ...prev,
      {
        id: novoId,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        cargo: novoUsuario.cargo,
        perfil: novoUsuario.perfil,
        ativo: true,
        avatar: "/placeholder.svg?height=40&width=40",
        permissoes: [], // Novo usuário sem permissões
      },
    ])

    setNovoUsuario({
      nome: "",
      email: "",
      cargo: "",
      perfil: "",
      senha: "",
      confirmarSenha: "",
    })

    setNovoUsuarioDialogOpen(false)

    toast({
      title: "Usuário adicionado",
      description: "O usuário foi adicionado com sucesso.",
    })
  }

  const handleEditarUsuario = (usuario: any) => {
    setUsuarioAtual(usuario)
    setEditarUsuarioDialogOpen(true)
  }

  const handleSalvarEdicao = () => {
    if (!usuarioAtual) return

    setUsuarios((prev) => prev.map((u) => (u.id === usuarioAtual.id ? usuarioAtual : u)))

    setEditarUsuarioDialogOpen(false)

    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas com sucesso.",
    })
  }

  const handleExcluirUsuario = (usuario: any) => {
    setUsuarioAtual(usuario)
    setExcluirUsuarioDialogOpen(true)
  }

  const confirmarExclusao = () => {
    if (!usuarioAtual) return

    setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAtual.id))
    setExcluirUsuarioDialogOpen(false)

    toast({
      title: "Usuário excluído",
      description: "O usuário foi excluído com sucesso.",
    })
  }

  const toggleStatusUsuario = (id: number) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return { ...u, ativo: !u.ativo }
        }
        return u
      }),
    )

    const usuario = usuarios.find((u) => u.id === id)
    const novoStatus = usuario?.ativo ? "desativado" : "ativado"

    toast({
      title: `Usuário ${novoStatus}`,
      description: `O usuário foi ${novoStatus} com sucesso.`,
    })
  }

  const handleGerenciarPermissoes = (usuario: any) => {
    setUsuarioAtual(usuario)
    setPermissoesUsuario(usuario.permissoes || [])
    setPermissoesDialogOpen(true)
  }

  const handleTogglePermissao = (permissaoId: string) => {
    setPermissoesUsuario((prev) => {
      if (prev.includes(permissaoId)) {
        return prev.filter((id) => id !== permissaoId)
      } else {
        return [...prev, permissaoId]
      }
    })
  }

  const handleSalvarPermissoes = () => {
    if (!usuarioAtual) return

    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === usuarioAtual.id) {
          return { ...u, permissoes: permissoesUsuario }
        }
        return u
      }),
    )

    setPermissoesDialogOpen(false)

    toast({
      title: "Permissões atualizadas",
      description: `As permissões do usuário ${usuarioAtual.nome} foram atualizadas com sucesso.`,
    })
  }

  const handleMarcarTodasPermissoes = (modulo: string) => {
    const permissoesDoModulo = permissoesPorModulo[modulo].map((p) => p.id)
    const todasJaMarcadas = permissoesDoModulo.every((id) => permissoesUsuario.includes(id))

    if (todasJaMarcadas) {
      // Desmarcar todas do módulo
      setPermissoesUsuario((prev) => prev.filter((id) => !permissoesDoModulo.includes(id)))
    } else {
      // Marcar todas do módulo
      setPermissoesUsuario((prev) => {
        const novasPermissoes = [...prev]
        permissoesDoModulo.forEach((id) => {
          if (!novasPermissoes.includes(id)) {
            novasPermissoes.push(id)
          }
        })
        return novasPermissoes
      })
    }
  }

  const handleSave = () => {
    setSaving(true)

    // Simulate saving
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso.",
      })

      logUserAction({
        action: "update",
        resource: "configuracao",
        details: "Configurações do sistema atualizadas",
      })
    }, 1000)
  }

  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [ipRestriction, setIpRestriction] = useState(false)
  const [allowedIps, setAllowedIps] = useState("")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[#1e366a]">Configurações</h2>
      </div>

      <Tabs defaultValue="empresa" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full md:w-auto">
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="limpar-dados">Limpar Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Configure as informações básicas da sua empresa que serão exibidas em relatórios e documentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-nome">Nome da Empresa</Label>
                  <Input id="company-nome" value={empresaInfo.nome} onChange={handleEmpresaChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-cnpj">CNPJ</Label>
                  <Input id="company-cnpj" value={empresaInfo.cnpj} onChange={handleEmpresaChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-telefone">Telefone</Label>
                  <Input id="company-telefone" value={empresaInfo.telefone} onChange={handleEmpresaChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">E-mail</Label>
                  <Input id="company-email" type="email" value={empresaInfo.email} onChange={handleEmpresaChange} />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="company-endereco">Endereço</Label>
                <Textarea id="company-endereco" value={empresaInfo.endereco} onChange={handleEmpresaChange} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="company-logo">Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src={empresaInfo.logo || "/placeholder.svg"}
                      alt="Logo da empresa"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={handleLogoButtonClick}>
                      Alterar Logo
                    </Button>
                    <input
                      type="file"
                      id="logo-upload"
                      ref={logoInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: JPG, PNG, SVG. Tamanho máximo: 5MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Impressão</CardTitle>
              <CardDescription>Personalize como os documentos serão impressos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paper-size">Tamanho do Papel</Label>
                  <Select
                    value={configImpressao.tamanhoPapel}
                    onValueChange={(value) => handleImpressaoChange("tamanhoPapel", value)}
                  >
                    <SelectTrigger id="paper-size">
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Carta</SelectItem>
                      <SelectItem value="legal">Ofício</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orientation">Orientação</Label>
                  <Select
                    value={configImpressao.orientacao}
                    onValueChange={(value) => handleImpressaoChange("orientacao", value)}
                  >
                    <SelectTrigger id="orientation">
                      <SelectValue placeholder="Selecione a orientação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Retrato</SelectItem>
                      <SelectItem value="landscape">Paisagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="include-logo"
                  checked={configImpressao.incluirLogo}
                  onCheckedChange={(checked) => handleImpressaoChange("incluirLogo", checked)}
                />
                <Label htmlFor="include-logo">Incluir logo nos documentos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="include-footer"
                  checked={configImpressao.incluirRodape}
                  onCheckedChange={(checked) => handleImpressaoChange("incluirRodape", checked)}
                />
                <Label htmlFor="include-footer">Incluir rodapé com informações da empresa</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Ajuste as configurações gerais do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="pt-BR">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Formato de Data</Label>
                <Select defaultValue="dd/MM/yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                    <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Notificações</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="email-notifications" defaultChecked />
                    <Label htmlFor="email-notifications">Notificações por e-mail</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="system-notifications" defaultChecked />
                    <Label htmlFor="system-notifications">Notificações do sistema</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="light-theme" name="theme" defaultChecked />
                    <Label htmlFor="light-theme">Claro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="dark-theme" name="theme" />
                    <Label htmlFor="dark-theme">Escuro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="system-theme" name="theme" />
                    <Label htmlFor="system-theme">Sistema</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Configure as opções de segurança do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Tempo de Inatividade (minutos)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" min="5" max="120" />
                <p className="text-sm text-muted-foreground">
                  Tempo de inatividade antes de encerrar a sessão automaticamente.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">Habilitar autenticação de dois fatores</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="password-complexity" defaultChecked />
                <Label htmlFor="password-complexity">Exigir senhas complexas</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Gerencie os usuários que têm acesso ao sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Gerenciamento de Usuários</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                        <DialogDescription>
                          Preencha os campos abaixo para adicionar um novo usuário ao sistema.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nome" className="text-right">
                            Nome*
                          </Label>
                          <Input
                            id="nome"
                            name="nome"
                            value={novoUsuario.nome}
                            onChange={handleNovoUsuarioChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email*
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={novoUsuario.email}
                            onChange={handleNovoUsuarioChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="cargo" className="text-right">
                            Cargo
                          </Label>
                          <Input
                            id="cargo"
                            name="cargo"
                            value={novoUsuario.cargo}
                            onChange={handleNovoUsuarioChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="perfil" className="text-right">
                            Perfil*
                          </Label>
                          <Select onValueChange={handlePerfilChange}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecione um perfil" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Administrador">Administrador</SelectItem>
                              <SelectItem value="Operador">Operador</SelectItem>
                              <SelectItem value="Básico">Básico</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="senha" className="text-right">
                            Senha*
                          </Label>
                          <Input
                            id="senha"
                            name="senha"
                            type="password"
                            value={novoUsuario.senha}
                            onChange={handleNovoUsuarioChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="confirmarSenha" className="text-right">
                            Confirmar Senha*
                          </Label>
                          <Input
                            id="confirmarSenha"
                            name="confirmarSenha"
                            type="password"
                            value={novoUsuario.confirmarSenha}
                            onChange={handleNovoUsuarioChange}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNovoUsuarioDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAdicionarUsuario}>Adicionar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center">
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email, cargo ou perfil..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          Nenhum usuário encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      usuariosFiltrados.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={usuario.avatar} alt={usuario.nome || ""} />
                                <AvatarFallback>{usuario.nome ? usuario.nome.charAt(0) : ""}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{usuario.nome}</div>
                                <div className="text-sm text-muted-foreground">{usuario.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{usuario.cargo}</TableCell>
                          <TableCell>{usuario.perfil}</TableCell>
                          <TableCell>
                            <Badge variant={usuario.ativo ? "default" : "secondary"}>
                              {usuario.ativo ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Abrir menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditarUsuario(usuario)}>Editar</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGerenciarPermissoes(usuario)}>
                                  Permissões
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleStatusUsuario(usuario.id)}>
                                  {usuario.ativo ? "Desativar" : "Ativar"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleExcluirUsuario(usuario)}
                                >
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
              <CardDescription>Visualize os logs de atividades do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Para visualizar os logs do sistema, acesse a seção de Logs.
              </p>
              <Button variant="outline" onClick={() => (window.location.href = "/dashboard/configuracoes/logs")}>
                Ir para Logs do Sistema
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup do Sistema</CardTitle>
              <CardDescription>Configure e gerencie backups do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-time">Horário do Backup</Label>
                <Input id="backup-time" type="time" defaultValue="02:00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-retention">Retenção de Backups (dias)</Label>
                <Input id="backup-retention" type="number" defaultValue="30" min="1" max="365" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Backup Manual</Label>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline">Realizar Backup Agora</Button>
                  <p className="text-sm text-muted-foreground">Último backup: 12/03/2025 às 02:00</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Restaurar Backup</Label>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline">Selecionar Arquivo de Backup</Button>
                  <p className="text-sm text-muted-foreground">
                    Selecione um arquivo de backup para restaurar o sistema.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ipRestriction">Restrição de Acesso por IP</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ipRestriction"
                      checked={ipRestriction}
                      onCheckedChange={setIpRestriction}
                      disabled={true}
                    />
                    <span className="text-sm text-muted-foreground">
                      {ipRestriction ? "Ativado" : "Desativado"} (Funcionalidade em desenvolvimento)
                    </span>
                  </div>
                </div>
                
                {ipRestriction && (
                  <div className="space-y-2">
                    <Label htmlFor="allowedIps">IPs Permitidos</Label>
                    <Textarea
                      id="allowedIps"
                      placeholder="Digite os IPs permitidos, um por linha"
                      value={allowedIps}
                      onChange={(e) => setAllowedIps(e.target.value)}
                      disabled={true}
                    />
                    <p className="text-xs text-muted-foreground">
                      Digite um endereço IP por linha. Exemplo: 192.168.1.1
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="limpar-dados">
          <Card>
            <CardHeader>
              <CardTitle>Limpar Dados do Sistema</CardTitle>
              <CardDescription>Remova todos os dados do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                <h3 className="text-amber-800 font-medium mb-2">⚠️ Aviso Importante</h3>
                <p className="text-amber-700">
                  Esta ação não pode ser desfeita. Todos os dados serão permanentemente removidos do sistema.
                  Recomendamos fazer um backup dos dados antes de prosseguir.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => window.location.href = "/dashboard/configuracoes/limpar-dados"}
              >
                Ir para Limpar Dados
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Edição de Usuário */}
      {usuarioAtual && (
        <Dialog open={editarUsuarioDialogOpen} onOpenChange={setEditarUsuarioDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>Atualize as informações do usuário.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nome" className="text-right">
                  Nome
                </Label>
                <Input
                  id="edit-nome"
                  value={usuarioAtual.nome || ""}
                  onChange={(e) => setUsuarioAtual({ ...usuarioAtual, nome: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={usuarioAtual.email || ""}
                  onChange={(e) => setUsuarioAtual({ ...usuarioAtual, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cargo" className="text-right">
                  Cargo
                </Label>
                <Input
                  id="edit-cargo"
                  value={usuarioAtual.cargo || ""}
                  onChange={(e) => setUsuarioAtual({ ...usuarioAtual, cargo: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-perfil" className="text-right">
                  Perfil
                </Label>
                <Select
                  defaultValue={usuarioAtual.perfil}
                  onValueChange={(value) => setUsuarioAtual({ ...usuarioAtual, perfil: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Operador">Operador</SelectItem>
                    <SelectItem value="Básico">Básico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditarUsuarioDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarEdicao}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={excluirUsuarioDialogOpen} onOpenChange={setExcluirUsuarioDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário {usuarioAtual?.nome}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarExclusao}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de Gerenciamento de Permissões */}
      {usuarioAtual && (
        <Dialog open={permissoesDialogOpen} onOpenChange={setPermissoesDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerenciar Permissões</DialogTitle>
              <DialogDescription>Configure as permissões do usuário {usuarioAtual.nome}.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
              {Object.entries(permissoesPorModulo).map(([modulo, permissoes]) => (
                <div key={modulo} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{modulo}</h3>
                    <Button variant="outline" size="sm" onClick={() => handleMarcarTodasPermissoes(modulo)}>
                      {permissoes.every((p) => permissoesUsuario.includes(p.id)) ? "Desmarcar Todas" : "Marcar Todas"}
                    </Button>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissoes.map((permissao) => (
                      <div key={permissao.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={permissao.id}
                          checked={permissoesUsuario.includes(permissao.id)}
                          onCheckedChange={() => handleTogglePermissao(permissao.id)}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor={permissao.id} className="font-medium cursor-pointer">
                            {permissao.nome}
                          </Label>
                          <p className="text-sm text-muted-foreground">{permissao.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPermissoesDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarPermissoes}>Salvar Permissões</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

