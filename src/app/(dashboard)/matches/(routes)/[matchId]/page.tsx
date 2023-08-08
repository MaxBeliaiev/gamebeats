import { prisma } from '@/db'
import MatchPageClient from '@/app/(dashboard)/matches/(routes)/[matchId]/client'
import { CreateMatchModalProvider } from '@/providers/create-match-modal-provider'
import { UpdateMatchModalProvider } from '@/providers/update-match-modal-provider'

interface MatchPageProps {
  params: {
    matchId: string
  }
}
const MatchPage = async ({
  params: { matchId },
}: MatchPageProps) => {
  const matchIdNum = Number(matchId)
  const match = await prisma.match.findUnique({
    where: {
      id: Number(matchIdNum),
    },
    include: {
      competitors: {
        include: {
          competitor: true
        }
      },
      games: true,
    },
  })

  return (
    <>
      {/*<CreateMatchModalProvider*/}
      {/*  competitors={competitors}*/}
      {/*  tournamentId={match}*/}
      {/*/>*/}
      {/*<UpdateMatchModalProvider*/}
      {/*  competitors={competitors}*/}
      {/*  matchId={matchId}*/}
      {/*/>*/}
      <MatchPageClient match={match} />
    </>
  )
}

export default MatchPage
