"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center">
      <main className="bg-black rounded-lg">
        <h1 className="text-2xl">Pokemon Project</h1>
      </main>
      <p className="text-center text-sm">ts fetches pokemon details</p>
      </div>
      <div className="flex flex-col items-center justify-center mt-6">
        <Link href="/about">About</Link>
        <Link href="/pokemon">View Pokemon</Link>
        <Link href="/test">Backend-lecture4</Link>
      </div>
    </div>
  )
}
