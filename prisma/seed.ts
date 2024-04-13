import { MatchFormat, MatchStatus, PrismaClient } from '@prisma/client'
import moment from 'moment/moment'
const prisma = new PrismaClient()
async function main() {
  await prisma.match.updateMany({
    where: {
      format: MatchFormat.BO1
    },
    data: {
      format: MatchFormat.SET
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })