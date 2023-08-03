import { Matchmaker, User } from '@prisma/client'
import React from 'react'

type MMDashboardProps = {
  user: User &  {
    matchmaker: Matchmaker
  }
}

function MMDashboard({ user }: MMDashboardProps) {
  return (
    <div>MMDashboard</div>
  )
}

export default MMDashboard
