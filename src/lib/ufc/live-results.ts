export type damageStat = 'traumas' | 'knockdowns'
export type subjectStat = 'head' | 'body' | 'rightLeg' | 'leftLeg'

export type UfcLiveStatistics = {
  currentRound: number
  rounds: {
    [key: string]: {
      [key: string]: {
        traumas: {
          head: number
          body: number
          rightLeg: number
          leftLeg: number
        }
        knockdowns: {
          head: number
          body: number
          rightLeg: number
          leftLeg: number
        }
        stamina: number
      }
    }
  }
}

export const ufcDamageAreas: { [stat in subjectStat]: string } = {
  head: 'Head',
  body: 'Body',
  rightLeg: 'R. Leg',
  leftLeg: 'L. Leg',
}

export const getDefaultUfcLiveResults = (
  competitors: any
): UfcLiveStatistics => ({
  currentRound: 1,
  rounds: {
    '1': {
      [competitors[0].value]: {
        traumas: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        knockdowns: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        stamina: 100,
      },
      [competitors[1].value]: {
        traumas: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        knockdowns: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        stamina: 100,
      },
    },
    '2': {
      [competitors[0].value]: {
        traumas: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        knockdowns: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        stamina: 100,
      },
      [competitors[1].value]: {
        traumas: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        knockdowns: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        stamina: 100,
      },
    },
    '3': {
      [competitors[0].value]: {
        traumas: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        stamina: 100,
        knockdowns: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
      },
      [competitors[1].value]: {
        traumas: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        knockdowns: {
          head: 0,
          body: 0,
          rightLeg: 0,
          leftLeg: 0,
        },
        stamina: 100,
      },
    },
  },
})
