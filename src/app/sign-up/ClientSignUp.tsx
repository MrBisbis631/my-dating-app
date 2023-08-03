"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"
import ControlledDatePiker from "@/components/ControlledDatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signUpClientSchema } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePopper } from "@/providers/popper";
import axios from "axios";
import { Form } from "@/components/ui/form";

const signUpClientSchemaClient = signUpClientSchema
  .merge(
    z.object({
      confirmPassword: z.string().min(6),
      category: z.string().regex(/^(on|off)$/).optional().default("off"),
      birthday: z.date({
        required_error: "Please fill your date of birth",
      }),
    })
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

export default function ClientSignUp() {
  const { pop } = usePopper();
  const { push } = useRouter();

  const form = useForm<z.infer<typeof signUpClientSchemaClient>>({
    resolver: zodResolver(signUpClientSchemaClient),
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const formSubmitHandler = handleSubmit(async (data) => {
    try {
      await axios.post("/api/sign-up/clients", {
        ...data,
        category: data.category === "on" ? "DIVORCED" : "SINGLE",
        birthday: data.birthday.toISOString(),
      });
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        role: "CLIENT",
        callbackUrl: "/",
        redirect: false,
      });
      if (res?.error) {
        pop({
          type: "error",
          headline: "Failed to signing up",
          message: "Please check your information and try again.",
        });
        reset();
      } else {
        push("/dashboard");
      }
    } catch (error) {
      pop({
        type: "error",
        headline: "Failed to signing up",
        message: "Please check your information and try again.",
      });
      reset();
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Sign-Up</CardTitle>
        <CardDescription>
          Fill up the fields and click the button to sign-up.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={formSubmitHandler} className="">
          <CardContent className="grid gap-2 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input {...register("firstName")} id="firstName" type="text" />
              {errors.firstName?.message && (
                <Label htmlFor="firstName" className="text-xs text-red-600">
                  {errors.firstName?.message.toString()}
                </Label>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input {...register("lastName")} id="lastName" type="text" />
              {errors.lastName?.message && (
                <Label htmlFor="lastName" className="text-xs text-red-600">
                  {errors.lastName?.message.toString()}
                </Label>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                {...register("phoneNumber")}
                id="phoneNumber"
                type="text"
              />
              {errors.phoneNumber?.message && (
                <Label htmlFor="phoneNumber" className="text-xs text-red-600">
                  {errors.phoneNumber?.message.toString()}
                </Label>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} id="email" type="text" />
              {errors.email?.message && (
                <Label className="text-xs text-red-600" htmlFor="phoneNumber">
                  {errors.email?.message.toString()}
                </Label>
              )}
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                autoComplete="password"
                id="password"
                type="password"
              />
              {errors.password?.message && (
                <Label htmlFor="password" className="text-xs text-red-600">
                  {errors.password?.message.toString()}
                </Label>
              )}
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                {...register("confirmPassword")}
                autoComplete="password"
                id="confirmPassword"
                type="password"
              />
              {errors.confirmPassword?.message && (
                <Label htmlFor="confirmPassword" className="text-xs text-red-600">
                  {errors.confirmPassword?.message.toString()}
                </Label>
              )}
            </div>
            <ControlledDatePiker
              name="birthday"
              form={form}
              headline={"Date of birth"}
            />
            <RadioGroup {...register("gender")}  className="flex justify-end place-items-end md:pb-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem defaultChecked value="MALE" id="male" />
                <Label htmlFor="male">Men</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FEMALE" id="female" />
                <Label htmlFor="female">Women</Label>
              </div>
            </RadioGroup>
            <div className="items-top flex space-x-2">
              <Checkbox {...register("category")} id="divorced" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="divorced"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I a{"'"}m divorced.
                </label>
                <p className="text-sm text-muted-foreground">
                  You can check this box if you are divorced.
                </p>
              </div>
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="about-me">About Me</Label>
              <Label htmlFor="about-me" className="text-xs opacity-70 block">
                This will be shard with other people
              </Label>
              <Textarea
                {...register("aboutMe")}
                autoComplete="about-me"
                rows={10}
                id="about-me"
              />
              {errors.aboutMe?.message && (
                <Label htmlFor="about-me" className="text-xs text-red-600">
                  {errors.aboutMe?.message.toString()}
                </Label>
              )}
            </div>
          </CardContent>
          <input type="hidden" value="CLIENT" {...register("role")} />
          <CardContent>
            <Button type="submit">Sign Up</Button>
          </CardContent>
        </form>
      </Form>
      <CardFooter>
        <p className="text-sm text-center mx-auto opacity-85">
          If you already have an account,{" "}
          <Link href="/sign-in" className="underline text-violet-900">
            sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
