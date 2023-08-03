import { getBuildedUploadThingsConfig, profileImageEndpoint as piEndpoint } from "../config/uploadThings";

export type OurFileRouter = ReturnType<typeof getBuildedUploadThingsConfig>;

export const profileImageEndpoint = piEndpoint;
