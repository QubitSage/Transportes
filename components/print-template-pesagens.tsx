"use client"

import type React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Tipo para os dados de pesagem
type Pesagem = {
  id: string
  data: Date
  placa: string
  motorista: string
  produto: string
  fornecedor: string
  pesoEntrada: number
  pesoSaida: number
  pesoLiquido: number
  status: "concluido" | "pendente" | "cancelado"
}

interface PrintTemplatePesagensProps {
  pesagens: Pesagem[]
  filtros?: {
    dataInicio?: Date
    dataFim?: Date
    produto?: string
    fornecedor?: string
    status?: string
  }
}

const PrintTemplatePesagens: React.FC<PrintTemplatePesagensProps> = ({ pesagens, filtros }) => {
  // Formatar data para exibição
  const formatarData = (data: Date) => {
    return format(data, "dd/MM/yyyy HH:mm", { locale: ptBR })
  }

  // Formatar peso para exibição
  const formatarPeso = (peso: number) => {
    return peso.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Obter data e hora atual
  const dataHoraAtual = format(new Date(), "dd/MM/yyyy HH:mm:ss", {
    locale: ptBR,
  })

  return (
    <div className="print-container p-8 max-w-full">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatório de Pesagens</h1>
          <p className="text-sm text-gray-600">Gerado em: {dataHoraAtual}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Sistema de Logística</h2>
          <p className="text-sm text-gray-600">Módulo de Pesagens</p>
        </div>
      </div>

      {/* Filtros aplicados */}
      {filtros && (
        <div className="mb-6 p-3 bg-gray-100 rounded-md">
          <h3 className="font-semibold mb-2">Filtros aplicados:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {filtros.dataInicio && (
              <div>
                <span className="font-medium">Data início:</span>{" "}
                {format(filtros.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
              </div>
            )}
            {filtros.dataFim && (
              <div>
                <span className="font-medium">Data fim:</span> {format(filtros.dataFim, "dd/MM/yyyy", { locale: ptBR })}
              </div>
            )}
            {filtros.produto && (
              <div>
                <span className="font-medium">Produto:</span> {filtros.produto}
              </div>
            )}
            {filtros.fornecedor && (
              <div>
                <span className="font-medium">Fornecedor:</span> {filtros.fornecedor}
              </div>
            )}
            {filtros.status && (
              <div>
                <span className="font-medium">Status:</span> {filtros.status}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resumo */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="border rounded-md p-3 bg-blue-50">
          <h3 className="font-semibold">Total de registros</h3>
          <p className="text-2xl font-bold">{pesagens.length}</p>
        </div>
        <div className="border rounded-md p-3 bg-green-50">
          <h3 className="font-semibold">Peso total líquido</h3>
          <p className="text-2xl font-bold">
            {formatarPeso(pesagens.reduce((acc, pesagem) => acc + pesagem.pesoLiquido, 0))} kg
          </p>
        </div>
        <div className="border rounded-md p-3 bg-purple-50">
          <h3 className="font-semibold">Média por pesagem</h3>
          <p className="text-2xl font-bold">
            {formatarPeso(
              pesagens.length > 0
                ? pesagens.reduce((acc, pesagem) => acc + pesagem.pesoLiquido, 0) / pesagens.length
                : 0,
            )}{" "}
            kg
          </p>
        </div>
      </div>

      {/* Tabela de dados */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Data/Hora</th>
            <th className="border p-2 text-left">Placa</th>
            <th className="border p-2 text-left">Motorista</th>
            <th className="border p-2 text-left">Produto</th>
            <th className="border p-2 text-left">Fornecedor</th>
            <th className="border p-2 text-right">Peso Entrada (kg)</th>
            <th className="border p-2 text-right">Peso Saída (kg)</th>
            <th className="border p-2 text-right">Peso Líquido (kg)</th>
            <th className="border p-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {pesagens.map((pesagem) => (
            <tr key={pesagem.id} className="hover:bg-gray-50">
              <td className="border p-2">{formatarData(pesagem.data)}</td>
              <td className="border p-2">{pesagem.placa}</td>
              <td className="border p-2">{pesagem.motorista}</td>
              <td className="border p-2">{pesagem.produto}</td>
              <td className="border p-2">{pesagem.fornecedor}</td>
              <td className="border p-2 text-right">{formatarPeso(pesagem.pesoEntrada)}</td>
              <td className="border p-2 text-right">{formatarPeso(pesagem.pesoSaida)}</td>
              <td className="border p-2 text-right font-medium">{formatarPeso(pesagem.pesoLiquido)}</td>
              <td className="border p-2 text-center">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    pesagem.status === "concluido"
                      ? "bg-green-100 text-green-800"
                      : pesagem.status === "pendente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {pesagem.status === "concluido"
                    ? "Concluído"
                    : pesagem.status === "pendente"
                      ? "Pendente"
                      : "Cancelado"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-semibold">
            <td colSpan={5} className="border p-2 text-right">
              Total:
            </td>
            <td className="border p-2 text-right">
              {formatarPeso(pesagens.reduce((acc, pesagem) => acc + pesagem.pesoEntrada, 0))}
            </td>
            <td className="border p-2 text-right">
              {formatarPeso(pesagens.reduce((acc, pesagem) => acc + pesagem.pesoSaida, 0))}
            </td>
            <td className="border p-2 text-right">
              {formatarPeso(pesagens.reduce((acc, pesagem) => acc + pesagem.pesoLiquido, 0))}
            </td>
            <td className="border p-2"></td>
          </tr>
        </tfoot>
      </table>

      {/* Rodapé */}
      <div className="mt-8 text-sm text-gray-500 flex justify-between">
        <div>Página 1 de 1</div>
        <div>Sistema de Logística - Relatório de Pesagens</div>
      </div>

      {/* Estilos específicos para impressão */}
      <style jsx>{`
        @media print {
          body {
            font-size: 12pt;
            color: black;
          }
          
          .print-container {
            width: 100%;
            margin: 0;
            padding: 10mm;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>
    </div>
  )
}

export default PrintTemplatePesagens

