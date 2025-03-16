"use client"

import { Button } from "@/components/ui/button"
import { useAlert } from "@/contexts/alert-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

export function DemoAlert() {
  const { showAlert } = useAlert()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Demonstração de Alertas
        </CardTitle>
        <CardDescription>Teste os diferentes tipos de alertas do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
            onClick={() =>
              showAlert({
                message: "Operação concluída",
                description: "A ação foi realizada com sucesso.",
                type: "success",
                duration: 5000,
              })
            }
          >
            <CheckCircle className="h-4 w-4" />
            Alerta de Sucesso
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
            onClick={() =>
              showAlert({
                message: "Erro encontrado",
                description: "Não foi possível completar a operação.",
                type: "error",
                duration: 5000,
              })
            }
          >
            <AlertCircle className="h-4 w-4" />
            Alerta de Erro
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
            onClick={() =>
              showAlert({
                message: "Atenção necessária",
                description: "Verifique os dados antes de continuar.",
                type: "warning",
                duration: 5000,
              })
            }
          >
            <AlertTriangle className="h-4 w-4" />
            Alerta de Aviso
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() =>
              showAlert({
                message: "Informação importante",
                description: "Aqui está uma informação que você deve saber.",
                type: "info",
                duration: 5000,
              })
            }
          >
            <Info className="h-4 w-4" />
            Alerta Informativo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

