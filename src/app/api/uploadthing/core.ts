import { createUploadthing, type FileRouter } from "uploadthing/next";
import { utapi } from "uploadthing/server";
import { getServerSession } from "@/lib/auth/authorization";
import { prisma } from "@/services/prismaClient";

const maxFileCount = 1;
const maxFileSize = "4MB";

export const profileImageEndpoint = "profileImage";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
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
        const user = await prisma.client.findUnique({
          where: { userId: metadata.id },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (user.photoUrl) {
          await utapi.deleteFiles(user.photoUrl);
        }
        
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

export type OurFileRouter = typeof ourFileRouter;
