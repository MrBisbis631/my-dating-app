import Image from 'next/image'
import MatchmakerSignUp from "./MatchmakerSignup"
import ClientSignUp from "./ClientSignUp"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function TabsDemo() {
  return (
    <>
    {/* TODO: Get the .svg logo in from Avishai */}
    <Image  src="/logo.svg" width={200} height={"400"} alt="logo" color="black" className="text-black mx-auto" />
    <Tabs defaultValue="clients" className="max-w-[500px] mx-auto mt-10">
      <TabsList className="grid w-full grid-cols-2 mb-2 bg-white shadow-sm">
        <TabsTrigger value="clients">Clients</TabsTrigger>
        <TabsTrigger value="matchmaker">Matchmaker</TabsTrigger>
      </TabsList>
      <TabsContent value="clients" className="bg-white">
        <ClientSignUp />
      </TabsContent>
      <TabsContent value="matchmaker" className="bg-white">
        <MatchmakerSignUp />
      </TabsContent>
    </Tabs>
    </>
  )
}
