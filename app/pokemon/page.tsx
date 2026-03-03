"use client"

import { useState } from "react"

export default function PokemonPage() {
  const [pokemon, setPokemon] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPokemon = async () => {
    setLoading(true)
    setError(null)
    setPokemon(null)
    try {
      const res = await fetch(`/api?resource=pokemon/pikachu`)
      if (!res.ok) {
        const errData = await res.json()
        setError(errData?.error || "Unknown error")
      } else {
        const data = await res.json()
        setPokemon(data)
      }
    } catch (e: any) {
      setError(e?.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <h1 className="text-xl mb-4">Pokemon Details</h1>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded mb-3 text-sm"
        onClick={fetchPokemon}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Pikachu Details"}
      </button>
      {error && (
        <div className="text-red-500 mb-2 text-sm">{error}</div>
      )}
      {pokemon && (
        <div className="border rounded p-3 mt-2 w-64 text-sm">
          <h2 className="font-medium capitalize mb-1">{pokemon.name}</h2>
          <img src={pokemon.sprites?.front_default} alt={pokemon.name} className="mb-1 w-16 h-16 mx-auto" />
          <div>ID: {pokemon.id}</div>
          <div>Height: {pokemon.height}</div>
          <div>Weight: {pokemon.weight}</div>
          <div>Types: {pokemon.types?.map((t: any) => t.type.name).join(", ")}</div>
        </div>
      )}
    </div>
  )
}