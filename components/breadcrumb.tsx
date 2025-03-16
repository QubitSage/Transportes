"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumb() {
  const pathname = usePathname()

  if (pathname === "/dashboard") {
    return null
  }

  const pathSegments = pathname.split("/").filter(Boolean)

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`

    let label = segment.charAt(0).toUpperCase() + segment.slice(1)

    // Custom labels for specific segments
    switch (segment) {
      case "dashboard":
        label = "Dashboard"
        break
      case "coletas":
        label = "Coletas"
        break
      case "pesagens":
        label = "Pesagens"
        break
      case "cadastros":
        label = "Cadastros"
        break
      case "fornecedores":
        label = "Fornecedores"
        break
      case "caminhoes":
        label = "Caminhões"
        break
      case "produtos":
        label = "Produtos"
        break
      case "clientes":
        label = "Clientes"
        break
      case "motoristas":
        label = "Motoristas"
        break
      case "relatorios":
        label = "Relatórios"
        break
      case "configuracoes":
        label = "Configurações"
        break
      case "novo":
        label = "Novo"
        break
      case "editar":
        label = "Editar"
        break
    }

    return {
      href,
      label,
      isCurrent: index === pathSegments.length - 1,
    }
  })

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-6">
      <Link href="/dashboard" className="flex items-center hover:text-primary">
        <Home className="h-4 w-4 mr-1" />
        <span className="sr-only sm:not-sr-only">Home</span>
      </Link>

      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.isCurrent ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

