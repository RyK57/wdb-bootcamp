import { NextRequest, NextResponse } from "next/server"
import { removeCustomPokemon } from "../data"

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 })
  }

  const removed = removeCustomPokemon(parseInt(id, 10))
  if (!removed) {
    return NextResponse.json(
      { error: "Not found (only custom pokemon can be deleted; PokeAPI data is read-only)" },
      { status: 404 }
    )
  }

  return NextResponse.json({ message: "Deleted" })
}
