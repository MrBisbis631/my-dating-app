import { createNextRouteHandler } from "uploadthing/next";
import {getBuildedUploadThingsConfig} from "@/config/uploadThings"
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: getBuildedUploadThingsConfig(f),
});
