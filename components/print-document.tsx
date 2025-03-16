import React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PrintDocumentProps {
  data: any
  type?: "coleta" | "entrega" | "frete"
}

export const PrintDocument = React.forwardRef<HTMLDivElement, PrintDocumentProps>(({ data, type = "coleta" }, ref) => {
  if (!data) return null

  // Função para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch (e) {
      return dateString
    }
  }

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return "N/A"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div
      ref={ref}
      className="print-document bg-white p-4 w-full mx-auto landscape"
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "10pt",
        maxWidth: "297mm",
        minHeight: "210mm",
        boxSizing: "border-box",
      }}
    >
      {/* Cabeçalho */}
      <div className="border-b-2 border-black pb-2 mb-3">
        <table width="100%" cellPadding="0" cellSpacing="0" border="0">
          <tr>
            <td width="60%">
              <div style={{ fontSize: "18pt", fontWeight: "bold" }}>LOGÍSTICA EXPRESS</div>
              <div style={{ fontSize: "8pt" }}>
                CNPJ: 12.345.678/0001-90
                <br />
                Rua das Transportadoras, 123 - São Paulo - SP
                <br />
                Tel: (11) 3456-7890 | contato@logisticaexpress.com.br
              </div>
            </td>
            <td width="40%" style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "14pt",
                  fontWeight: "bold",
                  border: "2px solid black",
                  padding: "5px",
                  display: "inline-block",
                }}
              >
                {type === "coleta" ? "ORDEM DE COLETA" : type === "entrega" ? "ORDEM DE ENTREGA" : "ORDEM DE FRETE"}
                <br />
                Nº {data.id || "000000"}
              </div>
            </td>
          </tr>
        </table>
      </div>

      {/* Informações Básicas */}
      <table width="100%" cellPadding="3" cellSpacing="0" border="0" style={{ marginBottom: "10px" }}>
        <tr>
          <td width="25%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
            Data de Emissão:
          </td>
          <td width="25%" style={{ border: "1px solid #ddd" }}>
            {formatDate(data.dataEmissao || data.data_criacao || data.data)}
          </td>
          <td width="25%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
            Data Prevista:
          </td>
          <td width="25%" style={{ border: "1px solid #ddd" }}>
            {formatDate(data.dataPrevista || data.data_entrega || data.data_prevista)}
          </td>
        </tr>
        <tr>
          <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Status:</td>
          <td style={{ border: "1px solid #ddd" }}>{data.status || "Pendente"}</td>
          <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Tipo:</td>
          <td style={{ border: "1px solid #ddd" }}>{data.tipo || type.charAt(0).toUpperCase() + type.slice(1)}</td>
        </tr>
      </table>

      {/* Informações Específicas por Tipo */}
      {type === "coleta" && (
        <>
          <div
            style={{
              fontWeight: "bold",
              backgroundColor: "#007846",
              color: "white",
              padding: "3px 5px",
              marginBottom: "5px",
            }}
          >
            INFORMAÇÕES DA COLETA
          </div>
          <table width="100%" cellPadding="3" cellSpacing="0" border="0" style={{ marginBottom: "10px" }}>
            <tr>
              <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
                Remetente:
              </td>
              <td width="35%" style={{ border: "1px solid #ddd" }}>
                {data.remetente || data.cliente?.nome || "N/A"}
              </td>
              <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
                Destinatário:
              </td>
              <td width="35%" style={{ border: "1px solid #ddd" }}>
                {data.destinatario || "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Endereço:</td>
              <td style={{ border: "1px solid #ddd" }}>{data.enderecoColeta || data.endereco || "N/A"}</td>
              <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Cidade/UF:</td>
              <td style={{ border: "1px solid #ddd" }}>{data.cidadeColeta || data.cidade || "N/A"}</td>
            </tr>
          </table>
        </>
      )}

      {type === "entrega" && (
        <>
          <div
            style={{
              fontWeight: "bold",
              backgroundColor: "#007846",
              color: "white",
              padding: "3px 5px",
              marginBottom: "5px",
            }}
          >
            INFORMAÇÕES DA ENTREGA
          </div>
          <table width="100%" cellPadding="3" cellSpacing="0" border="0" style={{ marginBottom: "10px" }}>
            <tr>
              <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
                Destinatário:
              </td>
              <td width="35%" style={{ border: "1px solid #ddd" }}>
                {data.destinatario || data.nome || "N/A"}
              </td>
              <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
                Contato:
              </td>
              <td width="35%" style={{ border: "1px solid #ddd" }}>
                {data.contato || data.telefone || "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Endereço:</td>
              <td style={{ border: "1px solid #ddd" }}>{data.enderecoEntrega || data.endereco || "N/A"}</td>
              <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Cidade/UF:</td>
              <td style={{ border: "1px solid #ddd" }}>{data.cidadeEntrega || data.cidade || "N/A"}</td>
            </tr>
          </table>
        </>
      )}

      {type === "frete" && (
        <>
          <div
            style={{
              fontWeight: "bold",
              backgroundColor: "#007846",
              color: "white",
              padding: "3px 5px",
              marginBottom: "5px",
            }}
          >
            INFORMAÇÕES DO FRETE
          </div>
          <table width="100%" cellPadding="3" cellSpacing="0" border="0" style={{ marginBottom: "10px" }}>
            <tr>
              <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
                Origem:
              </td>
              <td width="35%" style={{ border: "1px solid #ddd" }}>
                {data.origem || data.remetente || "N/A"}
              </td>
              <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
                Destino:
              </td>
              <td width="35%" style={{ border: "1px solid #ddd" }}>
                {data.destino || data.destinatario || "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
                Distância (km):
              </td>
              <td style={{ border: "1px solid #ddd" }}>{data.distancia || "N/A"}</td>
              <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
                Valor do Frete:
              </td>
              <td style={{ border: "1px solid #ddd" }}>{formatCurrency(data.valor || data.valorFrete)}</td>
            </tr>
          </table>
        </>
      )}

      {/* Informações da Carga */}
      <div
        style={{
          fontWeight: "bold",
          backgroundColor: "#007846",
          color: "white",
          padding: "3px 5px",
          marginBottom: "5px",
        }}
      >
        INFORMAÇÕES DA CARGA
      </div>
      <table width="100%" cellPadding="3" cellSpacing="0" border="0" style={{ marginBottom: "10px" }}>
        <tr>
          <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
            Produto:
          </td>
          <td width="35%" style={{ border: "1px solid #ddd" }}>
            {data.produto || "N/A"}
          </td>
          <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
            Valor:
          </td>
          <td width="35%" style={{ border: "1px solid #ddd" }}>
            {formatCurrency(data.valor || data.valorFrete)}
          </td>
        </tr>
        <tr>
          <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Peso (kg):</td>
          <td style={{ border: "1px solid #ddd" }}>{data.peso || "N/A"}</td>
          <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Volume (m³):</td>
          <td style={{ border: "1px solid #ddd" }}>{data.volume || "N/A"}</td>
        </tr>
        <tr>
          <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Quantidade:</td>
          <td colSpan={3} style={{ border: "1px solid #ddd" }}>
            {data.quantidade || "N/A"}
          </td>
        </tr>
      </table>

      {/* Informações do Transporte */}
      <div
        style={{
          fontWeight: "bold",
          backgroundColor: "#007846",
          color: "white",
          padding: "3px 5px",
          marginBottom: "5px",
        }}
      >
        {type === "frete" ? "INFORMAÇÕES DO VEÍCULO" : "INFORMAÇÕES DO TRANSPORTE"}
      </div>
      <table width="100%" cellPadding="3" cellSpacing="0" border="0" style={{ marginBottom: "10px" }}>
        <tr>
          <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
            Motorista:
          </td>
          <td width="35%" style={{ border: "1px solid #ddd" }}>
            {data.motorista?.nome || data.motorista || "N/A"}
          </td>
          <td width="15%" style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>
            Contato:
          </td>
          <td width="35%" style={{ border: "1px solid #ddd" }}>
            {data.motorista?.telefone || data.telefone || "N/A"}
          </td>
        </tr>
        <tr>
          <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Veículo:</td>
          <td style={{ border: "1px solid #ddd" }}>{data.caminhao?.modelo || data.veiculo || "N/A"}</td>
          <td style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", border: "1px solid #ddd" }}>Placa:</td>
          <td style={{ border: "1px solid #ddd" }}>{data.caminhao?.placa || data.placa || "N/A"}</td>
        </tr>
      </table>

      {/* Observações */}
      <div
        style={{
          fontWeight: "bold",
          backgroundColor: "#007846",
          color: "white",
          padding: "3px 5px",
          marginBottom: "5px",
        }}
      >
        OBSERVAÇÕES
      </div>
      <table width="100%" cellPadding="3" cellSpacing="0" border="0" style={{ marginBottom: "15px" }}>
        <tr>
          <td style={{ border: "1px solid #ddd", height: "40px", verticalAlign: "top" }}>
            {data.observacoes || "Sem observações."}
          </td>
        </tr>
      </table>

      {/* Assinaturas */}
      <table width="100%" cellPadding="0" cellSpacing="0" border="0" style={{ marginTop: "20px" }}>
        <tr>
          <td width="45%" style={{ borderTop: "1px solid black", paddingTop: "3px", textAlign: "center" }}>
            Responsável
          </td>
          <td width="10%"></td>
          <td width="45%" style={{ borderTop: "1px solid black", paddingTop: "3px", textAlign: "center" }}>
            Motorista
          </td>
        </tr>
      </table>

      {/* Rodapé */}
      <div
        style={{
          fontSize: "8pt",
          textAlign: "center",
          marginTop: "15px",
          borderTop: "1px solid #ddd",
          paddingTop: "5px",
        }}
      >
        Este documento foi gerado pelo sistema Logística Express em{" "}
        {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
      </div>
    </div>
  )
})

PrintDocument.displayName = "PrintDocument"

