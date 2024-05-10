import { prisma } from '@/db'
import {MatchStatus} from "@prisma/client";
export default async function Count() {
  const sets = await prisma.match.findMany({
    where: {
      status: MatchStatus.FINISHED,
      numberOfGames: 5
    },
    select: {
      id: true,
      winnerId: true,
      competitors: true
    }
  })

  for (const set of sets) {
    const isDraw = set.competitors[0].score === set.competitors[1].score

    if (isDraw) {
      console.log('draw ', set.id)
    } else {
      const winnerByScore = [...set.competitors].sort(
          (a, b) => b.score - a.score)[0]
      if (set.winnerId !== winnerByScore.competitorId) {
        console.log('mistake ', set.id, ' real winner: ', winnerByScore.competitorId)

          // await prisma.match.update({
          //   where: {
          //     id: set.id
          //   },
          //   data: {
          //     winnerId: winnerByScore.competitorId
          //   }
          // })

      }
    }
  }

  return (
    <div>lalka</div>
  )
}

export const revalidate = 0