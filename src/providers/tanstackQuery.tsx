"use client";

import { HaveChildren } from '@/types'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// This is the client that will be used to make queries
export const queryClient = new QueryClient()

// This is a wrapper component that provides the React Query
export function TanstackQueryProvider({ children }: HaveChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
} 
