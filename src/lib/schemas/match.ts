import * as z from 'zod'
import { MatchStatus } from '@prisma/client'

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
  streamChannel: z.string({
    required_error: 'Stream channel is required'
  }),
}

export const matchFormSchema = attachRefinements(
  z.object({
    ...matchCommon,
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
  })
)

export const matchPatchReqSchema = z.object({
  status: z.string()
}).refine(
  ({ status }) => status === MatchStatus.ONGOING,
  {
    message: 'Invalid status.',
    path: ['status'],
  }
)
