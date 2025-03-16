"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useAlert } from "@/contexts/alert-context"
import { Bell, Send, Users, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react"

interface SendPushDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendPushDialog({ open, onOpenChange }: SendPushDialogProps) {
  const { users } = useAuth()
  const { toast } = useToast()
  const { showAlert } = useAlert()

  const [notificationType, setNotificationType] = useState<"success" | "error" | "warning" | "info">("info")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<Record<number, boolean>>({})
  const [selectAll, setSelectAll] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // Função para lidar com a seleção de todos os usuários
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)

    const newSelectedUsers: Record<number, boolean> = {}
    users.forEach((user) => {
      newSelectedUsers[user.id] = checked
    })

    setSelectedUsers(newSelectedUsers)
  }

  // Função para lidar com a seleção individual de usuários
  const handleSelectUser = (userId: number, checked: boolean) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [userId]: checked,
    }))

    // Verificar se todos estão selecionados para atualizar o estado selectAll
    const allSelected = users.every((user) => selectedUsers[user.id] || (user.id === userId && checked))

    setSelectAll(allSelected)
  }

  // Função para enviar a notificação
  const handleSendNotification = () => {
    if (!title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para a notificação.",
        variant: "destructive",
      })
      return
    }

    if (!message.trim()) {
      toast({
        title: "Mensagem obrigatória",
        description: "Por favor, informe uma mensagem para a notificação.",
        variant: "destructive",
      })
      return
    }

    const selectedUserIds = Object.entries(selectedUsers)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => Number.parseInt(id))

    if (selectedUserIds.length === 0) {
      toast({
        title: "Nenhum usuário selecionado",
        description: "Por favor, selecione pelo menos um usuário para enviar a notificação.",
        variant: "destructive",
      })
      return
    }

    // Simulação de envio
    setIsSending(true)

    setTimeout(() => {
      setIsSending(false)

      // Mostrar alerta de sucesso
      showAlert({
        message: "Notificação enviada",
        description: `Notificação enviada com sucesso para ${selectedUserIds.length} usuário(s).`,
        type: "success",
        duration: 5000,
      })

      // Limpar o formulário e fechar o diálogo
      setTitle("")
      setMessage("")
      setSelectedUsers({})
      setSelectAll(false)
      onOpenChange(false)

      // Mostrar toast com detalhes
      toast({
        title: "Notificação enviada",
        description: `A notificação foi enviada para ${selectedUserIds.length} usuário(s).`,
      })
    }, 1500)
  }

  // Função para obter o ícone com base no tipo de notificação
  const getNotificationIcon = () => {
    switch (notificationType) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Enviar Notificação Push
          </DialogTitle>
          <DialogDescription>Envie uma notificação manual para os usuários selecionados</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notification-type">Tipo de Notificação</Label>
            <Select
              value={notificationType}
              onValueChange={(value: "success" | "error" | "warning" | "info") => setNotificationType(value)}
            >
              <SelectTrigger id="notification-type" className="flex items-center gap-2">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Sucesso</span>
                  </div>
                </SelectItem>
                <SelectItem value="error">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>Erro</span>
                  </div>
                </SelectItem>
                <SelectItem value="warning">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Aviso</span>
                  </div>
                </SelectItem>
                <SelectItem value="info">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span>Informação</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-title">Título</Label>
            <Input
              id="notification-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da notificação"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-message">Mensagem</Label>
            <Textarea
              id="notification-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem da notificação"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Selecionar Usuários
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                />
                <Label htmlFor="select-all" className="text-sm">
                  Selecionar todos
                </Label>
              </div>
            </div>

            <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers[user.id] || false}
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked === true)}
                    />
                    <Label htmlFor={`user-${user.id}`} className="flex items-center gap-2">
                      <span className="font-medium">{user.username}</span>
                      <span className="text-xs text-muted-foreground">({user.email})</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100">{user.role}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md border">
            <div className="text-sm font-medium mb-2">Prévia da notificação:</div>
            <div className="flex items-start gap-3 p-3 bg-white rounded border">
              <div className="flex-shrink-0 mt-1">{getNotificationIcon()}</div>
              <div>
                <div className="font-medium">{title || "Título da notificação"}</div>
                <div className="text-sm text-muted-foreground mt-1">{message || "Mensagem da notificação"}</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSendNotification} className="bg-[#007846] hover:bg-[#006038]" disabled={isSending}>
            {isSending ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Notificação
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

