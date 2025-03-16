"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  ShieldAlert,
  UserCog,
  Eye,
  EyeOff,
  Lock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  MoreVertical,
  LogOut,
  Key,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Schemas para validação de formulários
const userFormSchema = z
  .object({
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    perfil: z.string().min(1, "Selecione um perfil"),
    senha: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Deve conter pelo menos um número")
      .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial"),
    confirmarSenha: z.string(),
    ativo: z.boolean().default(true),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

const perfilFormSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  permissoes: z.array(z.string()).min(1, "Selecione pelo menos uma permissão"),
})

const configFormSchema = z.object({
  senhaExpiraDias: z.number().min(30, "Mínimo de 30 dias").max(180, "Máximo de 180 dias"),
  tentativasLogin: z.number().min(3, "Mínimo de 3 tentativas").max(10, "Máximo de 10 tentativas"),
  bloqueioMinutos: z.number().min(5, "Mínimo de 5 minutos").max(60, "Máximo de 60 minutos"),
  autenticacaoDoisFatores: z.boolean().default(false),
  forcaTrocaSenha: z.boolean().default(true),
  registroAcessos: z.boolean().default(true),
})

// Dados mockados para demonstração
const usuariosMock = [
  {
    id: 1,
    nome: "Admin Sistema",
    email: "admin@sistema.com",
    perfil: "Administrador",
    ultimoAcesso: "2023-05-15 08:30",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "João Operador",
    email: "joao@sistema.com",
    perfil: "Operador",
    ultimoAcesso: "2023-05-14 14:22",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Maria Gerente",
    email: "maria@sistema.com",
    perfil: "Gerente",
    ultimoAcesso: "2023-05-10 09:45",
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Carlos Vendas",
    email: "carlos@sistema.com",
    perfil: "Vendas",
    ultimoAcesso: "2023-05-12 16:30",
    status: "Inativo",
  },
  {
    id: 5,
    nome: "Ana Financeiro",
    email: "ana@sistema.com",
    perfil: "Financeiro",
    ultimoAcesso: "2023-05-13 11:15",
    status: "Ativo",
  },
]

const perfisMock = [
  {
    id: 1,
    nome: "Administrador",
    descricao: "Acesso total ao sistema",
    permissoes: [
      "usuarios_gerenciar",
      "perfis_gerenciar",
      "config_seguranca",
      "logs_visualizar",
      "admin_notifications",
    ],
  },
  {
    id: 2,
    nome: "Gerente",
    descricao: "Gerenciamento de operações",
    permissoes: ["usuarios_visualizar", "logs_visualizar", "operacoes_gerenciar"],
  },
  {
    id: 3,
    nome: "Operador",
    descricao: "Operações do dia a dia",
    permissoes: ["operacoes_visualizar", "operacoes_registrar"],
  },
  { id: 4, nome: "Vendas", descricao: "Equipe de vendas", permissoes: ["vendas_gerenciar", "clientes_gerenciar"] },
  {
    id: 5,
    nome: "Financeiro",
    descricao: "Equipe financeira",
    permissoes: ["financeiro_gerenciar", "relatorios_visualizar"],
  },
]

const permissoesMock = [
  { id: "usuarios_gerenciar", nome: "Gerenciar Usuários", grupo: "Usuários" },
  { id: "usuarios_visualizar", nome: "Visualizar Usuários", grupo: "Usuários" },
  { id: "perfis_gerenciar", nome: "Gerenciar Perfis", grupo: "Perfis" },
  { id: "perfis_visualizar", nome: "Visualizar Perfis", grupo: "Perfis" },
  { id: "config_seguranca", nome: "Configurar Segurança", grupo: "Configurações" },
  { id: "logs_visualizar", nome: "Visualizar Logs", grupo: "Logs" },
  { id: "operacoes_gerenciar", nome: "Gerenciar Operações", grupo: "Operações" },
  { id: "operacoes_visualizar", nome: "Visualizar Operações", grupo: "Operações" },
  { id: "operacoes_registrar", nome: "Registrar Operações", grupo: "Operações" },
  { id: "vendas_gerenciar", nome: "Gerenciar Vendas", grupo: "Vendas" },
  { id: "clientes_gerenciar", nome: "Gerenciar Clientes", grupo: "Clientes" },
  { id: "financeiro_gerenciar", nome: "Gerenciar Financeiro", grupo: "Financeiro" },
  { id: "relatorios_visualizar", nome: "Visualizar Relatórios", grupo: "Relatórios" },
  { id: "admin_notifications", nome: "Administrar Notificações", grupo: "Notificações" },
]

const logsMock = [
  {
    id: 1,
    usuario: "Admin Sistema",
    acao: "Login no sistema",
    ip: "192.168.1.100",
    data: "2023-05-15 08:30:22",
    status: "Sucesso",
  },
  {
    id: 2,
    usuario: "João Operador",
    acao: "Alteração de cadastro",
    ip: "192.168.1.101",
    data: "2023-05-14 14:22:45",
    status: "Sucesso",
  },
  {
    id: 3,
    usuario: "Carlos Vendas",
    acao: "Tentativa de login",
    ip: "192.168.1.102",
    data: "2023-05-14 10:15:30",
    status: "Falha",
  },
  {
    id: 4,
    usuario: "Maria Gerente",
    acao: "Exportação de relatório",
    ip: "192.168.1.103",
    data: "2023-05-13 16:40:12",
    status: "Sucesso",
  },
  {
    id: 5,
    usuario: "Ana Financeiro",
    acao: "Alteração de permissões",
    ip: "192.168.1.104",
    data: "2023-05-13 11:15:55",
    status: "Sucesso",
  },
  {
    id: 6,
    usuario: "Sistema",
    acao: "Backup automático",
    ip: "localhost",
    data: "2023-05-12 23:00:00",
    status: "Sucesso",
  },
  {
    id: 7,
    usuario: "Carlos Vendas",
    acao: "Reset de senha",
    ip: "192.168.1.102",
    data: "2023-05-12 09:30:18",
    status: "Sucesso",
  },
]

export default function SegurancaPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, hasPermission } = useAuth()

  const [activeTab, setActiveTab] = useState("usuarios")
  const [usuarios, setUsuarios] = useState(usuariosMock)
  const [perfis, setPerfis] = useState(perfisMock)
  const [logs, setLogs] = useState(logsMock)
  const [permissoes] = useState(permissoesMock)

  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [perfilDialogOpen, setPerfilDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [filteredLogs, setFilteredLogs] = useState(logs)
  const [logFilter, setLogFilter] = useState("todos")

  // Verificar permissões
  useEffect(() => {
    if (
      !hasPermission("usuarios_gerenciar") &&
      !hasPermission("perfis_gerenciar") &&
      !hasPermission("config_seguranca")
    ) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [hasPermission, router, toast])

  // Formulário de usuários
  const userForm = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      perfil: "",
      senha: "",
      confirmarSenha: "",
      ativo: true,
    },
  })

  // Formulário de perfis
  const perfilForm = useForm({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      permissoes: [],
    },
  })

  // Formulário de configurações
  const configForm = useForm({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      senhaExpiraDias: 90,
      tentativasLogin: 5,
      bloqueioMinutos: 15,
      autenticacaoDoisFatores: false,
      forcaTrocaSenha: true,
      registroAcessos: true,
    },
  })

  // Filtrar logs
  useEffect(() => {
    if (logFilter === "todos") {
      setFilteredLogs(logs)
    } else if (logFilter === "sucesso") {
      setFilteredLogs(logs.filter((log) => log.status === "Sucesso"))
    } else if (logFilter === "falha") {
      setFilteredLogs(logs.filter((log) => log.status === "Falha"))
    }
  }, [logFilter, logs])

  // Abrir diálogo para adicionar usuário
  const handleAddUser = () => {
    setEditMode(false)
    userForm.reset({
      nome: "",
      email: "",
      perfil: "",
      senha: "",
      confirmarSenha: "",
      ativo: true,
    })
    setUserDialogOpen(true)
  }

  // Abrir diálogo para editar usuário
  const handleEditUser = (user) => {
    setEditMode(true)
    setCurrentItem(user)
    userForm.reset({
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      senha: "",
      confirmarSenha: "",
      ativo: user.status === "Ativo",
    })
    setUserDialogOpen(true)
  }

  // Abrir diálogo para adicionar perfil
  const handleAddPerfil = () => {
    setEditMode(false)
    perfilForm.reset({
      nome: "",
      descricao: "",
      permissoes: [],
    })
    setPerfilDialogOpen(true)
  }

  // Abrir diálogo para editar perfil
  const handleEditPerfil = (perfil) => {
    setEditMode(true)
    setCurrentItem(perfil)
    perfilForm.reset({
      nome: perfil.nome,
      descricao: perfil.descricao,
      permissoes: perfil.permissoes,
    })
    setPerfilDialogOpen(true)
  }

  // Abrir diálogo para confirmar exclusão
  const handleDeleteConfirm = (item, type) => {
    setCurrentItem({ ...item, type })
    setDeleteDialogOpen(true)
  }

  // Salvar usuário
  const onSubmitUser = (data) => {
    if (editMode) {
      // Atualizar usuário existente
      setUsuarios(
        usuarios.map((u) =>
          u.id === currentItem.id
            ? {
                ...u,
                nome: data.nome,
                email: data.email,
                perfil: data.perfil,
                status: data.ativo ? "Ativo" : "Inativo",
              }
            : u,
        ),
      )
      toast({
        title: "Usuário atualizado",
        description: `O usuário ${data.nome} foi atualizado com sucesso.`,
      })
    } else {
      // Adicionar novo usuário
      const newUser = {
        id: usuarios.length + 1,
        nome: data.nome,
        email: data.email,
        perfil: data.perfil,
        ultimoAcesso: "Nunca",
        status: data.ativo ? "Ativo" : "Inativo",
      }
      setUsuarios([...usuarios, newUser])
      toast({
        title: "Usuário adicionado",
        description: `O usuário ${data.nome} foi adicionado com sucesso.`,
      })
    }
    setUserDialogOpen(false)
  }

  // Salvar perfil
  const onSubmitPerfil = (data) => {
    if (editMode) {
      // Atualizar perfil existente
      setPerfis(
        perfis.map((p) =>
          p.id === currentItem.id
            ? {
                ...p,
                nome: data.nome,
                descricao: data.descricao,
                permissoes: data.permissoes,
              }
            : p,
        ),
      )
      toast({
        title: "Perfil atualizado",
        description: `O perfil ${data.nome} foi atualizado com sucesso.`,
      })
    } else {
      // Adicionar novo perfil
      const newPerfil = {
        id: perfis.length + 1,
        nome: data.nome,
        descricao: data.descricao,
        permissoes: data.permissoes,
      }
      setPerfis([...perfis, newPerfil])
      toast({
        title: "Perfil adicionado",
        description: `O perfil ${data.nome} foi adicionado com sucesso.`,
      })
    }
    setPerfilDialogOpen(false)
  }

  // Salvar configurações
  const onSubmitConfig = (data) => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de segurança foram atualizadas com sucesso.",
    })
  }

  // Excluir item
  const handleDelete = () => {
    if (currentItem.type === "usuario") {
      setUsuarios(usuarios.filter((u) => u.id !== currentItem.id))
      toast({
        title: "Usuário excluído",
        description: `O usuário ${currentItem.nome} foi excluído com sucesso.`,
      })
    } else if (currentItem.type === "perfil") {
      setPerfis(perfis.filter((p) => p.id !== currentItem.id))
      toast({
        title: "Perfil excluído",
        description: `O perfil ${currentItem.nome} foi excluído com sucesso.`,
      })
    }
    setDeleteDialogOpen(false)
  }

  // Exportar logs
  const handleExportLogs = () => {
    toast({
      title: "Logs exportados",
      description: "Os logs foram exportados com sucesso.",
    })
  }

  // Limpar logs
  const handleClearLogs = () => {
    toast({
      title: "Logs limpos",
      description: "Os logs antigos foram limpos com sucesso.",
      variant: "destructive",
    })
  }

  // Forçar logout de usuário
  const handleForceLogout = (user) => {
    toast({
      title: "Logout forçado",
      description: `O usuário ${user.nome} foi desconectado com sucesso.`,
    })
  }

  // Resetar senha de usuário
  const handleResetPassword = (user) => {
    toast({
      title: "Senha resetada",
      description: `A senha do usuário ${user.nome} foi resetada com sucesso. Um email foi enviado com as instruções.`,
    })
  }

  // Filtrar usuários por termo de busca
  const filteredUsers = usuarios.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.perfil.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filtrar perfis por termo de busca
  const filteredPerfis = perfis.filter(
    (perfil) =>
      perfil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Agrupar permissões por grupo
  const permissoesPorGrupo = permissoes.reduce((acc, perm) => {
    if (!acc[perm.grupo]) {
      acc[perm.grupo] = []
    }
    acc[perm.grupo].push(perm)
    return acc
  }, {})

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Segurança</h1>
          <p className="text-muted-foreground">Gerencie usuários, perfis e configurações de segurança do sistema</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger
            value="usuarios"
            disabled={!hasPermission("usuarios_gerenciar") && !hasPermission("usuarios_visualizar")}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger
            value="perfis"
            disabled={!hasPermission("perfis_gerenciar") && !hasPermission("perfis_visualizar")}
          >
            <Shield className="mr-2 h-4 w-4" />
            Perfis
          </TabsTrigger>
          <TabsTrigger value="configuracoes" disabled={!hasPermission("config_seguranca")}>
            <Lock className="mr-2 h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="logs" disabled={!hasPermission("logs_visualizar")}>
            <Clock className="mr-2 h-4 w-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        {/* Aba de Usuários */}
        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Adicione, edite e gerencie os usuários do sistema</CardDescription>
              </div>
              {hasPermission("usuarios_gerenciar") && (
                <Button onClick={handleAddUser}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.nome}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10">
                              {user.perfil}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.ultimoAcesso}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.status === "Ativo" ? "default" : "secondary"}
                              className={user.status === "Ativo" ? "bg-green-500" : "bg-gray-500"}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                {hasPermission("usuarios_gerenciar") && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                      <Key className="mr-2 h-4 w-4" />
                                      Resetar Senha
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleForceLogout(user)}>
                                      <LogOut className="mr-2 h-4 w-4" />
                                      Forçar Logout
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteConfirm(user, "usuario")}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </>
                                )}
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

        {/* Aba de Perfis */}
        <TabsContent value="perfis" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Gerenciamento de Perfis</CardTitle>
                <CardDescription>Configure os perfis e permissões do sistema</CardDescription>
              </div>
              {hasPermission("perfis_gerenciar") && (
                <Button onClick={handleAddPerfil}>
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Novo Perfil
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar perfis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Permissões</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPerfis.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          Nenhum perfil encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPerfis.map((perfil) => (
                        <TableRow key={perfil.id}>
                          <TableCell className="font-medium">{perfil.nome}</TableCell>
                          <TableCell>{perfil.descricao}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {perfil.permissoes.length > 3 ? (
                                <>
                                  {perfil.permissoes.slice(0, 2).map((perm) => (
                                    <Badge key={perm} variant="outline" className="bg-primary/10">
                                      {permissoes.find((p) => p.id === perm)?.nome || perm}
                                    </Badge>
                                  ))}
                                  <Badge variant="outline">+{perfil.permissoes.length - 2} mais</Badge>
                                </>
                              ) : (
                                perfil.permissoes.map((perm) => (
                                  <Badge key={perm} variant="outline" className="bg-primary/10">
                                    {permissoes.find((p) => p.id === perm)?.nome || perm}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                {hasPermission("perfis_gerenciar") && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleEditPerfil(perfil)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteConfirm(perfil, "perfil")}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </>
                                )}
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

        {/* Aba de Configurações */}
        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Configure as políticas de segurança do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...configForm}>
                <form onSubmit={configForm.handleSubmit(onSubmitConfig)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Política de Senhas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={configForm.control}
                        name="senhaExpiraDias"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiração de senha (dias)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>Número de dias até que a senha expire</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={configForm.control}
                        name="forcaTrocaSenha"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Forçar troca de senha no primeiro acesso</FormLabel>
                              <FormDescription>Usuários devem trocar a senha no primeiro acesso</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Controle de Acesso</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={configForm.control}
                        name="tentativasLogin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tentativas de login</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>Número máximo de tentativas de login antes do bloqueio</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={configForm.control}
                        name="bloqueioMinutos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tempo de bloqueio (minutos)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>Tempo de bloqueio após exceder tentativas</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={configForm.control}
                      name="autenticacaoDoisFatores"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Autenticação de dois fatores (2FA)</FormLabel>
                            <FormDescription>
                              Exigir autenticação de dois fatores para todos os usuários
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Auditoria</h3>
                    <FormField
                      control={configForm.control}
                      name="registroAcessos"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Registro de acessos e ações</FormLabel>
                            <FormDescription>Manter logs de todas as ações realizadas no sistema</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    Salvar Configurações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Logs */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Logs de Auditoria</CardTitle>
                <CardDescription>Visualize os registros de atividades do sistema</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Select value={logFilter} onValueChange={setLogFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os logs</SelectItem>
                    <SelectItem value="sucesso">Sucesso</SelectItem>
                    <SelectItem value="falha">Falha</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExportLogs}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button variant="destructive" onClick={handleClearLogs}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Nenhum log encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.usuario}</TableCell>
                          <TableCell>{log.acao}</TableCell>
                          <TableCell>{log.ip}</TableCell>
                          <TableCell>{log.data}</TableCell>
                          <TableCell>
                            <Badge
                              variant={log.status === "Sucesso" ? "default" : "destructive"}
                              className={log.status === "Sucesso" ? "bg-green-500" : ""}
                            >
                              {log.status === "Sucesso" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {log.status}
                            </Badge>
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
      </Tabs>

      {/* Diálogo para adicionar/editar usuário */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
            <DialogDescription>
              {editMode
                ? "Edite as informações do usuário abaixo."
                : "Preencha as informações para adicionar um novo usuário."}
            </DialogDescription>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="perfil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {perfis.map((perfil) => (
                          <SelectItem key={perfil.id} value={perfil.nome}>
                            {perfil.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={userForm.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="confirmarSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={userForm.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Usuário ativo</FormLabel>
                      <FormDescription>Usuários inativos não podem acessar o sistema</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editMode ? "Salvar alterações" : "Adicionar usuário"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para adicionar/editar perfil */}
      <Dialog open={perfilDialogOpen} onOpenChange={setPerfilDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Editar Perfil" : "Adicionar Perfil"}</DialogTitle>
            <DialogDescription>
              {editMode
                ? "Edite as informações do perfil abaixo."
                : "Preencha as informações para adicionar um novo perfil."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <Form {...perfilForm}>
              <form onSubmit={perfilForm.handleSubmit(onSubmitPerfil)} className="space-y-4">
                <FormField
                  control={perfilForm.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do perfil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={perfilForm.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição do perfil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={perfilForm.control}
                  name="permissoes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Permissões</FormLabel>
                        <FormDescription>Selecione as permissões para este perfil</FormDescription>
                      </div>
                      {Object.entries(permissoesPorGrupo).map(([grupo, perms]) => (
                        <div key={grupo} className="mb-4">
                          <h4 className="text-sm font-medium mb-2">{grupo}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {perms.map((perm) => (
                              <FormField
                                key={perm.id}
                                control={perfilForm.control}
                                name="permissoes"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={perm.id} className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(perm.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, perm.id])
                                              : field.onChange(field.value?.filter((value) => value !== perm.id))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">{perm.nome}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={perfilForm.handleSubmit(onSubmitPerfil)}>
              {editMode ? "Salvar alterações" : "Adicionar perfil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {currentItem?.type === "usuario" ? "o usuário" : "o perfil"}{" "}
              <span className="font-bold">{currentItem?.nome}</span>?
              {currentItem?.type === "perfil" && (
                <div className="mt-2 text-red-500">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Atenção: Usuários com este perfil perderão suas permissões.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

