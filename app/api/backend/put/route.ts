import { pokemon } from "../data";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, name, type } = body;
    
    const index = pokemon.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    if (name) pokemon[index].name = name;
    if (type) pokemon[index].type = type;
    
    return NextResponse.json(pokemon[index]);
  }