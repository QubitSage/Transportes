"use client"

import { MoreHorizontal, FileEdit, Trash, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DocumentActionsProps {
  data: any
  type: "coleta" | "pesagem" | "fornecedor" | "cliente" | "motorista" | "caminhao" | "produto"
  onEdit?: () => void
  onDelete?: () => void
  onExport?: () => void
  onView?: () => void
}

export function DocumentActions({ data, type, onEdit, onDelete, onExport, onView }: DocumentActionsProps) {
  // Get the label based on the document type
  const getTypeLabel = () => {
    switch (type) {
      case "coleta":
        return "Coleta"
      case "pesagem":
        return "Pesagem"
      case "fornecedor":
        return "Fornecedor"
      case "cliente":
        return "Cliente"
      case "motorista":
        return "Motorista"
      case "caminhao":
        return "Caminhão"
      case "produto":
        return "Produto"
      default:
        return "Documento"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizar {getTypeLabel()}
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <FileEdit className="mr-2 h-4 w-4" />
            Editar {getTypeLabel()}
          </DropdownMenuItem>
        )}
        {onExport && (
          <DropdownMenuItem onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar {getTypeLabel()}
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={onDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Excluir {getTypeLabel()}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

