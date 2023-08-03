"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signUpMatchMakerSchema } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePopper } from "@/providers/popper";
import { FC, useState } from "react";
import { useMemo } from "react";

type SignUpState = "pending" | "success" | "error";

type MatchmakerFormProps = {
  onSuccess: () => void;
};

const signUpMatchMakerSchemaMatchmaker = signUpMatchMakerSchema
  .merge(
    z.object({
      confirmPassword: z.string().min(6),
    })
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


const MatchmakerForm: FC<MatchmakerFormProps> = ({ onSuccess }) => {
  const form = useForm<z.infer<typeof signUpMatchMakerSchemaMatchmaker>>({
    resolver: zodResolver(signUpMatchMakerSchemaMatchmaker),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useMemo(() => form, [form]);

  const { pop } = usePopper();

  const { push } = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    await axios.post("/api/sign-up/matchmaker", data);
    const res = await signIn("credentials", {
      ...data,
      callbackUrl: "/",
      redirect: false,
    });
    if (res?.error) {
      pop({
        type: "error",
        headline: "Failed to signing up",
        message: "Please check your informations and try again.",
      });
      reset();
    } else {
      push("/dashboard");
      onSuccess();
    }
  });
  return (
    <>
      <CardHeader>
        <CardTitle>Matchmaker Sign-Up</CardTitle>
        <CardDescription>
          Enter your informations and then, click the sign-up button to sign-up.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} className="">
        <CardContent className="grid gap-2 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input {...register("firstName")} id="firstName" type="text" />
            {errors.firstName?.message && (
              <Label htmlFor="email" className="text-xs text-red-600">
                {errors.firstName?.message.toString()}
              </Label>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input {...register("lastName")} id="lastName" type="text" />
            {errors.lastName?.message && (
              <Label htmlFor="email" className="text-xs text-red-600">
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
              <Label htmlFor="email" className="text-xs text-red-600">
                {errors.phoneNumber?.message.toString()}
              </Label>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input {...register("email")} id="email" type="text" />
            {errors.email?.message && (
              <Label className="text-xs text-red-600" htmlFor="email">
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
              <Label htmlFor="email" className="text-xs text-red-600">
                {errors.password?.message.toString()}
              </Label>
            )}
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="password">Confirm Password</Label>
            <Input
              {...register("confirmPassword")}
              autoComplete="password"
              id="confirmPassword"
              type="password"
            />
            {errors.confirmPassword?.message && (
              <Label htmlFor="password" className="text-xs text-red-600">
                {errors.confirmPassword?.message.toString()}
              </Label>
            )}
          </div>
        </CardContent>
        <CardContent>
          <Button type="submit">Sign Up</Button>
        </CardContent>
        <input type="hidden" value="MATCHMAKER" {...register("role")} />
        <CardFooter>
          <p className="text-sm text-center mx-auto opacity-85">
            If you already have an account,{" "}
            <Link href="/sign-in" className="underline text-violet-900">
              sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </>
  );
};

const SignUpSuccess: FC = () => {
  return <div>dsfdsfdf</div>;
};

export default function MatchmakerSignUp() {
  const [signUpSate, setSignUpState] = useState<SignUpState>("pending");
  return (
    <Card>
      {signUpSate === "pending" && (
        <MatchmakerForm onSuccess={() => setSignUpState("success")} />
      )}
      {signUpSate === "success" && <SignUpSuccess />}
    </Card>
  );
}
