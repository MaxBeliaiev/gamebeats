import { create } from 'zustand'
import { Match } from '@prisma/client'

interface useUpdateMatchModal {
  isOpen: boolean
  open: () => void
  close: () => void
  match: any
  matchId?: number | null
  setMatchId: (id: number) => void
  setMatch: (match: Match) => void
}

export const useUpdateMatchModal = create<useUpdateMatchModal>((set) => ({
  matchId: null,
  setMatchId: (newMatchId: number) => set({ matchId: newMatchId }),
  setMatch: (newMatch: any) => set({ match: newMatch }),
  isOpen: false,
  match: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
