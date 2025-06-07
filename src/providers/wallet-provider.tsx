// WalletContext.tsx
import {
  connectInjectedExtension,
  getInjectedExtensions,
} from 'polkadot-api/pjs-signer'
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'
import type { ReactNode } from 'react'
import type { InjectedPolkadotAccount } from 'polkadot-api/pjs-signer'

interface WalletContextType {
  extensions: Array<string>
  selectedExtension?: string
  setSelectedExtension: (ext: string) => void
  availableAccounts: Array<InjectedPolkadotAccount>
  selectedAccount?: InjectedPolkadotAccount
  setSelectedAccount: (account?: InjectedPolkadotAccount) => void
  connectAccounts: (walletName: string) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [extensions, setExtensions] = useState<Array<string>>([])
  const [selectedExtension, setSelectedExtension] = useState<string>()
  const [availableAccounts, setAvailableAccounts] = useState<
    Array<InjectedPolkadotAccount>
  >([])
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedPolkadotAccount>()

  useEffect(() => {
    const ext = getInjectedExtensions().sort((a, b) => a.localeCompare(b))
    setExtensions(ext)
  }, [])

  const connectAccounts = useCallback((fromWallet: string) => {
    connectInjectedExtension(fromWallet)
      .then((ext) => {
        const accounts = ext.getAccounts()
        toast.success(
          `Connected ${accounts.length} account(s) from ${fromWallet}.`,
        )
        setAvailableAccounts(accounts)
      })
      .catch((err) => {
        setAvailableAccounts([])
        if (err instanceof Error) toast.error(err.message)
      })
  }, [])

  useEffect(() => {
    if (selectedExtension) {
      connectAccounts(selectedExtension)
    }
  }, [selectedExtension, connectAccounts])

  const value = useMemo(() => {
    return {
      extensions,
      selectedExtension,
      setSelectedExtension,
      availableAccounts,
      selectedAccount,
      setSelectedAccount,
      connectAccounts,
    }
  }, [
    extensions,
    selectedExtension,
    setSelectedExtension,
    availableAccounts,
    selectedAccount,
    setSelectedAccount,
    connectAccounts,
  ])

  return <WalletContext value={value}>{children}</WalletContext>
}

export const useWallet = (): WalletContextType => {
  const context = use(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
