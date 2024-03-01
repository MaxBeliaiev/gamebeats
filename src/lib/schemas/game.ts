import * as z from 'zod'

export const gameFinishFormSchema = z.object({
  winnerId: z.string(),
  round: z.number({
    required_error: 'Round is required'
  }),
  endTime: z.string({
    required_error: 'Win time is required in format 0:00'
  }).regex(new RegExp('^([0-5]):[0-5][0-9]$'), { message: 'Wrong time format' }),
  endMethod: z.string()
}).refine(({ endMethod, winnerId }) => !(winnerId && !endMethod), {
  message: 'Win method is required.',
  path: ['endMethod'],
})

export const gameFormSchema =
  z.object({
    startedAt: z
      .date({
        invalid_type_error: 'Please choose correct date',
      })
      .nullish()
      .transform((value, ctx): Date | undefined => {
        if (value == null) {
          ctx.addIssue({
            code: 'custom',
            message: 'Start date is required',
          })
        } else {
          return value
        }
      }),
  })