import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import fs from 'fs';
import path from 'path';
import {Redis} from '@upstash/redis';

const redis = Redis.fromEnv();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const userKeys = await redis.keys("user:*")
        let foundUser = null

        for (const key of userKeys) {
          const user = await redis.get(key) as any
          if (user && user.email === credentials?.email) {
            foundUser = user
            break
          }
        }

        if (foundUser && foundUser.password === credentials?.password) {
          return { id: foundUser.id.toString(), email: foundUser.email, name: foundUser.email }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }