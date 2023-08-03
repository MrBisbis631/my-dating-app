"use server";

import { Answer } from "@prisma/client";
import { prisma } from "./prismaClient";
import { getServerSession } from "@/lib/auth/authorization";

type AnswerSubmission = Pick<Answer, "questionId" | "optionId" | "text">

export async function addAnswer(ans: AnswerSubmission): Promise<Answer> {
  const session = await getServerSession()
  if (!session?.user || session.user.role !== "CLIENT") {
    throw new Error("Unauthorized");
  }
  return await prisma.answer.create({
    data: {
      userId: session.user.id,
      questionId: ans.questionId,
      optionId: ans.optionId,
      text: ans.text,
    },
  });
}

