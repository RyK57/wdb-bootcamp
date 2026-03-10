import { NextRequest, NextResponse } from "next/server";
import { pokemon } from "../data";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, type } = body;    
    
    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type required' }, { status: 400 });
    }
    
    const newId = pokemon.length > 0 ? Math.max(...pokemon.map(p => p.id)) + 1 : 1;
    const newPokemon = { id: newId, name, type };
    pokemon.push(newPokemon);
    
    return NextResponse.json(newPokemon);
  }
  