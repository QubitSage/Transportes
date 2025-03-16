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

interface Motorista {
  id: string
  nome: string
  prontuario: string
  cnh: string
  categoria: string
  liberacao: string
  validade: string
  cpf: string
  rg: string
  pisPasep: string
  dataNascimento: string
  status: "ativo" | "inativo"
}

interface ImportPdfDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (motoristas: Motorista[]) => void
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
      const importedMotoristas: Motorista[] = [
        {
          id: crypto.randomUUID(),
          nome: "FRANCISCO RODRIGUES DA SILVA",
          prontuario: "",
          cnh: "00821729483",
          categoria: "AE",
          liberacao: "",
          validade: "",
          cpf: "199.723.422-04",
          rg: "63516 SSP",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "ADAO DE SOUZA",
          prontuario: "",
          cnh: "03765403574",
          categoria: "AE",
          liberacao: "",
          validade: "",
          cpf: "971.082.782-00",
          rg: "251682",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "JOSE APARECIDO DA SILVA",
          prontuario: "",
          cnh: "00197852599",
          categoria: "C",
          liberacao: "",
          validade: "",
          cpf: "314.296.451-72",
          rg: "",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "VANDELIN CAZUZA DA SILVA",
          prontuario: "",
          cnh: "00446499559",
          categoria: "E",
          liberacao: "",
          validade: "",
          cpf: "176.425.663-87",
          rg: "134425293",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "DENISON MOTA TELES",
          prontuario: "",
          cnh: "6000179702",
          categoria: "AE",
          liberacao: "21/10/2050",
          validade: "21/10/2050",
          cpf: "021.293.072-99",
          rg: "",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "RODRIGO MARTIMIANI DOS SANTOS",
          prontuario: "",
          cnh: "05431243623",
          categoria: "AE",
          liberacao: "",
          validade: "",
          cpf: "775.421.262-53",
          rg: "16957903",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "MACIEL RODRIGUES DA SILVA",
          prontuario: "2239847199",
          cnh: "01406824001",
          categoria: "AE",
          liberacao: "19/10/2022",
          validade: "19/10/2050",
          cpf: "605.692.712-15",
          rg: "120314",
          pisPasep: "",
          dataNascimento: "15/10/1977",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "FERNANDO HENRIQUE DA SILVA SANTOS",
          prontuario: "",
          cnh: "03274817723",
          categoria: "AE",
          liberacao: "",
          validade: "",
          cpf: "845.751.582-91",
          rg: "239669",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "JONAS BATISTA DOS SANTOS",
          prontuario: "",
          cnh: "00967425452",
          categoria: "E",
          liberacao: "",
          validade: "",
          cpf: "007.973.638-66",
          rg: "12212218",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "DAN FERREIRA GOMES WEBER",
          prontuario: "2164740106",
          cnh: "04311932037",
          categoria: "E",
          liberacao: "31/10/2050",
          validade: "31/10/2050",
          cpf: "972.467.782-68",
          rg: "250107",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "JOAO VICTOR SANTOS SILVA",
          prontuario: "",
          cnh: "06274180311",
          categoria: "AE",
          liberacao: "",
          validade: "",
          cpf: "331.325.668-61",
          rg: "38761134",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "JOSE WEBER",
          prontuario: "",
          cnh: "01567340061",
          categoria: "E",
          liberacao: "31/10/2050",
          validade: "30/10/2050",
          cpf: "270.262.801-04",
          rg: "313332",
          pisPasep: "",
          dataNascimento: "03/01/1961",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "JOSE FERREIRA DE SOUZA NETO",
          prontuario: "",
          cnh: "",
          categoria: "AE",
          liberacao: "",
          validade: "",
          cpf: "029.467.082-33",
          rg: "4273451",
          pisPasep: "",
          dataNascimento: "",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          nome: "EURICLENISON DA SILVA RABELO",
          prontuario: "",
          cnh: "03918155417",
          categoria: "AE",
          liberacao: "",
          validade: "",
          cpf: "812.474.192-15",
          rg: "228855",
          pisPasep: "",
          dataNascimento: "12/12/1985",
          status: "ativo",
        },
      ]

      onImport(importedMotoristas)
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
          <DialogTitle>Importar Motoristas</DialogTitle>
          <DialogDescription>Selecione um arquivo PDF contendo a lista de motoristas para importar.</DialogDescription>
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

