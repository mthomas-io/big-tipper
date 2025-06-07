import { ksm } from '@polkadot-api/descriptors'
import { createClient } from 'polkadot-api'
import { getSmProvider } from 'polkadot-api/sm-provider'
import { chainSpec } from 'polkadot-api/chains/polkadot'
import { startFromWorker } from 'polkadot-api/smoldot/from-worker'

// Using vite
import SmWorker from 'polkadot-api/smoldot/worker?worker'
import type { SS58String } from 'polkadot-api'

const worker = new SmWorker()

const smoldot = startFromWorker(worker)
const chain = await smoldot.addChain({ chainSpec })

// Connect to the polkadot relay chain.
const client = createClient(getSmProvider(chain))

// With the `client`, you can get information such as subscribing to the last
// block to get the latest hash:
client.finalizedBlock$.subscribe((finalizedBlock) =>
  console.log(finalizedBlock.number, finalizedBlock.hash),
)

// To interact with the chain, you need to get the `TypedApi`, which includes
// all the types for every call in that chain:
const typedApi = client.getTypedApi(ksm)

// get the value for an account
export const getAccountInfo = (address: SS58String) =>
  typedApi.query.System.Account.getValue(address)
