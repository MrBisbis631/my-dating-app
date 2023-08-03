"use client";

import { useState } from "react"
import type { Question, Option, QuestionType, Answer } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { usePopper } from "@/providers/popper"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { addAnswer } from "@/services/answerActions";

type QuestionsProps = {
  prevAnswers?: Answer[]
  questions: (Question & { options: Option[] })[]
  type: QuestionType
}

type AnswerSubmission = Pick<Answer, "questionId" | "optionId" | "text">

type QuestionFormProps = {
  prevAnswer?: Answer
  question: Question & { options: Option[] }
  mutate: (answers: AnswerSubmission) => void
  isSuccuss: boolean
}

const answerSchema = z.object({
  questionId: z.string(),
  optionId: z.string(),
  text: z.string().max(255).optional()
})

export function Questions({ questions, type, prevAnswers }: QuestionsProps) {
  const [isSuccess, setIsSuccess] = useState(new Array(questions.length).fill(false))
  const { pop } = usePopper()

  const { mutate } = useMutation({
    mutationKey: ["question", type],
    mutationFn: addAnswer,
    onSuccess: (data) => {
      setIsSuccess((prev) => {
        const newArr = [...prev]
        newArr[questions.findIndex((q) => q.id === data.questionId)] = true
        return newArr
      })
      console.log(data)
      pop({
        headline: "Success",
        message: "Your answers have been submitted",
        type: "success"
      })
      // redirect to next page
    },
    onError: (error) => {
      console.error(error)
      pop({
        headline: "Error",
        message: "There was an error submitting your answers",
        type: "error"
      })
    }
  })
  return (
    <div className="space-y-3">
      {questions.map((question) => {
        const prevAnswer = prevAnswers?.find((answer: Answer) => answer.userId === question.id)
        return <QuestionForm
          key={question.id}
          question={question}
          prevAnswer={prevAnswer}
          mutate={mutate}
          isSuccuss={isSuccess[questions.indexOf(question)]}
        />
      }
      )}
    </div>
  )
}


export function QuestionForm({ question, prevAnswer, mutate, isSuccuss }: QuestionFormProps) {
  const form = useForm<AnswerSubmission>({
    defaultValues: {
      optionId: prevAnswer?.optionId || undefined,
      text: prevAnswer?.text || undefined,
      questionId: question.id
    },
    resolver: zodResolver(answerSchema)
  })

  const { register, handleSubmit, formState: { errors }, reset } = form

  const onSubmit = handleSubmit(async (data) => {
    mutate(data)
  })

  return (
    <Card className={`${isSuccuss ? "bg-green-500/10" : ""} w-[450apx]`}>
      <CardHeader>
        <CardTitle>{question.text}</CardTitle>
        {question.description && <CardDescription>{question.description}</CardDescription>}
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="optionId"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor={`options-${question.id}`}>Framework</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                        <SelectTrigger id={`options-${question.id}`}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {question.options.map((option, i) => (
                            <SelectItem key={`option-${question.id}-${i}`} value={option.id}>{option.text}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor={`answerText-${question.id}`}> Your answer</Label>
                <Textarea {...register("text")} id={`answerText-${question.id}`} placeholder="Type your answer here." />
                {errors.text && <FormMessage className="text-sm text-red-500 opacity-80">{errors.text.message}</FormMessage>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => reset()} variant="outline">Cancel</Button>
            <Button type="submit">Send Answer</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
