import { AccountPickerButton } from './wallet/AccountPickerButton'

export default function Header() {
  return (
    <header className="border-b py-3 px-4 items-center flex gap-2 bg-white text-black justify-between">
      <h1 className="text-2xl font-bold italic">BigTipper</h1>
      {/* <nav className="flex">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
      </nav> */}
      <div className="flex items-center gap-4">
        <h4 className="font-semibold">Kusama</h4>
        <AccountPickerButton />
      </div>
    </header>
  )
}
