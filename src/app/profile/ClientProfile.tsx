"use client";

import UploadProfileImage from '@/components/UploadProfileImage'
import Image from 'next/image'
import { Client, User } from '@prisma/client'
import { getRandomProfileImageUrl } from '@/lib/images'
import { useState } from 'react';


type ClientProfileProps = User & {
  client: Client
}

function ClientProfile({ client, image }: ClientProfileProps) {
  const imgUrl = client.photoUrl || image || getRandomProfileImageUrl()
  return (
    <div className="space-y-5">
      <h3 className='text-xl font-semibold text-center'>Your Image</h3>
      <Image
        src={imgUrl}
        alt="Profile Image"
        width={500}
        height={500}
        className='mx-auto'
      />
      <h3 className="font-semibold text-lg text-center">Change/Add new Image</h3>
      <UploadProfileImage />
    </div>
  )
}

export default ClientProfile
