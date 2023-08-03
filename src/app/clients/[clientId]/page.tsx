import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badges, ClientAvatar } from '@/components/users-table/RowCells'
import { getRandomProfileImageUrl } from '@/lib/images'
import { prisma } from '@/services/prismaClient'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type ClientDetailsPageProps = {
  params: {
    clientId: string
  }
}

async function ClientDetailsPage({ params }: ClientDetailsPageProps) {
  const client = await prisma.client.findUnique({
    where: {
      userId: params.clientId,
      user: {
        role: "CLIENT"
      }
    },
    include: {
      user: true,
      answers: {
        include: {
          question: true,
          option: {
            include: {
              answers: true
            }
          }
        }
      },
      matches1: true,
      matches2: true,
      reports: true,
    }
  })

  if (!client || !client.user) {
    throw new Error("Client not found")
  }

  const question = await prisma.question.findMany({
    where: {
      id: {
        in: client.answers.map(answer => answer.questionId)
      }
    },
    include: {


    }
  })

  const photoUrl = client.photoUrl || client.user.image || getRandomProfileImageUrl()

  const birthday = new Date(client.birthday)
  const year = birthday.getFullYear();
  const month = String(birthday.getMonth() + 1).padStart(2, '0');
  const day = String(birthday.getDate()).padStart(2, '0');

  return (
    <div className='max-w-2xl mx-auto px-2 py-3 my-5 shadow-black/50 bg-white -z-10 min-h-screen shadow'>
      <div className="flex justify-between items-top gap-x-1">
        <div className="space-y-5">
          <div className="">
            <h2 className="text-3xl font-semibold">
              {client.user.firstName} {client.user.lastName}
            </h2>
            <Badges category={client.category} gender={client.gender} isDating={client.isDating} />
          </div>
          <div className="">
            <h3 className="text-xl font-light">Birthday: {[day, month, year].join('/')}</h3>
          </div>
          <div className="">
            <h3 className="text-xl font-light">
              Contact Info
            </h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="">Email:</span>
                <Link className='text-purple-950/80' href={`mailto:${client.user.email}`}>
                  {client.user.email}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="">Phone Number:</span>
                <Link className='text-purple-950/80' href={`tel:${client.user.phoneNumber}`}>
                  {client.user.phoneNumber}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Image
          src={photoUrl}
          alt="client photo"
          width={500}
          height={500}
          className='rounded shadow shadow-black/30 w-5/12'
        />
      </div>


      <div className="space-y-3 mt-10">
        <div className="max-w-xl mx-auto">
          {client.answers.length &&
            <>
              <h3 className="font-light text-xl">Answer to Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {client.answers.map((answer) => (
                  <AccordionItem value={`item-${answer.id}`} key={`q-${answer.id}`}>
                    <AccordionTrigger className='text-md text-left font-normal'>{answer.question.text}</AccordionTrigger>
                    <AccordionContent>
                      <p className="">&bull; {answer.option?.text}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default ClientDetailsPage
