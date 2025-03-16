"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function PaginationControls({ currentPage, pageCount, onPageChange }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {currentPage} de {pageCount}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        Próxima
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

