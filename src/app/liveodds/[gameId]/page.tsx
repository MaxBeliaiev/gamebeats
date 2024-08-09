import { prisma } from "@/db"
import axios from "axios"
import LiveOddsClient from "@/app/liveodds/[gameId]/client"

const LiveOdds = async ({ params: { gameId }}: {params: { gameId: string}}) => {
  const competitors = await prisma.competitor.findMany()

  const odds = await axios.post(`https://odds.solutions.eaisy.tech/live`,
    [
      {
        "liveMatch": {
          "id": Number(gameId),
          "requestId": "random_requestId"
        },
        "oddsTypes": [
          "matchResult"
        ]
      }
      ]
  )

  const result = odds.data?.[0].oddsTypes?.[0].matchResult

  const resultsDisplay = {
    [result.competitorIds[1]]: result.winOdds[1],
    [result.competitorIds[2]]: result.winOdds[2]
  }

  return <LiveOddsClient data={resultsDisplay} competitors={competitors} />
}

export default LiveOdds