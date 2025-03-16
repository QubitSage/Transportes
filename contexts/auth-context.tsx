"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Definição de permissões disponíveis no sistema
export type Permission =
  | "dashboard_view"
  | "pesagens_view"
  | "pesagens_create"
  | "pesagens_edit"
  | "pesagens_delete"
  | "coletas_view"
  | "coletas_create"
  | "coletas_edit"
  | "coletas_delete"
  | "motoristas_view"
  | "motoristas_create"
  | "motoristas_edit"
  | "motoristas_delete"
  | "caminhoes_view"
  | "caminhoes_create"
  | "caminhoes_edit"
  | "caminhoes_delete"
  | "produtos_view"
  | "produtos_create"
  | "produtos_edit"
  | "produtos_delete"
  | "fornecedores_view"
  | "fornecedores_create"
  | "fornecedores_edit"
  | "fornecedores_delete"
  | "clientes_view"
  | "clientes_create"
  | "clientes_edit"
  | "clientes_delete"
  | "relatorios_view"
  | "relatorios_export"
  | "admin_users"
  | "admin_config"

// Definição de perfis pré-configurados
export const UserProfiles = {
  ADMIN: "Administrador",
  OPERATOR: "Operador",
  MANAGER: "Gerente",
  CUSTOM: "Personalizado",
}

// Permissões padrão para cada perfil
export const DefaultPermissions: Record<string, Permission[]> = {
  [UserProfiles.ADMIN]: [
    "dashboard_view",
    "pesagens_view",
    "pesagens_create",
    "pesagens_edit",
    "pesagens_delete",
    "coletas_view",
    "coletas_create",
    "coletas_edit",
    "coletas_delete",
    "motoristas_view",
    "motoristas_create",
    "motoristas_edit",
    "motoristas_delete",
    "caminhoes_view",
    "caminhoes_create",
    "caminhoes_edit",
    "caminhoes_delete",
    "produtos_view",
    "produtos_create",
    "produtos_edit",
    "produtos_delete",
    "fornecedores_view",
    "fornecedores_create",
    "fornecedores_edit",
    "fornecedores_delete",
    "clientes_view",
    "clientes_create",
    "clientes_edit",
    "clientes_delete",
    "relatorios_view",
    "relatorios_export",
    "admin_users",
    "admin_config",
  ],
  [UserProfiles.OPERATOR]: [
    "dashboard_view",
    "pesagens_view",
    "pesagens_create",
    "pesagens_edit",
    "coletas_view",
    "coletas_create",
    "motoristas_view",
    "caminhoes_view",
    "produtos_view",
    "fornecedores_view",
    "clientes_view",
    "relatorios_view",
  ],
  [UserProfiles.MANAGER]: [
    "dashboard_view",
    "pesagens_view",
    "pesagens_create",
    "pesagens_edit",
    "pesagens_delete",
    "coletas_view",
    "coletas_create",
    "coletas_edit",
    "coletas_delete",
    "motoristas_view",
    "motoristas_create",
    "motoristas_edit",
    "caminhoes_view",
    "caminhoes_create",
    "caminhoes_edit",
    "produtos_view",
    "produtos_create",
    "produtos_edit",
    "fornecedores_view",
    "fornecedores_create",
    "fornecedores_edit",
    "clientes_view",
    "clientes_create",
    "clientes_edit",
    "relatorios_view",
    "relatorios_export",
  ],
  [UserProfiles.CUSTOM]: [],
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission?: (permission: Permission) => boolean
  updateUserPermissions?: (userId: number, permissions: Permission[]) => void
  users?: User[]
  addUser?: (user: Omit<User, "id">) => void
  updateUser?: (id: number, userData: Partial<User>) => void
  deleteUser?: (id: number) => boolean
  getUserById?: (id: number) => User | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Lista inicial de usuários
const initialUsers: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@exemplo.com",
    role: "admin",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    // Verificar se o usuário está autenticado no localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulação de login - em produção, isso seria uma chamada de API
      if (email === "admin@exemplo.com" && password === "senha123") {
        const user = {
          id: "1",
          name: "Administrador",
          email: "admin@exemplo.com",
          role: "admin",
        }
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        setIsLoading(false)
        return true
      }
      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    // @ts-ignore
    return user.permissions.includes(permission)
  }

  const updateUserPermissions = (userId: number, permissions: Permission[]) => {
    setUsers((prevUsers) =>
      // @ts-ignore
      prevUsers.map((u) => (u.id === userId ? { ...u, permissions, role: UserProfiles.CUSTOM } : u)),
    )

    // Se o usuário logado for o que está sendo atualizado, atualizar também
    if (user && user.id === userId) {
      // @ts-ignore
      const updatedUser = { ...user, permissions, role: UserProfiles.CUSTOM }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const addUser = (userData: Omit<User, "id">) => {
    // @ts-ignore
    const newId = Math.max(0, ...users.map((u) => u.id)) + 1
    // @ts-ignore
    const newUser = { ...userData, id: newId }
    setUsers([...users, newUser])
  }

  const updateUser = (id: number, userData: Partial<User>) => {
    setUsers((prevUsers) => prevUsers.map((u) => (u.id === id ? { ...u, ...userData } : u)))

    // Se o usuário logado for o que está sendo atualizado, atualizar também
    if (user && user.id === id) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const deleteUser = (id: number): boolean => {
    // Não permitir excluir o usuário admin principal
    if (id === 1) return false

    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id))
    return true
  }

  const getUserById = (id: number): User | undefined => {
    return users.find((u) => u.id === id)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        updateUserPermissions,
        users,
        addUser,
        updateUser,
        deleteUser,
        getUserById,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

