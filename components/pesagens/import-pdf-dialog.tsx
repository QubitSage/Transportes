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
import { Loader2, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ImportPdfDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportSuccess: (data: PesagemData[]) => void
}

export interface PesagemData {
  id: string
  numero: string
  data: string
  hora: string
  placa: string
  motorista: string
  produto: string
  fornecedor: string
  cliente: string
  pesoEntrada: number
  pesoSaida: number
  pesoLiquido: number
  status: "Concluída" | "Pendente"
}

export function ImportPdfDialog({ open, onOpenChange, onImportSuccess }: ImportPdfDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<PesagemData[]>([])
  const [importSuccess, setImportSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
    setPreviewData([])
    setImportSuccess(false)
  }

  const processFile = async () => {
    if (!file) {
      setError("Por favor, selecione um arquivo PDF.")
      return
    }

    if (file.type !== "application/pdf") {
      setError("O arquivo selecionado não é um PDF.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulação de processamento do PDF
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Gerar dados de exemplo baseados no formato do relatório
      const mockData = generateMockPesagensData()
      setPreviewData(mockData)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError("Erro ao processar o arquivo. Verifique se o formato é válido.")
      console.error(err)
    }
  }

  const handleImport = () => {
    setIsLoading(true)

    // Simulação de importação
    setTimeout(() => {
      setIsLoading(false)
      setImportSuccess(true)
      onImportSuccess(previewData)

      // Fechar o diálogo após 1.5 segundos
      setTimeout(() => {
        onOpenChange(false)
        setFile(null)
        setPreviewData([])
        setImportSuccess(false)
      }, 1500)
    }, 1000)
  }

  const generateMockPesagensData = (): PesagemData[] => {
    const motoristas = [
      "CLAUDEMIR ALVES FARIAS",
      "GILENE FERREIRA DE SOUSA",
      "ANTONIO SANTANA DE LIMA",
      "LEANDRO AUGUSTO LOPES",
      "MACIEL RODRIGUES DA SILVA",
    ]

    const produtos = ["CALCÁRIO AGRÍCOLA", "FERTILIZANTE NPK", "ADUBO ORGÂNICO", "UREIA", "SUPERFOSFATO"]

    const fornecedores = [
      "AGROINDUSTRIAL SERRA VERDE LTDA",
      "CALNORTE INDUSTRIA E COMERCIO DE",
      "AMAGGI EXP.E IMP.LTDA",
    ]

    const clientes = [
      "ELZILENE DA SILVA",
      "RURAL FERTIL AGRONEGOCIOS LTDA",
      "AMAGGI EXPORTACAO E IMPORTACAO LTDA",
      "KOICHI ETO",
    ]

    const placas = ["ABC1D23", "XYZ9F87", "QWE4R56", "JKL7M89", "ZXC2V34"]

    return Array.from({ length: 15 }, (_, i) => {
      const pesoEntrada = Math.floor(Math.random() * 30000) + 10000
      const pesoSaida = Math.floor(Math.random() * 10000) + 5000
      const pesoLiquido = pesoEntrada - pesoSaida

      return {
        id: `pes-${Date.now()}-${i}`,
        numero: `${Math.floor(Math.random() * 10000) + 1}`,
        data: `${Math.floor(Math.random() * 28) + 1}/0${Math.floor(Math.random() * 9) + 1}/2024`,
        hora: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
        placa: placas[Math.floor(Math.random() * placas.length)],
        motorista: motoristas[Math.floor(Math.random() * motoristas.length)],
        produto: produtos[Math.floor(Math.random() * produtos.length)],
        fornecedor: fornecedores[Math.floor(Math.random() * fornecedores.length)],
        cliente: clientes[Math.floor(Math.random() * clientes.length)],
        pesoEntrada,
        pesoSaida,
        pesoLiquido,
        status: Math.random() > 0.2 ? "Concluída" : "Pendente",
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importar Pesagens de PDF</DialogTitle>
          <DialogDescription>
            Faça upload de um relatório de pesagens em formato PDF para importar os dados.
          </DialogDescription>
        </DialogHeader>

        {importSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-center">Importação concluída com sucesso!</h3>
            <p className="text-center text-muted-foreground mt-2">{previewData.length} registros foram importados.</p>
          </div>
        ) : (
          <>
            {!previewData.length ? (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pdf-file">Arquivo PDF</Label>
                  <div className="flex items-center gap-2">
                    <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} className="flex-1" />
                    <Button onClick={processFile} disabled={!file || isLoading} className="w-[150px]">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Processar
                        </>
                      )}
                    </Button>
                  </div>
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {(file.size / 1024).toFixed(2)} KB
                      </Badge>
                    </div>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Prévia dos dados</AlertTitle>
                  <AlertDescription>
                    Foram encontrados {previewData.length} registros no arquivo. Verifique se os dados estão corretos
                    antes de importar.
                  </AlertDescription>
                </Alert>

                <ScrollArea className="h-[300px] rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Placa</TableHead>
                        <TableHead>Motorista</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Peso Líquido</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.numero}</TableCell>
                          <TableCell>{item.data}</TableCell>
                          <TableCell>{item.placa}</TableCell>
                          <TableCell>{item.motorista}</TableCell>
                          <TableCell>{item.produto}</TableCell>
                          <TableCell className="text-right">{item.pesoLiquido.toLocaleString("pt-BR")} kg</TableCell>
                          <TableCell>
                            <Badge variant={item.status === "Concluída" ? "success" : "outline"}>{item.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          {previewData.length > 0 && !importSuccess && (
            <Button onClick={handleImport} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                "Confirmar Importação"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

