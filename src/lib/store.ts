import { create } from 'zustand'

type AppState = {
  ufc: {
    liveResultsForm: {
      isLoading: boolean,
      setIsLoading: (value: boolean) => void
    }
    matches: {
      pagination: {
        page: number
      }
      setPage: (value: number) => void
    }
  }
}


const useStore = create<AppState>()(set => ({
  ufc: {
    liveResultsForm: {
      isLoading: false,
      setIsLoading: (value: boolean) =>
        set((state: any) => ({
          ufc: {
            ...state.ufc,
            liveResultsForm: {
              ...state.ufc.liveResultsForm,
              isLoading: value
            }
          },
        })),
    },
    matches: {
      pagination: {
        page: 1
      },
      setPage: (value: number) =>
        set((state: any) => ({
          ufc: {
            ...state.ufc,
            matches: {
              ...state.ufc.matches,
              pagination: {
                ...state.ufc.matches.pagination,
                page: value,
              }
            }
          },
        })),
    }
  },
}))

export default useStore