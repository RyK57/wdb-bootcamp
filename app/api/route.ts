import { NextRequest, NextResponse } from 'next/server'
import { createPokemon } from '@/db/pokemons/actions'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, type } = body

    if (!name) {
      return NextResponse.json({ error: 'Missing Pokémon name' }, { status: 400 })
    }

    const newPokemon = await createPokemon({ name, type })

    return NextResponse.json(newPokemon, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 })
  }
}