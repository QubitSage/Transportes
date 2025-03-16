import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Retornando array vazio conforme solicitado
    return NextResponse.json([])
  } catch (error) {
    console.error("Erro ao buscar atividades operacionais:", error)
    return NextResponse.json({ error: "Erro ao buscar atividades operacionais" }, { status: 500 })
  }
}

