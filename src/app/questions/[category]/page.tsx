import { Answer, QuestionType } from "@prisma/client"
import { prisma } from "@/services/prismaClient"
import { getServerSession } from "@/lib/auth/authorization"
import { redirect } from "next/navigation"
import { Questions } from './QuestionsForm'
import { FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type QuestionProps = {
  params: {
    category: QuestionType
  }
}

// revalidate data every 24 hours
export const revalidate = 60 * 60 * 24 // 24 hours

type QuestionsHeadlineProps = {
  type?: QuestionType
}

const QuestionsHeadline: FC<QuestionsHeadlineProps> = () => {
  return (
    <div className="mb-5" >
      <h1 className="text-3xl font-semibold mx-5">Questions</h1>
      <p className="text-sm mx-5 opacity-70">Please answer the following questions to help us find your match</p>
    </div>
  )
}

const QuestionsLinks = ({ currentCategory }: { currentCategory: string }) => {
  const categories = ["PERSONALITY", "PREFERENCE", "BIO", "RELIGION", "LIFESTYLE", "BACKGROUND", "OTHER", "LOOKINS_FOR"]
  return (
    <div className="flex justify-around px-5 absolute top-0 opacity-80 bg-black py-5 w-full shadow-xl">
      <div className="flex flex-col space-y-3 xl:space-y-0 xl:space-x-3 xl:flex-row">
        {categories.map((category) => (
          <Link key={category} href={`/questions/${category}`} className=" capitalize">
            <Button className="opacity-100 w-full my-auto" size={"sm"} variant={"outline"} disabled={category === currentCategory}>{category}</Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default async function Question({ params }: QuestionProps) {
  const session = await getServerSession();
  if (!session || !session.user || session.user.role !== "CLIENT") {
    return redirect("/sign-in")
  }

  const questions = await prisma.question.findMany({
    where: {
      type: params.category
    },
    include: {
      options: true
    }
  })

  const answers: Answer[] = await prisma.answer.findMany({
    where: {
      userId: session.user.id,
      question: {
        type: params.category
      }
    },
  })

  return (
    <>
      <QuestionsLinks currentCategory={params.category} />
      <div className="my-10 mx-auto max-w-lg">
        <Image
          src={"/black-logo.png"}
          alt="logo"
          width={200}
          height={200}
          className="mt-[400px] mx-auto xl:mt-24"
        />
        <QuestionsHeadline />
        <Questions type={params.category} questions={questions} prevAnswers={answers} />
      </div>
    </>
  )
}
