import { getServerSession } from '@/lib/auth/authorization';
import { prisma } from '@/services/prismaClient';
import { redirect } from 'next/navigation';
import React from 'react'
import MMDashboard from './MMDashboard';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';
import { Admin, Client, Matchmaker, User } from '@prisma/client';

async function Dashboard() {
  const session = await getServerSession();
  if (!session?.user || !["ADMIN", "CLIENT", "MATCHMAKER"].includes(session.user.role)) {
    return redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    include: {
      client: true,
      matchmaker: true,
      admin: true
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  if (user.role === "CLIENT" && !user.client) {
    throw new Error("Client not found")
  }

  if (user.role === "MATCHMAKER" && !user.matchmaker) {
    throw new Error("Matchmaker not found")
  }

  if (user.role === "ADMIN" && !user.admin) {
    throw new Error("Admin not found")
  }

  return (
    <div>
      {user?.role === "ADMIN" && <AdminDashboard user={user as User & { admin: Admin }} />}
      {user?.role === "MATCHMAKER" && <MMDashboard user={user as User & { matchmaker: Matchmaker }} />}
      {user?.role === "CLIENT" && <ClientDashboard user={user as User & { client: Client }} />}
    </div>
  )
}

export default Dashboard
