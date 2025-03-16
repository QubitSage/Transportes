"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { toast } from "@/hooks/use-toast"
import { MoreHorizontal, Plus, Search } from "lucide-react"

// Dados de exemplo para usuários
const usuariosIniciais = [
  {
    id: 1,
    nome: "Administrador",
    email: "admin@ruralfertil.com.br",
    cargo: "Gerente",
    perfil: "Administrador",
    ativo: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nome: "João Silva",
    email: "joao@ruralfertil.com.br",
    cargo: "Operador",
    perfil: "Operador",
    ativo: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nome: "Maria Oliveira",
    email: "maria@ruralfertil.com.br",
    cargo: "Recepcionista",
    perfil: "Básico",
    ativo: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais)
  const [busca, setBusca] = useState("")
  const [novoUsuarioDialogOpen, setNovoUsuarioDialogOpen] = useState(false)
  const [editarUsuarioDialogOpen, setEditarUsuarioDialogOpen] = useState(false)
  const [excluirUsuarioDialogOpen, setExcluirUsuarioDialogOpen] = useState(false)
  const [usuarioAtual, setUsuarioAtual] = useState<any>(null)
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    cargo: "",
    perfil: "",
    senha: "",
    confirmarSenha: "",
  })

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

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
        <Dialog open={novoUsuarioDialogOpen} onOpenChange={setNovoUsuarioDialogOpen}>
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Gerencie os usuários do sistema, seus perfis e permissões.</CardDescription>
          <div className="flex items-center mt-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, cargo ou perfil..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

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
    </div>
  )
}

