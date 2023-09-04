export type damageStat = 'crashes'
export type stat = 'knockdowns'
export type subjectStat = 'head' | 'body' | 'legs'

export type UfcLiveStatistics = {
  currentRound: number
  competitors: {
    [key: string]: {
      stamina: number
      rounds: {
        [key: string]: {
          crashes: {
            head: number
            body: number
            legs: number
          }
          knockdowns: number
        }
      }
    }
  }
}

export const ufcDamageAreas: { [stat in subjectStat]: string } = {
  head: 'Head',
  body: 'Body',
  legs: 'Legs',
}

const getRoundObject = () => ({
  crashes: {
    head: 0,
    body: 0,
    legs: 0,
  },
  knockdowns: 0,
})

const getCompetitorObject = () => ({
  stamina: 100,
  rounds: {
    1: getRoundObject(),
    2: getRoundObject(),
    3: getRoundObject(),
  },
})

export const getDefaultUfcLiveResults = (
  competitors: any
): UfcLiveStatistics => ({
  currentRound: 1,
  competitors: {
    [competitors[0].value]: getCompetitorObject(),
    [competitors[1].value]: getCompetitorObject(),
  }
})
