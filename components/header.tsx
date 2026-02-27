"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const navLinks = [
  { href: "/", key: "nav.home" },
  { href: "/services", key: "nav.services" },
  { href: "/packages", key: "nav.packages" },
  { href: "/hotels", key: "nav.hotels" },
  { href: "/transportation", key: "nav.transportation" },
  { href: "/visas", key: "nav.visas" },
  { href: "/blog", key: "nav.blog" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { t, locale, setLocale, isRTL } = useI18n()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  return (
    <>
      {/* ---- Top Info Bar ---- */}
      <div
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
          isScrolled ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <div className="border-b border-primary-foreground/10 bg-foreground/30 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6">
            {/* Contact details */}
            <div className="flex items-center gap-6">
              <a
                href="https://wa.me/966566610996"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                <span dir="ltr">+966566610996</span>
              </a>
              <a
                href="mailto:support@elhamas.com"
                className="hidden items-center gap-2 text-xs text-primary-foreground/80 transition-colors hover:text-primary-foreground md:flex"
              >
                <Mail className="h-3.5 w-3.5" />
                <span dir="ltr">support@elhamas.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Main Navbar ---- */}
      <nav
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "top-0 bg-background/90 shadow-lg shadow-foreground/5 backdrop-blur-xl"
            : "top-[32px] bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4  lg:px-6">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image src="/Logo_ilham.png" alt="Elham Nasser Abu Sarahd Company" width={80} height={80} className="h-23 w-24 object-contain lg:h-24 lg:w-24" />
          </Link>

          {/* Desktop Links - center */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3.5 py-2 text-[13px] font-medium tracking-wide transition-all duration-300",
                  isScrolled
                    ? "text-primary hover:bg-muted"
                    : "text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Language switcher (always LTR so EN | ع order is clear) */}
          <div
            dir="ltr"
            className={cn(
              "hidden items-center gap-0.5 rounded-lg border lg:flex",
              isScrolled
                ? "border-border bg-muted/50"
                : "border-primary-foreground/30 bg-primary-foreground/10"
            )}
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={cn(
                "rounded-l-md px-3 py-1.5 text-xs font-medium transition-colors",
                locale === "en"
                  ? isScrolled
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary-foreground/25 text-primary-foreground"
                  : isScrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
              )}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("ar")}
              className={cn(
                "rounded-r-md px-3 py-1.5 text-xs font-medium transition-colors",
                locale === "ar"
                  ? isScrolled
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary-foreground/25 text-primary-foreground"
                  : isScrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
              )}
            >
              ع
            </button>
          </div>

          {/* CTA Button */}
          <Link
            href="/packages"
            className={cn(
              "hidden rounded-lg px-6 py-2.5 text-[13px] font-semibold transition-all duration-300 lg:inline-flex",
              isScrolled
                ? "bg-primary text-primary-foreground hover:bg-primary/85"
                : "bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/30 backdrop-blur-sm hover:bg-primary-foreground/25"
            )}
          >
            {t("nav.bookTrip")}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden",
              isScrolled
                ? "text-foreground hover:bg-muted"
                : "text-primary-foreground hover:bg-primary-foreground/10"
            )}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ---- Mobile Menu ---- */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-80 animate-slide-in-right flex-col bg-background shadow-2xl">
            {/* Close area */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              {/* <span className="font-serif text-lg font-bold text-primary">Elham Nasser Abu Sarahd Company</span> */}
              {/* <button
                onClick={() => setIsMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button> */}
              <div className="h-12"/>
            </div>

            {/* Links */}
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>

            {/* Language switcher (mobile) */}
            <div className="flex items-center gap-2 border-t border-border px-4 py-3">
              <span className="text-xs text-muted-foreground">
                {locale === "ar" ? "اللغة" : "Language"}
              </span>
              <div dir="ltr" className="flex rounded-lg border border-border bg-muted/50 p-0.5">
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium",
                    locale === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLocale("ar")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium",
                    locale === "ar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="border-t border-border px-6 py-5">
              {/* Contact info */}
              <div className="mb-4 flex flex-col gap-2">
                <a
                  href="https://wa.me/966566610996"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                  <span dir="ltr">+966 56 661 0996</span>
                </a>
                <a
                  href="mailto:support@elhamas.com"
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Mail className="h-3.5 w-3.5" />
                  support@elhamas.com
                </a>
              </div>
              <Link
                href="/packages"
                onClick={() => setIsMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                {t("nav.bookTrip")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
