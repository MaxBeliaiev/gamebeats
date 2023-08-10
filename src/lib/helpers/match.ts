import { Game, GameStatus, Match, MatchFormat } from '@prisma/client'

export const needsToFinish = (match: Match & { games: Game[] }): boolean => {
  const finishedGamesNumber = match.games.filter(
    (game) => game.status === GameStatus.FINISHED
  ).length

  let needsToFinish = false

  //@TODO: Add expanded format logic when BO3+ introduced
  if (match.format === MatchFormat.BO1 && finishedGamesNumber > 0) {
    needsToFinish = true
  }

  return needsToFinish
}
