import { create } from 'zustand'
import { Game } from '@prisma/client'

interface useUpdateGameModal {
  isOpen: boolean
  open: () => void
  close: () => void
  game: any
  gameId?: number | null
  setGameId: (id: number) => void
  setGame: (game: Game) => void
}

export const useUpdateGameModal = create<useUpdateGameModal>((set) => ({
  gameId: null,
  setGameId: (newGameId: number) => set({ gameId: newGameId }),
  setGame: (newGame: any) => set({ game: newGame }),
  isOpen: false,
  game: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
