import { zodResolver } from '@hookform/resolvers/zod'
import { skipToken, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { typedApi } from '@/lib/papi/client'
import {
  DEFAULT_FINDERS_FEE,
  KRAKEN_SYMBOL_PAIR,
  TOKEN_SYMBOL,
} from '@/lib/papi/constants'
import { useWallet } from '@/providers/wallet-provider'
import { getExchangeRateQueryOptions } from '@/queries/exchange-queries'

export const Route = createFileRoute('/')({
  component: App,
})

const formSchema = z.object({
  beneficiary: z.string().min(1),
  justification: z.string().min(40),
  tip_amount_usd: z.coerce.number().min(0),
  finders_fee: z.coerce.number().min(0).max(100),
})

function App() {
  const { selectedAccount } = useWallet()
  const { data: accountBalance } = useQuery({
    queryKey: ['account', 'balance', selectedAccount?.address],
    queryFn: selectedAccount
      ? () => typedApi.query.System.Account.getValue(selectedAccount.address)
      : skipToken,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      beneficiary: '',
      justification: '',
      tip_amount_usd: 0,
      finders_fee: DEFAULT_FINDERS_FEE * 100,
    },
  })

  const exchangeQuery = useQuery(
    getExchangeRateQueryOptions(KRAKEN_SYMBOL_PAIR),
  )

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl mb-4">Account Balance</h1>
      <ul>
        <li>
          <b>Free Balance:</b> {accountBalance?.data.free}
        </li>
        <li>
          <b>Reserved Balance:</b> {accountBalance?.data.reserved}
        </li>
        <li>
          <b>Frozen Balance:</b> {accountBalance?.data.frozen}
        </li>
      </ul>

      <div>
        1 USD = {exchangeQuery.data ?? 0} {TOKEN_SYMBOL}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-md mx-auto"
        >
          <FormField
            control={form.control}
            name="beneficiary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beneficiary address:</FormLabel>
                <FormControl>
                  <Input placeholder="Address..." type="text" {...field} />
                </FormControl>
                <FormDescription>
                  This is the account address of the person who you want to
                  receive a tip for a contribution they made.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="justification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tip justification:</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="They deserve to be tipped, because..."
                  />
                </FormControl>
                <FormDescription>
                  Explain why token holders should want to tip the above person
                  for their contributions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tip_amount_usd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tip amount (in USD):</FormLabel>
                <FormControl>
                  <Input placeholder="$$$" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  This is how much you think the contributor should receive in
                  USD.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finders_fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finders fee (%):</FormLabel>
                <FormControl>
                  <Input placeholder="10" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  As the person who found this contribution, what should be your
                  cut for proposing to tip?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 
          <div className="flex flex-col gap-1.5">
            <Label>Tip amount in {TOKEN_SYMBOL}:</Label>
            <Input
              readOnly
              disabled
              value={form.watch('tip_amount_usd') / (exchangeQuery.data ?? 0)}
            />
          </div> */}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
