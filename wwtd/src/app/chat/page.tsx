"use client";

import { useSearchParams } from 'next/navigation'
import { RecordButton } from '../components/RecordButton';
import { TranscriptionWindow } from '../components/TranscriptionWindow';

export default function ChatPage() {
  const searchParams = useSearchParams()
  const name = searchParams.get('name') // This will get 'Varun' or 'Malin'
  console.log("name", name);

  return (
    <div className="flex flex-col border-2 min-h-screen">
      <div className="flex items-center justify-center m-4 text-2xl font-light bg-gradient-to-r from-blue-500/80 to-pink-500/80 bg-clip-text text-transparent">
        Chatting with {name}
      </div>
      <div>
        <TranscriptionWindow />
      </div>
      <div className="flex-grow flex items-center justify-center translate-y-[20%]">
        <RecordButton />
      </div>
    </div>
  )
}
