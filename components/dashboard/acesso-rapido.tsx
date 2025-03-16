"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Truck, Weight, Users, FileText } from "lucide-react"

export function AcessoRapido() {
  const router = useRouter()

  const menuItems = [
    {
      title: "Coletas",
      icon: <Truck className="h-4 w-4" />,
      path: "/dashboard/coletas",
    },
    {
      title: "Pesagens",
      icon: <Weight className="h-4 w-4" />,
      path: "/dashboard/pesagens",
    },
    {
      title: "Cadastros",
      icon: <Users className="h-4 w-4" />,
      path: "/dashboard/cadastros",
    },
    {
      title: "Relatórios",
      icon: <FileText className="h-4 w-4" />,
      path: "/dashboard/relatorios",
    },
  ]

  return (
    <div className="bg-background rounded-md p-3 border">
      <h3 className="text-sm font-medium mb-2">Acesso Rápido</h3>
      <div className="flex space-x-2">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-auto flex items-center justify-center gap-1.5 py-1.5"
            onClick={() => router.push(item.path)}
          >
            <div className="text-primary">{item.icon}</div>
            <span className="text-xs font-medium">{item.title}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

