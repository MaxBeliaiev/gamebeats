import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchMatches = async (params: any) => {
  const searchParams = new URLSearchParams(params);
  const { data: { data } } = await axios(`/api/matches?${searchParams.toString()}`)

  console.log('FETCHING with ', params.page)

  return data
}

interface UseMatchesParams {
  queryParams: { tournamentId?: number, page?: number, size?: number }
  initialData: any
}

const useMatches = (params: UseMatchesParams) => {
  const { queryParams, initialData } = params

  return useQuery({
    queryKey: ['matches', queryParams],
    queryFn: () => fetchMatches(queryParams),
    initialData,
    keepPreviousData: true,
  })
}

export { useMatches, fetchMatches }