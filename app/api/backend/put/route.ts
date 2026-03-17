import { NextRequest, NextResponse } from "next/server"
import { updateCustomPokemon } from "../data"

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, name, type } = body

  if (id == null) {
    return NextResponse.json({ error: "ID required" }, { status: 400 })
  }

  const updated = updateCustomPokemon(Number(id), { name, type })
  if (!updated) {
    return NextResponse.json(
      { error: "Not found (only custom pokemon can be updated; PokeAPI data is read-only)" },
      { status: 404 }
    )
  }

  return NextResponse.json(updated)
}
