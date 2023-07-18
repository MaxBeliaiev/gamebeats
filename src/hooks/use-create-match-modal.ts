import { create } from 'zustand'

interface useCreateMatchModal {
  isOpen: boolean
  open: () => void
  close: () => void
  matchId?: number | null
  setMatchId: (id: number) => void
}

export const useCreateMatchModal = create<useCreateMatchModal>((set) => ({
  matchId: null,
  setMatchId: (newMatchId: number) => set({ matchId: newMatchId }),
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
