import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Retornando array vazio conforme solicitado
    return NextResponse.json([])
  } catch (error) {
    console.error("Erro ao buscar clientes mais atendidos:", error)
    return NextResponse.json({ error: "Erro ao buscar clientes mais atendidos" }, { status: 500 })
  }
}

