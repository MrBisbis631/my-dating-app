import React from "react";
import type { User as PrismaUser, Client, Matchmaker } from "@prisma/client";
import type { Session } from "next-auth";

// global types for all the project
interface HaveChildren {
  children?: React.ReactNode;
}

// user from api
interface User extends PrismaUser {
  client?: Client;
  matchmaker?: Matchmaker;
}

// user from session
interface UserSession {
  user: Session["user"];
}

interface ClientsFromApi extends User, Client {}

interface Filters {
  page: number | undefined;
  page_size: number | undefined;
  search: string | undefined;
  categories: Client["category"][] | undefined;
  gender?: Client["gender"] | undefined;
}

interface ApiResponse<T> {
  data: T[];
  error?: string;
  count: number;
  page: number;
  page_size: number;
}
