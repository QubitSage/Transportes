"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock do usuário para demonstração
const mockUser: User = {
  id: 1,
  name: "Admin Sistema",
  email: "admin@sistema.com",
  role: "Administrador",
  permissions: ["usuarios_gerenciar", "perfis_gerenciar", "config_seguranca", "logs_visualizar", "admin_notifications"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula verificação de autenticação ao carregar
    const checkAuth = async () => {
      try {
        // Em um cenário real, verificaria um token no localStorage ou cookie
        // e faria uma requisição para validar o token no backend

        // Para demonstração, vamos apenas simular um usuário logado
        setUser(mockUser)
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Em um cenário real, faria uma requisição para o backend
      // e receberia um token de autenticação

      // Para demonstração, vamos apenas simular um login bem-sucedido
      if (email === "admin@sistema.com" && password === "senha123") {
        setUser(mockUser)
        return true
      }
      return false
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Em um cenário real, removeria o token do localStorage ou cookie
    setUser(null)
  }

  const hasPermission = (permission: string) => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

