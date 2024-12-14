"use client";

import { useSearchParams } from 'next/navigation'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const name = searchParams.get('name') // This will get 'Varun' or 'Malin'
  console.log("name", name);

  return (
    <div className="flex items-center justify-center m-4 text-2xl font-light tracking-wide bg-gradient-to-r from-blue-500/80 to-pink-500/80 bg-clip-text text-transparent">
      Chatting with {name}
    </div>
  )
}
