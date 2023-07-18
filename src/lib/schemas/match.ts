import * as z from 'zod'

interface MatchCommonTypes {
  competitorOne: string
  competitorTwo: string
  startedAt: Date | null | string
  status: string
}

function attachRefinements<
  O extends MatchCommonTypes,
  T extends z.ZodTypeDef,
  I,
>(schema: z.ZodType<O, T, I>) {
  return schema
    .refine(
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
  status: z.string(),
}

export const matchFormSchema = attachRefinements(
  z.object({
    ...matchCommon,
    startedAt: z
      .date({
        invalid_type_error: "That's not a date!",
      })
      .nullable(),
  })
)

const matchReqCommon = {
  startedAt: z.string().nullable(),
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
  })
)
