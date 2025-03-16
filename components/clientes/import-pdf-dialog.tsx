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
import { FileUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Cliente {
  id: string
  codigo: string
  nome: string
  cnpjCpf: string
  inscricaoEstadual: string
  telefone: string
  email: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  status: "ativo" | "inativo"
}

interface ImportPdfDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (clientes: Cliente[]) => void
}

export default function ImportPdfDialog({ open, onOpenChange, onImport }: ImportPdfDialogProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile)
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo PDF.",
          variant: "destructive",
        })
      }
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
      // Simulação de processamento do PDF
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Dados simulados extraídos do PDF
      const mockExtractedClientes: Cliente[] = [
        {
          id: `c${Date.now()}1`,
          codigo: `C${Math.floor(1000 + Math.random() * 9000)}`,
          nome: "Empresa Importada Ltda",
          cnpjCpf: "45.678.901/0001-23",
          inscricaoEstadual: "987654321",
          telefone: "(21) 3456-7890",
          email: "contato@empresaimportada.com.br",
          endereco: "Av. Comercial, 789",
          cidade: "Belo Horizonte",
          estado: "MG",
          cep: "30000-000",
          status: "ativo",
        },
        {
          id: `c${Date.now()}2`,
          codigo: `C${Math.floor(1000 + Math.random() * 9000)}`,
          nome: "Distribuidora PDF S.A.",
          cnpjCpf: "56.789.012/0001-34",
          inscricaoEstadual: "123456789",
          telefone: "(31) 4567-8901",
          email: "contato@distribuidorapdf.com.br",
          endereco: "Rua Industrial, 456",
          cidade: "Curitiba",
          estado: "PR",
          cep: "80000-000",
          status: "ativo",
        },
        {
          id: `c${Date.now()}3`,
          codigo: `C${Math.floor(1000 + Math.random() * 9000)}`,
          nome: "Comércio Importado Eireli",
          cnpjCpf: "67.890.123/0001-45",
          inscricaoEstadual: "234567890",
          telefone: "(41) 5678-9012",
          email: "contato@comercioimportado.com.br",
          endereco: "Rua do Comércio, 123",
          cidade: "Porto Alegre",
          estado: "RS",
          cep: "90000-000",
          status: "ativo",
        },
      ]

      onImport(mockExtractedClientes)

      toast({
        title: "Importação concluída",
        description: `${mockExtractedClientes.length} clientes extraídos do PDF com sucesso.`,
      })

      setFile(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao processar o PDF:", error)
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao processar o arquivo PDF.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Clientes de PDF</DialogTitle>
          <DialogDescription>Selecione um arquivo PDF contendo dados de clientes para importar.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-file">Arquivo PDF</Label>
            <div className="flex items-center gap-2">
              <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} className="flex-1" />
            </div>
          </div>
          {file && (
            <div className="text-sm">
              <p className="font-medium">Arquivo selecionado:</p>
              <p>{file.name}</p>
            </div>
          )}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              O sistema tentará extrair automaticamente os dados dos clientes do PDF. Certifique-se de que o PDF esteja
              bem formatado para melhor precisão.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || isLoading}>
            {isLoading ? (
              <>Processando...</>
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

