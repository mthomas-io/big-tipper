import { ksm } from '@polkadot-api/descriptors'
import { createClient } from 'polkadot-api'
import { getSmProvider } from 'polkadot-api/sm-provider'
import { chainSpec } from 'polkadot-api/chains/ksmcc3'
import { startFromWorker } from 'polkadot-api/smoldot/from-worker'

// Using vite
import SmWorker from 'polkadot-api/smoldot/worker?worker'

const worker = new SmWorker()

const smoldot = startFromWorker(worker, { forbidWs: true })
const chain = await smoldot.addChain({ chainSpec })

const client = createClient(getSmProvider(chain))

export const typedApi = client.getTypedApi(ksm)
