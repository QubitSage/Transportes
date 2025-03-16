import { format } from "date-fns"

interface PesagemTicketProps {
  pesagem: any
  compact?: boolean
}

export default function PesagemTicket({ pesagem, compact = false }: PesagemTicketProps) {
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
            <h2 className={`${headingSize} font-bold text-[#007846]`}>Ticket de Pesagem</h2>
            <p className="text-gray-500">#{pesagem.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Data de Emissão:</p>
            <p className={fontSize}>{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
          </div>
        </div>

        <div className={`grid grid-cols-2 ${gap}`}>
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className={`font-medium ${fontSize}`}>{pesagem.cliente}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data da Pesagem</p>
            <p className={`font-medium ${fontSize}`}>
              {pesagem.dataPesagem ? format(new Date(pesagem.dataPesagem), "dd/MM/yyyy") : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p
              className={`font-medium ${fontSize} ${
                pesagem.status === "Concluída"
                  ? "text-green-600"
                  : pesagem.status === "Pendente"
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {pesagem.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo de Material</p>
            <p className={`font-medium ${fontSize}`}>{pesagem.tipoMaterial}</p>
          </div>
        </div>

        <div>
          <h3 className={`${subheadingSize} font-semibold mb-2`}>Detalhes da Pesagem</h3>
          <div className={`grid grid-cols-2 ${gap}`}>
            <div>
              <p className="text-sm text-gray-500">Motorista</p>
              <p className={`font-medium ${fontSize}`}>{pesagem.motorista}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Placa do Veículo</p>
              <p className={`font-medium ${fontSize}`}>{pesagem.placaVeiculo}</p>
            </div>
          </div>

          <div className="mt-3">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left font-medium text-gray-500">Descrição</th>
                  <th className="border p-2 text-right font-medium text-gray-500">Peso (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Peso Bruto</td>
                  <td className="border p-2 text-right">{pesagem.pesoBruto}</td>
                </tr>
                <tr>
                  <td className="border p-2">Peso Tara</td>
                  <td className="border p-2 text-right">{pesagem.pesoTara}</td>
                </tr>
                <tr className="bg-gray-50 font-medium">
                  <td className="border p-2">Peso Líquido</td>
                  <td className="border p-2 text-right">{pesagem.pesoLiquido}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {pesagem.observacoes && (
          <div>
            <h3 className={`${subheadingSize} font-semibold mb-2`}>Observações</h3>
            <p className={`bg-gray-50 p-3 rounded-lg ${fontSize}`}>{pesagem.observacoes}</p>
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

