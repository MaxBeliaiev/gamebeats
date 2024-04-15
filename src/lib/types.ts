import { PrismaClient } from '@prisma/client'
import { DefaultArgs } from 'prisma/prisma-client/runtime/library'
import { Prisma } from '.prisma/client'

type TransactionPrisma =
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

export type PrismaTransactionalClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export type PrismaClientCommon = PrismaClient | PrismaTransactionalClient | TransactionPrisma