import { NextRequest, NextResponse } from "next/server";
import { fetchPokemonFromPokeAPI } from "@/app/api/backend/data";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10) || 20, 151);

    const apiPokemon = await fetchPokemonFromPokeAPI(limit);
    const supabase = await createClient();

    let rows = apiPokemon.map((p) => ({ name: p.name, pokeapi_id: p.id }));
    let { data, error } = await supabase.from("pokemons").insert(rows).select();

    if (error?.code === "42703" || error?.message?.toLowerCase().includes("pokeapi_id")) {
      rows = apiPokemon.map((p) => ({ name: p.name }));
      const retry = await supabase.from("pokemons").insert(rows).select();
      if (retry.error) {
        console.error("[seed] Supabase error:", retry.error);
        return NextResponse.json({ error: retry.error.message }, { status: 500 });
      }
      data = retry.data;
    } else if (error) {
      console.error("[seed] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const created = data ?? [];
    return NextResponse.json(
      { message: `Seeded ${created.length} Pokémon from PokeAPI`, count: created.length },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[seed] Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
