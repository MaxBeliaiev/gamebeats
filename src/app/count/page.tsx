import { prisma } from '@/db'
import { getUtcStartOfMonth } from '@/lib/helpers/date'

type Data = {
  games: number,
  wins: number,
  winRate: number,
  competitorId: number,
  losses: number,
  draws: number,
  nickname: string
}

export default async function Count() {
  // const between = await prisma.match.findMany({
  //   where: {
  //     AND: [
  //       {
  //         competitors: {
  //         some: {
  //           match: {
  //             tournamentId: 88,
  //           },
  //           competitor: {
  //             id: 9,
  //           }
  //         }
  //       }},
  //       {
  //         competitors: {
  //           some: {
  //             match: {
  //               tournamentId: 88,
  //             },
  //             competitor: {
  //               id: 8,
  //             }
  //           }
  //         }}
  //     ],
  //   },
  //   include: {
  //     competitors: true,
  //   }
  // })
  //
  // const betweenData = {}
  // between.forEach(b => {
  //   const winner = b.competitors.find(c => c.score === 1)
  //   const winnerId = String(winner!.competitorId)
  //   // @ts-ignore
  //   betweenData[winnerId] = !isNaN(betweenData[winnerId]) ? betweenData[winnerId] + 1 : 1
  // })

  const start = getUtcStartOfMonth()
  const end = getUtcStartOfMonth(-1)
  const stats = await prisma.ufcCompetitorStats.findMany({
    where: {
      periodStartedAt: {
        gte: start,
        lt: end,
      },
    },
    include: {
      competitor: {
        select: {
          nickname: true,
        },
      },
    },
  })

  let competitorsData: {
    [key: string]: Data
  } = {}
  stats.forEach(({ competitorId, competitor, games, wins, losses, draws, }) => {
    if (competitorId in competitorsData) {
      competitorsData[competitorId].games += games
      competitorsData[competitorId].wins += wins
      competitorsData[competitorId].losses += losses
      competitorsData[competitorId].draws += draws
      competitorsData[competitorId].winRate =
        Number((competitorsData[competitorId].wins / competitorsData[competitorId].games).toFixed(2))
    } else {
      competitorsData[competitorId] = {
        games: games,
        wins: wins,
        winRate: wins / games,
        losses: losses,
        competitorId: competitorId,
        nickname: competitor!.nickname,
        draws: draws,
      }
    }
  })

  const data: Array<Data> = Object.values(competitorsData).sort((a: any, b: any) => b.winRate - a.winRate)
  const ranked: Array<Data> = data.filter(item => item.games >= 70)
  const rest: Array<Data> = data.filter(item => item.games < 70)

  return (
    <div className='flex flex-col gap-5 px-16 pt-3'>
      <div><b>Start</b>: {start.toUTCString()}, <b>End</b>: {end.toUTCString()}</div>
      {
        ranked.map((competitorData: any) => {
          return (
            <>
              <div className='flex flex-col gap-1' key={competitorData.competitorId}>
                <div className='font-bold'>{competitorData.nickname}:</div>
                <div>Winrate: {(competitorData.winRate * 100).toFixed()}%</div>
                <div>{competitorData.games} games,
                  ({competitorData.wins}-{competitorData.losses}-{competitorData.draws})
                </div>
              </div>
            </>
          )
        })
      }
      {
        Boolean(rest.length) && (
          <div className='text-orange-400'>
            <div>Rest:</div>
            {
              rest.map((competitorData: any) => {
                return (
                  <>
                    <div className='mb-2' key={competitorData.competitorId}>
                      {competitorData.nickname}:
                      <div>{(competitorData.winRate * 100).toFixed()}% ({competitorData.games} games)</div>
                    </div>
                  </>
                )
              })
            }
          </div>
        )
      }
    </div>
  )
}

export const revalidate = 0