import { ArrowPathIcon } from '@heroicons/react/24/outline'

export function Spinner() {
  return (
    <div className="flex h-full w-full flex-grow items-center justify-center gap-2">
      <ArrowPathIcon className="h-5 w-5 animate-spin" data-testid="spinner" />
    </div>
  )
}

export default Spinner
