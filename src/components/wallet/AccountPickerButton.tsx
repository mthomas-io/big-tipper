import { WalletIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useWallet } from '@/providers/wallet-provider'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '../ui/label'

type Extension = {
  id: string
  name: string
  preferred: boolean
}

const supportedExtensions: Extension[] = [
  { id: 'polkadot-js', name: 'polkadot{.js}', preferred: false },
  { id: 'subwallet-js', name: 'SubWallet', preferred: true },
  { id: 'talisman', name: 'Talisman', preferred: true },
  { id: 'nova', name: 'Nova', preferred: true },
]

export const AccountPickerButton = () => {
  const {
    selectedAccount,
    selectedExtension,
    extensions,
    setSelectedExtension,
  } = useWallet()

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        {selectedAccount ? (
          <Button variant={'outline'}>
            <Avatar className="size-6">
              <AvatarImage src={`/extensions/${selectedExtension}.webp`} />
              <AvatarFallback>
                {selectedAccount.name?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <span className="ml-2 text-sm">{selectedAccount.name}</span>
          </Button>
        ) : (
          <Button>
            <WalletIcon /> Connect Wallet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Connect your account using one of the extensions available in your
            browser.
          </DialogDescription>
        </DialogHeader>

        <div>
          {!extensions.length ? (
            <div className="text-center">No supported extensions detected.</div>
          ) : (
            <div className="space-y-6 my-8">
              <div className="space-y-4">
                <div className=" items-center flex gap-4 mb-2">
                  <span className="text-muted-foreground text-xs">
                    Preferred extensions
                  </span>
                  <Separator className="flex-1" />
                </div>
                <div className="flex flex-wrap gap-4">
                  {supportedExtensions
                    .filter(({ preferred }) => !!preferred)
                    .map((supported) => (
                      <ExtensionButton
                        key={supported.id}
                        extension={supported}
                        isSelected={selectedExtension === supported.id}
                        isAvailable={extensions.some(
                          (extension) => extension === supported.id,
                        )}
                        onClick={() => setSelectedExtension(supported.id)}
                      />
                    ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className=" items-center flex gap-4 mb-2">
                  <span className="text-muted-foreground text-xs">
                    Other extensions
                  </span>
                  <Separator className="flex-1" />
                </div>
                <div className="flex flex-wrap gap-4">
                  {supportedExtensions
                    .filter(({ preferred }) => !preferred)
                    .map((supported) => (
                      <ExtensionButton
                        key={supported.id}
                        extension={supported}
                        isSelected={selectedExtension === supported.id}
                        isAvailable={extensions.some(
                          (extension) => extension === supported.id,
                        )}
                        onClick={() => setSelectedExtension(supported.id)}
                      />
                    ))}
                </div>
              </div>

              {!!selectedExtension && (
                <>
                  <Separator />
                  <SelectAccount />
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="default" className="cursor-pointer">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type ExtensionButtonProps = {
  onClick: () => void
  extension: Extension
  isSelected?: boolean
  isAvailable?: boolean
}

const ExtensionButton = ({
  extension,
  isSelected,
  isAvailable,
  onClick,
}: ExtensionButtonProps) => {
  return (
    <div className="max-sm:w-full max-sm:justify-center max-w-full flex max-sm:gap-4 gap-2 items-start">
      <Avatar className="mt-0.5">
        <AvatarImage src={`/extensions/${extension.id}.webp`} />
        <AvatarFallback>{extension.name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="flex-col flex-1 w-full max-w-64 gap-1 flex">
        <Button
          disabled={!isAvailable}
          variant={isSelected ? 'default' : 'outline'}
          className=" w-full min-w-32 hover:cursor-pointer"
          onClick={onClick}
        >
          {extension.name}
        </Button>
        {!isAvailable && (
          <p className="text-xs text-muted-foreground ml-1">Not installed</p>
        )}
      </div>
    </div>
  )
}

const SelectAccount = () => {
  const { selectedAccount, setSelectedAccount, availableAccounts } = useWallet()

  const selectedAddress = selectedAccount?.address

  const handleSelectAddress = (address: string) => {
    setSelectedAccount(
      availableAccounts.find((account) => account.address === address),
    )
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label>Select account:</Label>
      <Select value={selectedAddress} onValueChange={handleSelectAddress}>
        <SelectTrigger className="w-full min-h-12">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {availableAccounts.map((account) => (
            <SelectItem key={account.address} value={account.address}>
              <div className="flex justify-start text-left flex-col">
                <span>{account.name}</span>
                <span className="text-xs text-muted-foreground">
                  {account.address}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
