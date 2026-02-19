import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import fs from 'fs';
import path from 'path';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const pathToFile = path.join(process.cwd(), 'data/tasks.json')
        const fileContent = fs.readFileSync(pathToFile, 'utf8')
        const data: any = JSON.parse(fileContent)

        const foundUser = data.users.find((user: any) => user.email === credentials?.email)

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