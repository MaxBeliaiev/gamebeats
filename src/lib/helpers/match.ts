import { Game, GameStatus, Match, MatchFormat } from '@prisma/client'

export const needsToFinish = (match: Match & { games: Game[] }): boolean => {
  const unFinishedGamesNumber = match.games.filter(
    (game) => game.status === GameStatus.UPCOMING ||
      game.status === GameStatus.ONGOING).length

  return match.format === MatchFormat.SET && unFinishedGamesNumber === 0
}
