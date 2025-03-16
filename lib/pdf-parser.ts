// Esta é uma implementação simulada de um parser de PDF
// Em um ambiente real, você usaria uma biblioteca como pdf.js ou enviaria para o servidor processar

export interface FornecedorParsed {
  nome: string
  endereco: string
  bairro: string
  cidade: string
  contato: string
  cnpj: string
}

export async function parsePdfFornecedores(file: File): Promise<FornecedorParsed[]> {
  // Em um ambiente real, você usaria uma biblioteca como pdf.js
  // ou enviaria o arquivo para o servidor processar

  // Simulação de processamento
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dados simulados extraídos do PDF
      const fornecedores: FornecedorParsed[] = [
        {
          nome: "113 COMERCIO DE PECAS E ACESSORIOS PARA VEICULOS L",
          endereco: "ROD RSC-453 - 95058300",
          bairro: "ANA RECH",
          cidade: "CAXIAS DO SUL - RS",
          contato: "",
          cnpj: "00.092.323/0001-52",
        },
        {
          nome: "B AUTOTINTAS LTDA",
          endereco: "AV GLAYCON DE PAIVA - 69303340",
          bairro: "SAO VICENTE",
          cidade: "BOA VISTA - RR",
          contato: "",
          cnpj: "03.942.320/0001-59",
        },
        // Mais dados simulados...
      ]

      resolve(fornecedores)
    }, 2000)
  })
}

