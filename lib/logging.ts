"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ActionType = "create" | "update" | "delete" | "view" | "export" | "import" | "login" | "logout" | "other"
export type ResourceType =
  | "coleta"
  | "pesagem"
  | "fornecedor"
  | "cliente"
  | "motorista"
  | "caminhao"
  | "produto"
  | "usuario"
  | "configuracao"
  | "relatorio"
  | "system"

export interface LogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: ActionType
  resource: ResourceType
  resourceId?: string
  details: string
  ipAddress?: string
  userAgent?: string
}

interface LoggingState {
  logs: LogEntry[]
  addLog: (log: Omit<LogEntry, "id" | "timestamp" | "userId" | "userName" | "ipAddress" | "userAgent">) => Promise<void>
  clearLogs: () => void
  getRecentLogs: (limit?: number) => LogEntry[]
  getLogsByResource: (resource: ResourceType, limit?: number) => LogEntry[]
  getLogsByUser: (userId: string, limit?: number) => LogEntry[]
  getLogsByAction: (action: ActionType, limit?: number) => LogEntry[]
  getLogsByDateRange: (startDate: Date, endDate: Date) => LogEntry[]
}

// Mock current user - in a real app, this would come from your auth system
const currentUser = {
  id: "user-1",
  name: "Admin",
}

// Create the store with persistence
export const useLoggingStore = create<LoggingState>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: async (logData) => {
        const newLog: LogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          userId: currentUser.id,
          userName: currentUser.name,
          ipAddress: "127.0.0.1", // In a real app, you'd get this from the request
          userAgent: navigator.userAgent,
          ...logData,
        }

        set((state) => ({
          logs: [newLog, ...state.logs].slice(0, 1000), // Keep only the latest 1000 logs
        }))

        return Promise.resolve()
      },

      clearLogs: () => set({ logs: [] }),

      getRecentLogs: (limit = 50) => {
        return get().logs.slice(0, limit)
      },

      getLogsByResource: (resource, limit = 50) => {
        return get()
          .logs.filter((log) => log.resource === resource)
          .slice(0, limit)
      },

      getLogsByUser: (userId, limit = 50) => {
        return get()
          .logs.filter((log) => log.userId === userId)
          .slice(0, limit)
      },

      getLogsByAction: (action, limit = 50) => {
        return get()
          .logs.filter((log) => log.action === action)
          .slice(0, limit)
      },

      getLogsByDateRange: (startDate, endDate) => {
        return get().logs.filter((log) => {
          const logDate = new Date(log.timestamp)
          return logDate >= startDate && logDate <= endDate
        })
      },
    }),
    {
      name: "logistics-logs",
      partialize: (state) => ({ logs: state.logs }),
    },
  ),
)

// Helper function to log user actions
export async function logUserAction(data: {
  action: ActionType
  resource: ResourceType
  resourceId?: string
  details: string
}) {
  return useLoggingStore.getState().addLog(data)
}

