"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { FileUp, Loader2 } from "lucide-react"

interface Caminhao {
  id: string
  placa: string
  renavan: string
  chassi: string
  cor: string
  modelo: string
  anoModelo: string
  anoFabricacao: string
  tipoVeiculo: string
  tipoFrota: string
  capacidade: string
  marca: string
  proprietario: string
  cidade: string
  estado: string
  status: "ativo" | "inativo"
}

interface ImportPdfDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (caminhoes: Caminhao[]) => void
}

export default function ImportPdfDialog({ open, onOpenChange, onImport }: ImportPdfDialogProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo PDF para importar.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulando o processamento do PDF
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Dados simulados baseados no PDF fornecido
      const importedCaminhoes: Caminhao[] = [
        {
          id: crypto.randomUUID(),
          placa: "04946559",
          renavan: "013310147329",
          chassi: "A9SRCBA2P1DK4095",
          cor: "PRETA",
          modelo: "SR",
          anoModelo: "2022",
          anoFabricacao: "2023",
          tipoVeiculo: "CARRETA 2 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "METALESP",
          proprietario: "TRANSPORTADORA VIANA & VIANA LTDA",
          cidade: "BOA VISTA",
          estado: "RR",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "ADT3E44",
          renavan: "null",
          chassi: "null",
          cor: "BRANCA",
          modelo: "G 420",
          anoModelo: "2011",
          anoFabricacao: "2011",
          tipoVeiculo: "CAVALO TRUCADO",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "SCANIA",
          proprietario: "APP TRANSPORTES LTDA",
          cidade: "MARINGA",
          estado: "PR",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AFH824",
          renavan: "null",
          chassi: "null",
          cor: "NÃO INFORMADO",
          modelo: "",
          anoModelo: "",
          anoFabricacao: "",
          tipoVeiculo: "CARRETA 2 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "DAF",
          proprietario: "3 IRMAOS TRANSPORTES LTDA",
          cidade: "ITAITUBA",
          estado: "PA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AFJ0067",
          renavan: "008342978259",
          chassi: "ADG124344M205407",
          cor: "BRANCA",
          modelo: "SR/RANDON SR CA",
          anoModelo: "2004",
          anoFabricacao: "2004",
          tipoVeiculo: "CARRETA 2 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "SR",
          proprietario: "GEOVANI MOREIRA BRAGA",
          cidade: "BOA VISTA",
          estado: "RR",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AGE0712",
          renavan: "007734305129",
          chassi: "ADG077212M170080",
          cor: "BRANCA",
          modelo: "SR/RANDON SR CA",
          anoModelo: "2001",
          anoFabricacao: "2002",
          tipoVeiculo: "CARRETA 3 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "23000",
          marca: "RANDON",
          proprietario: "JULIANE TRANSPORTES RODOVIARIOS LTDA",
          cidade: "JARDIM ALEGRE",
          estado: "PR",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AGE0F12",
          renavan: "007734305479",
          chassi: "ADG077212M170081",
          cor: "BRANCA",
          modelo: "SR/RANDON SR CA",
          anoModelo: "2001",
          anoFabricacao: "2002",
          tipoVeiculo: "CARRETA 3 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "23000",
          marca: "RANDON",
          proprietario: "JOBES DOS SANTOS OLIVEIRA",
          cidade: "BOA VISTA",
          estado: "RR",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AGE0H25",
          renavan: "null",
          chassi: "null",
          cor: "BRANCA",
          modelo: "SR RANDON SR CA",
          anoModelo: "2001",
          anoFabricacao: "2002",
          tipoVeiculo: "CARRETA 3 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "SR",
          proprietario: "JOBES DOS SANTOS OLIVEIRA",
          cidade: "BOA VISTA",
          estado: "RR",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AHU6G67",
          renavan: "004095394069",
          chassi: "BSG6X400C3801312",
          cor: "NÃO INFORMADO",
          modelo: "",
          anoModelo: "2012",
          anoFabricacao: "2011",
          tipoVeiculo: "CAVALO TRUCADO",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "SCANIA",
          proprietario: "NC LOGISTICA DE TRANSPORTES DE CARGAS",
          cidade: "MANAUS",
          estado: "AM",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AHY0F04",
          renavan: "null",
          chassi: "null",
          cor: "NÃO INFORMADO",
          modelo: "GUERRA",
          anoModelo: "2013",
          anoFabricacao: "2013",
          tipoVeiculo: "CARRETA 2 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "SR",
          proprietario: "TRANSLINS TRANSPORTES DE CARGAS LTDA",
          cidade: "MANAUS",
          estado: "AM",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AII4C52",
          renavan: "007140459429",
          chassi: "BST4X2A0X3508193",
          cor: "VERMELHA",
          modelo: "SCANIA/T124",
          anoModelo: "1999",
          anoFabricacao: "1999",
          tipoVeiculo: "CAVALO TRUCADO",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "SCANIA",
          proprietario: "GEOVANI MOREIRA BRAGA",
          cidade: "BOA VISTA",
          estado: "RR",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AJZ1I70",
          renavan: "007623155639",
          chassi: "ADG075211M165981",
          cor: "AZUL",
          modelo: "SR/RANDON SR CA",
          anoModelo: "2001",
          anoFabricacao: "2001",
          tipoVeiculo: "CARRETA 2 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "37000",
          marca: "SR",
          proprietario: "GUILHERME DE SOUSA SANTOS",
          cidade: "DOM ELISEU",
          estado: "PA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "AJZ1I71",
          renavan: "007623149159",
          chassi: "ADG075211M165982",
          cor: "AZUL",
          modelo: "RANDON SR",
          anoModelo: "2001",
          anoFabricacao: "2001",
          tipoVeiculo: "CARRETA 2 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "37000",
          marca: "SR",
          proprietario: "ELVIS FRANKLIN FEITOSA DE SOUSA",
          cidade: "BOA VISTA",
          estado: "RR",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "ALV6202",
          renavan: "0083015428094",
          chassi: "BA096244V005654",
          cor: "CINZA",
          modelo: "SR/FACCHINI SRF",
          anoModelo: "2004",
          anoFabricacao: "2004",
          tipoVeiculo: "CARRETA 3 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "SR",
          proprietario: "CLAYTON LUCIO SCHUH",
          cidade: "MUCAJAI",
          estado: "RR",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "ALV6C02",
          renavan: "null",
          chassi: "null",
          cor: "NÃO INFORMADO",
          modelo: "",
          anoModelo: "",
          anoFabricacao: "",
          tipoVeiculo: "CARRETA 2 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "GUERRA",
          proprietario: "3 IRMAOS TRANSPORTES LTDA",
          cidade: "ITAITUBA",
          estado: "PA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          placa: "ALV6C16",
          renavan: "0083015429994",
          chassi: "BA073244V005655",
          cor: "NÃO INFORMADO",
          modelo: "SR/FACCHINI SRF",
          anoModelo: "2004",
          anoFabricacao: "2004",
          tipoVeiculo: "CARRETA 2 EIXOS",
          tipoFrota: "AGREGADA",
          capacidade: "0",
          marca: "SR",
          proprietario: "CLAYTON LUCIO SCHUH",
          cidade: "MUCAJAI",
          estado: "RR",
          status: "ativo",
        },
      ]

      onImport(importedCaminhoes)
    } catch (error) {
      console.error("Erro ao importar PDF:", error)
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao processar o arquivo PDF.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setFile(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importar Caminhões</DialogTitle>
          <DialogDescription>Selecione um arquivo PDF contendo a lista de caminhões para importar.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pdf">Arquivo PDF</Label>
            <Input id="pdf" type="file" accept=".pdf" onChange={handleFileChange} disabled={isLoading} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Importar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

