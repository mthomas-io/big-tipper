import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getAccountInfo } from '@/lib/papi/client'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data } = useQuery({
    queryKey: ['people'],
    queryFn: () =>
      // Jay
      getAccountInfo('E5qFqe5g5iS4Byu4hyKLAavayXtCiuuuK4xzuLcnQWvtqrg'),
  })

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Jay's Account Balance</h1>
      <ul>
        <li>
          <b>Free Balance:</b> {data?.data.free}
        </li>
        <li>
          <b>Reserved Balance:</b> {data?.data.reserved}
        </li>
        <li>
          <b>Frozen Balance:</b> {data?.data.frozen}
        </li>
      </ul>
    </div>
  )
}
