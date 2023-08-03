import PendingRegistration from "@/components/profile/pending-registration"
import { prisma } from "@/services/prismaClient"
import { Accordion } from "@/components/ui/accordion"

async function AdminProfile() {
  const mmRequestsToJoin = await prisma.user.findMany({
    where: {
      role: "MATCHMAKER",
      matchmaker: {
        adminAuthorizerId: null
      }
    }
  })

  return (
    <div className="">
      <h1 className="text-lg">Asked to join matchmaker program</h1>
      <Accordion type="single" collapsible className="">
        {mmRequestsToJoin.map(mm => (
          <PendingRegistration user={mm} key={mm.id} />
        ))}
      </Accordion>
    </div>
  )
}

export default AdminProfile