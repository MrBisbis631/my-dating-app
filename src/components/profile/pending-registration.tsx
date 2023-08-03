"use client"

import { User } from "@prisma/client";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import Link from "next/link";
import { usePopper } from "@/providers/popper";
import { acceptMatchmaker } from "@/services/adminActions";
import { Button } from "../ui/button";

type PendingRegistrationProps = {
  user: User
}

export default function PendingRegistration({user}: PendingRegistrationProps) {
  const { pop } = usePopper()
  const handleAccept = async () => {
    const err = await acceptMatchmaker(user.id)
    if (err) {
      pop({
        type: "error",
        headline: "Failed to accept matchmaker",
        message: err,
      })
    } else {
      pop({
        type: "success",
        headline: "Successfully accepted matchmaker",
      })
    }
  }
  

  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>{user.firstName} {user.lastName}</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <div className="flex justify=between">
            <span className="font-semibold">
              Email:
            </span>
            <Link href={`mailto:${user.email}`}>{user.email}</Link>
          </div>
          <div className="flex justify=between">
            <span className="font-semibold">
              Phone number:
            </span>
            <Link href={`tel:${user.phoneNumber}`}>{user.phoneNumber}</Link>
          </div>
          <Button onClick={handleAccept}>Accept</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}