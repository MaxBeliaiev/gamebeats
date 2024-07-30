import { prisma } from '@/db'
import MatchPageClient from '@/app/(dashboard)/matches/(routes)/[matchId]/client'
import { UfcLiveResultModalProvider } from '@/providers/ufc-live-result-modal-provider'
import { FinishGameModalProvider } from '@/providers/finish-game-modal-provider'
import { UpdateGameModalProvider } from '@/providers/update-game-modal-provider'

interface MatchPageProps {
  params: {
    matchId: string
  }
}

const MatchPage = async ({ params: { matchId } }: MatchPageProps) => {
  const matchIdNum = Number(matchId)
  const match = await prisma.match.findUnique({
    where: {
      id: Number(matchIdNum),
    },
    include: {
      competitors: {
        orderBy: {
          order: 'asc',
        },
        include: {
          competitor: {
            select: {
              nickname: true,
              id: true,
            },
          },
        },
      },
      games: {
        include: {
          ufcResultDetails: true,
        }
      },
    },
  })

  const competitorsData = match?.competitors.map((c) => c.competitor) || []

  return (
    <>
      <MatchPageClient match={match} />
      <FinishGameModalProvider competitors={competitorsData} />
      <UfcLiveResultModalProvider competitors={competitorsData} />
      <UpdateGameModalProvider />
    </>
  )
}

export default MatchPage
