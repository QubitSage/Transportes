"use client"

import { useSocketStore, type DeliveryInProgress } from "@/lib/socket"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Truck, MapPin, Package, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function DeliveriesInProgress() {
  const { deliveriesInProgress } = useSocketStore()
  const router = useRouter()

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "em trânsito":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "carregando":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "descarregando":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "aguardando":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Function to format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Entregas em Andamento</CardTitle>
            <CardDescription>Acompanhe as entregas em tempo real</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {deliveriesInProgress.length} ativa{deliveriesInProgress.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {deliveriesInProgress.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Truck className="h-12 w-12 mb-4 opacity-20" />
            <p>Nenhuma entrega em andamento no momento</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {deliveriesInProgress.map((delivery) => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  getStatusColor={getStatusColor}
                  formatTime={formatTime}
                  onViewDetails={() => router.push(`/dashboard/coletas/${delivery.id}`)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

interface DeliveryCardProps {
  delivery: DeliveryInProgress
  getStatusColor: (status: string) => string
  formatTime: (timestamp: string) => string
  onViewDetails: () => void
}

function DeliveryCard({ delivery, getStatusColor, formatTime, onViewDetails }: DeliveryCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusColor(delivery.status)}>
            {delivery.status}
          </Badge>
          <span className="text-sm text-muted-foreground">Atualizado às {formatTime(delivery.updatedAt)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewDetails}>
          Ver detalhes
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <h3 className="font-medium">{delivery.ticket}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            <span>{delivery.produto}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-sm">
            <User className="h-3.5 w-3.5" />
            <span>{delivery.motorista}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            <span>{delivery.placa}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <div className="flex items-start gap-1">
          <MapPin className="h-3.5 w-3.5 mt-0.5 text-green-600" />
          <div className="text-sm">
            <span className="font-medium">Origem:</span> {delivery.origem}
          </div>
        </div>
        <div className="flex items-start gap-1">
          <MapPin className="h-3.5 w-3.5 mt-0.5 text-red-600" />
          <div className="text-sm">
            <span className="font-medium">Destino:</span> {delivery.destino}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span>Progresso</span>
          <span>{delivery.progress}%</span>
        </div>
        <Progress value={delivery.progress} className="h-2" />
      </div>
    </div>
  )
}

