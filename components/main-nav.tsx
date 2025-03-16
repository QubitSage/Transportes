"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Truck, Scale, ClipboardList, FileText, Settings } from "lucide-react"

interface MainNavProps {
  className?: string
}

export default function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/coletas",
      label: "Coletas",
      icon: <Truck className="mr-2 h-4 w-4" />,
      active: pathname.includes("/dashboard/coletas"),
    },
    {
      href: "/dashboard/pesagens",
      label: "Pesagens",
      icon: <Scale className="mr-2 h-4 w-4" />,
      active: pathname.includes("/dashboard/pesagens"),
    },
    {
      href: "/dashboard/cadastros",
      label: "Cadastros",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
      active:
        pathname.includes("/dashboard/cadastros") ||
        pathname.includes("/dashboard/fornecedores") ||
        pathname.includes("/dashboard/caminhoes") ||
        pathname.includes("/dashboard/produtos") ||
        pathname.includes("/dashboard/clientes") ||
        pathname.includes("/dashboard/motoristas"),
    },
    {
      href: "/dashboard/relatorios",
      label: "Relatórios",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname.includes("/dashboard/relatorios"),
    },
    {
      href: "/dashboard/configuracoes",
      label: "Configurações",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname.includes("/dashboard/configuracoes"),
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-[#007846] font-semibold" : "text-muted-foreground",
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

