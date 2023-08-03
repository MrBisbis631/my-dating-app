"use client";

import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardTitle, CardHeader, } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";

type ClientFiltersProps = {
  totalItems: number
}


const filtersSchema = z.object({
  page: z.number().min(1).default(1),
  page_size: z.number().max(40).default(20),
  search: z.string().max(255).optional(),
  category: z.string().regex(/^(MARIED|"SINGLE|DIVORCED|BLACKLISTED)$/).optional(),
  gender: z.string().regex(/^(MALE|FEMALE)$/).optional(),
  isDating: z.boolean().optional(),
})

export const ClientFilters: FC<ClientFiltersProps> = ({ totalItems }) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof filtersSchema>>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      page: 1,
      page_size: 20,
    }
  })

  form.watch((filters) => {
    const params = new URLSearchParams(filters as any).toString()
    console.log(filters, params)
    router.push(`/clients?${params}`)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'><p className="text-xl">Filters</p></CardTitle>
        <CardDescription>
          Use the filters below to find the perfect match you looking for.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form>
          <CardContent className="flex items-center justify-between">
            <div className=" space-x-10 flex">
              <div className="">
                <Label htmlFor="search">
                  <p className='mb-2 text-md'>Search</p></Label>
                <Input size={40} id="search" type="text" {...form.register("search")} />
                {form.formState.errors.search && (
                  <Label htmlFor="search" className='text-sm text-red-600/80'>
                    {form.formState.errors.search.message}
                  </Label>
                )}
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="undefined">none</SelectItem>
                          <SelectItem value="MARIED"><span className="lowercase">MARIED</span></SelectItem>
                          <SelectItem value="SINGLE"><span className="lowercase">SINGLE</span></SelectItem>
                          <SelectItem value="DIVORCED"><span className="lowercase">DIVORCED</span></SelectItem>
                          <SelectItem value="BLACKLISTED"><span className="lowercase">BLACKLISTED</span></SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="lowercase" value="undefined">none</SelectItem>
                          <SelectItem className="lowercase" value="MALE">men</SelectItem>
                          <SelectItem className="lowercase" value="FEMALE">women</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="isDating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gating status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="lowercase" value="undefined">none</SelectItem>
                          <SelectItem className="lowercase" value="true">dating</SelectItem>
                          <SelectItem className="lowercase" value="false">not dating</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </form>
      </Form>
      <CardFooter className="space-x-5 flex items-end">
        <Button
          disabled={form.getValues("page") === 1}
          onClick={() => form.setValue("page", form.getValues("page") - 1)}
          size="sm"
          variant={"outline"}
        >
          Previous Page
        </Button>
        <Button
          disabled={form.getValues("page_size") > totalItems}
          onClick={() => form.setValue("page", form.getValues("page") + 1)}
          size="sm"
          variant={"outline"}
        >
          Next Page
        </Button>
        <p className="text-xs opacity-60">page number {form.getValues("page")}, {totalItems} items in page.</p>
      </CardFooter>
    </Card >
  )
}
