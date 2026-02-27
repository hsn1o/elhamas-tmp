'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SortOption {
  value: string
  label: string
}

interface SearchSortBarProps {
  /** Current search query (controlled) */
  searchValue: string
  /** Callback when search input changes */
  onSearchChange: (value: string) => void
  /** Placeholder for the search input */
  searchPlaceholder: string
  /** Current sort value (must match one of sortOptions[].value) */
  sortValue: string
  /** Callback when sort selection changes */
  onSortChange: (value: string) => void
  /** Available sort options */
  sortOptions: SortOption[]
  /** Label for the sort dropdown (e.g. "Sort by") */
  sortLabel?: string
  /** Optional class for the container */
  className?: string
  /** Whether layout is RTL (e.g. for Arabic) */
  isRTL?: boolean
}

/**
 * Reusable search + sort bar. Use with any list; parent is responsible for
 * filtering/sorting items based on searchValue and sortValue.
 */
export function SearchSortBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  sortValue,
  onSortChange,
  sortOptions,
  sortLabel,
  className,
  isRTL,
}: SearchSortBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-4 sm:items-center sm:gap-4',
        isRTL && 'sm:flex-row-reverse',
        className,
      )}
    >
      <div className="relative flex-1 w-full min-w-0">
        <Search
          className={cn(
            'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none',
            isRTL ? 'right-3' : 'left-3',
          )}
        />
        <Input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={cn(
            'w-full pl-9 pr-4 h-10',
            isRTL && 'pl-4 pr-9',
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-label={searchPlaceholder}
        />
      </div>
      <div className={cn('flex items-center gap-2 shrink-0', isRTL && 'flex-row-reverse')}>
        {sortLabel && (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {sortLabel}
          </span>
        )}
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
