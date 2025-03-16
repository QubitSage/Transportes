"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Fornecedor {
  id?: number
  nome: string
  endereco: string
  bairro: string
  cidade: string
  contato: string
  cnpj: string
  status?: string
}

export default function NovoFornecedorPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [fornecedor, setFornecedor] = useState<Fornecedor>({
    nome: "",
    endereco: "",
    bairro: "",
    cidade: "",
    contato: "",
    cnpj: "",
    status: "Ativo",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFornecedor((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validar campos obrigatórios
      if (!fornecedor.nome || !fornecedor.cnpj) {
        throw new Error("Nome e CNPJ/CPF são campos obrigatórios.")
      }

      // Simular um pequeno atraso para mostrar o estado de carregamento
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Adicionar ID único
      const novoFornecedor = {
        ...fornecedor,
        id: Date.now(),
      }

      // Carregar fornecedores existentes do localStorage
      const savedFornecedores = localStorage.getItem("fornecedores")
      const fornecedoresAtuais = savedFornecedores ? JSON.parse(savedFornecedores) : []

      // Adicionar novo fornecedor à lista
      const updatedFornecedores = [...fornecedoresAtuais, novoFornecedor]

      // Salvar no localStorage
      localStorage.setItem("fornecedores", JSON.stringify(updatedFornecedores))

      toast({
        title: "Fornecedor cadastrado",
        description: "O fornecedor foi cadastrado com sucesso.",
      })

      // Redirecionar para a lista de fornecedores
      router.push("/dashboard/fornecedores")
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível cadastrar o fornecedor.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/fornecedores">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Novo Fornecedor</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Cadastrar Fornecedor</CardTitle>
            <CardDescription>Preencha os dados do novo fornecedor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Nome do fornecedor"
                  value={fornecedor.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">
                  CNPJ/CPF <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={fornecedor.cnpj}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                placeholder="Endereço completo"
                value={fornecedor.endereco}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  placeholder="Bairro"
                  value={fornecedor.bairro}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  placeholder="Cidade"
                  value={fornecedor.cidade}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contato">Contato</Label>
                <Input
                  id="contato"
                  name="contato"
                  placeholder="Telefone ou e-mail"
                  value={fornecedor.contato}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={fornecedor.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/fornecedores">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Fornecedor
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

