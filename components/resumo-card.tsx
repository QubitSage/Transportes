import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResumoCardProps {
  title: string
  value: string
  icon: React.ReactNode
  highlight?: boolean
}

export function ResumoCard({ title, value, icon, highlight = false }: ResumoCardProps) {
  return (
    <Card className={highlight ? "border-[#007846]" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${highlight ? "text-[#007846]" : ""}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

