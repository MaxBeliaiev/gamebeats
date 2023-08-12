import { UfcWinMethods } from '@prisma/client'

export const UFC_ROUNDS = [1, 2, 3]

export const ufcResultsDbColumns = {
  [UfcWinMethods.DEC]: 'decisions',
  [UfcWinMethods.KO]: 'knockouts',
  [UfcWinMethods.SUB]: 'submissions',
}