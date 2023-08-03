import { Filters } from "@/types";
import { Gender } from "@prisma/client";
import { NextRequest } from "next/server";

// max results per page
const maxPageSize = 40;

// pagination params
export type PaginationParams = {
  page: number;
  page_size: number;
};

const defaultPaginationParams: PaginationParams = {
  page: 1,
  page_size: 20,
};

// get pagination params from request
export function getPaginationParams(url: URL): PaginationParams {
  const page = parseInt(url.searchParams.get("page") || "1");
  const page_size = parseInt(url.searchParams.get("page_size") || "20");

  if (isNaN(page) || isNaN(page_size) || page_size < 1 || page_size < 1) {
    return defaultPaginationParams;
  }

  return {
    page,
    page_size: Math.min(page_size, maxPageSize),
  };
}

export function getFilterParams(req: NextRequest): Filters {
  const url = new URL(req.nextUrl);
  const search = url.searchParams.get("search") || "";
  const categories = url.searchParams.getAll(
    "categories"
  ) as Filters["categories"];
  const gender = (url.searchParams.get("gender") as Gender) || null;

  return {
    ...getPaginationParams(url),
    search,
    categories,
    gender,
  };
}

export function getParams(searchParams?: {
  [key: string]: string | string[] | undefined;
}) {
  const search = (searchParams?.search as string) || undefined;
  const category = searchParams?.category != "undefined" ? searchParams?.category : undefined;
  const gender = searchParams?.gender != "undefined" ? (searchParams?.gender as Gender) : undefined;
  const isDating = searchParams?.isDating != "undefined" ? searchParams?.isDating === "true" : undefined;
  let page_size: number | undefined = parseInt(searchParams?.page_size as string) || 20;
  let page: number | undefined = parseInt(searchParams?.page as string) || 1;
  
  if (page < 1) {
    page = undefined;
  }

  if (page_size < 1) {
    page_size = undefined;
  }

  return {
    page,
    page_size,
    search,
    category,
    gender,
    isDating,
  };
}
