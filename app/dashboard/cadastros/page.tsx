"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Users, Package, User, Building, Settings } from "lucide-react"
import Link from "next/link"

export default function CadastrosPage() {
  const cadastros = [
    {
      title: "Fornecedores",
      description: "Gerenciar cadastro de fornecedores",
      icon: <Building className="h-10 w-10 text-[#007846]" />,
      href: "/dashboard/fornecedores",
    },
    {
      title: "Caminhões",
      description: "Gerenciar cadastro de caminhões",
      icon: <Truck className="h-10 w-10 text-[#007846]" />,
      href: "/dashboard/caminhoes",
    },
    {
      title: "Clientes",
      description: "Gerenciar cadastro de clientes",
      icon: <Users className="h-10 w-10 text-[#007846]" />,
      href: "/dashboard/clientes",
    },
    {
      title: "Motoristas",
      description: "Gerenciar cadastro de motoristas",
      icon: <User className="h-10 w-10 text-[#007846]" />,
      href: "/dashboard/motoristas",
    },
    {
      title: "Produtos",
      description: "Gerenciar cadastro de produtos",
      icon: <Package className="h-10 w-10 text-[#007846]" />,
      href: "/dashboard/produtos",
    },
    {
      title: "Configurações",
      description: "Configurações do sistema",
      icon: <Settings className="h-10 w-10 text-[#007846]" />,
      href: "/dashboard/configuracoes",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Cadastros</h1>
        <p className="text-muted-foreground">Gerencie os cadastros do sistema</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cadastros.map((cadastro, index) => (
          <Link href={cadastro.href} key={index} className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-[#007846]/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{cadastro.title}</CardTitle>
                <CardDescription>{cadastro.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pt-4">{cadastro.icon}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

