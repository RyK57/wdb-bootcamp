"use server";

import { createClient } from "@/utils/supabase/server";
import { fetchFullPokemonDetails } from "@/app/api/backend/data";

export interface Pokemon {
  id: number;
  created_at: string;
  name: string | null;
  type?: string | null;
  pokeapi_id?: number | null;
  image?: string | null;
  types?: string[] | null;
  stats?: { name: string; value: number }[] | null;
  height?: number | null;
  weight?: number | null;
  abilities?: string[] | null;
}

export async function getPokemons() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pokemons")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  const rows = JSON.parse(JSON.stringify(data ?? [])) as Pokemon[];

  const enriched = await Promise.all(
    rows.map(async (row) => {
      const pokeapiId = row.pokeapi_id ?? null;
      if (pokeapiId == null) return row;

      const details = await fetchFullPokemonDetails(pokeapiId);
      if (!details) return row;

      return {
        ...row,
        image: details.image,
        types: details.types,
        type: details.types[0] ?? row.type,
        stats: details.stats,
        height: details.height,
        weight: details.weight,
        abilities: details.abilities,
      } satisfies Pokemon;
    })
  );

  return enriched;
}

export async function getPokemon(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pokemons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return JSON.parse(JSON.stringify(data)) as Pokemon;
}

export async function createPokemon({ name, type }: { name: string; type?: string }) {
  const supabase = await createClient();
  const row: { name: string; type?: string } = { name };
  if (type) row.type = type;
  const { data, error } = await supabase
    .from("pokemons")
    .insert([row])
    .select()
    .single();

  if (error) throw error;
  return JSON.parse(JSON.stringify(data)) as Pokemon;
}

export async function bulkCreatePokemons(pokemons: Array<{ name: string; type?: string }>) {
  if (pokemons.length === 0) return [];
  const supabase = await createClient();
  const rows = pokemons.map((p) => (p.type ? { name: p.name, type: p.type } : { name: p.name }));
  const { data, error } = await supabase.from("pokemons").insert(rows).select();
  if (error) throw error;
  return JSON.parse(JSON.stringify(data ?? [])) as Pokemon[];
}

export async function updatePokemon(id: number, { name, type }: { name?: string; type?: string }) {
  const supabase = await createClient();
  const updates: Record<string, string> = {};
  if (name !== undefined) updates.name = name;
  if (type !== undefined) updates.type = type;

  const { data, error } = await supabase
    .from("pokemons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return JSON.parse(JSON.stringify(data)) as Pokemon;
}

// Delete a pokemon by id
export async function deletePokemon(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pokemons")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}