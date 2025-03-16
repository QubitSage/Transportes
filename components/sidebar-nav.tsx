"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Truck,
  Scale,
  ClipboardList,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

interface SidebarNavProps {
  className?: string
}

export default function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const [cadastrosOpen, setCadastrosOpen] = useState(
    pathname.includes("/dashboard/cadastros") ||
      pathname.includes("/dashboard/fornecedores") ||
      pathname.includes("/dashboard/caminhoes") ||
      pathname.includes("/dashboard/produtos") ||
      pathname.includes("/dashboard/clientes") ||
      pathname.includes("/dashboard/motoristas"),
  )

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/coletas",
      label: "Coletas",
      icon: <Truck className="mr-2 h-5 w-5" />,
      active: pathname.includes("/dashboard/coletas"),
    },
    {
      href: "/dashboard/pesagens",
      label: "Pesagens",
      icon: <Scale className="mr-2 h-5 w-5" />,
      active: pathname.includes("/dashboard/pesagens"),
    },
    {
      href: "/dashboard/cadastros",
      label: "Cadastros",
      icon: <ClipboardList className="mr-2 h-5 w-5" />,
      active:
        pathname.includes("/dashboard/cadastros") ||
        pathname.includes("/dashboard/fornecedores") ||
        pathname.includes("/dashboard/caminhoes") ||
        pathname.includes("/dashboard/produtos") ||
        pathname.includes("/dashboard/clientes") ||
        pathname.includes("/dashboard/motoristas"),
      children: [
        {
          href: "/dashboard/fornecedores",
          label: "Fornecedores",
          active: pathname.includes("/dashboard/fornecedores"),
        },
        {
          href: "/dashboard/caminhoes",
          label: "Caminhões",
          active: pathname.includes("/dashboard/caminhoes"),
        },
        {
          href: "/dashboard/produtos",
          label: "Produtos",
          active: pathname.includes("/dashboard/produtos"),
        },
        {
          href: "/dashboard/clientes",
          label: "Clientes",
          active: pathname.includes("/dashboard/clientes"),
        },
        {
          href: "/dashboard/motoristas",
          label: "Motoristas",
          active: pathname.includes("/dashboard/motoristas"),
        },
      ],
    },
    {
      href: "/dashboard/relatorios",
      label: "Relatórios",
      icon: <FileText className="mr-2 h-5 w-5" />,
      active: pathname.includes("/dashboard/relatorios"),
    },
    {
      href: "/dashboard/configuracoes",
      label: "Configurações",
      icon: <Settings className="mr-2 h-5 w-5" />,
      active: pathname.includes("/dashboard/configuracoes"),
    },
  ]

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {routes.map((route) => (
        <div key={route.href} className="flex flex-col">
          {route.children ? (
            <>
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
                  route.active
                    ? "bg-[#007846]/10 text-[#007846]"
                    : "text-muted-foreground hover:bg-muted hover:text-primary",
                )}
                onClick={() => setCadastrosOpen(!cadastrosOpen)}
              >
                <div className="flex items-center">
                  {route.icon}
                  {route.label}
                </div>
                {cadastrosOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
              {cadastrosOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {route.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        child.active
                          ? "bg-[#007846]/10 text-[#007846]"
                          : "text-muted-foreground hover:bg-muted hover:text-primary",
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              href={route.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                route.active
                  ? "bg-[#007846]/10 text-[#007846]"
                  : "text-muted-foreground hover:bg-muted hover:text-primary",
              )}
            >
              {route.icon}
              {route.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

