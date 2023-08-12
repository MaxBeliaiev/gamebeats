import { prisma } from '@/db'
import TournamentPageClient from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/client'
import { CreateMatchModalProvider } from '@/providers/create-match-modal-provider'
import { UpdateMatchModalProvider } from '@/providers/update-match-modal-provider'
import { CompetitorStatus, MatchStatus } from '@prisma/client'

interface TournamentPageProps {
  params: {
    tournamentId: string
  }
}
const TournamentPage = async ({
  params: { tournamentId },
}: TournamentPageProps) => {
  const tournamentIdNum = Number(tournamentId)
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: Number(tournamentIdNum),
    },
    include: {
      matches: {
        orderBy: [
          {
            endedAt: 'asc'
          },
          {
            status: 'desc',
          },
          {
            startedAt: 'asc',
          },
        ],
        take: 20,
        include: {
          competitors: {
            orderBy: {
              order: 'asc',
            },
            include: {
              competitor: {
                select: {
                  id: true,
                  nickname: true,
                },
              },
            },
          },
        },
      },
    },
  })
  const competitors = await prisma.competitor.findMany({
    where: {
      status: {
        not: CompetitorStatus.ARCHIVED,
      },
    },
    select: {
      id: true,
      nickname: true,
    },
  })

  // @ts-ignore
  // tournament.matches = tournament?.matches.sort((a, b) => {
  //   if (a.status === MatchStatus.ONGOING && b.status !== MatchStatus.ONGOING) {
  //     return -1
  //   }
  //
  //   if (
  //     a.status === MatchStatus.UPCOMING &&
  //     b.status === MatchStatus.FINISHED
  //   ) {
  //     return -1
  //   }
  //
  //   return 0
  // })
  return (
    <>
      <CreateMatchModalProvider
        competitors={competitors}
        tournamentId={tournamentIdNum}
      />
      <UpdateMatchModalProvider
        competitors={competitors}
        tournamentId={tournamentIdNum}
      />
      <TournamentPageClient tournament={tournament} />
    </>
  )
}

export default TournamentPage
