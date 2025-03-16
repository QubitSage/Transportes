"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { AlertBanner } from "@/components/alert-banner"

type AlertType = "success" | "error" | "warning" | "info" | "default"

interface AlertOptions {
  message: string
  description?: string
  type?: AlertType
  duration?: number
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void
  hideAlert: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertOptions | null>(null)
  const [visible, setVisible] = useState(false)

  const hideAlert = useCallback(() => {
    setVisible(false)
    setTimeout(() => setAlert(null), 300) // Aguarda a animação terminar
  }, [])

  const showAlert = useCallback(
    (options: AlertOptions) => {
      setAlert(options)
      setVisible(true)

      // Se já houver um alerta visível, esconde-o primeiro
      if (visible) {
        setVisible(false)
        setTimeout(() => {
          setAlert(options)
          setVisible(true)
        }, 300)
      }
    },
    [visible],
  )

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {alert && (
        <AlertBanner
          message={alert.message}
          description={alert.description}
          variant={alert.type}
          visible={visible}
          duration={alert.duration || 5000}
          onClose={hideAlert}
        />
      )}
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}

