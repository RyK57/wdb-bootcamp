import { NextRequest, NextResponse } from "next/server";
import { pokemon } from "../data";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      const found = pokemon.find(p => p.id === parseInt(id));
      if (found) {
        return NextResponse.json(found);
      }
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(pokemon);
  }     