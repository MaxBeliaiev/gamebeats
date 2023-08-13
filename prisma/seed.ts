import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  // const users = await prisma.user.findMany()
  //
  // await prisma.userNew.createMany({
  //   data: users.map(user => ({
  //     name: user.name,
  //     surname: user.surname,
  //     email: user.email,
  //     password: user.password,
  //     role: user.role
  //   }))
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