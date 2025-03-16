"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

interface CaminhaoFormData {
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

export default function NovoCaminhaoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CaminhaoFormData>({
    placa: "",
    renavan: "",
    chassi: "",
    cor: "",
    modelo: "",
    anoModelo: "",
    anoFabricacao: "",
    tipoVeiculo: "",
    tipoFrota: "",
    capacidade: "",
    marca: "",
    proprietario: "",
    cidade: "",
    estado: "",
    status: "ativo",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validação básica
      if (!formData.placa || !formData.modelo || !formData.proprietario) {
        throw new Error("Preencha os campos obrigatórios: Placa, Modelo e Proprietário")
      }

      // Simulando um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Recuperar caminhões existentes
      const storedCaminhoes = localStorage.getItem("caminhoes")
      const caminhoes = storedCaminhoes ? JSON.parse(storedCaminhoes) : []

      // Adicionar novo caminhão
      const novoCaminhao = {
        ...formData,
        id: crypto.randomUUID(),
      }

      caminhoes.push(novoCaminhao)
      localStorage.setItem("caminhoes", JSON.stringify(caminhoes))

      toast({
        title: "Caminhão cadastrado",
        description: `O caminhão ${formData.placa} foi cadastrado com sucesso.`,
      })

      // Redirecionar para a lista de caminhões
      router.push("/dashboard/caminhoes")
    } catch (error) {
      console.error("Erro ao cadastrar caminhão:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao cadastrar o caminhão.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Novo Caminhão</h1>
        <Link href="/dashboard/caminhoes">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Caminhão</CardTitle>
          <CardDescription>
            Preencha os dados do novo caminhão. Os campos marcados com * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="placa">
                  Placa <span className="text-red-500">*</span>
                </Label>
                <Input id="placa" name="placa" value={formData.placa} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="renavan">Renavan</Label>
                <Input id="renavan" name="renavan" value={formData.renavan} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chassi">Chassi</Label>
                <Input id="chassi" name="chassi" value={formData.chassi} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cor">Cor</Label>
                <Input id="cor" name="cor" value={formData.cor} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo">
                  Modelo <span className="text-red-500">*</span>
                </Label>
                <Input id="modelo" name="modelo" value={formData.modelo} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input id="marca" name="marca" value={formData.marca} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anoModelo">Ano Modelo</Label>
                <Input id="anoModelo" name="anoModelo" value={formData.anoModelo} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anoFabricacao">Ano Fabricação</Label>
                <Input id="anoFabricacao" name="anoFabricacao" value={formData.anoFabricacao} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoVeiculo">Tipo de Veículo</Label>
                <Input id="tipoVeiculo" name="tipoVeiculo" value={formData.tipoVeiculo} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoFrota">Tipo de Frota</Label>
                <Input id="tipoFrota" name="tipoFrota" value={formData.tipoFrota} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade (Kg)</Label>
                <Input
                  id="capacidade"
                  name="capacidade"
                  type="number"
                  value={formData.capacidade}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proprietario">
                  Proprietário <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="proprietario"
                  name="proprietario"
                  value={formData.proprietario}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" name="estado" value={formData.estado} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/dashboard/caminhoes">
                <Button variant="outline" type="button" disabled={isLoading}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

