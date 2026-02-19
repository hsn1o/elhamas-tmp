"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const destinations = [
  { name: "Makkah, Saudi Arabia", image: "/images/dest-makkah.jpg" },
  { name: "Madinah, Saudi Arabia", image: "/images/dest-madinah.jpg" },
  { name: "Jeddah, Saudi Arabia", image: "/images/dest-jeddah.jpg" },
  { name: "Taif, Saudi Arabia", image: "/images/dest-taif.jpg" },
  { name: "AlUla, Saudi Arabia", image: "/images/dest-alula.jpg" },
]

export function DestinationsSections() {
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>(0.1)

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-[#3a1518] via-[#4a1c20] to-[#5a2228] py-16 md:py-24"
      id="destinations"
    >
      
      {/* Soft top fade to blend with hero */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-[#3a1518]" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header row */}
        <div
          className={`mb-10 flex items-end justify-between transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
            Top Vacation Destinations
          </h2>
          <Link
            href="/packages"
            className="group hidden items-center gap-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Horizontal scroll row */}
      <div
        className={`transition-all duration-700 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
      >
        <div className="flex gap-5 overflow-x-auto px-6 pb-4 scrollbar-hide lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {destinations.map((dest, i) => (
            <Link
              key={dest.name}
              href="/packages"
              className="group relative flex-shrink-0 overflow-hidden rounded-2xl"
              style={{
                transitionDelay: isVisible ? `${300 + i * 100}ms` : "0ms",
              }}
            >
              <div className="relative h-56 w-64 sm:h-64 sm:w-72 md:h-72 md:w-80">
                <Image
                  src={dest.image || "/placeholder.svg"}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-primary-foreground md:text-xl">
                    {dest.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile "View All" link */}
      <div className="mt-6 px-6 sm:hidden">
        <Link
          href="/packages"
          className="group flex items-center gap-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
        >
          View All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
