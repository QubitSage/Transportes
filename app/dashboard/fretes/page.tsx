"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableHeader, TableRow, TableCell, TableBody, Button } from "@nextui-org/react"
import { SearchIcon } from "@/components/icons/SearchIcon"
import { Input } from "@nextui-org/react"
import { PlusIcon } from "@/components/icons/PlusIcon"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DocumentActions } from "@/components/document-actions"

interface Frete {
  id: string
  nome: string
  data_criacao: string
  status: string
  valor: number
}

export default function FretesPage() {
  const [fretes, setFretes] = useState<Frete[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fretes", {
          cache: "no-store",
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setFretes(data)
      } catch (error) {
        console.error("Could not fetch fretes:", error)
      }
    }

    fetchData()
  }, [])

  const filteredFretes = fretes.filter((frete) => frete.nome.toLowerCase().includes(searchQuery.toLowerCase()))

  const renderCell = (frete: Frete, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <DocumentActions
              data={frete}
              type="frete"
              onExport={() => {
                /* lógica de exportação */
              }}
            />
          </div>
        )
      default:
        return frete[columnKey as keyof Frete]?.toString() || ""
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fretes</h1>
        <Link href="/dashboard/fretes/novo">
          <Button color="primary" startContent={<PlusIcon />}>
            Novo Frete
          </Button>
        </Link>
      </div>

      <Input
        isClearable
        placeholder="Pesquisar fretes..."
        startContent={<SearchIcon />}
        className="max-w-xs mb-4"
        value={searchQuery}
        onClear={() => setSearchQuery("")}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Table aria-label="Lista de Fretes">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Nome</TableHeaderCell>
            <TableHeaderCell>Data de Criação</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Valor</TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody items={filteredFretes}>
          {(frete) => (
            <TableRow key={frete.id}>
              <TableCell>{frete.nome}</TableCell>
              <TableCell>{frete.data_criacao}</TableCell>
              <TableCell>{frete.status}</TableCell>
              <TableCell>{frete.valor}</TableCell>
              <TableCell>{renderCell(frete, "actions")}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const TableHeaderCell = ({ children }: { children: React.ReactNode }) => {
  return (
    <TableHeader>
      <TableCell className="text-small font-bold">{children}</TableCell>
    </TableHeader>
  )
}

