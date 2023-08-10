import { PrismaClient } from '@prisma/client'
import { DefaultArgs, PrismaClientOptions } from 'prisma/prisma-client/runtime/library'

type TransactionPrisma =
  Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

export type PrismaClientCommon = PrismaClient | TransactionPrisma