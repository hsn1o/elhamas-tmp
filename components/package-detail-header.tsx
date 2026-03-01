'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PackageDetailHeaderProps {
  title: string
  subtitle?: string
  backgroundImage: string
  className?: string
}

export function PackageDetailHeader({
  title,
  subtitle,
  backgroundImage,
  className,
}: PackageDetailHeaderProps) {
  return (
    <section
      className={cn(
        'relative min-h-[260px] sm:min-h-[300px] md:min-h-[360px] lg:min-h-[400px] flex items-center justify-center overflow-hidden pt-10 sm:pt-12',
        className
      )}
    >
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Red overlay - inspired by page-header */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/90"
        aria-hidden
      />
      {/* Same pattern as page-header */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      {/* Centered content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 text-center max-w-4xl min-w-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg break-words">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow break-words">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
