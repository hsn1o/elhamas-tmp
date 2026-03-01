'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const FAQ_ITEMS = [
  { questionKey: 'faq.1.question' as const, answerKey: 'faq.1.answer' as const },
  { questionKey: 'faq.2.question' as const, answerKey: 'faq.2.answer' as const },
  { questionKey: 'faq.3.question' as const, answerKey: 'faq.3.answer' as const },
  { questionKey: 'faq.4.question' as const, answerKey: 'faq.4.answer' as const },
  { questionKey: 'faq.5.question' as const, answerKey: 'faq.5.answer' as const },
  { questionKey: 'faq.6.question' as const, answerKey: 'faq.6.answer' as const },
]

export function FAQAccordion() {
  const { t, isRTL } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-muted/30 scroll-mt-[4.5rem] overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 min-w-0">
        <div className="max-w-3xl mx-auto">
          <h2
            className={cn(
              'text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-primary break-words',
              isRTL && 'text-right',
            )}
          >
            {t('faq.title')}
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] min-w-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={cn(
                      'w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 transition-colors text-left min-w-0',
                      isOpen && 'bg-primary text-primary-foreground',
                      isRTL && 'flex-row-reverse text-right',
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors',
                        isOpen ? 'bg-white/20' : 'bg-muted',
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 text-muted-foreground',
                          isOpen && 'rotate-180',
                          isOpen && 'text-white',
                        )}
                      />
                    </span>
                    <span className="flex-1 font-medium text-xs sm:text-sm md:text-base break-words min-w-0">
                      {t(item.questionKey)}
                    </span>
                  </button>
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-200 ease-out',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={cn(
                          'px-3 pb-3 sm:px-4 sm:pb-4 md:px-5 md:pb-5 pt-0',
                          isRTL && 'text-right',
                        )}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed break-words">
                          {t(item.answerKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
