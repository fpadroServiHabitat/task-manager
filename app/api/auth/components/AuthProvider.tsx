'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

function ProtectionWrapper({children}: {children: React.ReactNode}) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/login') {
      router.push('/login')
    }
  }, [status, pathname, router])

  if (status === 'loading') return <div>Carregant...</div>
  if (status === 'unauthenticated' && pathname !== '/login') return null

  return <>{children}</>
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
  <SessionProvider>
    <ProtectionWrapper>{children}</ProtectionWrapper>
  </SessionProvider>)
}
