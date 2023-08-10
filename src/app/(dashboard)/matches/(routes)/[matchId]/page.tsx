import { prisma } from '@/db'
import MatchPageClient from '@/app/(dashboard)/matches/(routes)/[matchId]/client'
import { CreateMatchModalProvider } from '@/providers/create-match-modal-provider'
import { UpdateMatchModalProvider } from '@/providers/update-match-modal-provider'
import { FinishGameModalProvider } from '@/providers/finish-game-modal-provider'

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
        include: {
          competitor: {
            select: {
              nickname: true,
              id: true,
            },
          },
        },
      },
      games: true,
    },
  })

  return (
    <>
      <MatchPageClient match={match} />
      <FinishGameModalProvider
        competitors={match?.competitors.map((c) => c.competitor) || []}
      />
    </>
  )
}

export default MatchPage
