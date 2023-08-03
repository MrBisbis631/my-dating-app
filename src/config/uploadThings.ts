import "server-only";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { utapi } from "uploadthing/server";
import { getServerSession } from "@/lib/auth/authorization";
import { prisma } from "@/services/prismaClient";

// number files a client can upload
const maxFileCount = 1;
// max size of each file
const maxFileSize = "4MB";

// endpoint for profile image
export const profileImageEndpoint = "profileImage";

// configure the file uploader builder
export function getBuildedUploadThingsConfig(
  f: ReturnType<typeof createUploadthing>
) {
  return {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    [profileImageEndpoint]: f({ image: { maxFileSize, maxFileCount } })
      // Set permissions and file types for this FileRoute
      .middleware(async () => {
        const session = await getServerSession();

        // reject if user is not logged in
        if (
          !session ||
          !session.user ||
          !session.user.role ||
          session.user.role !== "CLIENT"
        ) {
          throw new Error("Unauthorized");
        }

        return session.user;
      })
      .onUploadComplete(async ({ metadata, file }) => {
        try {
          await prisma.client.update({
            where: { userId: metadata.id },
            data: {
              photoUrl: file.url,
            },
          });
        } catch (e) {
          await utapi.deleteFiles(file.name);
        }
      }),
  } satisfies FileRouter;
}

export type OurFileRouter = ReturnType<typeof getBuildedUploadThingsConfig>;
