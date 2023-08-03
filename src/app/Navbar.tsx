import { getServerSession } from '@/lib/auth/authorization';
import React from 'react'
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SignOut from '@/components/SignOut';


const adminRoutes = {
  "Dashboard": "/dashboard",
  "Clients": "/clients",
  "Profile": "/profile",
}

const mmRoutes = {
  "Dashboard": "/dashboard",
  "Clients": "/clients",
  "Profile": "/profile",
}

const clientRoutes = {
  "Dashboard": "/dashboard",
  "Profile": "/profile",
  "Questions": "/questions",
}

const entries = {
  "ADMIN": adminRoutes,
  "MATCHMAKER": mmRoutes,
  "CLIENT": clientRoutes,
}


async function Navbar() {
  const session = await getServerSession();

  if (!session || !session.user) {
    return null
  }


  return (
    <div className="h-16 z-50 px-3 flex justify-between items-center shadow shadow-gray-300 bg-gray-200">
      <Image
        src="/black-logo.png"
        width={50}
        height={50}
        alt='logo'
      />
      <nav>
        <ul className="flex space-x-3">
          {Object.entries(entries[session.user.role]).map(([key, value]) => (
            <li key={key}>
              <Link href={value}>
              <Button variant={"outline"}>{key}</Button>
              </Link>
            </li>
          ))}
          <li>
            <SignOut />
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar