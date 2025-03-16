import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Retornando array vazio conforme solicitado
    return NextResponse.json([])
  } catch (error) {
    console.error("Erro ao buscar produtos mais transportados:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos mais transportados" }, { status: 500 })
  }
}

