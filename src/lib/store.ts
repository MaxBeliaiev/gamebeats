import { create } from 'zustand'

type AppState = {
  ufc: {
    liveResultsForm: {
      isLoading: boolean,
      setIsLoading: (value: boolean) => void
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
  },
}))

export default useStore