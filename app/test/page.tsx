"use client"

import { useState, useEffect } from 'react'
import {
  getPokemons,
  createPokemon,
  updatePokemon,
  deletePokemon,
  type Pokemon
} from '@/db/pokemons/actions'

const CUSTOM_ID_START = 10000

function isCustomPokemon(id: number) {
  return id >= CUSTOM_ID_START
}

export default function TestPage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [routeIsLoading, setRouteIsLoading] = useState(false)
  const [routeMessage, setRouteMessage] = useState<string | null>(null)

  const loadPokemon = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getPokemons()
      setPokemon(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPokemon()
  }, [])

  const handleCreate = async () => {
      if (!name) return
    setError(null)
    try {
      await createPokemon({ name, type })
      setName('')
      setType('')
      loadPokemon()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed')
    }
  }

  const handleUpdate = async (id: number) => {
    if (!name) return
    setError(null)
    try {
      await updatePokemon(id, { name, type })
      setName('')
      setEditId(null)
      loadPokemon()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  const handleDelete = async (id: number) => {
    setError(null)
    try {
      await deletePokemon(id)
      loadPokemon()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  const startEdit = (p: Pokemon) => {
    if (!isCustomPokemon(p.id)) return
    if (!p.name) return
    setName(p.name)
    setType(p.type ?? "")
    setEditId(p.id)
  }

  const handleSeedFromPokeAPI = async () => {
    setRouteIsLoading(true)
    setRouteMessage(null)
    setError(null)
    try {
      const res = await fetch("/api/seed?limit=20", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Unknown error from seed route")
      }
      setRouteMessage(data.message ?? `Seeded ${data.count} Pokémon from PokeAPI!`)
      loadPokemon()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to seed from PokeAPI")
    } finally {
      setRouteIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-white text-black">
      <h1 className="text-2xl font-bold text-gray-900">Pokemon Test</h1>

      <div className="mb-4">
        <button
          className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 font-semibold shadow disabled:opacity-50"
          disabled={routeIsLoading}
          onClick={handleSeedFromPokeAPI}
        >
          {routeIsLoading ? "Seeding..." : "Seed Pokémon from PokeAPI → Supabase"}
        </button>
        {routeMessage && (
          <div className="mt-2 text-sm text-green-700 font-semibold">{routeMessage}</div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-600 text-white text-sm font-semibold border border-red-800">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="px-3 py-2 border border-gray-700 rounded-md bg-white text-black placeholder-gray-700"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="px-3 py-2 border border-gray-700 rounded-md bg-white text-black placeholder-gray-700"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        {editId ? (
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 font-semibold shadow"
            onClick={() => handleUpdate(editId)}
          >
            Update
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 font-semibold shadow"
            onClick={handleCreate}
          >
            Create
          </button>
        )}
      </div>

      <p className="text-sm text-gray-800">
        Data from PokeAPI. Only custom pokemon (created by you) can be edited or deleted.
      </p>

      {isLoading ? (
        <p className="text-gray-800">Loading...</p>
      ) : (
        <ul className="space-y-4">
          {pokemon.map((p) => (
            <li
              key={p.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-gray-300 bg-gray-50 shadow-sm"
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name ?? "Pokémon"}
                  className="w-24 h-24 object-contain flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
                  No img
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-gray-900 text-lg">{p.name}</span>
                  {isCustomPokemon(p.id) && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-black font-bold">
                      custom
                    </span>
                  )}
                </div>
                {p.types && p.types.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.types.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {!p.types && p.type != null && (
                  <span className="text-sm text-gray-600">{p.type}</span>
                )}
                {p.stats && p.stats.length > 0 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-600">
                    {p.stats.slice(0, 6).map((s) => (
                      <span key={s.name}>
                        {s.name}: <strong>{s.value}</strong>
                      </span>
                    ))}
                  </div>
                )}
                {(p.height != null || p.weight != null) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {p.height != null && `${(p.height / 10).toFixed(1)}m`}
                    {p.height != null && p.weight != null && " · "}
                    {p.weight != null && `${(p.weight / 10).toFixed(1)}kg`}
                  </p>
                )}
                {p.abilities && p.abilities.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Abilities: {p.abilities.slice(0, 3).join(", ")}
                  </p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {isCustomPokemon(p.id) ? (
                  <>
                    <button
                      className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-800 font-semibold"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-800 font-semibold"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
