"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type SettingsContextType = {
  companyName: string
  companyLogo: string
  theme: string
  updateCompanyName: (name: string) => void
  updateCompanyLogo: (logo: string) => void
  updateTheme: (theme: string) => void
  saveSettings: () => void
}

const defaultSettings = {
  companyName: "Gestão Logística",
  companyLogo: "",
  theme: "light",
}

const SettingsContext = createContext<SettingsContextType>({
  companyName: defaultSettings.companyName,
  companyLogo: defaultSettings.companyLogo,
  theme: defaultSettings.theme,
  updateCompanyName: () => {},
  updateCompanyLogo: () => {},
  updateTheme: () => {},
  saveSettings: () => {},
})

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState({
    companyName: defaultSettings.companyName,
    companyLogo: defaultSettings.companyLogo,
    theme: defaultSettings.theme,
  })

  // Carregar configurações do localStorage ao iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCompanyName = localStorage.getItem("companyName")
      const savedCompanyLogo = localStorage.getItem("companyLogo")
      const savedTheme = localStorage.getItem("theme")

      setSettings({
        companyName: savedCompanyName || defaultSettings.companyName,
        companyLogo: savedCompanyLogo || defaultSettings.companyLogo,
        theme: savedTheme || defaultSettings.theme,
      })

      // Aplicar o tema
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  const updateCompanyName = (name: string) => {
    setSettings((prev) => ({ ...prev, companyName: name }))
  }

  const updateCompanyLogo = (logo: string) => {
    setSettings((prev) => ({ ...prev, companyLogo: logo }))
  }

  const updateTheme = (theme: string) => {
    setSettings((prev) => ({ ...prev, theme }))

    // Aplicar o tema imediatamente
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const saveSettings = () => {
    localStorage.setItem("companyName", settings.companyName)
    localStorage.setItem("companyLogo", settings.companyLogo)
    localStorage.setItem("theme", settings.theme)
  }

  return (
    <SettingsContext.Provider
      value={{
        companyName: settings.companyName,
        companyLogo: settings.companyLogo,
        theme: settings.theme,
        updateCompanyName,
        updateCompanyLogo,
        updateTheme,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

