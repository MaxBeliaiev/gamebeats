import { prisma } from '@/db'
import TournamentPageClient from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/client'
import { CreateMatchModalProvider } from '@/providers/create-match-modal-provider'
import { UpdateMatchModalProvider } from '@/providers/update-match-modal-provider'
import { CompetitorStatus } from '@prisma/client'
import { fetchTournament } from '@/lib/actions/tournament'

interface TournamentPageProps {
  params: {
    tournamentId: string
  }
}

const TournamentPage = async ({
                                params: { tournamentId },
                              }: TournamentPageProps) => {
  const tournament = await fetchTournament(tournamentId)
  // const tournament = await prisma.tournament.findUnique({
  //   where: {
  //     id: tournamentId,
  //   },
  //   include: {
  //     matches: {
  //       orderBy: [
  //         {
  //           status: 'asc',
  //         },
  //         {
  //           startedAt: 'desc',
  //         },
  //       ],
  //     },
  //   },
  // })
  const allCompetitors = await prisma.competitor.findMany({
    where: {
      status: {
        not: CompetitorStatus.ARCHIVED,
      },
    },
  })

  return (
    <>
      <CreateMatchModalProvider
        competitors={allCompetitors}
        tournamentId={tournamentId}
      />
      <UpdateMatchModalProvider
        competitors={allCompetitors}
        tournamentId={tournamentId}
      />
      <TournamentPageClient tournament={tournament} />
    </>
  )
}

export default TournamentPage
