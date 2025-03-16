"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Save, X, FileSpreadsheet, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Tipos para as configurações de exportação
export interface ExportColumn {
  id: string
  field: string
  header: string
  include: boolean
  width: number
  format?: string
}

export interface ExportConfig {
  id: string
  name: string
  description?: string
  type: "pesagens" | "coletas" | "fornecedores" | "caminhoes" | "produtos" | "clientes"
  columns: ExportColumn[]
  showHeaders: boolean
  showGridLines: boolean
  showTotals: boolean
  orientation: "portrait" | "landscape"
  paperSize: "a4" | "letter" | "legal"
  logo: boolean
  dateFormat: string
  numberFormat: string
  currencyFormat: string
}

interface ExportConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "pesagens" | "coletas" | "fornecedores" | "caminhoes" | "produtos" | "clientes"
  onExport: (config: ExportConfig, format: "csv" | "pdf" | "excel") => void
}

// Configurações padrão para cada tipo
const getDefaultColumns = (type: string): ExportColumn[] => {
  switch (type) {
    case "pesagens":
      return [
        { id: "1", field: "id", header: "Ticket", include: true, width: 80 },
        { id: "2", field: "data", header: "Data", include: true, width: 100, format: "date" },
        { id: "3", field: "motorista", header: "Motorista", include: true, width: 150 },
        { id: "4", field: "produto", header: "Produto", include: true, width: 150 },
        { id: "5", field: "pesoInicial", header: "Peso Inicial (kg)", include: true, width: 120, format: "number" },
        { id: "6", field: "pesoLiquido", header: "Peso Líquido (kg)", include: true, width: 120, format: "number" },
        { id: "7", field: "pesoFinal", header: "Peso Final (kg)", include: true, width: 120, format: "number" },
        { id: "8", field: "cliente", header: "Cliente", include: true, width: 150 },
        { id: "9", field: "status", header: "Status", include: true, width: 100 },
      ]
    case "coletas":
      return [
        { id: "1", field: "id", header: "Número", include: true, width: 100 },
        { id: "2", field: "dataEmissao", header: "Data Emissão", include: true, width: 100, format: "date" },
        { id: "3", field: "dataPrevista", header: "Data Prevista", include: true, width: 100, format: "date" },
        { id: "4", field: "tipo", header: "Tipo", include: true, width: 100 },
        { id: "5", field: "remetente", header: "Remetente", include: true, width: 150 },
        { id: "6", field: "destinatario", header: "Destinatário", include: true, width: 150 },
        { id: "7", field: "produto", header: "Produto", include: true, width: 150 },
        { id: "8", field: "valorFrete", header: "Valor Frete", include: true, width: 120, format: "currency" },
        { id: "9", field: "status", header: "Status", include: true, width: 100 },
      ]
    // Adicione outros tipos conforme necessário
    default:
      return []
  }
}

const getDefaultConfig = (type: string): ExportConfig => {
  return {
    id: `default-${type}`,
    name: `Configuração Padrão - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    type: type as any,
    columns: getDefaultColumns(type),
    showHeaders: true,
    showGridLines: true,
    showTotals: true,
    orientation: "landscape",
    paperSize: "a4",
    logo: true,
    dateFormat: "dd/MM/yyyy",
    numberFormat: "#,##0.00",
    currencyFormat: "R$ #,##0.00",
  }
}

// Componente principal
export function ExportConfigDialog({ open, onOpenChange, type, onExport }: ExportConfigDialogProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("columns")
  const [configs, setConfigs] = useState<ExportConfig[]>([])
  const [selectedConfigId, setSelectedConfigId] = useState<string>("")
  const [currentConfig, setCurrentConfig] = useState<ExportConfig>(getDefaultConfig(type))
  const [newConfigName, setNewConfigName] = useState("")

  // Carregar configurações salvas
  useEffect(() => {
    const savedConfigs = localStorage.getItem("exportConfigs")
    if (savedConfigs) {
      const parsedConfigs = JSON.parse(savedConfigs) as ExportConfig[]
      setConfigs(parsedConfigs)

      // Encontrar uma configuração para o tipo atual
      const typeConfig = parsedConfigs.find((config) => config.type === type)
      if (typeConfig) {
        setSelectedConfigId(typeConfig.id)
        setCurrentConfig(typeConfig)
      } else {
        // Se não houver configuração para este tipo, use a padrão
        const defaultConfig = getDefaultConfig(type)
        setCurrentConfig(defaultConfig)
        setSelectedConfigId(defaultConfig.id)
      }
    } else {
      // Se não houver configurações salvas, use a padrão
      const defaultConfig = getDefaultConfig(type)
      setConfigs([defaultConfig])
      setSelectedConfigId(defaultConfig.id)
    }
  }, [type])

  // Atualizar configuração atual quando a seleção mudar
  useEffect(() => {
    const selected = configs.find((config) => config.id === selectedConfigId)
    if (selected) {
      setCurrentConfig(selected)
    }
  }, [selectedConfigId, configs])

  // Salvar configurações
  const saveConfig = () => {
    const updatedConfigs = selectedConfigId
      ? configs.map((config) => (config.id === selectedConfigId ? currentConfig : config))
      : [...configs, { ...currentConfig, id: `config-${Date.now()}` }]

    setConfigs(updatedConfigs)
    localStorage.setItem("exportConfigs", JSON.stringify(updatedConfigs))

    toast({
      title: "Configuração salva",
      description: "Suas preferências de exportação foram salvas com sucesso.",
    })
  }

  // Salvar como nova configuração
  const saveAsNewConfig = () => {
    if (!newConfigName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, forneça um nome para a nova configuração.",
        variant: "destructive",
      })
      return
    }

    const newConfig = {
      ...currentConfig,
      id: `config-${Date.now()}`,
      name: newConfigName,
    }

    const updatedConfigs = [...configs, newConfig]
    setConfigs(updatedConfigs)
    setSelectedConfigId(newConfig.id)
    localStorage.setItem("exportConfigs", JSON.stringify(updatedConfigs))
    setNewConfigName("")

    toast({
      title: "Nova configuração criada",
      description: `A configuração "${newConfigName}" foi criada com sucesso.`,
    })
  }

  // Reordenar colunas com drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(currentConfig.columns)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCurrentConfig({
      ...currentConfig,
      columns: items,
    })
  }

  // Atualizar inclusão de coluna
  const toggleColumnInclude = (columnId: string) => {
    setCurrentConfig({
      ...currentConfig,
      columns: currentConfig.columns.map((col) => (col.id === columnId ? { ...col, include: !col.include } : col)),
    })
  }

  // Atualizar largura da coluna
  const updateColumnWidth = (columnId: string, width: number) => {
    setCurrentConfig({
      ...currentConfig,
      columns: currentConfig.columns.map((col) => (col.id === columnId ? { ...col, width } : col)),
    })
  }

  // Atualizar cabeçalho da coluna
  const updateColumnHeader = (columnId: string, header: string) => {
    setCurrentConfig({
      ...currentConfig,
      columns: currentConfig.columns.map((col) => (col.id === columnId ? { ...col, header } : col)),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Configurações de Exportação</DialogTitle>
          <DialogDescription>Personalize como seus dados serão exportados para CSV e PDF</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="configSelect">Configuração:</Label>
              <Select value={selectedConfigId} onValueChange={setSelectedConfigId}>
                <SelectTrigger id="configSelect" className="w-[250px]">
                  <SelectValue placeholder="Selecione uma configuração" />
                </SelectTrigger>
                <SelectContent>
                  {configs
                    .filter((c) => c.type === type)
                    .map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => onExport(currentConfig, "csv")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" onClick={() => onExport(currentConfig, "excel")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" onClick={() => onExport(currentConfig, "pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="columns">Colunas</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="format">Formatação</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto mt-4">
              <TabsContent value="columns" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuração de Colunas</CardTitle>
                    <CardDescription>
                      Arraste para reordenar, marque para incluir e ajuste as larguras das colunas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="columns">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {currentConfig.columns.map((column, index) => (
                              <Draggable key={column.id} draggableId={column.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center space-x-4 p-3 border rounded-md bg-white"
                                  >
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Checkbox
                                      id={`include-${column.id}`}
                                      checked={column.include}
                                      onCheckedChange={() => toggleColumnInclude(column.id)}
                                    />
                                    <div className="flex-1">
                                      <Input
                                        value={column.header}
                                        onChange={(e) => updateColumnHeader(column.id, e.target.value)}
                                        placeholder="Nome da coluna"
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Label htmlFor={`width-${column.id}`} className="text-sm">
                                        Largura:
                                      </Label>
                                      <Input
                                        id={`width-${column.id}`}
                                        type="number"
                                        value={column.width}
                                        onChange={(e) => updateColumnWidth(column.id, Number.parseInt(e.target.value))}
                                        className="w-20"
                                      />
                                    </div>
                                    <div className="text-sm text-gray-500">{column.field}</div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparência do Documento</CardTitle>
                    <CardDescription>Configure a aparência visual dos documentos exportados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showHeaders"
                            checked={currentConfig.showHeaders}
                            onCheckedChange={(checked) =>
                              setCurrentConfig({
                                ...currentConfig,
                                showHeaders: !!checked,
                              })
                            }
                          />
                          <Label htmlFor="showHeaders">Mostrar cabeçalhos</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showGridLines"
                            checked={currentConfig.showGridLines}
                            onCheckedChange={(checked) =>
                              setCurrentConfig({
                                ...currentConfig,
                                showGridLines: !!checked,
                              })
                            }
                          />
                          <Label htmlFor="showGridLines">Mostrar linhas de grade</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showTotals"
                            checked={currentConfig.showTotals}
                            onCheckedChange={(checked) =>
                              setCurrentConfig({
                                ...currentConfig,
                                showTotals: !!checked,
                              })
                            }
                          />
                          <Label htmlFor="showTotals">Mostrar totais</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showLogo"
                            checked={currentConfig.logo}
                            onCheckedChange={(checked) =>
                              setCurrentConfig({
                                ...currentConfig,
                                logo: !!checked,
                              })
                            }
                          />
                          <Label htmlFor="showLogo">Incluir logo da empresa</Label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="orientation">Orientação</Label>
                          <Select
                            value={currentConfig.orientation}
                            onValueChange={(value: "portrait" | "landscape") =>
                              setCurrentConfig({
                                ...currentConfig,
                                orientation: value,
                              })
                            }
                          >
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
                          <Label htmlFor="paperSize">Tamanho do papel</Label>
                          <Select
                            value={currentConfig.paperSize}
                            onValueChange={(value: "a4" | "letter" | "legal") =>
                              setCurrentConfig({
                                ...currentConfig,
                                paperSize: value,
                              })
                            }
                          >
                            <SelectTrigger id="paperSize">
                              <SelectValue placeholder="Selecione o tamanho" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a4">A4</SelectItem>
                              <SelectItem value="letter">Carta</SelectItem>
                              <SelectItem value="legal">Ofício</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="format" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Formatação de Dados</CardTitle>
                    <CardDescription>Configure como os diferentes tipos de dados serão formatados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Formato de data</Label>
                        <Select
                          value={currentConfig.dateFormat}
                          onValueChange={(value) =>
                            setCurrentConfig({
                              ...currentConfig,
                              dateFormat: value,
                            })
                          }
                        >
                          <SelectTrigger id="dateFormat">
                            <SelectValue placeholder="Selecione o formato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dd/MM/yyyy">DD/MM/AAAA (31/12/2023)</SelectItem>
                            <SelectItem value="MM/dd/yyyy">MM/DD/AAAA (12/31/2023)</SelectItem>
                            <SelectItem value="yyyy-MM-dd">AAAA-MM-DD (2023-12-31)</SelectItem>
                            <SelectItem value="dd/MM/yyyy HH:mm">DD/MM/AAAA HH:MM (31/12/2023 14:30)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numberFormat">Formato de número</Label>
                        <Select
                          value={currentConfig.numberFormat}
                          onValueChange={(value) =>
                            setCurrentConfig({
                              ...currentConfig,
                              numberFormat: value,
                            })
                          }
                        >
                          <SelectTrigger id="numberFormat">
                            <SelectValue placeholder="Selecione o formato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="#,##0.00">1.234,56</SelectItem>
                            <SelectItem value="#,##0">1.235</SelectItem>
                            <SelectItem value="#,##0.000">1.234,567</SelectItem>
                            <SelectItem value="#.##0,00">1,234.56</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currencyFormat">Formato de moeda</Label>
                        <Select
                          value={currentConfig.currencyFormat}
                          onValueChange={(value) =>
                            setCurrentConfig({
                              ...currentConfig,
                              currencyFormat: value,
                            })
                          }
                        >
                          <SelectTrigger id="currencyFormat">
                            <SelectValue placeholder="Selecione o formato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="R$ #,##0.00">R$ 1.234,56</SelectItem>
                            <SelectItem value="#,##0.00 R$">1.234,56 R$</SelectItem>
                            <SelectItem value="$ #,##0.00">$ 1,234.56</SelectItem>
                            <SelectItem value="€ #,##0.00">€ 1.234,56</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between items-center border-t pt-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Nome da nova configuração"
              value={newConfigName}
              onChange={(e) => setNewConfigName(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" onClick={saveAsNewConfig}>
              Salvar como
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={saveConfig}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configuração
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

