import { getServerSession } from '@/lib/auth/authorization';
import { redirect } from 'next/navigation';
import React from 'react'

type ClientLayoutProps = {
  children: React.ReactNode
}

async function ClientLayout({ children }: ClientLayoutProps) {
  const session = await getServerSession();
  if (!session?.user || !["ADMIN", "MATCHMAKER"].includes(session.user.role)) {
    return redirect("/sign-in")
  }
  return (
    <>
      {children}
    </>
  )
}

export default ClientLayout
