import * as z from 'zod'

interface MatchCommonTypes {
  competitorOne: string
  competitorTwo: string
  startedAt?: Date | string | null
}

function attachRefinements<
  O extends MatchCommonTypes,
  T extends z.ZodTypeDef,
  I,
>(schema: z.ZodType<O, T, I>) {
  return schema.refine(
    ({ competitorOne, competitorTwo }) => competitorOne !== competitorTwo,
    {
      message: 'Cannot choose the same competitor.',
      path: ['competitorTwo'],
    }
  )
}

const matchCommon = {
  competitorOne: z.string({
    required_error: 'Competitor 1 is required',
  }),
  competitorTwo: z.string({
    required_error: 'Competitor 2 is required',
  }),
}

export const matchFormSchema = attachRefinements(
  z.object({
    ...matchCommon,
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
)

const matchReqCommon = {
  startedAt: z.string(),
}

export const matchCreateReqSchema = attachRefinements(
  z.object({
    ...matchCommon,
    ...matchReqCommon,
    tournamentId: z.number({
      required_error: 'Tournament ID is required',
    }),
  })
)

export const matchUpdateReqSchema = attachRefinements(
  z.object({
    ...matchCommon,
    ...matchReqCommon,
    status: z.string(),
  })
)

export const matchPatchReqSchema = z.object({
  status: z.string(),
})
