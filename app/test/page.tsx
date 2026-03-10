"use client"

import { useState, useEffect } from 'react'

interface Pokemon {
  id: number
  name: string
  type: string
}

export default function TestPage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [editId, setEditId] = useState<number | null>(null)

  const loadPokemon = async () => {
    const res = await fetch('/api/backend/get')
    const data = await res.json()
    setPokemon(data)
  }

  useEffect(() => {
    loadPokemon()
  }, [])

  const handleCreate = async () => {
    if (!name || !type) return
    await fetch('/api/backend/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type }),
    })
    setName('')
    setType('')
    loadPokemon()
  }

  const handleUpdate = async (id: number) => {
    if (!name || !type) return
    await fetch('/api/backend/put', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, type }),
    })
    setName('')
    setType('')
    setEditId(null)
    loadPokemon()
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/backend/delete?id=${id}`, {
      method: 'DELETE',
    })
    loadPokemon()
  }

  const startEdit = (p: Pokemon) => {
    setName(p.name)
    setType(p.type)
    setEditId(p.id)
  }

  return (
    <div>
      <h1>Pokemon Test</h1>
      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Type"
          value={type}
          onChange={e => setType(e.target.value)}
        />
        {editId ? (
          <button onClick={() => handleUpdate(editId)}>
            Update
          </button>
        ) : (
          <button onClick={handleCreate}>
            Create
          </button>
        )}
      </div>
      <div>
        {pokemon.map(p => (
          <div key={p.id}>
            <span>
              {p.name} - {p.type}
            </span>
            <button onClick={() => startEdit(p)}>
              Edit
            </button>
            <button onClick={() => handleDelete(p.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
