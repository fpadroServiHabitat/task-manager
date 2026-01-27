'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import ThemeToggle from '../components/ThemeToggle'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-purple-200 to-cyan-200 dark:from-purple-900 dark:to-blue-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <form onSubmit={handleSubmit} className="bg-fuchsia-200 dark:bg-purple-800 p-8 rounded-lg shadow-xl border-2 border-fuchsia-300 dark:border-purple-600">
        <h1 className="text-3xl mb-6 text-purple-400 dark:text-purple-200 text-center font-bold">Iniciar Sessió</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-cyan-200 dark:border-blue-600 rounded-md bg-cyan-100 dark:bg-blue-800 text-blue-400 dark:text-blue-200 placeholder-cyan-300 dark:placeholder-blue-300 focus:border-fuchsia-300 dark:focus:border-purple-500 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Contrasenya"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border-2 border-cyan-200 dark:border-blue-600 rounded-md bg-cyan-100 dark:bg-blue-800 text-blue-400 dark:text-blue-200 placeholder-cyan-300 dark:placeholder-blue-300 focus:border-fuchsia-300 dark:focus:border-purple-500 focus:outline-none"
          required
        />
        <button type="submit" className="w-full bg-blue-300 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 text-blue-100 dark:text-blue-100 p-3 rounded-md transition-colors font-semibold border-2 border-blue-400 dark:border-blue-500">
          Entrar
        </button>
      </form>
    </div>
  )
}