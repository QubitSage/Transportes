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

interface Produto {
  id: string
  codigo: string
  nome: string
  descricao: string
  categoria: string
  unidade: string
  precoUnitario: string
  estoque: string
  fornecedor: string
  status: "ativo" | "inativo"
}

interface ImportPdfDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (produtos: Produto[]) => void
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

      // Dados simulados
      const importedProdutos: Produto[] = [
        {
          id: crypto.randomUUID(),
          codigo: "P001",
          nome: "Fertilizante NPK 10-10-10",
          descricao: "Fertilizante granulado com proporções iguais de nitrogênio, fósforo e potássio",
          categoria: "Fertilizantes",
          unidade: "kg",
          precoUnitario: "120.00",
          estoque: "1500",
          fornecedor: "Fertilizantes Norte do Brasil LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P002",
          nome: "Fertilizante NPK 4-14-8",
          descricao: "Fertilizante granulado para culturas que necessitam mais fósforo",
          categoria: "Fertilizantes",
          unidade: "kg",
          precoUnitario: "110.00",
          estoque: "2000",
          fornecedor: "Fertilizantes Norte do Brasil LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P003",
          nome: "Ureia 45-0-0",
          descricao: "Fertilizante nitrogenado de alta concentração",
          categoria: "Fertilizantes",
          unidade: "kg",
          precoUnitario: "150.00",
          estoque: "1200",
          fornecedor: "Fertilizantes Norte do Brasil LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P004",
          nome: "Superfosfato Simples",
          descricao: "Fertilizante fosfatado com enxofre e cálcio",
          categoria: "Fertilizantes",
          unidade: "kg",
          precoUnitario: "95.00",
          estoque: "1800",
          fornecedor: "Fertilizantes Norte do Brasil LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P005",
          nome: "Cloreto de Potássio",
          descricao: "Fertilizante potássico de alta concentração",
          categoria: "Fertilizantes",
          unidade: "kg",
          precoUnitario: "130.00",
          estoque: "1000",
          fornecedor: "Fertilizantes Norte do Brasil LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P006",
          nome: "Calcário Dolomítico",
          descricao: "Corretivo de acidez do solo com cálcio e magnésio",
          categoria: "Corretivos",
          unidade: "kg",
          precoUnitario: "45.00",
          estoque: "5000",
          fornecedor: "Mineração Boa Vista LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P007",
          nome: "Glifosato",
          descricao: "Herbicida sistêmico não seletivo",
          categoria: "Defensivos",
          unidade: "L",
          precoUnitario: "85.00",
          estoque: "800",
          fornecedor: "Agroquímica Brasil LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P008",
          nome: "2,4-D",
          descricao: "Herbicida seletivo para controle de folhas largas",
          categoria: "Defensivos",
          unidade: "L",
          precoUnitario: "75.00",
          estoque: "600",
          fornecedor: "Agroquímica Brasil LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P009",
          nome: "Semente de Soja",
          descricao: "Semente de soja certificada",
          categoria: "Sementes",
          unidade: "kg",
          precoUnitario: "25.00",
          estoque: "3000",
          fornecedor: "Sementes do Norte LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P010",
          nome: "Semente de Milho",
          descricao: "Semente de milho híbrido",
          categoria: "Sementes",
          unidade: "kg",
          precoUnitario: "30.00",
          estoque: "2500",
          fornecedor: "Sementes do Norte LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P011",
          nome: "Adubo Orgânico",
          descricao: "Composto orgânico para agricultura",
          categoria: "Fertilizantes",
          unidade: "kg",
          precoUnitario: "60.00",
          estoque: "2000",
          fornecedor: "Orgânicos Naturais LTDA",
          status: "ativo",
        },
        {
          id: crypto.randomUUID(),
          codigo: "P012",
          nome: "Inseticida Piretróide",
          descricao: "Inseticida para controle de pragas",
          categoria: "Defensivos",
          unidade: "L",
          precoUnitario: "95.00",
          estoque: "500",
          fornecedor: "Agroquímica Brasil LTDA",
          status: "ativo",
        },
      ]

      onImport(importedProdutos)
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
          <DialogTitle>Importar Produtos</DialogTitle>
          <DialogDescription>Selecione um arquivo PDF contendo a lista de produtos para importar.</DialogDescription>
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

