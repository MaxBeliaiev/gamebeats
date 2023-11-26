import { prisma } from '@/db'
import { MatchStatus, TournamentStatus } from '@prisma/client'
import { formatDateTime } from '@/lib/date-utils'

export default async function Count() {
  const tournaments = await prisma.tournament.findMany({
    where: {
      status: TournamentStatus.FINISHED,
    },
    orderBy: {
      id: 'desc'
    },
    take: 3,
    select: {
      id: true,
      startedAt: true,
      name: true,
      matches: {
        where: {
          status: MatchStatus.FINISHED
        },
        select: {
          competitors: {
            select: {
              competitor: {
                select: {
                  nickname: true,
                  id: true,
                }
              }
            }
          },
        }
      }
    }
  })

  const tournamentIds: Array<number> = tournaments.map(t => t.id)
  const competitorIds: Array<number> = []
  const data: {[key: string]: { name: string, start: Date, data: {
    ranked:  Array<any>,
        rest:  Array<any>,
      }}} = {}
  const tournamentsCompetitors: any = {}

  tournaments.forEach(t => {
    data[t.id] = {
      name: t.name,
      start: t.startedAt,
      data: {
        ranked: [],
        rest: []
      }
    }

    t.matches.forEach(m => {
      m.competitors.forEach(({ competitor }) => {
        if (!competitorIds.includes(competitor.id)) {
          competitorIds.push(competitor.id)
        }

        tournamentsCompetitors[t.id] = { ...tournamentsCompetitors[t.id], [competitor.id] : {
            nickname: competitor.nickname
          } }
      })
    })
  })

  const stats = await prisma.ufcCompetitorStats.findMany({
    where: {
      tournamentId: {
        in: tournamentIds
      },
      competitorId: {
        in: competitorIds
      }
    }
  })

  tournaments.forEach(tournament => {
    const tournamentStats = stats.filter(stat => stat.tournamentId === tournament.id)
    const allStats: Array<{
      games: number,
      wins: number,
      winRate: number,
      competitorId: number,
      nickname: string
    }> = []

    const rest: Array<{
      games: number,
      wins: number,
      winRate: number,
      competitorId: number,
      nickname: string
    }> = []

    Object.entries(tournamentsCompetitors[tournament.id]).forEach(([competitorId, competitor]: any) => {
      const competitorStatsData =
        tournamentStats.filter(stat => Number(competitorId) === stat.competitorId)
      const games = competitorStatsData.reduce((a, b) => { return a + b.games }, 0)
      const wins= competitorStatsData.reduce((a, b) => { return a + b.wins }, 0)

      const dataItem = {
        games,
        wins,
        winRate: Number((wins / games).toFixed(2)),
        competitorId: competitorId,
        nickname: competitor.nickname
      }


      if (games >= 70) {
        allStats.push(dataItem)
      } else {
        rest.push(dataItem)
      }
    })

    data[tournament.id].data.ranked = allStats.sort((a,b) => b.winRate - a.winRate)
    data[tournament.id].data.rest = rest
  })

  return (
    <>
      <div className='flex flex-row gap-8 px-16'>
        {
          Object.entries(data).map(([tournamentId, tournamentData]: any) => (
            <div key={tournamentId} className='mb-5'>
              <div className='font-bold'>{tournamentData.name}</div>
              <div className='font-bold mb-6'>Start: {formatDateTime(tournamentData.start, 'dd/MM/yyyy')}</div>
              <div className='mb-3'>
                {
                  tournamentData.data.ranked.map((competitorData: any, i: number) => {
                    return (
                      <>
                        <div className='mb-2' key={competitorData.competitorId}>
                          {i + 1}. {competitorData.nickname}:
                          <div>{(competitorData.winRate * 100).toFixed()}% ({competitorData.games} games)</div>
                        </div>
                      </>
                    )
                  })
                }
              </div>
              {
                Boolean(tournamentData.data.rest.length) && (
                  <div className='text-orange-400'>
                    <div>Rest:</div>
                    {
                      tournamentData.data.rest.map((competitorData: any, i: number) => {
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
          ))
        }
      </div>
      <div>Cached: {new Date().toString()}</div>
    </>
  )
}

export const revalidate = 0