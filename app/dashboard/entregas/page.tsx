"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { DocumentActions } from "@/components/document-actions"

interface Entrega {
  id: string
  nome: string
  dataEntrega: string
  status: string
}

const columns: ColumnDef<Entrega>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "dataEntrega",
    header: "Data de Entrega",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const entrega = row.original
      const router = useRouter()
      const { toast } = useToast()

      return (
        <DocumentActions
          data={entrega}
          type="entrega"
          onExport={() => {
            toast({
              title: "Exportação simulada",
              description: "Implementar lógica de exportação aqui.",
            })
          }}
        />
      )
    },
  },
]

interface EntregasPageProps {
  entregas: Entrega[]
}

const EntregasPage = ({ entregas }: EntregasPageProps) => {
  const [data, setData] = useState(entregas)
  const router = useRouter()
  const { toast } = useToast()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: "Entrega deletada.",
      description: "A entrega foi deletada com sucesso.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Entregas</h1>
        <Button onClick={() => router.push("/dashboard/entregas/new")}>Criar Entrega</Button>
      </div>
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full table-auto">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className="px-4 py-2 text-left">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-2 px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EntregasPage

