"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Printer, FileText, Truck, User, Package, Building2, Calendar, Scale } from "lucide-react"
import Link from "next/link"
import { useAppContext } from "@/contexts/AppContext"
import { useToast } from "@/components/ui/use-toast"

export default function NovaPesagemPage() {
  const router = useRouter()
  const { motoristas, caminhoes, produtos, clientes, addPesagem } = useAppContext()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dados")
  const [formData, setFormData] = useState({
    produto: "",
    motorista: "",
    caminhao: "",
    carreta: "",
    cliente: "",
    pesoInicial: "",
    pesoLiquido: "",
    operador: "Administrador",
    dataEntrada: new Date().toISOString().split("T")[0],
    horaEntrada: new Date().toTimeString().split(" ")[0].substring(0, 5),
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const novaPesagem = {
      id: Date.now(), // Gera um ID único
      data: `${formData.dataEntrada} ${formData.horaEntrada}`,
      motorista: formData.motorista,
      produto: formData.produto,
      pesoInicial: Number(formData.pesoInicial),
      pesoLiquido: Number(formData.pesoLiquido),
      pesoFinal: Number(formData.pesoInicial) + Number(formData.pesoLiquido),
      cliente: formData.cliente,
      status: "Em andamento",
    }
    addPesagem(novaPesagem)
    toast({ title: "Pesagem registrada", description: "A nova pesagem foi registrada com sucesso." })
    router.push("/dashboard/pesagens")
  }

  const calcularPesoFinal = () => {
    const inicial = Number.parseFloat(formData.pesoInicial) || 0
    const liquido = Number.parseFloat(formData.pesoLiquido) || 0
    return inicial + liquido
  }

  // ... (resto do código permanece o mesmo)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pesagens">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Nova Pesagem</h1>
            <p className="text-muted-foreground">Registre uma nova pesagem no sistema</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/pesagens")}>
            Cancelar
          </Button>
          <Button className="bg-[#007846] hover:bg-[#006038]" onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Pesagem
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dados">Dados da Pesagem</TabsTrigger>
          <TabsTrigger value="revisao">Revisão e Impressão</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Selecione o produto, motorista e veículos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="produto" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Produto
                  </Label>
                  <Select value={formData.produto} onValueChange={(value) => handleChange("produto", value)}>
                    <SelectTrigger id="produto">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map((produto) => (
                        <SelectItem key={produto.id} value={produto.nome}>
                          {produto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motorista" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Motorista
                  </Label>
                  <Select value={formData.motorista} onValueChange={(value) => handleChange("motorista", value)}>
                    <SelectTrigger id="motorista">
                      <SelectValue placeholder="Selecione um motorista" />
                    </SelectTrigger>
                    <SelectContent>
                      {motoristas.map((motorista) => (
                        <SelectItem key={motorista.id} value={motorista.nome}>
                          {motorista.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caminhao" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Caminhão (Cavalo)
                  </Label>
                  <Select value={formData.caminhao} onValueChange={(value) => handleChange("caminhao", value)}>
                    <SelectTrigger id="caminhao">
                      <SelectValue placeholder="Selecione um caminhão" />
                    </SelectTrigger>
                    <SelectContent>
                      {caminhoes.map((caminhao) => (
                        <SelectItem key={caminhao.id} value={caminhao.placa}>
                          {caminhao.placa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carreta" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Carreta
                  </Label>
                  <Select value={formData.carreta} onValueChange={(value) => handleChange("carreta", value)}>
                    <SelectTrigger id="carreta">
                      <SelectValue placeholder="Selecione uma carreta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carreta-1">Carreta - JKL-3456</SelectItem>
                      <SelectItem value="carreta-2">Carreta - MNO-7890</SelectItem>
                      <SelectItem value="carreta-3">Carreta - PQR-1234</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cliente" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Cliente
                  </Label>
                  <Select value={formData.cliente} onValueChange={(value) => handleChange("cliente", value)}>
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.nome}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações de Peso</CardTitle>
                <CardDescription>Registre os pesos e datas de entrada/saída</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pesoInicial" className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Peso Inicial (kg)
                  </Label>
                  <Input
                    id="pesoInicial"
                    type="number"
                    placeholder="Ex: 5000"
                    value={formData.pesoInicial}
                    onChange={(e) => handleChange("pesoInicial", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pesoLiquido" className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Peso Líquido (kg)
                  </Label>
                  <Input
                    id="pesoLiquido"
                    type="number"
                    placeholder="Ex: 15000"
                    value={formData.pesoLiquido}
                    onChange={(e) => handleChange("pesoLiquido", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pesoFinal" className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Peso Final (kg)
                  </Label>
                  <Input
                    id="pesoFinal"
                    type="number"
                    value={calcularPesoFinal().toString()}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-muted-foreground">
                    Calculado automaticamente (Peso Inicial + Peso Líquido)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataEntrada" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Data de Entrada
                    </Label>
                    <Input
                      id="dataEntrada"
                      type="date"
                      value={formData.dataEntrada}
                      onChange={(e) => handleChange("dataEntrada", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horaEntrada" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Hora de Entrada
                    </Label>
                    <Input
                      id="horaEntrada"
                      type="time"
                      value={formData.horaEntrada}
                      onChange={(e) => handleChange("horaEntrada", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operador" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Operador
                  </Label>
                  <Input id="operador" value={formData.operador} disabled className="bg-gray-100" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => setActiveTab("revisao")} className="bg-[#1e366a] hover:bg-[#162a54]">
                  Avançar para Revisão
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revisao">
          <Card>
            <CardHeader>
              <CardTitle>Revisão da Pesagem</CardTitle>
              <CardDescription>Revise os dados antes de finalizar o registro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="font-semibold text-[#1e366a] mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informações Básicas
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nº Sequencial:</span>
                        <span className="font-medium">1005</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Produto:</span>
                        <span className="font-medium">
                          {formData.produto
                            ? formData.produto.charAt(0).toUpperCase() + formData.produto.slice(1)
                            : "Não selecionado"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Motorista:</span>
                        <span className="font-medium">
                          {formData.motorista ? formData.motorista : "Não selecionado"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Caminhão:</span>
                        <span className="font-medium">{formData.caminhao ? formData.caminhao : "Não selecionado"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Carreta:</span>
                        <span className="font-medium">
                          {formData.carreta === "carreta-1"
                            ? "Carreta - JKL-3456"
                            : formData.carreta === "carreta-2"
                              ? "Carreta - MNO-7890"
                              : formData.carreta === "carreta-3"
                                ? "Carreta - PQR-1234"
                                : "Não selecionado"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cliente:</span>
                        <span className="font-medium">{formData.cliente ? formData.cliente : "Não selecionado"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="font-semibold text-[#1e366a] mb-2 flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Informações de Peso
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peso Inicial:</span>
                        <span className="font-medium">{formData.pesoInicial || "0"} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peso Líquido:</span>
                        <span className="font-medium">{formData.pesoLiquido || "0"} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peso Final:</span>
                        <span className="font-medium">{calcularPesoFinal()} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data de Entrada:</span>
                        <span className="font-medium">{formData.dataEntrada}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hora de Entrada:</span>
                        <span className="font-medium">{formData.horaEntrada}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Operador:</span>
                        <span className="font-medium">{formData.operador}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-md bg-amber-50 p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 p-1">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800">Observações</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Verifique todos os dados antes de finalizar o registro. Após salvar, o relatório de pesagem será
                      gerado automaticamente e poderá ser impresso ou modificado posteriormente.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("dados")}>
                Voltar para Edição
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button className="bg-[#007846] hover:bg-[#006038]" onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  Finalizar Registro
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

