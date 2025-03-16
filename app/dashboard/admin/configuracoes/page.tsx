"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/contexts/settings-context"
import {
  AlertCircle,
  Save,
  Database,
  Globe,
  Bell,
  Shield,
  Printer,
  Upload,
  Mail,
  Phone,
  BellRing,
  MessageSquare,
  ClipboardCheck,
  FileText,
  RefreshCw,
  Eye,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// Importe o componente DemoAlert
import { DemoAlert } from "./demo-alert"

export default function ConfiguracoesPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const { companyName, companyLogo, theme, updateCompanyName, updateCompanyLogo, updateTheme, saveSettings } =
    useSettings()

  // Estados para as configurações gerais
  const [generalSettings, setGeneralSettings] = useState({
    companyName: companyName,
    companyLogo: companyLogo,
    systemTheme: theme,
  })

  // Atualizar os estados locais quando as configurações globais mudarem
  useEffect(() => {
    setGeneralSettings({
      companyName: companyName,
      companyLogo: companyLogo,
      systemTheme: theme,
    })
  }, [companyName, companyLogo, theme])

  // Estados para as configurações de banco de dados
  const [databaseSettings, setDatabaseSettings] = useState({
    dbBackup: true,
    backupTime: "02:00",
    backupRetention: "30",
    backupLocation: "local",
  })

  // Estados para as configurações de notificação
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: false,
    inAppNotifications: true,
    lowStockAlerts: true,
    pendingTaskReminders: true,
    dailyReportEmail: true,
    systemUpdates: true,
    emailSender: "noreply@gestao-logistica.com",
    emailReplyTo: "suporte@gestao-logistica.com",
    emailTemplate: "<h1>{{company_name}}</h1><p>Olá {{user_name}},</p><p>{{message}}</p>",
    notificationTime: "08:00",
    notificationFrequency: "daily",
    notificationDigest: "individual",
  })

  // Estados para as configurações de segurança
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiration: "90",
    sessionTimeout: "30",
    loginAttempts: "5",
    ipRestriction: false,
    allowedIPs: "",
  })

  // Estados para as configurações de impressão
  const [printSettings, setPrintSettings] = useState({
    defaultPrinter: "Principal",
    paperSize: "A4",
    orientation: "portrait",
    margins: "normal",
    headerFooter: true,
    defaultCopies: "1",
  })

  // Estado para controlar o diálogo de upload de logo
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(companyLogo || null)

  // Função para lidar com mudanças nos campos de texto das configurações gerais
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))

    // Atualizar o contexto global
    if (name === "companyName") {
      updateCompanyName(value)
    } else if (name === "companyLogo") {
      updateCompanyLogo(value)
      setLogoPreview(value)
    }
  }

  // Função para lidar com mudanças nos selects das configurações gerais
  const handleGeneralSelectChange = (name: string, value: string) => {
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))

    // Se for mudança de tema, atualizar o contexto global
    if (name === "systemTheme") {
      updateTheme(value)
    }
  }

  // Função para lidar com mudanças nos campos de texto das configurações de banco de dados
  const handleDatabaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatabaseSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Função para lidar com mudanças nos switches das configurações de banco de dados
  const handleDatabaseSwitchChange = (name: string, checked: boolean) => {
    setDatabaseSettings((prev) => ({ ...prev, [name]: checked }))
  }

  // Função para lidar com mudanças nos selects das configurações de banco de dados
  const handleDatabaseSelectChange = (name: string, value: string) => {
    setDatabaseSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Função para lidar com mudanças nos campos de texto das configurações de notificação
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNotificationSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Função para lidar com mudanças nos switches das configurações de notificação
  const handleNotificationSwitchChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  // Adicione esta função para lidar com mudanças nos selects das configurações de notificação
  const handleNotificationSelectChange = (name: string, value: string) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Função para lidar com mudanças nos campos de texto das configurações de segurança
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  // Função para lidar com mudanças nos switches das configurações de segurança
  const handleSecuritySwitchChange = (name: string, checked: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [name]: checked }))
  }

  // Função para lidar com mudanças nos campos de texto das configurações de impressão
  const handlePrintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPrintSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Função para lidar com mudanças nos selects das configurações de impressão
  const handlePrintSelectChange = (name: string, value: string) => {
    setPrintSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Função para lidar com mudanças nos switches das configurações de impressão
  const handlePrintSwitchChange = (name: string, checked: boolean) => {
    setPrintSettings((prev) => ({ ...prev, [name]: checked }))
  }

  // Função para lidar com o upload de logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const logoData = event.target.result as string
          setLogoPreview(logoData)
          setGeneralSettings((prev) => ({ ...prev, companyLogo: logoData }))
          updateCompanyLogo(logoData)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Função para salvar as configurações
  const handleSaveSettings = () => {
    // Salvar configurações gerais no contexto global
    updateCompanyName(generalSettings.companyName)
    updateCompanyLogo(generalSettings.companyLogo)
    updateTheme(generalSettings.systemTheme)

    // Persistir as configurações
    saveSettings()

    // Salvar configurações de banco de dados
    localStorage.setItem("dbBackup", databaseSettings.dbBackup.toString())
    localStorage.setItem("backupTime", databaseSettings.backupTime)
    localStorage.setItem("backupRetention", databaseSettings.backupRetention)
    localStorage.setItem("backupLocation", databaseSettings.backupLocation)

    // Mostrar toast de sucesso
    toast({
      title: "Configurações salvas",
      description: "As configurações do sistema foram atualizadas com sucesso.",
    })
  }

  const [hasAdminConfig, setHasAdminConfig] = useState(false)

  useEffect(() => {
    const savedDbBackup = localStorage.getItem("dbBackup")
    const savedBackupTime = localStorage.getItem("backupTime")
    const savedBackupRetention = localStorage.getItem("backupRetention")
    const savedBackupLocation = localStorage.getItem("backupLocation")

    if (savedDbBackup !== null) {
      setDatabaseSettings((prev) => ({
        ...prev,
        dbBackup: savedDbBackup === "true",
        backupTime: savedBackupTime || prev.backupTime,
        backupRetention: savedBackupRetention || prev.backupRetention,
        backupLocation: savedBackupLocation || prev.backupLocation,
      }))
    }
  }, [])

  useEffect(() => {
    setHasAdminConfig(hasPermission("admin_config"))
  }, [hasPermission])

  // Verificar se o usuário tem permissão para acessar esta página
  if (!hasAdminConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Você não tem permissão para acessar esta página. Entre em contato com um administrador se acredita que isso é
          um erro.
        </p>
      </div>
    )
  }

  // Carregar configurações de backup do localStorage

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1e366a]">Configurações do Sistema</h1>
        <p className="text-muted-foreground">Gerencie as configurações globais do sistema</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="printing">Impressão</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>Configure as informações básicas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={generalSettings.companyName}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLogo">Logo da Empresa</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      id="companyLogo"
                      name="companyLogo"
                      value={generalSettings.companyLogo}
                      onChange={handleGeneralChange}
                      placeholder="URL da imagem ou clique em 'Fazer Upload'"
                      className="flex-1"
                    />
                  </div>
                  <Button variant="outline" onClick={() => setIsLogoDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Fazer Upload
                  </Button>
                </div>
                {(logoPreview || generalSettings.companyLogo) && (
                  <div className="mt-2 border rounded-md p-2 flex items-center justify-center">
                    <img
                      src={logoPreview || generalSettings.companyLogo || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="max-h-20 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemTheme">Tema do Sistema</Label>
                  <Select
                    value={generalSettings.systemTheme}
                    onValueChange={(value) => handleGeneralSelectChange("systemTheme", value)}
                  >
                    <SelectTrigger id="systemTheme">
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações de Banco de Dados
              </CardTitle>
              <CardDescription>Configure as conexões com o banco de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dbBackup">Backup Automático</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dbBackup"
                    checked={databaseSettings.dbBackup}
                    onCheckedChange={(checked) => handleDatabaseSwitchChange("dbBackup", checked)}
                  />
                  <Label htmlFor="dbBackup">Ativar backup diário automático</Label>
                </div>
                {databaseSettings.dbBackup && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-sm text-green-700">
                      Backup ativo. Último backup realizado em {new Date().toLocaleDateString()} às{" "}
                      {databaseSettings.backupTime}.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupTime">Horário do Backup</Label>
                <Input
                  id="backupTime"
                  name="backupTime"
                  type="time"
                  value={databaseSettings.backupTime}
                  onChange={handleDatabaseChange}
                  disabled={!databaseSettings.dbBackup}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupRetention">Retenção de Backups (dias)</Label>
                <Input
                  id="backupRetention"
                  name="backupRetention"
                  type="number"
                  value={databaseSettings.backupRetention}
                  onChange={handleDatabaseChange}
                  disabled={!databaseSettings.dbBackup}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupLocation">Local de Armazenamento</Label>
                <Select
                  value={databaseSettings.backupLocation}
                  onValueChange={(value) => handleDatabaseSelectChange("backupLocation", value)}
                  disabled={!databaseSettings.dbBackup}
                >
                  <SelectTrigger id="backupLocation">
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Servidor Local</SelectItem>
                    <SelectItem value="cloud">Nuvem</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
                {databaseSettings.backupLocation === "local" && databaseSettings.dbBackup && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Os backups estão sendo armazenados no servidor local em /var/backups/sistema.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-[#007846] hover:bg-[#006038]">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>Configure como e quando as notificações são enviadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Canais de Notificação</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationSwitchChange("emailNotifications", checked)}
                        />
                        <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Notificações por E-mail
                        </Label>
                      </div>
                      {notificationSettings.emailNotifications && (
                        <Button variant="outline" size="sm" className="h-7 px-2">
                          Configurar
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="smsNotifications"
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => handleNotificationSwitchChange("smsNotifications", checked)}
                        />
                        <Label htmlFor="smsNotifications" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          Notificações por SMS
                        </Label>
                      </div>
                      {notificationSettings.smsNotifications && (
                        <Button variant="outline" size="sm" className="h-7 px-2">
                          Configurar
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="pushNotifications"
                          checked={notificationSettings.pushNotifications || false}
                          onCheckedChange={(checked) => handleNotificationSwitchChange("pushNotifications", checked)}
                        />
                        <Label htmlFor="pushNotifications" className="flex items-center gap-2">
                          <BellRing className="h-4 w-4 text-muted-foreground" />
                          Notificações Push
                        </Label>
                      </div>
                      {(notificationSettings.pushNotifications || false) && (
                        <Button variant="outline" size="sm" className="h-7 px-2">
                          Configurar
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="inAppNotifications"
                          checked={notificationSettings.inAppNotifications || true}
                          onCheckedChange={(checked) => handleNotificationSwitchChange("inAppNotifications", checked)}
                        />
                        <Label htmlFor="inAppNotifications" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          Notificações no Aplicativo
                        </Label>
                      </div>
                      {(notificationSettings.inAppNotifications || true) && (
                        <Button variant="outline" size="sm" className="h-7 px-2">
                          Configurar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Tipos de Notificação</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="lowStockAlerts"
                        checked={notificationSettings.lowStockAlerts}
                        onCheckedChange={(checked) => handleNotificationSwitchChange("lowStockAlerts", checked)}
                      />
                      <Label htmlFor="lowStockAlerts" className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        Alertas de Estoque Baixo
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pendingTaskReminders"
                        checked={notificationSettings.pendingTaskReminders}
                        onCheckedChange={(checked) => handleNotificationSwitchChange("pendingTaskReminders", checked)}
                      />
                      <Label htmlFor="pendingTaskReminders" className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                        Lembretes de Tarefas Pendentes
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="dailyReportEmail"
                        checked={notificationSettings.dailyReportEmail}
                        onCheckedChange={(checked) => handleNotificationSwitchChange("dailyReportEmail", checked)}
                      />
                      <Label htmlFor="dailyReportEmail" className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Relatório Diário por E-mail
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="systemUpdates"
                        checked={notificationSettings.systemUpdates || false}
                        onCheckedChange={(checked) => handleNotificationSwitchChange("systemUpdates", checked)}
                      />
                      <Label htmlFor="systemUpdates" className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        Atualizações do Sistema
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Configurações de E-mail</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailSender">E-mail Remetente</Label>
                    <Input
                      id="emailSender"
                      name="emailSender"
                      placeholder="noreply@suaempresa.com"
                      value={notificationSettings.emailSender || ""}
                      onChange={handleNotificationChange}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailReplyTo">E-mail de Resposta</Label>
                    <Input
                      id="emailReplyTo"
                      name="emailReplyTo"
                      placeholder="suporte@suaempresa.com"
                      value={notificationSettings.emailReplyTo || ""}
                      onChange={handleNotificationChange}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailTemplate">Template de E-mail</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() =>
                        toast({
                          title: "Visualização do template",
                          description: "Funcionalidade em desenvolvimento",
                        })
                      }
                      disabled={!notificationSettings.emailNotifications}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Visualizar
                    </Button>
                  </div>
                  <Textarea
                    id="emailTemplate"
                    name="emailTemplate"
                    placeholder="Template HTML para e-mails"
                    className="min-h-[100px] font-mono text-xs"
                    value={notificationSettings.emailTemplate}
                    onChange={handleNotificationChange}
                    disabled={!notificationSettings.emailNotifications}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use as variáveis {"{{"}company_name{"}}"}, {"{{"}user_name{"}}"} e {"{{"}message{"}}"} para
                    personalizar o template.
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Programação de Notificações</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notificationTime">Horário para Envio</Label>
                    <Input
                      id="notificationTime"
                      name="notificationTime"
                      type="time"
                      value={notificationSettings.notificationTime || "08:00"}
                      onChange={handleNotificationChange}
                    />
                    <p className="text-xs text-muted-foreground">Horário para envio de relatórios diários</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notificationFrequency">Frequência</Label>
                    <Select
                      value={notificationSettings.notificationFrequency || "daily"}
                      onValueChange={(value) => handleNotificationSelectChange("notificationFrequency", value)}
                    >
                      <SelectTrigger id="notificationFrequency">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Tempo Real</SelectItem>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notificationDigest">Formato de Resumo</Label>
                    <Select
                      value={notificationSettings.notificationDigest || "individual"}
                      onValueChange={(value) => handleNotificationSelectChange("notificationDigest", value)}
                    >
                      <SelectTrigger id="notificationDigest">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Notificações Individuais</SelectItem>
                        <SelectItem value="digest">Resumo Diário</SelectItem>
                        <SelectItem value="weekly">Resumo Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 p-1">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800">Configurações de Servidor SMTP</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Para configurar o servidor SMTP para envio de e-mails, entre em contato com o administrador do
                      sistema. As configurações atuais estão usando o servidor padrão.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-[#007846] hover:bg-[#006038]">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>Configure as políticas de segurança do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSecuritySwitchChange("twoFactorAuth", checked)}
                />
                <Label htmlFor="twoFactorAuth">Autenticação de Dois Fatores</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordExpiration">Expiração de Senha (dias)</Label>
                <Input
                  id="passwordExpiration"
                  name="passwordExpiration"
                  type="number"
                  value={securitySettings.passwordExpiration}
                  onChange={handleSecurityChange}
                />
                <p className="text-xs text-muted-foreground mt-1">Use 0 para desativar a expiração de senha.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Tempo Limite da Sessão (minutos)</Label>
                <Input
                  id="sessionTimeout"
                  name="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecurityChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Tentativas de Login</Label>
                <Input
                  id="loginAttempts"
                  name="loginAttempts"
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={handleSecurityChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Número máximo de tentativas de login antes do bloqueio temporário.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ipRestriction"
                    checked={securitySettings.ipRestriction}
                    onCheckedChange={(checked) => handleSecuritySwitchChange("ipRestriction", checked)}
                  />
                  <Label htmlFor="ipRestriction">Restrição de IP</Label>
                </div>

                {securitySettings.ipRestriction && (
                  <div className="mt-2">
                    <Label htmlFor="allowedIPs">IPs Permitidos</Label>
                    <Textarea
                      id="allowedIPs"
                      name="allowedIPs"
                      placeholder="Digite os IPs permitidos, um por linha"
                      className="min-h-[80px] mt-1"
                      value={securitySettings.allowedIPs}
                      onChange={handleSecurityChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Digite um endereço IP por linha. Use * como curinga (ex: 192.168.1.*).
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-[#007846] hover:bg-[#006038]">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="printing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Configurações de Impressão
              </CardTitle>
              <CardDescription>Configure as opções padrão de impressão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultPrinter">Impressora Padrão</Label>
                <Select
                  value={printSettings.defaultPrinter}
                  onValueChange={(value) => handlePrintSelectChange("defaultPrinter", value)}
                >
                  <SelectTrigger id="defaultPrinter">
                    <SelectValue placeholder="Selecione uma impressora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principal">Impressora Principal</SelectItem>
                    <SelectItem value="Secundaria">Impressora Secundária</SelectItem>
                    <SelectItem value="PDF">Salvar como PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperSize">Tamanho do Papel</Label>
                <Select
                  value={printSettings.paperSize}
                  onValueChange={(value) => handlePrintSelectChange("paperSize", value)}
                >
                  <SelectTrigger id="paperSize">
                    <SelectValue placeholder="Selecione um tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="Letter">Carta</SelectItem>
                    <SelectItem value="Legal">Ofício</SelectItem>
                    <SelectItem value="A3">A3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orientation">Orientação</Label>
                <Select
                  value={printSettings.orientation}
                  onValueChange={(value) => handlePrintSelectChange("orientation", value)}
                >
                  <SelectTrigger id="orientation">
                    <SelectValue placeholder="Selecione uma orientação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Retrato</SelectItem>
                    <SelectItem value="landscape">Paisagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="margins">Margens</Label>
                <Select
                  value={printSettings.margins}
                  onValueChange={(value) => handlePrintSelectChange("margins", value)}
                >
                  <SelectTrigger id="margins">
                    <SelectValue placeholder="Selecione as margens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="narrow">Estreita</SelectItem>
                    <SelectItem value="wide">Larga</SelectItem>
                    <SelectItem value="none">Sem Margens</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCopies">Número de Cópias Padrão</Label>
                <Input
                  id="defaultCopies"
                  name="defaultCopies"
                  type="number"
                  min="1"
                  max="99"
                  value={printSettings.defaultCopies}
                  onChange={handlePrintChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="headerFooter"
                  checked={printSettings.headerFooter}
                  onCheckedChange={(checked) => handlePrintSwitchChange("headerFooter", checked)}
                />
                <Label htmlFor="headerFooter">Incluir Cabeçalho e Rodapé</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-[#007846] hover:bg-[#006038]">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo para upload de logo */}
      <Dialog open={isLogoDialogOpen} onOpenChange={setIsLogoDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload de Logo</DialogTitle>
            <DialogDescription>Selecione uma imagem para usar como logo da empresa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="logoFile">Arquivo de Imagem</Label>
            <Input id="logoFile" type="file" accept="image/*" onChange={handleLogoUpload} />
            {logoPreview && (
              <div className="mt-2 border rounded-md p-4 flex items-center justify-center">
                <img src={logoPreview || "/placeholder.svg"} alt="Logo Preview" className="max-h-40 object-contain" />
              </div>
            )}
            <p className="text-xs text-muted-foreground">Formatos suportados: JPG, PNG, SVG. Tamanho máximo: 2MB.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => setIsLogoDialogOpen(false)}
              className="bg-[#007846] hover:bg-[#006038]"
              disabled={!logoPreview}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Componente DemoAlert para demonstração do sistema de alertas */}
      <div className="mt-8">
        <DemoAlert />
      </div>
    </div>
  )
}

