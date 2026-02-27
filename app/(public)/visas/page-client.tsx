'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Clock, FileCheck } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { SearchSortBar } from '@/components/search-sort-bar'
import { useI18n, getLocalizedContent } from '@/lib/i18n'
import type { Visa } from '@/lib/db'
import { cn } from '@/lib/utils'

const VISA_SORT_DEFAULT = 'priceAsc'

interface VisasPageClientProps {
  items: Visa[]
}

export function VisasPageClient({ items }: VisasPageClientProps) {
  const { t, locale } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState(VISA_SORT_DEFAULT)

  const displayedItems = useMemo(() => {
    let list = items
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter((item) => {
        const nameEn = item.name_en ?? ''
        const nameAr = item.name_ar ?? ''
        const descEn = item.description_en ?? ''
        const descAr = item.description_ar ?? ''
        const typeEn = item.visa_type_en ?? ''
        const typeAr = item.visa_type_ar ?? ''
        const procEn = item.processing_time_en ?? ''
        const procAr = item.processing_time_ar ?? ''
        const validEn = item.validity_en ?? ''
        const validAr = item.validity_ar ?? ''
        const price = (item.price ?? '').toString()
        const eligibilityEn = item.eligibility_en ?? ''
        const eligibilityAr = item.eligibility_ar ?? ''
        const notesEn = item.notes_en ?? ''
        const notesAr = item.notes_ar ?? ''
        const requirements = [...(item.requirements ?? []), ...(item.requirements_ar ?? [])].join(' ')
        const includes = [...(item.includes ?? []), ...(item.includes_ar ?? [])].join(' ')
        const excludes = [...(item.excludes ?? []), ...(item.excludes_ar ?? [])].join(' ')
        const searchable = [
          nameEn, nameAr, descEn, descAr, typeEn, typeAr, procEn, procAr,
          validEn, validAr, price, eligibilityEn, eligibilityAr, notesEn, notesAr,
          requirements, includes, excludes,
        ]
          .join(' ')
          .toLowerCase()
        return searchable.includes(q)
      })
    }
    const sorted = [...list]
    if (sortBy === 'priceAsc')
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    else if (sortBy === 'priceDesc')
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    else if (sortBy === 'nameAsc')
      sorted.sort((a, b) =>
        (locale === 'ar' ? a.name_ar : a.name_en).localeCompare(locale === 'ar' ? b.name_ar : b.name_en)
      )
    else if (sortBy === 'nameDesc')
      sorted.sort((a, b) =>
        (locale === 'ar' ? b.name_ar : b.name_en).localeCompare(locale === 'ar' ? a.name_ar : a.name_en)
      )
    return sorted
  }, [items, searchQuery, sortBy, locale])

  const visaType = (item: Visa) =>
    locale === 'ar' ? (item.visa_type_ar || item.visa_type_en) : (item.visa_type_en || item.visa_type_ar)
  const processing = (item: Visa) =>
    locale === 'ar' ? (item.processing_time_ar || item.processing_time_en) : (item.processing_time_en || item.processing_time_ar)

  return (
    <>
      <PageHeader
        title={t('visa.title')}
        subtitle={t('visa.subtitle')}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <SearchSortBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={t('visa.searchPlaceholder')}
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortLabel={t('list.sortBy')}
            sortOptions={[
              { value: 'priceAsc', label: t('list.sort.priceAsc') },
              { value: 'priceDesc', label: t('list.sort.priceDesc') },
              { value: 'nameAsc', label: t('list.sort.nameAsc') },
              { value: 'nameDesc', label: t('list.sort.nameDesc') },
            ]}
            isRTL={locale === 'ar'}
            className="mb-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item, index) => {
              const name = getLocalizedContent(
                item as unknown as Record<string, unknown>,
                'name',
                locale,
              )
              const priceStr =
                item.price != null
                  ? `${item.currency} ${Number(item.price).toLocaleString()}`
                  : null

              return (
                <article
                  key={item.id}
                  className={cn(
                    'group flex flex-col h-full rounded-2xl bg-card border border-border overflow-hidden',
                    'hover:border-primary/30 hover:shadow-xl transition-all duration-300',
                    'animate-fade-in-up',
                  )}
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <Link href={`/visas/${item.id}`} className="flex flex-col h-full">
                    <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-muted">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: item.images?.[0]
                            ? `url(${item.images[0]})`
                            : 'linear-gradient(135deg, #751f27 0%, #4a1c20 100%)',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                    <div className="flex-1 flex flex-col p-6 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {name}
                      </h3>
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                        <FileCheck className="w-4 h-4 shrink-0 text-primary" />
                        <span>{visaType(item)}</span>
                      </p>
                      {processing(item) && (
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                          <Clock className="w-4 h-4 shrink-0 text-primary" />
                          <span>{processing(item)}</span>
                        </p>
                      )}
                      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                        {priceStr && (
                          <div className="min-w-0">
                            <span className="text-xl font-bold text-primary">
                              {priceStr}
                            </span>
                          </div>
                        )}
                        <span
                          className={cn(
                            'shrink-0 px-4 py-2 rounded-md text-sm font-medium',
                            'bg-primary text-primary-foreground',
                            'group-hover:bg-primary/90 transition-colors',
                          )}
                        >
                          {t('visa.viewDetails')}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>

          {displayedItems.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">
                {locale === 'ar' ? 'لا توجد تأشيرات تطابق البحث' : 'No visas match your search.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
