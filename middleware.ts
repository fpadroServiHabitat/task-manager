import withAuth from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const protectedPaths = ['/dashboard', '/profile', '/tasks']
      const isProtectedPath = protectedPaths.some(path => 
        req.nextUrl.pathname.startsWith(path)
      )
      
      if (isProtectedPath) {
        return !!token
      }
      
      return true
    },
  },
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}