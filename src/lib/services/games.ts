import { prisma } from '@/db'

export const getGames = async () => {
  "use server"
  return prisma.game.findMany()
}