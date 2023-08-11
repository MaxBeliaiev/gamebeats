import * as z from 'zod'

export const gameFinishFormSchema = z.object({
  winnerId: z.string(),
  round: z.number({
    required_error: 'Round is required'
  }),
  winTime: z.string({
    required_error: 'Win time is required in format 0:00'
  }).length(4, { message: "Wrong format" }),
  winMethod: z.string({
    required_error: 'Win method is required',
  })
})