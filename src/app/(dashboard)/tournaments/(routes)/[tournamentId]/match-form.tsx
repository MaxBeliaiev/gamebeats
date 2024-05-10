"use client"
import axios from "axios"
import { toast } from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Match, MatchesOnCompetitors } from "@prisma/client"
import { matchFormSchema } from "@/lib/schemas/match"
import Combobox from "@/components/ui/combobox"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { getAxiosErrorMessage } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import * as React from "react"
import { STREAM_CHANNELS } from "@/lib/constants/matches"
import { useQueryClient } from "@tanstack/react-query"
import { parseISO } from "date-fns"
import { Input } from "@/components/ui/input"

interface MatchFormProps {
    initialData?: Match & {
        competitors: Array<MatchesOnCompetitors>
    } & {
        startedAt: Date | string
    }
    tournamentId?: number
    competitors: Array<{
        label: string
        value: string
    }>
    onSuccess?: () => void
}

type MatchFormValues = z.infer<typeof matchFormSchema>

export function MatchForm({
    initialData,
    competitors,
    tournamentId,
    onSuccess,
}: MatchFormProps) {
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const toastMessage = initialData ? "Match updated!" : "Match created!"
    const form = useForm<MatchFormValues>({
        resolver: zodResolver(matchFormSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  startedAt:
                      typeof initialData.startedAt === "string"
                          ? parseISO(initialData.startedAt)
                          : initialData.startedAt,
                  competitorOne: String(
                      initialData.competitors[0]?.competitorId
                  ),
                  competitorTwo: String(
                      initialData.competitors[1]?.competitorId
                  ),
              }
            : {
                  streamChannel: "1",
                  numberOfGames: 5,
              },
    })
    const onSubmit = async (values: MatchFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.put(`/api/matches/${initialData.id}`, values)
            } else {
                await axios.post(`/api/matches`, { ...values, tournamentId })
            }
            await queryClient.invalidateQueries({ queryKey: ["matches"] })
            router.refresh()
            toast.success(toastMessage)
            onSuccess && onSuccess()
        } catch (e: any) {
            toast.error(getAxiosErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="competitorOne"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <Combobox
                                title="Select competitor 1"
                                value={field.value}
                                data={competitors}
                                onSelect={(value) => {
                                    form.setValue("competitorOne", value)
                                }}
                                searchText="Search competitor..."
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="competitorTwo"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <Combobox
                                title="Select competitor 2"
                                value={field.value}
                                data={competitors}
                                onSelect={(value) => {
                                    form.setValue("competitorTwo", value)
                                }}
                                searchText="Search competitor..."
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="startedAt"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Start time</FormLabel>
                            <DateTimePicker
                                date={field.value}
                                setDate={(date) => {
                                    // @ts-ignore
                                    form.setValue("startedAt", date)
                                }}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="streamChannel"
                    render={({ field }) => (
                        <FormItem className="w-1/2">
                            <FormLabel>Stream channel</FormLabel>
                            <Select
                                defaultValue={field.value}
                                onValueChange={(value) => field.onChange(value)}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select stream channel" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(STREAM_CHANNELS).map(
                                        (stream) => (
                                            <SelectItem
                                                key={stream}
                                                value={stream}
                                            >
                                                {stream}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="numberOfGames"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of games</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    className="w-1/2"
                                    min={1}
                                    max={5}
                                    placeholder="Enter number of games"
                                    {...field}
                                    disabled={loading}
                                    onChange={(e) => {
                                        form.setValue(
                                            "numberOfGames",
                                            Number(e.target.value)
                                        )
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button variant="success" disabled={loading} type="submit">
                    Save
                </Button>
            </form>
        </Form>
    )
}
