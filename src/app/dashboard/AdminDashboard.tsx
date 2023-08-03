import { Admin, User } from '@prisma/client'
import React from 'react'

type AdminDashboardProps = {
  user: User &  {
    admin: Admin
  }
}

function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div></div>
  )
}

export default AdminDashboard