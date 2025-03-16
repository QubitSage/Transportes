"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  TruckIcon,
  Users,
  Package,
  Building2,
  FileText,
  Settings,
  ChevronRight,
  ChevronDown,
  UserPlus,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  href: string
  isActive?: boolean
  isSubmenu?: boolean
  isOpen?: boolean
  onClick?: (e: React.MouseEvent) => void
  children?: React.ReactNode
  requiredPermission?: string
}

function SidebarItem({
  icon,
  title,
  href,
  isActive,
  isSubmenu,
  isOpen,
  onClick,
  children,
  requiredPermission,
}: SidebarItemProps) {
  const { hasPermission } = useAuth()

  // Se uma permissão for necessária e o usuário não a tiver, não renderizar o item
  if (requiredPermission && !hasPermission(requiredPermission as any)) {
    return null
  }

  return (
    <div>
      {children ? (
        // Item com submenu
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all cursor-pointer",
            isActive ? "bg-[#007846] text-white" : "text-muted-foreground hover:bg-[#007846]/10 hover:text-[#007846]",
            isSubmenu && "pl-10",
          )}
          onClick={onClick}
        >
          {icon}
          <span className="flex-1">{title}</span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      ) : (
        // Item sem submenu
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
            isActive ? "bg-[#007846] text-white" : "text-muted-foreground hover:bg-[#007846]/10 hover:text-[#007846]",
            isSubmenu && "pl-10",
          )}
        >
          {icon}
          <span className="flex-1">{title}</span>
        </Link>
      )}

      {children && isOpen && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    cadastros: false,
    relatorios: false,
    admin: false,
  })

  const toggleMenu = (menu: string, e: React.MouseEvent) => {
    e.preventDefault()
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="hidden border-r bg-white lg:block lg:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <div className="space-y-1">
              <SidebarItem
                icon={<LayoutDashboard className="h-5 w-5" />}
                title="Dashboard"
                href="/dashboard"
                isActive={pathname === "/dashboard"}
                requiredPermission="dashboard_view"
              />

              <SidebarItem
                icon={<FileText className="h-5 w-5" />}
                title="Pesagens"
                href="/dashboard/pesagens"
                isActive={pathname === "/dashboard/pesagens" || pathname.startsWith("/dashboard/pesagens/")}
                requiredPermission="pesagens_view"
              />

              <SidebarItem
                icon={<FileText className="h-5 w-5" />}
                title="Coleta"
                href="/dashboard/coletas"
                isActive={pathname === "/dashboard/coletas" || pathname.startsWith("/dashboard/coletas/")}
                requiredPermission="coletas_view"
              />

              <SidebarItem
                icon={<Package className="h-5 w-5" />}
                title="Cadastros"
                href="#"
                isActive={pathname.includes("/dashboard/cadastros")}
                isOpen={openMenus.cadastros}
                onClick={(e) => toggleMenu("cadastros", e)}
              >
                <SidebarItem
                  icon={<Building2 className="h-4 w-4" />}
                  title="Fornecedores"
                  href="/dashboard/cadastros/fornecedores"
                  isActive={pathname === "/dashboard/cadastros/fornecedores"}
                  isSubmenu
                  requiredPermission="fornecedores_view"
                />
                <SidebarItem
                  icon={<Users className="h-4 w-4" />}
                  title="Motoristas"
                  href="/dashboard/cadastros/motoristas"
                  isActive={pathname === "/dashboard/cadastros/motoristas"}
                  isSubmenu
                  requiredPermission="motoristas_view"
                />
                <SidebarItem
                  icon={<TruckIcon className="h-4 w-4" />}
                  title="Caminhões"
                  href="/dashboard/cadastros/caminhoes"
                  isActive={pathname === "/dashboard/cadastros/caminhoes"}
                  isSubmenu
                  requiredPermission="caminhoes_view"
                />
                <SidebarItem
                  icon={<Package className="h-4 w-4" />}
                  title="Produtos"
                  href="/dashboard/cadastros/produtos"
                  isActive={pathname === "/dashboard/cadastros/produtos"}
                  isSubmenu
                  requiredPermission="produtos_view"
                />
                <SidebarItem
                  icon={<Building2 className="h-4 w-4" />}
                  title="Clientes"
                  href="/dashboard/cadastros/clientes"
                  isActive={pathname === "/dashboard/cadastros/clientes"}
                  isSubmenu
                  requiredPermission="clientes_view"
                />
              </SidebarItem>

              <SidebarItem
                icon={<FileText className="h-5 w-5" />}
                title="Relatórios"
                href="/dashboard/relatorios"
                isActive={pathname === "/dashboard/relatorios"}
                requiredPermission="relatorios_view"
              />

              <SidebarItem
                icon={<Settings className="h-5 w-5" />}
                title="Administração"
                href="#"
                isActive={pathname.includes("/dashboard/admin")}
                isOpen={openMenus.admin}
                onClick={(e) => toggleMenu("admin", e)}
              >
                <SidebarItem
                  icon={<UserPlus className="h-4 w-4" />}
                  title="Usuários"
                  href="/dashboard/admin/usuarios"
                  isActive={pathname === "/dashboard/admin/usuarios"}
                  isSubmenu
                  requiredPermission="admin_users"
                />
                <SidebarItem
                  icon={<Settings className="h-4 w-4" />}
                  title="Configurações"
                  href="/dashboard/admin/configuracoes"
                  isActive={pathname === "/dashboard/admin/configuracoes"}
                  isSubmenu
                  requiredPermission="admin_config"
                />
              </SidebarItem>
            </div>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-2 rounded-lg bg-[#1e366a]/10 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e366a]">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#1e366a]">Versão do Sistema</p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

