import { queryOptions } from '@tanstack/react-query'
import { KRAKEN_SYMBOL_PAIR } from '../lib/papi/constants'

export const getExchangeRateQueryOptions = (pair: string) =>
  queryOptions({
    queryKey: ['exchange', pair],
    queryFn: async () => {
      const response = await fetch(
        `https://api.kraken.com/0/public/Ticker?pair=${pair}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      const data = await response.json()

      if (data.error?.length) {
        throw new Error(data.error[0])
      }

      // Volume weighted average price in last 24 hours
      // https://docs.kraken.com/api/docs/rest-api/get-ticker-information
      return Number(data.result[KRAKEN_SYMBOL_PAIR].p[1])
    },
    // Refresh every 60 seconds
    refetchInterval: 60_000,
  })
