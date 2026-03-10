import { NextRequest, NextResponse } from "next/server";
import { pokemon } from "@/app/api/backend/data";

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const index = pokemon.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    pokemon.splice(index, 1);
    return NextResponse.json({ message: 'Deleted' });
  }
  