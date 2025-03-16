import { format } from "date-fns"

interface ColetaTicketProps {
  coleta: any
  compact?: boolean
}

export default function ColetaTicket({ coleta, compact = false }: ColetaTicketProps) {
  const fontSize = compact ? "text-sm" : "text-base"
  const headingSize = compact ? "text-lg" : "text-2xl"
  const subheadingSize = compact ? "text-base" : "text-lg"
  const spacing = compact ? "space-y-4" : "space-y-6"
  const padding = compact ? "p-4" : "p-6"
  const gap = compact ? "gap-4" : "gap-6"

  return (
    <div className={`print-content bg-white ${padding} rounded-lg border max-w-full mx-auto`}>
      <div className={spacing}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className={`${headingSize} font-bold text-[#007846]`}>Comprovante de Coleta</h2>
            <p className="text-gray-500">#{coleta.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Data de Emissão:</p>
            <p className={fontSize}>{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
          </div>
        </div>

        <div className={`grid grid-cols-2 ${gap}`}>
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className={`font-medium ${fontSize}`}>{coleta.cliente}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data Agendada</p>
            <p className={`font-medium ${fontSize}`}>
              {coleta.dataAgendada ? format(new Date(coleta.dataAgendada), "dd/MM/yyyy") : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`text-blue-600 font-medium ${fontSize}`}>{coleta.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Endereço</p>
            <p className={`font-medium ${fontSize}`}>{coleta.endereco}</p>
          </div>
        </div>

        <div>
          <h3 className={`${subheadingSize} font-semibold mb-2`}>Detalhes da Coleta</h3>
          <div className={`grid grid-cols-2 ${gap}`}>
            <div>
              <p className="text-sm text-gray-500">Tipo de Resíduo</p>
              <p className={`font-medium ${fontSize}`}>{coleta.tipo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Responsável</p>
              <p className={`font-medium ${fontSize}`}>{coleta.responsavel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Motorista</p>
              <p className={`font-medium ${fontSize}`}>{coleta.motorista}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Placa do Veículo</p>
              <p className={`font-medium ${fontSize}`}>{coleta.placaVeiculo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Materiais</p>
              <p className={`font-medium ${fontSize}`}>{coleta.materiais}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantidade Estimada</p>
              <p className={`font-medium ${fontSize}`}>{coleta.quantidadeEstimada} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contato</p>
              <p className={`font-medium ${fontSize}`}>{coleta.contato}</p>
            </div>
          </div>
        </div>

        {coleta.observacoes && (
          <div>
            <h3 className={`${subheadingSize} font-semibold mb-2`}>Observações</h3>
            <p className={`bg-gray-50 p-3 rounded-lg ${fontSize}`}>{coleta.observacoes}</p>
          </div>
        )}

        <div className="flex justify-between pt-4 mt-4 border-t">
          <div>
            <p className="text-sm text-gray-500">Documento gerado em:</p>
            <p className={fontSize}>{format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">Assinatura do Responsável:</p>
            <div className="border-b border-gray-300 w-36"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

