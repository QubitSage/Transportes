"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Key,
  ShieldCheck,
  UserCog,
  AlertCircle,
} from "lucide-react"
import { useAuth, UserProfiles, DefaultPermissions, type Permission } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Agrupamento de permissões para exibição na interface
const permissionGroups = [
  {
    name: "Dashboard",
    permissions: [{ id: "dashboard_view", label: "Visualizar Dashboard" }],
  },
  {
    name: "Pesagens",
    permissions: [
      { id: "pesagens_view", label: "Visualizar Pesagens" },
      { id: "pesagens_create", label: "Criar Pesagens" },
      { id: "pesagens_edit", label: "Editar Pesagens" },
      { id: "pesagens_delete", label: "Excluir Pesagens" },
    ],
  },
  {
    name: "Coletas",
    permissions: [
      { id: "coletas_view", label: "Visualizar Coletas" },
      { id: "coletas_create", label: "Criar Coletas" },
      { id: "coletas_edit", label: "Editar Coletas" },
      { id: "coletas_delete", label: "Excluir Coletas" },
    ],
  },
  {
    name: "Motoristas",
    permissions: [
      { id: "motoristas_view", label: "Visualizar Motoristas" },
      { id: "motoristas_create", label: "Criar Motoristas" },
      { id: "motoristas_edit", label: "Editar Motoristas" },
      { id: "motoristas_delete", label: "Excluir Motoristas" },
    ],
  },
  {
    name: "Caminhões",
    permissions: [
      { id: "caminhoes_view", label: "Visualizar Caminhões" },
      { id: "caminhoes_create", label: "Criar Caminhões" },
      { id: "caminhoes_edit", label: "Editar Caminhões" },
      { id: "caminhoes_delete", label: "Excluir Caminhões" },
    ],
  },
  {
    name: "Produtos",
    permissions: [
      { id: "produtos_view", label: "Visualizar Produtos" },
      { id: "produtos_create", label: "Criar Produtos" },
      { id: "produtos_edit", label: "Editar Produtos" },
      { id: "produtos_delete", label: "Excluir Produtos" },
    ],
  },
  {
    name: "Fornecedores",
    permissions: [
      { id: "fornecedores_view", label: "Visualizar Fornecedores" },
      { id: "fornecedores_create", label: "Criar Fornecedores" },
      { id: "fornecedores_edit", label: "Editar Fornecedores" },
      { id: "fornecedores_delete", label: "Excluir Fornecedores" },
    ],
  },
  {
    name: "Clientes",
    permissions: [
      { id: "clientes_view", label: "Visualizar Clientes" },
      { id: "clientes_create", label: "Criar Clientes" },
      { id: "clientes_edit", label: "Editar Clientes" },
      { id: "clientes_delete", label: "Excluir Clientes" },
    ],
  },
  {
    name: "Relatórios",
    permissions: [
      { id: "relatorios_view", label: "Visualizar Relatórios" },
      { id: "relatorios_export", label: "Exportar Relatórios" },
    ],
  },
  {
    name: "Administração",
    permissions: [
      { id: "admin_users", label: "Gerenciar Usuários" },
      { id: "admin_config", label: "Configurações do Sistema" },
    ],
  },
]

export default function UsuariosPage() {
  const { users, addUser, updateUser, deleteUser, hasPermission, updateUserPermissions } = useAuth()
  const { toast } = useToast()

  // Verificar permissão para acessar esta página
  useEffect(() => {
    if (!hasPermission("admin_users")) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      })
    }
  }, [hasPermission, toast])

  // Estado para o formulário
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contato: "",
    cpf: "",
    cep: "",
    role: UserProfiles.OPERATOR,
    senha: "",
    nome: "",
    endereco: "",
  })

  // Estado para controlar edição
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("info")
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])

  // Função para lidar com mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Adicione esta função para lidar com campos que não precisam ser alterados
  const handleNoChange = () => {
    // Função vazia para campos que são somente leitura mas precisam de um onChange
  }

  // Função para lidar com mudanças em selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Se o perfil mudar, atualizar as permissões para o padrão desse perfil
    if (name === "role") {
      setSelectedPermissions(DefaultPermissions[value] || [])
    }
  }

  // Função para adicionar ou atualizar usuário
  const handleSubmit = () => {
    if (editingId) {
      // Atualizar usuário existente
      updateUser(editingId, {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        permissions: selectedPermissions,
        nome: formData.nome,
        contato: formData.contato,
        cpf: formData.cpf,
        endereco: formData.endereco,
      })
      toast({
        title: "Usuário atualizado",
        description: "O usuário foi atualizado com sucesso.",
      })
    } else {
      // Adicionar novo usuário
      addUser({
        username: formData.username,
        email: formData.email,
        role: formData.role,
        permissions: selectedPermissions,
        nome: formData.nome,
        contato: formData.contato,
        cpf: formData.cpf,
        endereco: formData.endereco,
      })
      toast({
        title: "Usuário adicionado",
        description: "O novo usuário foi adicionado com sucesso.",
      })
    }

    // Resetar formulário e fechar diálogo
    resetForm()
    setIsDialogOpen(false)
  }

  // Função para excluir usuário
  const handleDelete = (id: number) => {
    if (id === 1) {
      toast({
        title: "Operação não permitida",
        description: "Não é possível excluir o usuário administrador principal.",
        variant: "destructive",
      })
      return
    }

    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      const success = deleteUser(id)
      if (success) {
        toast({
          title: "Usuário excluído",
          description: "O usuário foi removido com sucesso.",
        })
      } else {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir este usuário.",
          variant: "destructive",
        })
      }
    }
  }

  // Função para editar usuário
  const handleEdit = (user: any) => {
    setFormData({
      username: user.username,
      email: user.email,
      contato: user.contato || "",
      cpf: user.cpf || "",
      cep: "",
      role: user.role,
      senha: "", // Não preenchemos a senha ao editar
      nome: user.nome || "",
      endereco: user.endereco || "",
    })
    setSelectedPermissions(user.permissions || [])
    setEditingId(user.id)
    setIsDialogOpen(true)
    setActiveTab("info")
  }

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      contato: "",
      cpf: "",
      cep: "",
      role: UserProfiles.OPERATOR,
      senha: "",
      nome: "",
      endereco: "",
    })
    setSelectedPermissions(DefaultPermissions[UserProfiles.OPERATOR] || [])
    setEditingId(null)
    setActiveTab("info")
  }

  // Função para lidar com mudanças nas permissões
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions((prev) => [...prev, permissionId as Permission])
    } else {
      setSelectedPermissions((prev) => prev.filter((p) => p !== permissionId))
    }

    // Se as permissões forem alteradas manualmente, mudar o perfil para personalizado
    setFormData((prev) => ({
      ...prev,
      role: UserProfiles.CUSTOM,
    }))
  }

  // Filtrar usuários com base no termo de pesquisa
  const filteredUsuarios = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Verificar se o usuário atual tem permissão para acessar esta página
  if (!hasPermission("admin_users")) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Você não tem permissão para acessar esta página. Entre em contato com um administrador se acredita que isso é
          um erro.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007846] hover:bg-[#006038]">
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Edite as informações do usuário e clique em salvar quando terminar."
                  : "Preencha as informações do usuário e clique em salvar quando terminar."}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Informações Básicas</TabsTrigger>
                <TabsTrigger value="permissions">Permissões</TabsTrigger>
              </TabsList>

              <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                <TabsContent value="info" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nome de Usuário
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nome de usuário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@exemplo.com"
                        type="email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha" className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Senha
                      </Label>
                      <Input
                        id="senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder={editingId ? "Deixe em branco para manter a atual" : "Digite a senha"}
                        type="password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Perfil
                      </Label>
                      <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserProfiles.ADMIN}>Administrador</SelectItem>
                          <SelectItem value={UserProfiles.MANAGER}>Gerente</SelectItem>
                          <SelectItem value={UserProfiles.OPERATOR}>Operador</SelectItem>
                          <SelectItem value={UserProfiles.CUSTOM}>Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nome" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nome Completo
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Nome completo do usuário"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contato" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contato
                      </Label>
                      <Input
                        id="contato"
                        name="contato"
                        value={formData.contato}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        CPF
                      </Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço
                    </Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Endereço completo"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="py-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Permissões do Usuário</h3>
                      <div className="text-sm text-muted-foreground">
                        Perfil: <span className="font-medium">{formData.role}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {permissionGroups.map((group) => (
                        <div key={group.name} className="space-y-2 border rounded-md p-3">
                          <h4 className="font-medium text-[#1e366a]">{group.name}</h4>
                          <div className="space-y-2">
                            {group.permissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={permission.id}
                                  checked={selectedPermissions.includes(permission.id as Permission)}
                                  onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                                />
                                <Label htmlFor={permission.id} className="text-sm">
                                  {permission.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm()
                  setIsDialogOpen(false)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="bg-[#007846] hover:bg-[#006038]">
                {editingId ? "Atualizar" : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Visualize, edite ou exclua os usuários do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por usuário, email ou cargo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1e366a] flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        {usuario.username}
                      </div>
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.contato || "-"}</TableCell>
                    <TableCell>
                      <div
                        className={`rounded-full px-2 py-1 text-xs inline-block
                        ${
                          usuario.role === UserProfiles.ADMIN
                            ? "bg-[#007846]/10 text-[#007846]"
                            : usuario.role === UserProfiles.MANAGER
                              ? "bg-[#1e366a]/10 text-[#1e366a]"
                              : usuario.role === UserProfiles.CUSTOM
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {usuario.role === UserProfiles.ADMIN && <ShieldCheck className="h-3 w-3" />}
                          {usuario.role === UserProfiles.MANAGER && <UserCog className="h-3 w-3" />}
                          {usuario.role === UserProfiles.OPERATOR && <User className="h-3 w-3" />}
                          {usuario.role === UserProfiles.CUSTOM && <User className="h-3 w-3" />}
                          {usuario.role}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(usuario)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(usuario.id)}
                          disabled={usuario.id === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

