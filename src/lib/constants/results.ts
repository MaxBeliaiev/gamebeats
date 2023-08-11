import { UfcWinMethods } from '@prisma/client'

export const UFC_ROUNDS = [1, 2, 3, 4 ,5]

export const ufcResultIncrementColumns = {
  [UfcWinMethods.DEC]: 'decisions',
  [UfcWinMethods.KO]: 'knockouts',
  [UfcWinMethods.SUB]: 'submissions',
}