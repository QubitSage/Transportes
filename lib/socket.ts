import { io, type Socket } from "socket.io-client"
import { create } from "zustand"

// Define types for our events
export type ActivityType =
  | "pesagem_created"
  | "pesagem_updated"
  | "coleta_created"
  | "coleta_updated"
  | "coleta_status_changed"
  | "user_login"

export interface Activity {
  id: string
  type: ActivityType
  message: string
  details: any
  timestamp: string
  read: boolean
  user?: {
    name: string
    avatar?: string
  }
}

export interface DeliveryInProgress {
  id: string
  ticket: string
  cliente: string
  motorista: string
  placa: string
  produto: string
  origem: string
  destino: string
  status: string
  progress: number
  updatedAt: string
}

// Define the store state
interface SocketState {
  socket: Socket | null
  isConnected: boolean
  activities: Activity[]
  deliveriesInProgress: DeliveryInProgress[]
  unreadActivities: number
  connect: () => void
  disconnect: () => void
  markActivityAsRead: (id: string) => void
  markAllActivitiesAsRead: () => void
}

// Create the socket store
export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  activities: [],
  deliveriesInProgress: [],
  unreadActivities: 0,

  connect: () => {
    // Only connect if not already connected
    if (get().socket?.connected) return

    // Create socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    // Set up event listeners
    socket.on("connect", () => {
      console.log("Socket connected")
      set({ isConnected: true })
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected")
      set({ isConnected: false })
    })

    // Listen for new activities
    socket.on("new_activity", (activity: Activity) => {
      set((state) => ({
        activities: [activity, ...state.activities].slice(0, 100), // Keep only the latest 100 activities
        unreadActivities: state.unreadActivities + 1,
      }))
    })

    // Listen for deliveries in progress updates
    socket.on("deliveries_update", (deliveries: DeliveryInProgress[]) => {
      set({ deliveriesInProgress: deliveries })
    })

    // Set the socket in the store
    set({ socket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  markActivityAsRead: (id: string) => {
    set((state) => {
      const updatedActivities = state.activities.map((activity) =>
        activity.id === id ? { ...activity, read: true } : activity,
      )

      const unreadCount = updatedActivities.filter((a) => !a.read).length

      return {
        activities: updatedActivities,
        unreadActivities: unreadCount,
      }
    })
  },

  markAllActivitiesAsRead: () => {
    set((state) => ({
      activities: state.activities.map((activity) => ({ ...activity, read: true })),
      unreadActivities: 0,
    }))
  },
}))

