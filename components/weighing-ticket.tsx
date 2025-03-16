import Image from "next/image"
import { format, parseISO, isValid } from "date-fns"

interface WeighingTicketProps {
  ticketNumber: number
  dateTimeInitial: string
  dateTimeFinal: string
  client: {
    name: string
    address: string
  }
  driver: {
    name: string
    plate: string
  }
  weights: {
    tara: number
    gross: number
    net: number
  }
  product: {
    name: string
    quantity: number
  }
  observations?: string
}

export function WeighingTicket({
  ticketNumber,
  dateTimeInitial,
  dateTimeFinal,
  client,
  driver,
  weights,
  product,
  observations,
}: WeighingTicketProps) {
  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    try {
      // First, try to parse the date string as is
      let date = parseISO(dateString)

      // If the parsed date is invalid, try adding a time component
      if (!isValid(date)) {
        date = parseISO(`${dateString}T00:00:00`)
      }

      // If it's still invalid, return a placeholder
      if (!isValid(date)) {
        return "Data não disponível"
      }

      return format(date, "dd/MM/yyyy HH:mm:ss")
    } catch (error) {
      console.error("Error parsing date:", error)
      return "Data não disponível"
    }
  }

  return (
    <div className="bg-white p-8 w-full max-w-[800px] mx-auto">
      <div className="border border-black p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt="Rural Fértil Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div className="text-xs">
              <div className="font-bold">RURAL FÉRTIL AGRONEGÓCIOS</div>
              <div>ROD. AM 070 KM65, S/N - DISTRITO</div>
              <div>MANACAPURU/AM CNPJ: 09.041.790/0004-70</div>
            </div>
          </div>
          <div className="text-center border-l border-black pl-4 min-w-[200px]">
            <div className="font-bold text-lg">TICKET DE PESAGEM</div>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div className="text-right">Número:</div>
              <div className="font-bold">{ticketNumber}</div>
              <div className="text-right">Data/Hora Inicial:</div>
              <div>{formatDate(dateTimeInitial)}</div>
              <div className="text-right">Data/Hora Final:</div>
              <div>{formatDate(dateTimeFinal)}</div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-[auto,100px] gap-4 mb-4">
          <div className="border border-black p-2">
            <div className="font-bold mb-1">Cliente:</div>
            <div>{client.name}</div>
            <div className="text-sm">Endereço:</div>
            <div className="text-sm">{client.address}</div>
          </div>
          <div className="space-y-2">
            <div className="border border-black p-2">
              <div className="text-sm">Tara:</div>
              <div className="font-bold">{weights.tara.toLocaleString()} kg</div>
            </div>
            <div className="border border-black p-2">
              <div className="text-sm">Bruto:</div>
              <div className="font-bold">{weights.gross.toLocaleString()} kg</div>
            </div>
            <div className="border border-black p-2">
              <div className="text-sm">Líquido:</div>
              <div className="font-bold">{weights.net.toLocaleString()} kg</div>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-black p-2">
            <div className="font-bold">Motorista:</div>
            <div>{driver.name}</div>
          </div>
          <div className="border border-black p-2">
            <div className="font-bold">Placa:</div>
            <div>{driver.plate}</div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <div className="grid grid-cols-[1fr,auto] border border-black">
            <div className="p-2 border-r border-black font-bold">Produto</div>
            <div className="p-2 font-bold text-center min-w-[200px]">Quantidade</div>
            <div className="p-2 border-t border-r border-black">{product.name}</div>
            <div className="p-2 border-t border-black text-center">{product.quantity.toLocaleString()} TON</div>
          </div>
        </div>

        {/* Observations */}
        {observations && (
          <div className="mb-4">
            <div className="border border-black p-2">
              <div className="font-bold">Observações:</div>
              <div className="text-sm">{observations}</div>
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border-t border-black pt-2">
            <div className="text-center">Assinatura Expedição</div>
          </div>
          <div className="border-t border-black pt-2">
            <div className="text-center">Assinatura Motorista</div>
          </div>
        </div>

        {/* Store Copy Stamp */}
        <div className="absolute top-4 right-4 transform rotate-12">
          <div className="border-2 border-red-600 text-red-600 px-4 py-1 text-lg font-bold">Via da Loja</div>
        </div>
      </div>
    </div>
  )
}

