'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') return <div className="text-cyan-400 dark:text-purple-300">Carregant...</div>
  if (status === 'unauthenticated') return null

  return (
    <div className="flex items-center justify-center w-full p-8">
      <div className="bg-purple-200 dark:bg-purple-900 border-2 border-fuchsia-300 dark:border-purple-600 rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-purple-400 dark:text-purple-200 text-center">Benvingut, {session?.user?.name}!</h1>
        <p className="text-cyan-400 dark:text-purple-300 text-center mt-4">Gestiona les teves tasques de manera eficient</p>
      </div>
    </div>
  )
}
