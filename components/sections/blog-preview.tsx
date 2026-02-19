'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { BlogPost } from '@/lib/db'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

const BLOG_ACCENT = '#4a1c20'

const defaultPosts: {
  slug: string
  titleEn: string
  titleAr: string
  excerptEn: string
  excerptAr: string
  image: string
  categoryEn: string
  categoryAr: string
  date: string
  tagColor: string
}[] = [
  {
    slug: 'jeddah-attractions',
    titleEn: 'Tourist Attractions in Jeddah',
    titleAr: 'المعالم السياحية في مدينة جدة',
    excerptEn: 'Discover the best places to visit in Jeddah, from the historic Al-Balad to the Red Sea coast and modern landmarks.',
    excerptAr: 'اكتشف أفضل الأماكن للزيارة في جدة، من البلاد التاريخي إلى ساحل البحر الأحمر والمعالم الحديثة.',
    image: '/images/jeddah-city.jpg',
    categoryEn: 'Jeddah',
    categoryAr: 'جدة',
    date: '2023-12-27',
    tagColor: 'bg-emerald-500',
  },
  {
    slug: 'riyadh-guide',
    titleEn: 'A Guide to Exploring Riyadh',
    titleAr: 'دليل استكشاف الرياض',
    excerptEn: 'From historic Diriyah to the modern skyline, explore the capital\'s blend of tradition and innovation.',
    excerptAr: 'من الدرعية التاريخية إلى الأفق الحديث، استكشف مزيج العاصمة من التقاليد والابتكار.',
    image: '/images/riyadh.jpg',
    categoryEn: 'Riyadh',
    categoryAr: 'الرياض',
    date: '2023-12-20',
    tagColor: 'bg-sky-500',
  },
  {
    slug: 'alula-experience',
    titleEn: 'Experiencing AlUla',
    titleAr: 'تجربة العلا',
    excerptEn: 'Ancient tombs, dramatic landscapes, and cultural events in one of the world\'s most remarkable destinations.',
    excerptAr: 'مقابر قديمة ومناظر طبيعية درامية وفعاليات ثقافية في واحدة من أبرز الوجهات في العالم.',
    image: '/images/Alula.jpg',
    categoryEn: 'AlUla',
    categoryAr: 'العلا',
    date: '2023-12-15',
    tagColor: 'bg-teal-500',
  },
]

function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr)
  if (locale === 'ar') {
    return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface BlogPreviewSectionProps {
  posts?: BlogPost[]
}

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  const { t, locale, isRTL } = useI18n()
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>(0.08)

  const tagColors = ['bg-emerald-500', 'bg-sky-500', 'bg-teal-500']
  const items = (posts && posts.length > 0)
    ? posts.slice(0, 3).map((p, i) => ({
        slug: p.slug,
        title: locale === 'ar' ? (p.title_ar || p.title_en) : (p.title_en || p.title_ar),
        excerpt: locale === 'ar' ? (p.excerpt_ar || p.excerpt_en || '') : (p.excerpt_en || p.excerpt_ar || ''),
        image: p.featured_image || 'https://images.unsplash.com/photo-1540331547164-8b63109225b7?w=600&q=80',
        category: p.category || (locale === 'ar' ? 'مقالات' : 'Articles'),
        date: p.published_at ? formatDate(p.published_at.toString(), locale) : '',
        tagColor: tagColors[i % tagColors.length],
      }))
    : defaultPosts.map((p) => ({
        slug: p.slug,
        title: locale === 'ar' ? p.titleAr : p.titleEn,
        excerpt: locale === 'ar' ? p.excerptAr : p.excerptEn,
        image: p.image,
        category: locale === 'ar' ? p.categoryAr : p.categoryEn,
        date: formatDate(p.date, locale),
        tagColor: p.tagColor,
      }))

  return (
    <section ref={sectionRef} id="blog" className="py-16 sm:py-20 bg-white scroll-mt-[4.5rem]">
      <div className="container mx-auto px-4">
        {/* Split header */}
        <div className="flex flex-col-reverse lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <motion.div
            className={cn(
              'flex flex-col gap-4 lg:max-w-xl',
              isRTL ? 'lg:order-2 lg:items-end lg:text-right' : 'lg:order-1 lg:items-start lg:text-left'
            )}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {t('blog.subtitle')}
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className={cn(
                  'inline-flex items-center gap-2 rounded-l-full text-white text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity shrink-0',
                  isRTL && 'rounded-l-none rounded-r-full flex-row-reverse'
                )}
                style={{ backgroundColor: BLOG_ACCENT }}
              >
                {isRTL ? (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    {t('blog.allArticles')}
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    {t('blog.allArticles')}
                  </>
                )}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className={cn(
              'flex flex-col items-start lg:max-w-md',
              isRTL ? 'lg:order-1 lg:items-start lg:text-left' : 'lg:order-2 lg:items-end lg:text-right'
            )}
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08, ease: easeOutExpo }}
          >
            <span
              className={cn(
                'inline-block px-4 py-1.5 text-white text-sm font-medium mb-3',
                isRTL ? 'rounded-r-full' : 'rounded-l-full'
              )}
              style={{ backgroundColor: BLOG_ACCENT }}
            >
              {t('blog.tag')}
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
              style={{ color: BLOG_ACCENT }}
            >
              {t('blog.magazineTitle')}
            </h2>
          </motion.div>
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((post, index) => (
            <motion.article
              key={post.slug}
              className="group rounded-xl overflow-hidden bg-white shadow-md flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.08,
                ease: easeOutExpo,
              }}
              whileHover={{ y: -4 }}
            >
              <Link href="/" className="relative block aspect-[4/3] overflow-hidden">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <span
                  className={cn(
                    'absolute top-3 right-3 text-white text-xs font-medium px-3 py-1 rounded-md',
                    post.tagColor
                  )}
                >
                  {post.category}
                </span>
              </Link>
              <div
                className="flex flex-col flex-1 p-5 text-white transition-shadow duration-300 group-hover:shadow-lg"
                style={{ backgroundColor: BLOG_ACCENT }}
              >
                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:underline">
                  <Link href="/">{post.title}</Link>
                </h3>
                <p className="text-sm text-white/90 line-clamp-4 mb-4 flex-1">
                  {post.excerpt}
                </p>
                <Link
                  href="/"
                  className="text-sm font-medium text-white/95 hover:text-white inline-flex items-center gap-1 mb-3 transition-colors"
                >
                  {t('common.readMore')}
                  {isRTL ? ' «' : ' »'}
                </Link>
                {post.date && (
                  <p className="text-xs text-white/80 mt-auto">
                    {post.date}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
