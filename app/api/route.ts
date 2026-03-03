import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const resource = searchParams.get('resource')

  if (!resource) {
    return NextResponse.json({ error: 'Missing "resource" query param' }, { status: 400 })
  }

  const proxyParams = new URLSearchParams(Array.from(searchParams.entries())
    .filter(([key]) => key !== 'resource'))

  const pokeapiUrl = `https://pokeapi.co/api/v2/${resource}${proxyParams.toString() ? `?${proxyParams.toString()}` : ''}`
  
  try {
    const pokeRes = await fetch(pokeapiUrl)
    if (!pokeRes.ok) {
      return NextResponse.json({ error: 'PokéAPI request failed', status: pokeRes.status }, { status: pokeRes.status })
    }
    const data = await pokeRes.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 })
  }
}