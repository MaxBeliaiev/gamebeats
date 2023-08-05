import * as z from 'zod'

const tournamentCommon = {
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, {
      message: 'Name must be at least 2 characters',
    }),
  disciplineId: z.number({
    required_error: 'Please choose game',
  }),
}

const tournamentReqCommon = {
  startedAt: z.string({
    required_error: 'Start date is required',
  }),
}

export const tournamentFormSchema = z.object({
  ...tournamentCommon,
  startedAt: z
    .date({
      required_error: 'Start date is required',
      invalid_type_error: 'Please choose correct date',
    })
    .nullable()
    .transform((value, ctx): Date | undefined => {
      if (value == null) {
        ctx.addIssue({
          code: 'custom',
          message: 'Date cannot be null',
        })
      } else {
        return value
      }
    }),
})

export const tournamentCreateReqSchema = z.object({
  ...tournamentCommon,
  ...tournamentReqCommon,
})

export const tournamentUpdateReqSchema = z.object({
  ...tournamentCommon,
  ...tournamentReqCommon,
  status: z.string().optional()
})
