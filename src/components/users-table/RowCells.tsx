"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OutlineColoredBadge } from "@/components/ui/badge"
import { getRandomProfileImageUrl } from "@/lib/images"
import { FC, useState } from "react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { banUser, matchUser } from "@/services/clientAction";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { usePopper } from "@/providers/popper";


export const ClientAvatar: FC<{ url?: string }> = ({ url }) => {
  return (
    <Avatar className="relative">
      <AvatarImage src={url} />
      <AvatarFallback>
        <AvatarImage src={getRandomProfileImageUrl()} />
      </AvatarFallback>
    </Avatar>
  )
}

type BadgesProps = {
  gender: string
  isDating: boolean
  category: string
}

export const MenBadge = () => (
  <OutlineColoredBadge variant={"outline"} badgeColor={"blue"}>Men</OutlineColoredBadge>
)

export const WomenBadge = () => (
  <OutlineColoredBadge variant={"outline"} badgeColor={"pink"}>Women</OutlineColoredBadge>
)

export const DivorcedBadge = () => (
  <OutlineColoredBadge variant={"outline"} badgeColor={"yellow"}>Divorced</OutlineColoredBadge>
)

export const SingleBadge = () => (
  <OutlineColoredBadge variant={"outline"} badgeColor={"green"}>Single</OutlineColoredBadge>
)

export const BlackListedBadge = () => (
  <OutlineColoredBadge variant={"outline"} badgeColor={"red"}>Black Listed</OutlineColoredBadge>
)

export const IsDatingBadge = () => (
  <OutlineColoredBadge variant={"outline"} badgeColor={"black"}>Dating</OutlineColoredBadge>
)

export const Badges: FC<BadgesProps> = ({ gender, isDating, category }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {gender === "FEMALE" ? <WomenBadge /> : <MenBadge />}
      {isDating && <IsDatingBadge />}
      {category === "DIVORCED" && <DivorcedBadge />}
      {category === "SINGLE" && <SingleBadge />}
      {category === "BLACKLISTED" && <BlackListedBadge />}
    </div>
  )
}

type BanUserDialogProps = {
  id: string
  setOpen: (open: true | undefined) => void
}

const BanUserDialog = ({ id, setOpen }: BanUserDialogProps) => {

  const { register, handleSubmit } = useForm()

  return (
    <Dialog onOpenChange={(e) => setOpen(e ? true : undefined)}>
      <DialogTrigger>Ban user</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            You are about to ban this user. This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(d => {
          banUser({ userId: id, reason: d.reason || undefined })
        })}>
          <Textarea {...register("reason")} name="reason" id="reason" />
          <DialogFooter className="mt-5">
            <Button variant="ghost">Cancel</Button>
            <Button type="submit" variant="destructive">Ban</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function MatchUserForm({ id, setOpen }: { id: string; } & BanUserDialogProps) {
  const {pop} = usePopper()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({
      matchId: z.string().min(25, "Must be 25 character long.").max(25, "Must be 25 character long.").refine((v) => v !== id, {
        message: "You can't match a user with itself",
        path: ["matchId"]
      })
    }))
  })

  const onSubmit = handleSubmit(async d => {
    try {
      const res = await matchUser({ id: id, matchId: d.matchId })
      if (!res) {
        throw new Error("Failed to match user.")
      }
      pop({
        type: "success",
        headline: "User matched",
        message: "User matched successfully."
      })
    } catch (e) {
      const error = e as Error
      pop({
        type: "error",
        headline: "Failed to match user",
        message: error.message || "Something went wrong. Please try again later."
      })
    }
  })


  return (
    <Dialog onOpenChange={(e) => setOpen(e ? true : undefined)}>
      <DialogTrigger>Match user</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Match user</DialogTitle>
          <DialogDescription>
            You are about to match this user. enter match id.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="">
            <Label htmlFor="matchId">Match ID</Label>
            <Input {...register("matchId")} id="matchId" type="text" />
            {errors.matchId?.message && (
              <Label className="text-xs text-red-600" htmlFor="matchId">{errors.matchId?.message.toString()}</Label>
            )}
          </div>
          <DialogFooter className="mt-5">
            <Button variant="ghost">Cancel</Button>
            <Button type="submit">Match</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

}

export const Actions = ({ id }: { id: string }) => {
  const session = useSession()
  const [isOpen, setOpen] = useState<true | undefined>(undefined)
  return (
    <DropdownMenu open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href={`/clients/${id}`}>
            See Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => navigator.clipboard.writeText(id)}>
            copy ID
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <MatchUserForm id={id} setOpen={setOpen} />
        </DropdownMenuItem>
        {session.data?.user?.role === "ADMIN" && <DropdownMenuItem><BanUserDialog id={id} setOpen={setOpen} /></DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
