"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Download, Search, RefreshCw } from "lucide-react"
import { useLoggingStore, type LogEntry, type ActionType, type ResourceType } from "@/lib/logging"
import Breadcrumb from "@/components/breadcrumb"

export default function LogsPage() {
  const { logs, getLogsByAction, getLogsByResource, getLogsByDateRange } = useLoggingStore()

  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<ActionType | "all">("all")
  const [resourceFilter, setResourceFilter] = useState<ResourceType | "all">("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...logs]

    // Filter by action
    if (actionFilter !== "all") {
      result = result.filter((log) => log.action === actionFilter)
    }

    // Filter by resource
    if (resourceFilter !== "all") {
      result = result.filter((log) => log.resource === resourceFilter)
    }

    // Filter by date range
    if (dateFrom && dateTo) {
      result = result.filter((log) => {
        const logDate = new Date(log.timestamp)
        return logDate >= dateFrom && logDate <= dateTo
      })
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (log) =>
          log.details.toLowerCase().includes(term) ||
          log.userName.toLowerCase().includes(term) ||
          log.resourceId?.toLowerCase().includes(term),
      )
    }

    setFilteredLogs(result)
  }, [logs, actionFilter, resourceFilter, dateFrom, dateTo, searchTerm])

  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })
  }

  // Get action label
  const getActionLabel = (action: ActionType) => {
    const labels: Record<ActionType, string> = {
      create: "Criação",
      update: "Atualização",
      delete: "Exclusão",
      view: "Visualização",
      export: "Exportação",
      import: "Importação",
      login: "Login",
      logout: "Logout",
      other: "Outro",
    }
    return labels[action] || action
  }

  // Get resource label
  const getResourceLabel = (resource: ResourceType) => {
    const labels: Record<ResourceType, string> = {
      coleta: "Coleta",
      pesagem: "Pesagem",
      fornecedor: "Fornecedor",
      cliente: "Cliente",
      motorista: "Motorista",
      caminhao: "Caminhão",
      produto: "Produto",
      usuario: "Usuário",
      configuracao: "Configuração",
      relatorio: "Relatório",
      system: "Sistema",
    }
    return labels[resource] || resource
  }

  // Export logs to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Data/Hora", "Usuário", "Ação", "Recurso", "ID do Recurso", "Detalhes"]

    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          log.id,
          formatTimestamp(log.timestamp),
          log.userName,
          getActionLabel(log.action),
          getResourceLabel(log.resource),
          log.resourceId || "",
          `"${log.details.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `logs_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Logs do Sistema</h1>
          <p className="text-muted-foreground">Visualize e gerencie os registros de atividades do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os logs por diferentes critérios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Busca</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar nos logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ação</label>
              <Select value={actionFilter} onValueChange={(value: any) => setActionFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  <SelectItem value="create">Criação</SelectItem>
                  <SelectItem value="update">Atualização</SelectItem>
                  <SelectItem value="delete">Exclusão</SelectItem>
                  <SelectItem value="view">Visualização</SelectItem>
                  <SelectItem value="export">Exportação</SelectItem>
                  <SelectItem value="import">Importação</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recurso</label>
              <Select value={resourceFilter} onValueChange={(value: any) => setResourceFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um recurso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os recursos</SelectItem>
                  <SelectItem value="coleta">Coleta</SelectItem>
                  <SelectItem value="pesagem">Pesagem</SelectItem>
                  <SelectItem value="fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="motorista">Motorista</SelectItem>
                  <SelectItem value="caminhao">Caminhão</SelectItem>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="usuario">Usuário</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data inicial"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data final"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setActionFilter("all")
                setResourceFilter("all")
                setDateFrom(undefined)
                setDateTo(undefined)
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registros de Atividades</CardTitle>
          <CardDescription>
            {filteredLogs.length} {filteredLogs.length === 1 ? "registro encontrado" : "registros encontrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>ID do Recurso</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>{getActionLabel(log.action)}</TableCell>
                    <TableCell>{getResourceLabel(log.resource)}</TableCell>
                    <TableCell>{log.resourceId || "-"}</TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

