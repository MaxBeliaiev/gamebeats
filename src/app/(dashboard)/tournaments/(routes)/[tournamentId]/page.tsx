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
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
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
        tournamentId={tournamentId}
      />
      <UpdateMatchModalProvider
        competitors={competitors}
        tournamentId={tournamentId}
      />
      <TournamentPageClient tournament={tournament} />
    </>
  )
}

export default TournamentPage
