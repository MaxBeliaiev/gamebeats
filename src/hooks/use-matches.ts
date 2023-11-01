import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchMatches = async (params: any) => {
  const searchParams = new URLSearchParams(params);
  const data = await axios(`/api/matches?${searchParams.toString()}`)

  return data.data
}

interface UseMatchesParams {
  queryParams: { tournamentId?: number, page?: number, size?: number }
  filters: any
  initialData: any
}

const useMatches = (params: UseMatchesParams) => {
  const { queryParams, initialData, filters } = params
  const formattedParams: any = {
    ...queryParams
  }

  if (filters) {
    if (filters.from) {
      formattedParams.startedFrom = filters.from.toISOString()
    }
    if (filters.to) {
      formattedParams.startedTo = filters.to.toISOString()
    }
  }

  return useQuery({
    queryKey: ['matches', formattedParams],
    queryFn: () => fetchMatches(formattedParams),
    initialData,
    refetchOnMount: true,
    keepPreviousData: true,
  })
}

export { useMatches, fetchMatches }