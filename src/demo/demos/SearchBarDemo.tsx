import { SearchBar } from '@/components/taiso/search-bar'

export function SearchBarDemo() {
  return (
    <div className="max-w-2xl">
      <SearchBar />
      <p className="mt-3 text-xs text-muted-foreground">Type 3+ characters to trigger a search.</p>
    </div>
  )
}
