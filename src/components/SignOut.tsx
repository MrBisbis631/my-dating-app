"use client";

import React from 'react'
import { Button } from '@/components/ui/button';
import {signOut} from 'next-auth/react'

function SignOut() {
  return (
    <Button onClick={() => signOut()} variant={"ghost"}>Sign out</Button>
  )
}

export default SignOut
