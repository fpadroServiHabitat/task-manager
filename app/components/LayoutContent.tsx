'use client'
import { usePathname } from 'next/navigation'
import Sidebar from "./sidebar"
import Header from "./header"

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <>
      {!isLoginPage && (
        <div className="w-full flex bg-blue-300 dark:bg-purple-800 border-2 border-cyan-200 dark:border-purple-600 shadow-lg">
          <Sidebar />
          <Header />
        </div>
      )}
      <div className={isLoginPage 
        ? "flex min-h-screen items-center justify-center bg-blue-400 dark:bg-purple-900" 
        : "flex w-full top-20 items-center justify-center bg-blue-400 dark:bg-purple-900 border-2 border-cyan-200 dark:border-purple-600 shadow-lg"
      }>
        {children}
      </div>
    </>
  )
}