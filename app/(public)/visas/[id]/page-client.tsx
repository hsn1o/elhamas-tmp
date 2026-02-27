"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Check,
  FileCheck,
  Clock,
  Banknote,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, getLocalizedContent } from "@/lib/i18n";
import type { Visa } from "@/lib/db";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { InquiryFormSection } from "@/components/sections/inquiry-form";

interface VisaDetailClientProps {
  item: Visa;
}

export function VisaDetailClient({ item }: VisaDetailClientProps) {
  const { t, locale } = useI18n();

  const imageUrl = item.images?.[0] ?? "/images/package-default.jpg";

  const name = getLocalizedContent(
    item as unknown as Record<string, unknown>,
    "name",
    locale,
  );
  const description = getLocalizedContent(
    item as unknown as Record<string, unknown>,
    "description",
    locale,
  );
  const visaType =
    locale === "ar"
      ? item.visa_type_ar || item.visa_type_en
      : item.visa_type_en || item.visa_type_ar;
  const processingTime =
    locale === "ar"
      ? item.processing_time_ar || item.processing_time_en
      : item.processing_time_en || item.processing_time_ar;
  const validity =
    locale === "ar"
      ? item.validity_ar || item.validity_en
      : item.validity_en || item.validity_ar;
  const requirements =
    locale === "ar"
      ? item.requirements_ar?.length
        ? item.requirements_ar
        : item.requirements
      : item.requirements?.length
        ? item.requirements
        : item.requirements_ar;
  const includes =
    locale === "ar"
      ? item.includes_ar?.length
        ? item.includes_ar
        : item.includes
      : item.includes?.length
        ? item.includes
        : item.includes_ar;
  const excludes =
    locale === "ar"
      ? item.excludes_ar?.length
        ? item.excludes_ar
        : item.excludes
      : item.excludes?.length
        ? item.excludes
        : item.excludes_ar;
  const eligibility =
    locale === "ar"
      ? item.eligibility_ar || item.eligibility_en
      : item.eligibility_en || item.eligibility_ar;
  const notes =
    locale === "ar"
      ? item.notes_ar || item.notes_en
      : item.notes_en || item.notes_ar;

  const sectionCard = "rounded-xl border border-border bg-card p-6 md:p-8";
  const priceNum = item.price != null ? Number(item.price) : null;

  return (
    <>
      <section className="relative min-h-[320px] md:min-h-[380px] flex flex-col justify-center overflow-hidden pt-24">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/75 to-primary/90"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            {name}
          </h1>
        </div>
      </section>

      <div className="relative z-20 -mt-6 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div
            className={cn(
              "rounded-2xl bg-white border border-border shadow-lg px-6 py-4",
              "flex flex-wrap items-center justify-center md:justify-between gap-6 md:gap-8 text-sm",
              locale === "ar" && "md:flex-row-reverse",
            )}
          >
            {visaType && (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <FileCheck className="w-4 h-4 text-primary shrink-0" />
                {visaType}
              </span>
            )}
            {processingTime && (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                {processingTime}
              </span>
            )}
            {priceNum != null && (
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Banknote className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground">
                  {t("common.startingFrom")}
                </span>
                <span className="font-bold text-primary">
                  {item.currency} {priceNum.toLocaleString()}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/visas"
            className={cn(
              "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors",
              locale === "ar" && "flex-row-reverse",
            )}
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 shrink-0",
                locale === "ar" && "rotate-180",
              )}
            />
            {t("visa.backToVisas")}
          </Link>

          <div className="space-y-8">
            <div className={cn(sectionCard, "overflow-hidden p-0")}>
              <div className="relative w-full aspect-[21/10] min-h-[200px] bg-muted">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-xl font-semibold text-primary mb-4">
                {t("visa.overview")}
              </h2>
              {description && (
                <div
                  className="text-muted-foreground space-y-4 mb-6"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl font-semibold text-foreground mt-6 mb-2 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-foreground mt-5 mb-2">
                          {children}
                        </h2>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 leading-relaxed">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="marker:text-primary">{children}</li>
                      ),
                    }}
                  >
                    {description}
                  </ReactMarkdown>
                </div>
              )}
              {validity && (
                <p className="flex items-center gap-2 text-foreground mb-2">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">
                    {t("visa.validity")}:
                  </span>
                  <span className="font-medium">{validity}</span>
                </p>
              )}
              {priceNum != null && (
                <p className="text-foreground">
                  <span className="text-muted-foreground">
                    {t("common.startingFrom")}:{" "}
                  </span>
                  <span className="font-semibold text-primary">
                    {item.currency} {priceNum.toLocaleString()}
                  </span>
                </p>
              )}
            </div>

            {requirements?.length ? (
              <div className={sectionCard}>
                <h2 className="text-xl font-semibold text-primary mb-4">
                  {t("visa.requiredDocuments")}
                </h2>
                <ul className="space-y-2" dir={locale === "ar" ? "rtl" : "ltr"}>
                  {requirements.map((text, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div
              className={cn(
                sectionCard,
                "grid grid-cols-1 md:grid-cols-2 gap-8",
              )}
            >
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">
                  {t("visa.whatIncluded")}
                </h2>
                {includes?.length ? (
                  <ul
                    className="space-y-2"
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    {includes.map((text, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">
                  {t("visa.whatExcluded")}
                </h2>
                {excludes?.length ? (
                  <ul
                    className="space-y-2"
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    {excludes.map((text, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          —
                        </span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
            </div>

            {(eligibility || notes) && (
              <div className={sectionCard}>
                {eligibility && (
                  <p className="mb-4">
                    <span className="text-muted-foreground font-medium">
                      {t("visa.eligibility")}:{" "}
                    </span>
                    <span className="text-foreground">{eligibility}</span>
                  </p>
                )}
                {notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t("visa.notes")}
                    </h3>
                    <p
                      className="text-sm text-muted-foreground whitespace-pre-wrap"
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      {notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            <InquiryFormSection
              contextType="visa"
              referenceId={item.id}
              referenceName={name}
              referenceSummary={
                visaType ||
                (priceNum != null
                  ? `${item.currency} ${priceNum.toLocaleString()}`
                  : undefined)
              }
              meta={{
                visaType,
                price: priceNum != null ? priceNum : undefined,
                currency: item.currency,
                validity,
                processingTime,
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
