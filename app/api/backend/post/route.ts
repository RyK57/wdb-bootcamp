import { NextRequest, NextResponse } from "next/server"
import { addCustomPokemon } from "../data"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, type } = body

  if (!name || !type) {
    return NextResponse.json({ error: "Name and type required" }, { status: 400 })
  }

  const newPokemon = addCustomPokemon(name, type)
  return NextResponse.json(newPokemon)
}
