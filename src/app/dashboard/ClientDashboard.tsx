import { Client, User } from '@prisma/client'
import React from 'react'

type ClientDashboardProps = {
  user: User &  {
    client: Client
  }
}

function ClientDashboard({ user }: ClientDashboardProps) {
  return (
    <div>ClientDashboard</div>
  )
}

export default ClientDashboard
