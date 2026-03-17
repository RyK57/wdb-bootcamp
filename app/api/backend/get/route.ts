import { NextRequest, NextResponse } from "next/server"
import {
  fetchPokemonFromPokeAPI,
  fetchSinglePokemonFromPokeAPI,
  findCustomPokemonById,
  customPokemon,
} from "../data"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const limit = searchParams.get("limit")

  if (id) {
    const numericId = parseInt(id, 10)
    if (!isNaN(numericId)) {
      const custom = findCustomPokemonById(numericId)
      if (custom) return NextResponse.json(custom)

      const fromApi = await fetchSinglePokemonFromPokeAPI(numericId)
      if (fromApi) return NextResponse.json(fromApi)
    } else {
      const fromApi = await fetchSinglePokemonFromPokeAPI(id)
      if (fromApi) return NextResponse.json(fromApi)
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const apiLimit = limit ? parseInt(limit, 10) : 20
  const apiPokemon = await fetchPokemonFromPokeAPI(isNaN(apiLimit) ? 20 : apiLimit)
  const merged = [...apiPokemon, ...customPokemon]
  return NextResponse.json(merged)
}
