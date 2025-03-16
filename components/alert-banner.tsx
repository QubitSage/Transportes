"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 text-sm transition-all duration-300 transform",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-b",
        success: "bg-green-50 text-green-800 border-b border-green-200",
        error: "bg-red-50 text-red-800 border-b border-red-200",
        warning: "bg-amber-50 text-amber-800 border-b border-amber-200",
        info: "bg-blue-50 text-blue-800 border-b border-blue-200",
      },
      visible: {
        true: "translate-y-0",
        false: "-translate-y-full",
      },
    },
    defaultVariants: {
      variant: "default",
      visible: false,
    },
  },
)

export interface AlertBannerProps extends VariantProps<typeof alertVariants> {
  message: string
  description?: string
  duration?: number
  onClose?: () => void
}

export function AlertBanner({
  message,
  description,
  variant = "default",
  visible = true,
  duration = 5000,
  onClose,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(visible)

  useEffect(() => {
    setIsVisible(visible)

    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "error":
        return <AlertCircle className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className={cn(alertVariants({ variant, visible: isVisible }))}>
      <div className="flex items-center gap-3 max-w-screen-xl mx-auto w-full">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="font-medium">{message}</h3>
          {description && <p className="text-xs mt-1 opacity-80">{description}</p>}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-full p-1 hover:bg-black/5 transition-colors"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

