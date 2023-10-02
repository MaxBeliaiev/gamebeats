import { PrismaClient } from '@prisma/client'
import moment from 'moment/moment'
const prisma = new PrismaClient()
async function main() {
  // const data = await prisma.ufcCompetitorStats.updateMany({
  //   where: {
  //     periodStartedAt: moment().utc().startOf('month').toDate(),
  //   },
  //   data: {
  //     periodStartedAt: moment().utc().startOf('isoWeek').toDate()
  //   }
  // })
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