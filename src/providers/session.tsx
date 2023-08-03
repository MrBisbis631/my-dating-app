"use client";

// import { authOptions } from '@/config/nextAuth'
import { HaveChildren } from '@/types'
import { SessionProvider } from "next-auth/react"

export function NextAuthSessionProvider({ children }: HaveChildren) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}


