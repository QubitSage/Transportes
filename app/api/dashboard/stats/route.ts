import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Retornando dados zerados conforme solicitado
    return NextResponse.json({
      pesagensHoje: {
        total: 0,
        variacao: 0,
      },
      coletasAtivas: {
        total: 0,
        variacao: 0,
      },
      volumeTotal: {
        total: 0,
        variacao: 0,
      },
      motoristasAtivos: {
        total: 0,
        novos: 0,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error)
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}

