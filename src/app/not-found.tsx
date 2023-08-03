import React from 'react';
import { getServerSession } from '@/lib/auth/authorization';

import { adminDashboardUrl, clientDashboardUrl, matchMakerDashboardUrl } from '@/components/Nav/links';
import Link from 'next/link';
import { type Session } from 'next-auth';

function getDashboardLink(session:Session|undefined|null)
{
  switch (session?.user?.role) {
    case 'CLIENT':
      return clientDashboardUrl;
      
    case 'MATCHMAKER':
      return matchMakerDashboardUrl;
      
    case 'ADMIN':
      return adminDashboardUrl;
      
    default:
      return '/';
  }
}

export default async function NotFound() {
  const session = await getServerSession();
  
  return (
    <div>
      NotFound - You will be redirected soon...
      
      <Link href={getDashboardLink(session)}>
        <a>Go to Dashboard</a>
      </Link>
    </div>
  );
}
