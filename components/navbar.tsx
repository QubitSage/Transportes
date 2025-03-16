"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-xl font-bold">
            Sistema de Logística
          </Link>
          <div className="hidden md:flex space-x-4">
            <NavLink href="/dashboard" active={pathname === "/dashboard"}>
              Dashboard
            </NavLink>
            <NavLink href="/dashboard/coletas" active={pathname.startsWith("/dashboard/coletas")}>
              Coletas
            </NavLink>
            <NavLink href="/dashboard/entregas" active={pathname.startsWith("/dashboard/entregas")}>
              Entregas
            </NavLink>
            <NavLink href="/dashboard/fretes" active={pathname.startsWith("/dashboard/fretes")}>
              Fretes
            </NavLink>
            <NavLink href="/dashboard/fornecedores" active={pathname.startsWith("/dashboard/fornecedores")}>
              Fornecedores
            </NavLink>
            <NavLink href="/dashboard/caminhoes" active={pathname.startsWith("/dashboard/caminhoes")}>
              Caminhões
            </NavLink>
            <NavLink href="/dashboard/produtos" active={pathname.startsWith("/dashboard/produtos")}>
              Produtos
            </NavLink>
            <NavLink href="/dashboard/clientes" active={pathname.startsWith("/dashboard/clientes")}>
              Clientes
            </NavLink>
            <NavLink href="/dashboard/configuracoes" active={pathname.startsWith("/dashboard/configuracoes")}>
              Configurações
            </NavLink>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline">{user.name}</span>
          <Button variant="outline" className="text-white border-white hover:bg-green-700" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`${active ? "font-bold" : "hover:underline"}`}>
      {children}
    </Link>
  )
}

