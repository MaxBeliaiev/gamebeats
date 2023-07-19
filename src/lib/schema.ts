import * as z from 'zod'

export const competitorSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, {
      message: 'Name must be at least 2 characters.',
    }),
  nickname: z
    .string({
      required_error: 'Nickname is required',
    })
    .min(2, {
      message: 'Nickname must be at least 2 characters.',
    }),
  surname: z
    .string({
      required_error: 'Surname is required',
    })
    .min(2, {
      message: 'Surname must be at least 2 characters.',
    }),
  country: z.string().nullable(),
})
