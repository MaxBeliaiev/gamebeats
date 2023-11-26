export type damageStat = 'crashes'
export type stat = 'knockdowns'
export type subjectStat = 'head' | 'body' | 'legs'

enum DAMAGE_LEVELS {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export type damageLevel = DAMAGE_LEVELS

export const damageLevelsData = [
  {
    level: DAMAGE_LEVELS.LOW,
    color: 'amber-300',
    label: 'Low'
  },
  {
    level: DAMAGE_LEVELS.MEDIUM,
    color: 'orange-400',
    label: 'Medium'
  },
  {
    level: DAMAGE_LEVELS.HIGH,
    color: 'red-600',
    label: 'High'
  }
]

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
          submissions: {
            crashes: number
          }
          lungs: DAMAGE_LEVELS
          cuts: DAMAGE_LEVELS
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
    submissions: {
      crashes: 0
    },
    lungs: DAMAGE_LEVELS.NONE,
    cuts: DAMAGE_LEVELS.NONE,
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
