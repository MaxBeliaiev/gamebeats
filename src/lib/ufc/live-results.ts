export type UfcLiveStatistics = { currentRound: number, rounds: any }

export const getDefaultUfcLiveResults = (competitors: any): UfcLiveStatistics => (
  {
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
        },
      },
    },
  }
)