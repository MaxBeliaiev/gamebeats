import { prisma } from '@/db'
import TournamentPageClient from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/client'
import { CreateMatchModalProvider } from '@/providers/create-match-modal-provider'
import { UpdateMatchModalProvider } from '@/providers/update-match-modal-provider'
import { CompetitorStatus, MatchStatus, TournamentStatus } from '@prisma/client'
import { hash } from 'bcrypt'

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
            status: 'asc',
          },
          {
            startedAt: 'desc',
          },
        ],
        include: {
          result: true,
          competitors: {
            include: {
              competitor: true,
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
  })

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
