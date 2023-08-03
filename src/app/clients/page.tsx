import React from 'react'
import { DataTable } from '@/components/users-table/data-table'
import { getParams } from '@/lib/params-utils'
import { prisma } from '@/services/prismaClient'
import {columns} from "@/components/users-table/columns"
import { Client, User } from '@prisma/client'
import { ClientsFromApi } from "@/types"
import {ClientFilters} from "./filters"

type ClientPageProps = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export const revalidate = 5 * 60  // 5 min

async function ClientPage({ searchParams }: ClientPageProps) {
  const {
    page,
    page_size,
    search,
    category,
    gender, 
    isDating
  } = getParams(searchParams)

  const clients = await prisma.user.findMany({
    where: {
      role: "CLIENT",
      client: {
        gender,
        isDating,
        category: category as Client["category"],
      },
      OR: search ? [
        {
          firstName: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
          },
        },
        {
          lastName: {
            contains: search,
          },
        }
      ] : undefined

    },
    include: {
      client: true
    },
    skip: page && page_size ? (page - 1) * page_size : undefined,
    take: page_size,
    orderBy: [
      {
        firstName: "asc"
      }
    ]
  }) 

  return (
    <div className='max-w-5xl mx-auto m-10 text-sm px-1 space-y-5'>
      <h1 className="text-3xl font-semibold my-5">Clients</h1>
      <ClientFilters totalItems={clients.length} />
      <DataTable
        data={clients.map(user => ({
          ...user,
          ...user.client,
          password_hash: "",
        })) as User[]} 
        columns={columns} 
      />
    </div>
  )
}

export default ClientPage
