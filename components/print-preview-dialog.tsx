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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, Download, ZoomIn, ZoomOut, RotateCw, Settings, Minus, Plus } from "lucide-react"
import Image from "next/image"

interface DocumentType {
  id: string
  name: string
  icon: React.ReactNode
  category: "logistica" | "financeiro" | "estoque" | "relatorios"
  description: string
  templates: Template[]
}

interface Template {
  id: string
  name: string
  description: string
  previewImage: string
  default: boolean
}

interface PrintPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: DocumentType
  template: Template
  onPrint: () => void
}

export function PrintPreviewDialog({
  open,
  onOpenChange,
  document,
  template: initialTemplate,
  onPrint,
}: PrintPreviewDialogProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [template, setTemplate] = useState(initialTemplate)
  const [copies, setCopies] = useState(1)
  const [zoom, setZoom] = useState(100)

  // Função para alterar o template
  const handleTemplateChange = (templateId: string) => {
    const newTemplate = document.templates.find((t) => t.id === templateId)
    if (newTemplate) {
      setTemplate(newTemplate)
    }
  }

  // Função para aumentar o zoom
  const zoomIn = () => {
    if (zoom < 200) {
      setZoom((prev) => prev + 25)
    }
  }

  // Função para diminuir o zoom
  const zoomOut = () => {
    if (zoom > 50) {
      setZoom((prev) => prev - 25)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Visualização de Impressão - {document.name}</DialogTitle>
          <DialogDescription>Visualize e configure as opções de impressão para {document.name}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2">
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                Visualização
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={zoom <= 50}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoom >= 200}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(100)}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="preview" className="flex-1 overflow-auto mt-4 relative">
            <div
              className="mx-auto border shadow-sm bg-white transition-all duration-200 overflow-hidden"
              style={{
                width: `${(8.27 * zoom) / 100}in`,
                height: `${(11.69 * zoom) / 100}in`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <Image
                src={template.previewImage || "/placeholder.svg"}
                alt={`Visualização de ${document.name} - ${template.name}`}
                width={800}
                height={1100}
                className="w-full h-full object-contain"
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Modelo</Label>
                  <Select value={template.id} onValueChange={handleTemplateChange}>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {document.templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printer">Impressora</Label>
                  <Select defaultValue="hp-laserjet">
                    <SelectTrigger id="printer">
                      <SelectValue placeholder="Selecione uma impressora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hp-laserjet">HP LaserJet Pro M404</SelectItem>
                      <SelectItem value="zebra-zt411">Zebra ZT411</SelectItem>
                      <SelectItem value="epson-l3150">Epson L3150</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="copies">Número de cópias</Label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-r-none"
                      onClick={() => setCopies((prev) => Math.max(1, prev - 1))}
                      disabled={copies <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="copies"
                      type="number"
                      min={1}
                      value={copies}
                      onChange={(e) => setCopies(Number.parseInt(e.target.value) || 1)}
                      className="rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-l-none"
                      onClick={() => setCopies((prev) => prev + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paper-size">Tamanho do papel</Label>
                  <Select defaultValue="a4">
                    <SelectTrigger id="paper-size">
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                      <SelectItem value="letter">Carta (216 x 279 mm)</SelectItem>
                      <SelectItem value="legal">Ofício (216 x 356 mm)</SelectItem>
                      <SelectItem value="a5">A5 (148 x 210 mm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orientation">Orientação</Label>
                  <Select defaultValue="portrait">
                    <SelectTrigger id="orientation">
                      <SelectValue placeholder="Selecione a orientação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Retrato</SelectItem>
                      <SelectItem value="landscape">Paisagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Qualidade</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger id="quality">
                      <SelectValue placeholder="Selecione a qualidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between sm:justify-between gap-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
          <Button className="bg-[#007846] hover:bg-[#006038]" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

