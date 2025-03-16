"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type Permission } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: Permission
  fallback?: ReactNode
}

export default function ProtectedRoute({ children, requiredPermission, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  // Se estiver carregando, mostrar indicador de carregamento
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!isAuthenticated) {
    return null
  }

  // Se uma permissão específica for necessária e o usuário não a tiver
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Se um fallback for fornecido, mostrar isso
    if (fallback) {
      return <>{fallback}</>
    }

    // Caso contrário, mostrar mensagem de acesso negado padrão
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

  // Se tudo estiver ok, renderizar o conteúdo
  return <>{children}</>
}

