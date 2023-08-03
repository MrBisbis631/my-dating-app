"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePasswordSchema } from "@/lib/validators/users";
import { usePopper } from "@/providers/popper";
import { changePassword } from "@/services/authAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ChangePassword() {
  const { pop } = usePopper()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    const error = await changePassword(data)
    if (error) {
      pop({
        type: "error",
        headline: "Failed to change password",
        message: error,
      })
    } else {
      pop({
        type: "success",
        headline: "Success",
        message: "Password changed successfully",
      })
      reset()
    }
  })
  return (
    <Card className="w-[350px] mx-auto my-10">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Enter old and a new password.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="oldPassword">Old Password</Label>
              <Input {...register("oldPassword")} id="oldPassword" placeholder="old password" />
              {errors.oldPassword && <Label className="text-red-500 text-sm">{errors.oldPassword.message}</Label>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input {...register("newPassword")} id="newPassword" placeholder="New password" />
              {errors.newPassword && <Label className="text-red-500 text-sm">{errors.newPassword.message}</Label>}

            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input {...register("confirmPassword")} id="confirmPassword" placeholder="Confirm password" />
              {errors.confirmPassword && <Label className="text-red-500 text-sm">{errors.confirmPassword.message}</Label>}

            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => reset()} variant="outline">Cancel</Button>
          <Button type="submit">Chang Password</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
