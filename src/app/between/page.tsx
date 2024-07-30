import { prisma } from '@/db'
export default async function Count() {
  const id1 = 3, id2 = 8
  const between = await prisma.match.findMany({
    where: {
      AND: [
        {
          competitors: {
          some: {
            match: {
              tournamentId: {
                gte: 120,
              },
            },
            competitor: {
              id: id1,
            }
          }
        }},
        {
          competitors: {
            some: {
              match: {
                tournamentId: {
                  gte: 120,
                },
              },
              competitor: {
                id: id2,
              }
            }
          }}
      ],
    },
    include: {
      competitors: true,
    }
  })

  const betweenData = {[id1]: 0, [id2]: 0}
  let draws = 0
  between.forEach(b => {
    const comp1 = b.competitors.find(c => c.competitorId === id1)!.score
    betweenData[id1] += comp1
    const comp2 = b.competitors.find(c => c.competitorId === id2)!.score
    betweenData[id2] += comp2
    // const winner = b.competitors.find(c => c.score === 1)
    // // @ts-ignore
    // if (winner) {
    //   const winnerId = String(winner!.competitorId)
    //   // @ts-ignore
    //   betweenData[winnerId]++
    // } else {
    //   draws++
    // }
  })

  console.log('stat: ',betweenData)
  console.log('draws: ', draws)

  return (
    <div>asd</div>
  )
}

export const revalidate = 0