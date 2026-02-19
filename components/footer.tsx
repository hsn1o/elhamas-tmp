'use client';

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Twitter, Instagram, Youtube } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const quickLinkKeys: { href: string; key: string }[] = [
  { href: "/", key: "nav.home" },
  { href: "/packages", key: "nav.packages" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
]

const serviceLinkKeys: { href: string; key: string }[] = [
  { href: "/packages", key: "footer.hajjPackages" },
  { href: "/packages", key: "footer.umrahPackages" },
  { href: "/packages", key: "nav.hotels" },
  { href: "/packages", key: "nav.transportation" },
]

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
                <Image src="/Logo_ilham.png" alt="EA for Umrah Services" width={80} height={80} className="h-20 w-32 object-contain" />
              {/* <div>
                <span className="font-serif text-lg font-bold">Elham Nasser Abu Sarahd Company</span>
                <p className="text-[10px] tracking-[0.2em] uppercase text-primary-foreground/50">Hajj & Umrah Services</p>
              </div> */}
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-primary-foreground/60">
              {t("footer.description")}
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> <span dir="ltr">+966566610996</span></p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@ilhamas.com</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Makkah, Saudi Arabia</p>
            </div>
            {/* Social Media */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/Elhamas_Group?s=20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground/60 transition-all hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/elhamas_group?igsh=MXFndGVsbWYxb2Fvbg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground/60 transition-all hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com/@elhamas_group?si=Vju0jtlWRfHNdXoA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground/60 transition-all hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {quickLinkKeys.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-primary-foreground/50 transition-colors hover:text-primary-foreground">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">{t("footer.services")}</h3>
            <ul className="space-y-2">
              {serviceLinkKeys.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-primary-foreground/50 transition-colors hover:text-primary-foreground">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">Newsletter</h3>
            <p className="mb-4 text-sm text-primary-foreground/50">Subscribe to receive updates on our latest packages and promotions.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Subscribe
              </button>
            </form>
          </div> */}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 py-6 sm:flex-row">
          <p className="text-xs text-primary-foreground/40">
            &copy; {new Date().getFullYear()} {t("footer.companyName")}. {t("footer.rights")}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-primary-foreground/40 transition-colors hover:text-primary-foreground/60">{t("footer.privacyPolicy")}</Link>
            <Link href="#" className="text-xs text-primary-foreground/40 transition-colors hover:text-primary-foreground/60">{t("footer.termsOfService")}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
