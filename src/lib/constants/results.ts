import { UfcEndMethods } from '@prisma/client'

export const UFC_ROUNDS = [1, 2, 3]

export const ufcResultsDbColumns = {
  [UfcEndMethods.DEC]: 'decisions',
  [UfcEndMethods.KO]: 'knockouts',
  [UfcEndMethods.SUB]: 'submissions',
  [UfcEndMethods.SPLIT_DEC]: 'splitDecisions',
}