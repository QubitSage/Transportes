"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { ProximasColetas } from "@/components/dashboard/proximas-coletas"
import { ProdutosTransportados } from "@/components/dashboard/produtos-transportados"
import { ClientesAtendidos } from "@/components/dashboard/clientes-atendidos"
import { useEffect } from "react"
import { logUserAction } from "@/lib/logging"

export default function DashboardPage() {
  // Log dashboard view on mount
  useEffect(() => {
    logUserAction({
      action: "view",
      resource: "system",
      details: "Visualização do dashboard",
    })
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[#1e366a]">Dashboard</h2>
      </div>
      <Tabs defaultValue="acesso-rapido" className="space-y-4">
        <TabsList>
          <TabsTrigger value="acesso-rapido">Acesso Rápido</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Análises
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Relatórios
          </TabsTrigger>
        </TabsList>
        <TabsContent value="acesso-rapido" className="space-y-4">
          <DashboardStats />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <RecentActivities />
            </div>

            <div className="col-span-3 grid gap-4">
              <ProximasColetas />
              <ProdutosTransportados />
              <ClientesAtendidos />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

