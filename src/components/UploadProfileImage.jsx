"use client";

import "@uploadthing/react/styles.css";
import { usePopper } from "../providers/popper";
import { UploadButton, UploadDropzone } from "@uploadthing/react";
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"

export default function UploadProfileImage() {
  const { pop } = usePopper();
  const session = useSession()
  const router = useRouter()

  const onSuccessfulUpload = () => {
    session.update()
    router.refresh()
    pop({
      headline: "Profile Image",
      message: "Profile image uploaded successfully.",
      type: "success",
    });
  };

  const onUploadError = () => {
    pop({
      headline: "Profile Image",
      message: "Profile image upload failed.",
      type: "error",
    });
  };

    return (
      <div className="space-y-4">
        <UploadDropzone
          endpoint="profileImage"
          onClientUploadComplete={onSuccessfulUpload}
          onUploadError={onUploadError}
        />
        <UploadButton
          endpoint={"profileImage"}
          onClientUploadComplete={onSuccessfulUpload}
          onUploadError={onUploadError}
        />
      </div>
    );
}
