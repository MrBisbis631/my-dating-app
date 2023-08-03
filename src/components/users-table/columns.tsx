"use client"

import { User } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ClientAvatar, Badges, Actions } from "./RowCells"
import { Client } from "@prisma/client"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: "image",
    cell: ({ cell }) => <ClientAvatar url={cell.getValue() as string} />,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ cell }) => (
      <Link href={`mailto:${cell.getValue() as string | null || "N/A"}`} className="text-sm underline hover:opacity-70">{cell.getValue() as string | null || "N/A"}</Link>
    )
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ cell }) => (
      <Link href={`tel:${cell.getValue() as string | null || "N/A"}`} className="text-sm underline hover:opacity-70">{cell.getValue() as string | null || "N/A"}</Link>
    )
  },
  {
    accessorKey: "client",
    header: "Stats",
    cell: ({ cell }) => {
      const client = cell.getValue() as Client | null
      return <Badges gender={client?.gender || ""} category={client?.category || ""} isDating={client?.isDating || false} />
    }
  },
  {
    accessorKey: "birthday",
    header: "Birthday",
    cell: ({ cell }) => {
      const birthday = new Date(cell.getValue() as string)

      const year = birthday.getFullYear();
      const month = String(birthday.getMonth() + 1).padStart(2, '0');
      const day = String(birthday.getDate()).padStart(2, '0');

      return [day, month, year].join('/');
    }
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({cell}) => <Actions id={cell.getValue() as string} />
  }
]
