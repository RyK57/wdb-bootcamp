const POKEAPI_BASE = 'https://pokeapi.co/api/v2'

export const getPokemonImageUrl = (pokeapiId: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeapiId}.png`

export interface Pokemon {
  id: number
  name: string
  type: string
}

export interface PokemonDetails {
  id: number
  name: string
  types: string[]
  image: string
  stats: { name: string; value: number }[]
  height: number
  weight: number
  abilities: string[]
}

export const customPokemon: Pokemon[] = []
let nextCustomId = 10000

function formatName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function formatType(typeName: string): string {
  return typeName.charAt(0).toUpperCase() + typeName.slice(1)
}

function transformApiPokemon(raw: { id: number; name: string; types: Array<{ type: { name: string } }> }): Pokemon {
  const primaryType = raw.types?.[0]?.type?.name ?? 'Unknown'
  return {
    id: raw.id,
    name: formatName(raw.name),
    type: formatType(primaryType),
  }
}

export async function fetchPokemonFromPokeAPI(limit = 20): Promise<Pokemon[]> {
  try {
    const listRes = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}`)
    if (!listRes.ok) throw new Error('PokéAPI list request failed')
    const listData = await listRes.json()
    const results = listData.results || []

    const details = await Promise.all(
      results.map(async (p: { url: string }) => {
        const res = await fetch(p.url)
        if (!res.ok) return null
        return res.json()
      })
    )

    return details
      .filter(Boolean)
      .map((raw: { id: number; name: string; types: Array<{ type: { name: string } }> }) => transformApiPokemon(raw))
  } catch {
    return []
  }
}

export async function fetchSinglePokemonFromPokeAPI(idOrName: string | number): Promise<Pokemon | null> {
  try {
    const res = await fetch(`${POKEAPI_BASE}/pokemon/${idOrName}`)
    if (!res.ok) return null
    const raw = await res.json()
    return transformApiPokemon(raw)
  } catch {
    return null
  }
}

const POKEAPI_RAW = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

export async function fetchFullPokemonDetails(pokeapiId: number): Promise<PokemonDetails | null> {
  try {
    const res = await fetch(`${POKEAPI_BASE}/pokemon/${pokeapiId}`)
    if (!res.ok) return null
    const raw = await res.json()

    const types = (raw.types ?? []).map((t: { type: { name: string } }) =>
      t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
    )
    const stats = (raw.stats ?? []).map((s: { base_stat: number; stat: { name: string } }) => ({
      name: s.stat.name.replace(/-/g, ' '),
      value: s.base_stat,
    }))
    const abilities = (raw.abilities ?? []).map((a: { ability: { name: string } }) =>
      a.ability.name.replace(/-/g, ' ')
    )

    const image =
      raw.sprites?.other?.['official-artwork']?.front_default ??
      raw.sprites?.front_default ??
      `${POKEAPI_RAW}/${pokeapiId}.png`

    return {
      id: raw.id,
      name: formatName(raw.name),
      types,
      image,
      stats,
      height: raw.height ?? 0,
      weight: raw.weight ?? 0,
      abilities,
    }
  } catch {
    return null
  }
}

export function addCustomPokemon(name: string, type: string): Pokemon {
  const pokemon: Pokemon = { id: nextCustomId++, name: formatName(name), type: formatType(type) }
  customPokemon.push(pokemon)
  return pokemon
}

export function findCustomPokemonById(id: number): Pokemon | undefined {
  return customPokemon.find((p) => p.id === id)
}

export function updateCustomPokemon(id: number, updates: Partial<Pick<Pokemon, 'name' | 'type'>>): Pokemon | null {
  const index = customPokemon.findIndex((p) => p.id === id)
  if (index === -1) return null
  if (updates.name) customPokemon[index].name = formatName(updates.name)
  if (updates.type) customPokemon[index].type = formatType(updates.type)
  return customPokemon[index]
}

export function removeCustomPokemon(id: number): boolean {
  const index = customPokemon.findIndex((p) => p.id === id)
  if (index === -1) return false
  customPokemon.splice(index, 1)
  return true
}
