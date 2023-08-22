import { PrismaClient } from '@prisma/client'
import {getUtcStartOfMonth} from "@/lib/helpers/date";
const prisma = new PrismaClient()
async function main() {
  // await prisma.ufcCompetitorStats.updateMany({
  //   data: {
  //     periodStartedAt: moment().utc().startOf('month').toDate(),
  //   },
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