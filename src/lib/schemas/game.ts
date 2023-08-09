import * as z from 'zod'

export const gameFinishFormSchema = z.object({
  winnerId: z.string(),
})