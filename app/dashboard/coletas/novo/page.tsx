"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useData } from "@/lib/data-context"

export default function NovaColetaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addOrdemColeta, fornecedores, clientes, produtos } = useData()

  // Estado para o formulário
  const [formData, setFormData] = useState({
    dataEmissao: new Date().toISOString().split("T")[0],
    dataPrevista: "",
    tipo: "Coleta",
    status: "Pendente",
    remetente: "",
    destinatario: "",
    produto: "",
    valorFrete: 0,
    motorista: "",
    veiculo: "",
    observacoes: "",
  })

  // Função para atualizar o estado do formulário
  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.dataPrevista || !formData.remetente || !formData.destinatario || !formData.produto) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    // Gerar ID único para a nova ordem
    const newId = `OS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    // Criar objeto da nova ordem
    const newOrdem = {
      id: newId,
      dataEmissao: formData.dataEmissao,
      dataPrevista: formData.dataPrevista,
      tipo: formData.tipo,
      status: formData.status as "Pendente" | "Em andamento" | "Concluída" | "Cancelada",
      remetente: formData.remetente,
      destinatario: formData.destinatario,
      produto: formData.produto,
      valorFrete: Number(formData.valorFrete),
      motorista: formData.motorista,
      veiculo: formData.veiculo,
      observacoes: formData.observacoes,
    }

    // Adicionar a nova ordem ao estado
    addOrdemColeta(newOrdem)

    // Mostrar mensagem de sucesso
    toast({
      title: "Ordem de coleta criada",
      description: `A ordem de coleta ${newId} foi criada com sucesso.`,
    })

    // Redirecionar para a página de listagem
    router.push("/dashboard/coletas")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Nova Ordem de Coleta</h1>
          <p className="text-muted-foreground">Preencha os dados para criar uma nova ordem de coleta</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/coletas")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Detalhes da ordem de coleta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataEmissao">Data de Emissão</Label>
                  <Input
                    id="dataEmissao"
                    type="date"
                    value={formData.dataEmissao}
                    onChange={(e) => handleChange("dataEmissao", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataPrevista">Data Prevista</Label>
                  <Input
                    id="dataPrevista"
                    type="date"
                    value={formData.dataPrevista}
                    onChange={(e) => handleChange("dataPrevista", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleChange("tipo", value)}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coleta">Coleta</SelectItem>
                    <SelectItem value="Entrega">Entrega</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações de Transporte</CardTitle>
              <CardDescription>Detalhes do remetente, destinatário e produto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="remetente">Remetente</Label>
                <Select value={formData.remetente} onValueChange={(value) => handleChange("remetente", value)}>
                  <SelectTrigger id="remetente">
                    <SelectValue placeholder="Selecione o remetente" />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores.map((fornecedor) => (
                      <SelectItem key={fornecedor.id} value={fornecedor.nome}>
                        {fornecedor.nome}
                      </SelectItem>
                    ))}
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinatario">Destinatário</Label>
                <Select value={formData.destinatario} onValueChange={(value) => handleChange("destinatario", value)}>
                  <SelectTrigger id="destinatario">
                    <SelectValue placeholder="Selecione o destinatário" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.nome}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Select value={formData.produto} onValueChange={(value) => handleChange("produto", value)}>
                  <SelectTrigger id="produto">
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map((produto) => (
                      <SelectItem key={produto.id} value={produto.nome}>
                        {produto.nome}
                      </SelectItem>
                    ))}
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorFrete">Valor do Frete (R$)</Label>
                <Input
                  id="valorFrete"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valorFrete}
                  onChange={(e) => handleChange("valorFrete", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
              <CardDescription>Motorista, veículo e observações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motorista">Motorista</Label>
                  <Input
                    id="motorista"
                    value={formData.motorista}
                    onChange={(e) => handleChange("motorista", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veiculo">Veículo (Placa)</Label>
                  <Input
                    id="veiculo"
                    value={formData.veiculo}
                    onChange={(e) => handleChange("veiculo", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleChange("observacoes", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="bg-[#007846] hover:bg-[#006038]">
            <Save className="mr-2 h-4 w-4" />
            Salvar Ordem de Coleta
          </Button>
        </div>
      </form>
    </div>
  )
}

