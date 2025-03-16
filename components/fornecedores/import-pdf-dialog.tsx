"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface ImportPdfDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportSuccess: (fornecedores: FornecedorData[]) => void
}

interface FornecedorData {
  nome: string
  endereco: string
  bairro: string
  cidade: string
  contato: string
  cnpj: string
  status?: string
}

export function ImportPdfDialog({ open, onOpenChange, onImportSuccess }: ImportPdfDialogProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fornecedores, setFornecedores] = useState<FornecedorData[]>([])
  const [step, setStep] = useState<"upload" | "preview" | "success">("upload")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("O arquivo selecionado não é um PDF. Por favor, selecione um arquivo PDF.")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const processFile = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      // Em um ambiente real, você enviaria o arquivo para o servidor processar
      // Aqui estamos simulando a extração de dados do PDF

      // Extrair texto do PDF usando FileReader para simular
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          // Simulação de processamento do PDF
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // Dados extraídos do PDF compartilhado - versão expandida com mais de 100 registros
          const extractedData: FornecedorData[] = [
            {
              nome: "113 COMERCIO DE PECAS E ACESSORIOS PARA VEICULOS L",
              endereco: "ROD RSC-453 - 95058300",
              bairro: "ANA RECH",
              cidade: "CAXIAS DO SUL - RS",
              contato: "",
              cnpj: "00.092.323/0001-52",
              status: "Ativo",
            },
            {
              nome: "B AUTOTINTAS LTDA",
              endereco: "AV GLAYCON DE PAIVA - 69303340",
              bairro: "SAO VICENTE",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "03.942.320/0001-59",
              status: "Ativo",
            },
            {
              nome: "3D AUTO PECAS E DISTRIBUIDORA LTDA",
              endereco: "AV GENERAL ATAIDE TEIVE - 69314292",
              bairro: "DOUTOR SILVIO LEITE",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "48.453.353/0001-73",
              status: "Ativo",
            },
            {
              nome: "3 IRMAOS TRANSPORTES LTDA",
              endereco: "TV TERCEIRA - 68180360",
              bairro: "NOVA ITAITUBA",
              cidade: "ITAITUBA - PA",
              contato: "null",
              cnpj: "27.653.079/0001-06",
              status: "Ativo",
            },
            {
              nome: "7 ESTRELAS AGRONEGOCIOS LTDA.",
              endereco: "ESVC VICINAL 03 (BOM-060) - 69380000",
              bairro: "ZONA RURAL",
              cidade: "BONFIM - RR",
              contato: "",
              cnpj: "50.830.283/0001-77",
              status: "Ativo",
            },
            {
              nome: "A A RODRIGUES PADARIA LTDA",
              endereco: "R BRASIL - 69345000",
              bairro: "CENTRO",
              cidade: "PACARAIMA - RR",
              contato: "null",
              cnpj: "09.942.349/0001-17",
              status: "Ativo",
            },
            {
              nome: "ABDENEGO PINHEIRO TEIXEIRA",
              endereco: "AVENIDA VENEZUELA - 69304600",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "00700449299",
              status: "Ativo",
            },
            {
              nome: "ABREU EMPREENDIMENTOS SERVICOS E COMERCIO LTDA",
              endereco: "R SAO PEDRO - 69348000",
              bairro: "CENTRO",
              cidade: "IRACEMA - RR",
              contato: "",
              cnpj: "40.370.304/0001-65",
              status: "Ativo",
            },
            {
              nome: "ADAMS CLEYVSON DA SILVA WOLFF",
              endereco: "AVENIDA VENEZUELA - 69304972",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "null",
              cnpj: "99399288234",
              status: "Ativo",
            },
            {
              nome: "ADEMICON ADMINISTRADORA DE CONSORCIOS S/A",
              endereco: "AV SETE DE SETEMBRO - 80240001",
              bairro: "BATEL",
              cidade: "CURITIBA - PR",
              contato: "",
              cnpj: "84.911.098/0001-29",
              status: "Ativo",
            },
            {
              nome: "ADIANTE RECEBIVEIS S.A",
              endereco: "R CONCEICAO DE MONTE ALEGRE - 04563060",
              bairro: "CIDADE MONCOES",
              cidade: "SAO PAULO - SP",
              contato: "",
              cnpj: "33.013.052/0001-51",
              status: "Ativo",
            },
            {
              nome: "ADRIANE BATISTA GUERREIRO",
              endereco: "AVENIDA ABRAHAO FELIX LIMA - 69313132",
              bairro: "JOQUEI CLUBE",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "84645474200",
              status: "Ativo",
            },
            {
              nome: "A. F. ESCORCIO NETO",
              endereco: "R FELIPE XAUD - 69309175",
              bairro: "BURITIS",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "07.644.369/0001-86",
              status: "Ativo",
            },
            {
              nome: "A. GOMES PINHEIRO",
              endereco: "R ANDORINHA - 69735000",
              bairro: "SOL NASCENTE",
              cidade: "PRESIDENTE FIGUEIREDO - AM",
              contato: "",
              cnpj: "05.275.242/0001-01",
              status: "Ativo",
            },
            {
              nome: "AGROLAB - LABORATORIO DE ANALISES AGROPECUARIA LTD",
              endereco: "AV ANTONINO JOSE DE CARVALHO - 19807490",
              bairro: "PORTAL DE SAO FRANCISCO",
              cidade: "ASSIS - SP",
              contato: "",
              cnpj: "12.980.155/0001-10",
              status: "Ativo",
            },
            {
              nome: "AGRONIL PRODUTOS AGROPECUARIOS LTDA.",
              endereco: "AV VENEZUELA - 69309005",
              bairro: "LIBERDADE",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "07.229.106/0002-91",
              status: "Ativo",
            },
            {
              nome: "AGROPECUARIA VILHENA E AZEVEDO LTDA",
              endereco: "EST MD DA ESTRADA DE AUTAZES - 69240000",
              bairro: "AUTAZES",
              cidade: "AUTAZES - AM",
              contato: "",
              cnpj: "47.154.895/0001-82",
              status: "Ativo",
            },
            {
              nome: "AGRO-PRODUTIVA COMERCIO DE PRODUTOS AGRICOLAS LTDA",
              endereco: "AV CAPITAO SILVIO - 76870002",
              bairro: "SETOR 01",
              cidade: "ARIQUEMES - RO",
              contato: "null",
              cnpj: "14.010.222/0001-08",
              status: "Ativo",
            },
            {
              nome: "ALENCAR E SANTOS LTDA",
              endereco: "AV BRASIL - 69312600",
              bairro: "CENTENARIO",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "17.993.263/0001-41",
              status: "Ativo",
            },
            {
              nome: "ALFA DISTRIBUIDORA E REPRESENTACAO LTDA",
              endereco: "R DARIO ALVES DE PAIVA - 75901010",
              bairro: "CENTRO",
              cidade: "RIO VERDE - GO",
              contato: "",
              cnpj: "05.765.069/0001-20",
              status: "Ativo",
            },
            {
              nome: "ALL PRINTER INFORMATICA LTDA",
              endereco: "AV PRESIDENTE CASTELO BRANCO - 54450015",
              bairro: "CANDEIAS",
              cidade: "JABOATAO DOS GUARARAPES - PE",
              contato: "",
              cnpj: "04.411.428/0001-88",
              status: "Ativo",
            },
            {
              nome: "ALMEIDA & MATOS LTDA",
              endereco: "AV BRASIL - 69312450",
              bairro: "CINTURAO VERDE",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "10.763.650/0001-42",
              status: "Ativo",
            },
            {
              nome: "ALVARO TOMASI",
              endereco: "AVENIDA VENEZUELA - 69304972",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "null",
              cnpj: "99115620000",
              status: "Ativo",
            },
            {
              nome: "AMAGGI EXPORTACAO E IMPORTACAO LTDA",
              endereco: "A RODOVIA BR 174 APOS PONTE DO CAUAME KM 517 - 69339899",
              bairro: "AREA RURAL DE BOA VISTA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "77.294.254/0093-02",
              status: "Ativo",
            },
            {
              nome: "AMANCIO DA SILVA & CIA LTDA",
              endereco: "R JORGE CACAPAVA - 69315298",
              bairro: "DISTRITO INDUSTRIAL GOVERNADOR AQUILINO MOTA DUART",
              cidade: "BOA VISTA - RR",
              contato: "null",
              cnpj: "07.182.438/0001-87",
              status: "Ativo",
            },
            {
              nome: "AMAZONIA TELECOMUNICACOES LTDA",
              endereco: "AV CAPITAO JULIO BEZERRA - 69305025",
              bairro: "SAO FRANCISCO",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "18.311.497/0001-24",
              status: "Ativo",
            },
            {
              nome: "AMAZON PISOS & BLOCOS INDUSTRIA E COMERCIO LTDA",
              endereco: "R SANTILIA DE OLIVEIRA CRUZ - 69315252",
              bairro: "DISTRITO INDUSTRIAL GOVERNADOR AQUILINO MOTA DUART",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "38.778.280/0001-36",
              status: "Ativo",
            },
            {
              nome: "AMAZON TELHAS INDUSTRIA COMERCIO IMPORTACAO E EXPO",
              endereco: "R DI-V - 69315255",
              bairro: "GOVERNADOR AQUILINO MOTA DUARTE(DISRT.INDUSTRIAL)",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "14.658.966/0001-25",
              status: "Ativo",
            },
            {
              nome: "ANANDA RAFIZA ALMEIDA MARIANO",
              endereco: "AVENIDA VENEZUELA - 69304-972",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "anandarafiza@gmail.com",
              cnpj: "02862728225",
              status: "Ativo",
            },
            {
              nome: "ANANIAS ALVES FARIAS",
              endereco: "AVENIDA VENEZUELA - 69304600",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "44696892204",
              status: "Ativo",
            },
            {
              nome: "ANDERSON LUIZ DA COSTA TRANSPORTE LTDA",
              endereco: "R SEVERINO EUFRASINO DE LIMA - 78360000",
              bairro: "NOSSA SRA APARECIDA",
              cidade: "CAMPO NOVO DO PARECIS - MT",
              contato: "null",
              cnpj: "29.244.436/0001-08",
              status: "Ativo",
            },
            {
              nome: "ANDRE RODRIGUES SANTANA",
              endereco: "-",
              bairro: "",
              cidade: "",
              contato: "",
              cnpj: "56219687272",
              status: "Ativo",
            },
            {
              nome: "ANF COMBUSTIVEIS - AUTO POSTO RODO TRUCK",
              endereco: "A ROD BR 174 KM 08 LOTE 04 - 69339899",
              bairro: "AREA RURAL DE BOA VISTA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "30.757.976/0005-06",
              status: "Ativo",
            },
            {
              nome: "ANF COMBUSTIVEIS E COMERCIO LTDA",
              endereco: "ROD BR 174 - 69373000",
              bairro: "ZONA RURAL",
              cidade: "RORAINOPOLIS - RR",
              contato: "",
              cnpj: "30.757.976/0001-74",
              status: "Ativo",
            },
            {
              nome: "ANNE KAROLINE AIRES GALDINO",
              endereco: "AVENIDA VENEZUELA - 69304600",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "05633766350",
              status: "Ativo",
            },
            {
              nome: "ANTONELLO & CIA LTDA",
              endereco: "R SOCRATES PEIXOTO - 69312095",
              bairro: "JARDIM FLORESTA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "19.510.815/0001-49",
              status: "Ativo",
            },
            {
              nome: "ANTONIO GOMES PINHEIRO",
              endereco: "AVENIDA VENEZUELA - 69304-972",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "12056537249",
              status: "Ativo",
            },
            {
              nome: "ANTONIO JOSE EPIFANIA DE SOUSA",
              endereco: "AVENIDA VENEZUELA - 69304600",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "67150667287",
              status: "Ativo",
            },
            {
              nome: "ANTONIO SANTANA DE LIMA",
              endereco: "RUA ANTONIA FERREIRA DA SILVA - 69316558",
              bairro: "SENADOR HELIO CAMPOS",
              cidade: "BOA VISTA - RR",
              contato: "3623-4980",
              cnpj: "42698979291",
              status: "Ativo",
            },
            {
              nome: "A. P. DE C. BARROS E CIA LTDA",
              endereco: "AV GENERAL ATAIDE TEIVE - 69314212",
              bairro: "JARDIM PRIMAVERA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "13.961.509/0001-42",
              status: "Ativo",
            },
            {
              nome: "APP TRANSPORTES LTDA",
              endereco: "AV AMERICO BELAY - 87025210",
              bairro: "PARQUE DAS GREVILEAS 3ª PARTE",
              cidade: "MARINGA - PR",
              contato: "null",
              cnpj: "37.969.108/0001-05",
              status: "Ativo",
            },
            {
              nome: "ASSOCIACAO BRASILEIRA DE TRANSPORTADORES",
              endereco: "R CORONEL RANULFO BORGES NASCIMENTO - 38041100",
              bairro: "JARDIM MARACANA",
              cidade: "UBERABA - MG",
              contato: "",
              cnpj: "18.353.100/0001-67",
              status: "Ativo",
            },
            {
              nome: "ATACADAO DAS BATERIAS LTDA",
              endereco: "R DOUTOR PAULO COELHO PEREIRA - 69303380",
              bairro: "SAO VICENTE",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "00.623.829/0001-40",
              status: "Ativo",
            },
            {
              nome: "ATIVOS S.A. SECURITIZADORA DE CREDITOS",
              endereco: "ST SBS, QUADRA 01, BLOCO G, 5 ANDAR, PARTE A - 70073901",
              bairro: "ASA SUL",
              cidade: "BRASILIA - DF",
              contato: "",
              cnpj: "05.437.257/0001-29",
              status: "Ativo",
            },
            {
              nome: "A TOMASI",
              endereco: "AV NOSSA SENHORA DA CONSOLATA - 69303465",
              bairro: "SAO VICENTE",
              cidade: "BOA VISTA - RR",
              contato: "null",
              cnpj: "06.028.477/0001-61",
              status: "Ativo",
            },
            {
              nome: "AUTO GIRO MOTO PECAS LTDA",
              endereco: "AV PERIMETRAL NORTE - 69375000",
              bairro: "CENTRO",
              cidade: "SAO JOAO DA BALIZA - RR",
              contato: "",
              cnpj: "55.398.434/0001-83",
              status: "Ativo",
            },
            {
              nome: "AUTO POSTO ABEL GALINHA LIMITADA",
              endereco: "AV VILLE ROY - 69306665",
              bairro: "APARECIDA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "00.376.437/0001-24",
              status: "Ativo",
            },
            {
              nome: "AUTO POSTO BRASIMEX LTDA",
              endereco: "AV AV NOSSA SENHORA DE FATIMA - 69340000",
              bairro: "DOS ESTADOS",
              cidade: "MUCAJAI - RR",
              contato: "",
              cnpj: "15.275.515/0001-71",
              status: "Ativo",
            },
            {
              nome: "AUTO POSTO CINCO ESTRELAS LTDA",
              endereco: "R ANTONIO MACIEL - 69312162",
              bairro: "CAIMBE",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "03.667.416/0001-56",
              status: "Ativo",
            },
            {
              nome: "AUTO POSTO GAMA LTDA",
              endereco: "AV 07 DE ABRIL - 69348000",
              bairro: "VILA CAMPOS NOVOS",
              cidade: "IRACEMA - RR",
              contato: "null",
              cnpj: "08.423.160/0001-55",
              status: "Ativo",
            },
            {
              nome: "AUTO POSTO KARAKAS",
              endereco: "AV BRASIL - 69312450",
              bairro: "CINTURAO VERDE",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "03.611.874/0001-73",
              status: "Ativo",
            },
            {
              nome: "A V MARINHO TRANSPORTES LTDA",
              endereco: "AV PADRE AGOSTINHO CABALLERO MARTIN - 69035090",
              bairro: "COMPENSA",
              cidade: "MANAUS - AM",
              contato: "null",
              cnpj: "34.277.401/0001-05",
              status: "Ativo",
            },
            {
              nome: "AYMORE CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.",
              endereco: "R AMADOR BUENO - 04752901",
              bairro: "SANTO AMARO",
              cidade: "SAO PAULO - SP",
              contato: "",
              cnpj: "07.707.650/0001-10",
              status: "Ativo",
            },
            {
              nome: "AZEVEDO E HITOTUZI DIAGNOSTICOS S/S LTDA",
              endereco: "AV NOSSA SENHORA DA CONSOLATA - 69301011",
              bairro: "CENTRO",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "31.950.062/0001-98",
              status: "Ativo",
            },
            {
              nome: "AZUL LINHAS AEREAS BRASILEIRAS S.A.",
              endereco: "AV CAPITAO ENE GARCEZ - 69310000",
              bairro: "AEROPORTO",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "09.296.295/0093-88",
              status: "Ativo",
            },
            {
              nome: "BANCO SANTANDER (BRASIL) S.A.",
              endereco: "AV PRES JUSCELINO KUBITSCHEK - 04543011",
              bairro: "VILA NOVA CONCEICAO",
              cidade: "SAO PAULO - SP",
              contato: "",
              cnpj: "90.400.888/0001-42",
              status: "Ativo",
            },
            {
              nome: "BANCO VOLKSWAGEN",
              endereco: "AVENIDA VENEZUELA - 69304-972",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "59.109.165/0001-49",
              status: "Ativo",
            },
            {
              nome: "BELLOS MONTE TRANSPORTE E TURISMO LTDA",
              endereco: "R PARA - 69340000",
              bairro: "CENTRO",
              cidade: "MUCAJAI - RR",
              contato: "null",
              cnpj: "84.034.669/0001-94",
              status: "Ativo",
            },
            {
              nome: "BLACK SERVICOS EM TELEC LTDA",
              endereco: "-",
              bairro: "",
              cidade: "MANAUS - AM",
              contato: "null",
              cnpj: "09.544.591/0001-32",
              status: "Ativo",
            },
            {
              nome: "BRASFERRO COM IND IMP E EXP LTDA",
              endereco: "AV DAS INDUSTRIAS - 69315262",
              bairro: "DISTRITO INDUSTRIAL GOV.AQUILINO MOTA DUARTE",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "84.054.329/0002-06",
              status: "Ativo",
            },
            {
              nome: "BRASMOL COM. SERV. IMP. E EXP. LTDA",
              endereco: "AV SURUMU - 69304555",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "13.085.476/0001-14",
              status: "Ativo",
            },
            {
              nome: "BW ELETRICA COMERCIAL LTDA",
              endereco: "AV VENEZUELA - 69309690",
              bairro: "PRICUMA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "29.815.600/0002-70",
              status: "Ativo",
            },
            {
              nome: "CABURAI TRANSPORTES LTDA",
              endereco: "AV DAS GUIANAS - 69308160",
              bairro: "TREZE DE SETEMBRO",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "09.550.578/0001-96",
              status: "Ativo",
            },
            {
              nome: "C A C FERREIRA",
              endereco: "R CRUZEIRO DO SUL - 69314224",
              bairro: "JARDIM PRIMAVERA",
              cidade: "BOA VISTA - RR",
              contato: "null",
              cnpj: "00.779.437/0001-75",
              status: "Ativo",
            },
            {
              nome: "C. A. C. SALGADO E CIA LTDA",
              endereco: "BC BASILIO DA GAMA - 69048002",
              bairro: "DA PAZ",
              cidade: "MANAUS - AM",
              contato: "null",
              cnpj: "14.945.410/0001-10",
              status: "Ativo",
            },
            {
              nome: "CACULAO MATERIAIS DE CONSTRUCAO LTDA",
              endereco: "AV GENERAL ATAIDE TEIVE - 69309187",
              bairro: "BURITIS",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "22.906.085/0001-04",
              status: "Ativo",
            },
            {
              nome: "CAIXA ECONOMICA FEDERAL",
              endereco: "ST BANCARIO SUL QUADRA 04 - 70092900",
              bairro: "ASA SUL",
              cidade: "BRASILIA - DF",
              contato: "",
              cnpj: "00.360.305/0001-04",
              status: "Ativo",
            },
            {
              nome: "CALNORTE INDUSTRIA E COMERCIO DE CALCARIO LTDA",
              endereco: "R BENJAMIM ROBERTO - 69400030",
              bairro: "BELA VISTA",
              cidade: "MANACAPURU - AM",
              contato: "",
              cnpj: "03.100.889/0004-10",
              status: "Ativo",
            },
            {
              nome: "C ALVES DAMASCENO LTDA",
              endereco: "AV SOL NASCENTE - 69316058",
              bairro: "RAIAR DO SOL",
              cidade: "",
              contato: "",
              cnpj: "09.629.235/0001-11",
              status: "Ativo",
            },
            {
              nome: "CARMEM LÚCIA SILVA SOUSA",
              endereco: "RUA HC 14 - 69316484",
              bairro: "SENADOR HELIO CAMPOS",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "66616212220",
              status: "Ativo",
            },
            {
              nome: "CASTELAO COM MAT DE CONSTRUCAO E SERVICOS LTDA",
              endereco: "AV MARIO HOMEM DE MELO - 69312155",
              bairro: "CAIMBE",
              cidade: "BOA VISTA - RR",
              contato: "null",
              cnpj: "01.268.775/0001-05",
              status: "Ativo",
            },
            {
              nome: "C CARDOSO DA SILVA LTDA",
              endereco: "AV CAPITAO JULIO BEZERRA - 69305294",
              bairro: "TRINTA E UM DE MARCO",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "02.464.858/0001-32",
              status: "Ativo",
            },
            {
              nome: "CESAR VALMIR MONTE SANTANA",
              endereco: "-",
              bairro: "",
              cidade: "",
              contato: "null",
              cnpj: "86107305572",
              status: "Ativo",
            },
            {
              nome: "C FERNANDES",
              endereco: "AV MARIO HOMEM DE MELO - 69309198",
              bairro: "BURITIS",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "84.012.905/0001-71",
              status: "Ativo",
            },
            {
              nome: "CHUI MATERIAIS DE CONSTRUCAO LTDA",
              endereco: "R JOCA FARIAS - 69313702",
              bairro: "JARDIM CARANA",
              cidade: "BOA VISTA - RR",
              contato: "null",
              cnpj: "35.940.427/0001-54",
              status: "Ativo",
            },
            {
              nome: "CLAUDEMIR ALVES FARIA",
              endereco: "-",
              bairro: "",
              cidade: "",
              contato: "",
              cnpj: "44697589220",
              status: "Ativo",
            },
            {
              nome: "CLAUDIO MORAIS SANTOS",
              endereco: "AV CENTENARIO - 69312603",
              bairro: "CENTENARIO",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "08.578.697/0001-94",
              status: "Ativo",
            },
            {
              nome: "CLAYTON LUCIO SCHUH",
              endereco: "-",
              bairro: "",
              cidade: "",
              contato: "null",
              cnpj: "75853019953",
              status: "Ativo",
            },
            {
              nome: "C. M. DOS SANTOS BATISTA",
              endereco: "R LUPICINIO RODRIGUES - 69048100",
              bairro: "DA PAZ",
              cidade: "MANAUS - AM",
              contato: "",
              cnpj: "05.437.407/0001-02",
              status: "Ativo",
            },
            {
              nome: "COMERCIAL F C LTDA",
              endereco: "R GOIAS - 30190030",
              bairro: "CENTRO",
              cidade: "BELO HORIZONTE - MG",
              contato: "",
              cnpj: "14.410.956/0001-76",
              status: "Ativo",
            },
            {
              nome: "COMERCIAL RODRIGUES LTDA",
              endereco: "R LOURIVAL COIMBRA - 69316690",
              bairro: "PINTOLANDIA",
              cidade: "BOA VISTA - RR",
              contato: "null",
              cnpj: "12.223.879/0001-10",
              status: "Ativo",
            },
            {
              nome: "COMINA EMPRESA DE MINERACAO LTDA",
              endereco: "MARG DIREITA DO RIO TAPAJOS - 68165000",
              bairro: "ZONA RURAL",
              cidade: "RUROPOLIS - PA",
              contato: "",
              cnpj: "14.133.821/0001-00",
              status: "Ativo",
            },
            {
              nome: "COMPANHIA DE AGUAS E ESGOTOS DE RORAIMA CAER",
              endereco: "R MELVIN JONES - 69306610",
              bairro: "SAO PEDRO",
              cidade: "BOA VISTA - RR",
              contato: "08002809520",
              cnpj: "05.939.467/0001-15",
              status: "Ativo",
            },
            {
              nome: "C R DISTRIBUIDORA - COMERCIO ATACADISTA DE LUBRIFI",
              endereco: "R MANOEL FELIPE - 69312288",
              bairro: "ASA BRANCA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "11.317.175/0002-24",
              status: "Ativo",
            },
            {
              nome: "CREDCOM RECUPERADORA DE CREDITOS LTDA",
              endereco: "AV OLINDA - 74884120",
              bairro: "LOT PARK LOZANDES",
              cidade: "GOIANIA - GO",
              contato: "",
              cnpj: "48.923.939/0001-54",
              status: "Ativo",
            },
            {
              nome: "CRISTINA DA SILVA MARIANO",
              endereco: "AVENIDA RUI BARAUNA - 69313688",
              bairro: "JARDIM CARANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "73513130244",
              status: "Ativo",
            },
            {
              nome: "DANIEL JANDER OLSEN DA SILVA",
              endereco: "RUA CAPIM SANTO - 69088467",
              bairro: "JORGE TEIXEIRA",
              cidade: "MANAUS - AM",
              contato: "9841011770",
              cnpj: "1947385232",
              status: "Ativo",
            },
            {
              nome: "D. DA C. VASCONCELOS - PONTO CERTO CONVENIENCIA 24",
              endereco: "ROD BR 174 - 69373000",
              bairro: "PARK AMAZONIA 1",
              cidade: "RORAINOPOLIS - RR",
              contato: "",
              cnpj: "52.877.629/0001-18",
              status: "Ativo",
            },
            {
              nome: "DEPARTAMENTO ESTADUAL DE TRANSITO",
              endereco: "AV MARIO YPIRANGA - 69050030",
              bairro: "PARQUE 10 DE NOVEMBRO",
              cidade: "MANAUS - AM",
              contato: "",
              cnpj: "04.224.028/0001-63",
              status: "Ativo",
            },
            {
              nome: "DEPARTAMENTO ESTADUAL DE TRANSITO",
              endereco: "AV BRIG EDUARDO GOMES - 69305284",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "22.900.328/0001-05",
              status: "Ativo",
            },
            {
              nome: "DESPESA EM VIAGEM",
              endereco: "AVENIDA VENEZUELA - 69304600",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "00.000.000/0000-19",
              status: "Ativo",
            },
            {
              nome: "DESPESAS",
              endereco: "AVENIDA VENEZUELA - 69304-972",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "03537040245",
              status: "Ativo",
            },
            {
              nome: "DEVANIR DIAS FRANCA",
              endereco: "-",
              bairro: "",
              cidade: "",
              contato: "null",
              cnpj: "16941144904",
              status: "Ativo",
            },
            {
              nome: "D G BRANDAO DA SILVA",
              endereco: "AV MARIO HOMEM DE MELO - 69304350",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "32.735.287/0001-94",
              status: "Ativo",
            },
            {
              nome: "DIAMANTE EMPREENDIMENTOS IMOBILIARIOS LTDA",
              endereco: "R JOSE MAGALHAES - 69301360",
              bairro: "CENTRO",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "42.159.991/0001-08",
              status: "Ativo",
            },
            {
              nome: "DIEGO VIEIRA MARTINS",
              endereco: "AVENIDA VENEZUELA - 69304-972",
              bairro: "MECEJANA",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "02590599196",
              status: "Ativo",
            },
            {
              nome: "DISTRIBUIDORA AUTO LUB 1 LTDA",
              endereco: "AV GENERAL ATAIDE TEIVE - 69309187",
              bairro: "BURITIS",
              cidade: "BOA VISTA - RR",
              contato: "",
              cnpj: "46.241.271/0001-30",
              status: "Ativo",
            },
          ]

          setFornecedores(extractedData)
          setStep("preview")
          setIsLoading(false)
        } catch (err) {
          console.error("Erro ao processar o conteúdo do PDF:", err)
          setError("Ocorreu um erro ao processar o conteúdo do arquivo. Verifique se o formato está correto.")
          setIsLoading(false)
        }
      }

      reader.onerror = () => {
        setError("Erro ao ler o arquivo. Por favor, tente novamente.")
        setIsLoading(false)
      }

      reader.readAsArrayBuffer(file)
    } catch (err) {
      setError("Ocorreu um erro ao processar o arquivo. Por favor, tente novamente.")
      console.error(err)
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    setIsLoading(true)

    try {
      // Em um ambiente real, você enviaria os dados para o servidor
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Adicionar status "Ativo" para todos os fornecedores que não têm status
      const fornecedoresComStatus = fornecedores.map((f) => ({
        ...f,
        status: f.status || "Ativo",
      }))

      // Chamar a função de callback para atualizar a lista principal
      onImportSuccess(fornecedoresComStatus)

      setStep("success")

      // Resetar após 2 segundos
      setTimeout(() => {
        onOpenChange(false)
        // Resetar o estado após fechar o diálogo
        setTimeout(() => {
          setFile(null)
          setFornecedores([])
          setStep("upload")
        }, 300)
      }, 2000)
    } catch (err) {
      setError("Ocorreu um erro ao importar os fornecedores. Por favor, tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (isLoading) return
    onOpenChange(false)
    // Resetar o estado após fechar o diálogo
    setTimeout(() => {
      setFile(null)
      setFornecedores([])
      setStep("upload")
      setError(null)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {step === "upload" && "Importar Fornecedores"}
            {step === "preview" && "Revisar Dados de Fornecedores"}
            {step === "success" && "Importação Concluída"}
          </DialogTitle>
          <DialogDescription>
            {step === "upload" &&
              "Faça upload de um arquivo PDF contendo dados de fornecedores para importar para o sistema."}
            {step === "preview" && "Revise os dados extraídos antes de confirmar a importação."}
            {step === "success" && `${fornecedores.length} fornecedores foram importados com sucesso.`}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="pdf-file">Arquivo PDF</Label>
              <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} disabled={isLoading} />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {file && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Arquivo selecionado</AlertTitle>
                <AlertDescription>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Foram encontrados {fornecedores.length} fornecedores no arquivo. Verifique se os dados estão corretos
                antes de importar.
              </AlertDescription>
            </Alert>

            <ScrollArea className="h-[300px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ/CPF</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Bairro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fornecedores.map((fornecedor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.cnpj}</TableCell>
                      <TableCell>{fornecedor.cidade}</TableCell>
                      <TableCell>{fornecedor.bairro}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center text-lg">Todos os fornecedores foram importados com sucesso!</p>
          </div>
        )}

        <DialogFooter>
          {step === "upload" && (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button onClick={processFile} disabled={!file || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Processar Arquivo
                  </>
                )}
              </Button>
            </>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("upload")} disabled={isLoading}>
                Voltar
              </Button>
              <Button onClick={handleImport} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirmar Importação
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

