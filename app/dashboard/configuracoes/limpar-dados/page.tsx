"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function LimparDadosPage() {
  const { clearAllData } = useData()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleClearData = () => {
    clearAllData()
    setIsDialogOpen(false)
    toast({
      title: "Dados removidos",
      description: "Todos os dados do sistema foram removidos com sucesso.",
    })
    
    // Redirecionar para o dashboard após limpar os dados
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Limpar Dados do Sistema</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Remover Todos os Dados</CardTitle>
          <CardDescription>
            Esta ação irá remover permanentemente todos os dados do sistema, incluindo fornecedores, clientes, produtos, caminhões e ordens de coleta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <h3 className="text-amber-800 font-medium mb-2">⚠️ Aviso Importante</h3>
            <p className="text-amber-700">
              Esta ação não pode ser desfeita. Todos os dados serão permanentemente removidos do sistema.
              Recomendamos fazer um backup dos dados antes de prosseguir.
            </p>
          </div>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Limpar Todos os Dados</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso removerá permanentemente todos os dados do sistema, incluindo:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Fornecedores</li>
                    <li>Clientes</li>
                    <li>Produtos</li>
                    <li>Caminhões</li>
                    <li>Ordens de Coleta</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData} className="bg-red-600 hover:bg-red-700">
                  Sim, limpar todos os dados
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Button variant="outline" onClick={() => router.back()}>
        Voltar
      </Button>
    </div>
  )
} 