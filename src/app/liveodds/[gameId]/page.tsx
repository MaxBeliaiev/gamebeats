import { prisma } from "@/db"
import axios from "axios"

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

  return (
    <div className='p-4'>
      {
        Object.keys(resultsDisplay).map((key: any) => {
          const competitor = competitors.find(comp => comp.id === Number(key))
          return (
            <div key={key}><b>{competitor?.nickname}</b> - {(resultsDisplay[key] * 100).toFixed(2)}%</div>
          )
        })
      }
    </div>
  )
}

export default LiveOdds