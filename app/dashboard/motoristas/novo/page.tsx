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

interface MotoristaFormData {
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

export default function NovoMotoristaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<MotoristaFormData>({
    nome: "",
    prontuario: "",
    cnh: "",
    categoria: "",
    liberacao: "",
    validade: "",
    cpf: "",
    rg: "",
    pisPasep: "",
    dataNascimento: "",
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
      if (!formData.nome || !formData.cpf) {
        throw new Error("Preencha os campos obrigatórios: Nome e CPF")
      }

      // Simulando um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Recuperar motoristas existentes
      const storedMotoristas = localStorage.getItem("motoristas")
      const motoristas = storedMotoristas ? JSON.parse(storedMotoristas) : []

      // Adicionar novo motorista
      const novoMotorista = {
        ...formData,
        id: crypto.randomUUID(),
      }

      motoristas.push(novoMotorista)
      localStorage.setItem("motoristas", JSON.stringify(motoristas))

      toast({
        title: "Motorista cadastrado",
        description: `O motorista ${formData.nome} foi cadastrado com sucesso.`,
      })

      // Redirecionar para a lista de motoristas
      router.push("/dashboard/motoristas")
    } catch (error) {
      console.error("Erro ao cadastrar motorista:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao cadastrar o motorista.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Novo Motorista</h1>
        <Link href="/dashboard/motoristas">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Motorista</CardTitle>
          <CardDescription>
            Preencha os dados do novo motorista. Os campos marcados com * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prontuario">Prontuário</Label>
                <Input id="prontuario" name="prontuario" value={formData.prontuario} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnh">CNH</Label>
                <Input id="cnh" name="cnh" value={formData.cnh} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liberacao">Liberação</Label>
                <Input id="liberacao" name="liberacao" value={formData.liberacao} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validade">Validade</Label>
                <Input id="validade" name="validade" value={formData.validade} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">
                  CPF <span className="text-red-500">*</span>
                </Label>
                <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" name="rg" value={formData.rg} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pisPasep">PIS/PASEP</Label>
                <Input id="pisPasep" name="pisPasep" value={formData.pisPasep} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                />
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
              <Link href="/dashboard/motoristas">
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

