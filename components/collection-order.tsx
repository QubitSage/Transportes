import Image from "next/image"
import { format, parseISO, isValid } from "date-fns"

interface CollectionOrderProps {
  orderNumber: string
  branchInfo: {
    name: string
    address: string
    cnpj: string
  }
  orderInfo: {
    requestDate: string
    scheduledDate: string
    type: string
    status?: "Cancelada" | "Ativa"
  }
  sender: {
    name: string
    cnpj: string
    address: string
    neighborhood: string
    city: string
    state: string
    reference?: string
    contact?: string
    phone?: string
  }
  recipient: {
    name: string
    cnpj: string
    address: string
    neighborhood: string
    city: string
    state: string
  }
  shipping: {
    freightType: string
    vehicleType: string
    product: string
    combinedValue: number
    orderNumber?: string
    loadNumber?: string
  }
  observations?: string
  billingOnly?: boolean
}

export function CollectionOrder({
  orderNumber,
  branchInfo,
  orderInfo,
  sender,
  recipient,
  shipping,
  observations,
  billingOnly,
}: CollectionOrderProps) {
  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    try {
      let date = parseISO(dateString)
      if (!isValid(date)) {
        date = parseISO(`${dateString}T00:00:00`)
      }
      if (!isValid(date)) {
        return "Data não disponível"
      }
      return format(date, "dd/MM/yyyy")
    } catch (error) {
      console.error("Error parsing date:", error)
      return "Data não disponível"
    }
  }

  return (
    <div className="bg-white p-8 w-full max-w-[800px] mx-auto">
      <div className="border border-black p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt="Company Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div className="text-xs">
              <div className="font-bold">{branchInfo.name}</div>
              <div>{branchInfo.address}</div>
              <div>CNPJ: {branchInfo.cnpj}</div>
            </div>
          </div>
          <div className="text-center border-l border-black pl-4 min-w-[200px]">
            <div className="font-bold text-lg">ORDEM DE COLETA</div>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div className="text-right">Número:</div>
              <div className="font-bold">{orderNumber}</div>
              <div className="text-right">Tipo:</div>
              <div>{orderInfo.type}</div>
              {orderInfo.status && (
                <>
                  <div className="text-right">Status:</div>
                  <div className={orderInfo.status === "Cancelada" ? "text-red-600 font-bold" : ""}>
                    {orderInfo.status}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="border border-black p-2">
            <div className="font-bold">Data da Solicitação:</div>
            <div>{formatDate(orderInfo.requestDate)}</div>
          </div>
          <div className="border border-black p-2">
            <div className="font-bold">Previsão:</div>
            <div>{formatDate(orderInfo.scheduledDate)}</div>
          </div>
          <div className="border border-black p-2">
            <div className="font-bold">Programada Para:</div>
            <div>{formatDate(orderInfo.scheduledDate)}</div>
          </div>
        </div>

        {/* Sender Info */}
        <div className="mb-4">
          <div className="font-bold bg-gray-200 p-2 mb-2">Remetente</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="font-bold">Razão Social:</span>
                <span>{sender.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">CNPJ:</span>
                <span>{sender.cnpj}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Endereço:</span>
                <span>{sender.address}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="font-bold">Bairro:</span>
                <span>{sender.neighborhood}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Cidade:</span>
                <span>{sender.city}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Estado:</span>
                <span>{sender.state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Info */}
        <div className="mb-4">
          <div className="font-bold bg-gray-200 p-2 mb-2">Destinatário</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="font-bold">Razão Social:</span>
                <span>{recipient.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">CNPJ:</span>
                <span>{recipient.cnpj}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Endereço:</span>
                <span>{recipient.address}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="font-bold">Bairro:</span>
                <span>{recipient.neighborhood}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Cidade:</span>
                <span>{recipient.city}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Estado:</span>
                <span>{recipient.state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="mb-4">
          <div className="font-bold bg-gray-200 p-2 mb-2">Tabela de preço</div>
          <div className="grid grid-cols-4 gap-4">
            <div className="border border-black p-2">
              <div className="font-bold text-sm">Tipo Frete:</div>
              <div>{shipping.freightType}</div>
            </div>
            <div className="border border-black p-2">
              <div className="font-bold text-sm">Tipo Veículo:</div>
              <div>{shipping.vehicleType}</div>
            </div>
            <div className="border border-black p-2">
              <div className="font-bold text-sm">Produto/Operação:</div>
              <div>{shipping.product}</div>
            </div>
            <div className="border border-black p-2">
              <div className="font-bold text-sm">Valor Combinado:</div>
              <div>R$ {shipping.combinedValue.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Observations */}
        {observations && (
          <div className="mb-4">
            <div className="font-bold bg-gray-200 p-2 mb-2">Outras Informações</div>
            <div className="border border-black p-2">
              <div className="text-sm">{observations}</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div className="border-t border-black pt-2">
            <div className="text-center text-sm">Assinatura do Responsável</div>
          </div>
          <div className="border-t border-black pt-2">
            <div className="text-center text-sm">Assinatura do Motorista</div>
          </div>
        </div>

        {/* Billing Only Stamp */}
        {billingOnly && (
          <div className="absolute top-4 right-4 transform rotate-12">
            <div className="border-2 border-red-600 text-red-600 px-4 py-1 text-lg font-bold">Apenas para cobrança</div>
          </div>
        )}
      </div>
    </div>
  )
}

