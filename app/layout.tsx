import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import { ThemeProvider } from "next-themes";
import AuthProvider from "./api/auth/components/AuthProvider";
import LayoutContent from "./components/LayoutContent";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const minecraft = localFont({
  src: '../fonts/MinecraftRegular-Bmg3.otf',
  variable: '--font-minecraft'
});

export const metadata: Metadata = {
  title: "Tailwind v4.0 Theme Colors Example",
  description: "Tailwind v4.0 Theme Colors Example made by Kevstrosky",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistSans.variable} ${minecraft.variable} antialiased bg-blue-400 dark:bg-purple-900 text-blue-100 dark:text-purple-100`}>
        <ThemeProvider enableSystem={true} defaultTheme="system">
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
  
}
