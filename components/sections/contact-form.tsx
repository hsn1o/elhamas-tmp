"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const ACCENT = "#4a1c20";
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const contactInfo = [
  {
    key: "contact.info.address" as const,
    valueEn: "Mekkah, Saudi Arabia",
    valueAr: "مكه، المملكة العربية السعودية",
    icon: MapPin,
  },
  {
    key: "contact.info.phone" as const,
    valueEn: "+966 56 661 0996",
    valueAr: "+966 56 661 0996",
    icon: Phone,
  },
  {
    key: "contact.info.email" as const,
    valueEn: "support@elhamas.com",
    valueAr: "support@elhamas.com",
    icon: Mail,
  },
  {
    key: "contact.info.hours" as const,
    valueEn: "Sun–Thu 9AM–6PM",
    valueAr: "الأحد–الخميس ٩ص–٦م",
    icon: Clock,
  },
];

export function ContactFormSection() {
  const { t, locale, isRTL } = useI18n();
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>(0.08);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder: replace with your API or form action
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-10 sm:py-14 md:py-16 lg:py-20 bg-white scroll-mt-[4.5rem] overflow-x-hidden"
    >
      <div className="container mx-auto px-3 sm:px-4 min-w-0">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold mb-2 break-words"
              style={{ color: ACCENT }}
            >
              {t("contact.title")}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto break-words px-2">
              {t("contact.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            {/* Form */}
            <motion.div
              className="lg:col-span-2 min-w-0"
              initial={{ opacity: 0, x: -16 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08, ease: easeOutExpo }}
            >
              <form
                onSubmit={handleSubmit}
                className={cn(
                  "rounded-xl sm:rounded-2xl border border-border/60 bg-muted/30 p-4 sm:p-6 md:p-8 transition-shadow duration-300 hover:shadow-md focus-within:shadow-md",
                  isRTL && "text-right",
                )}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-foreground">
                      {t("contact.form.name")}
                    </Label>
                    <Input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder={t("contact.form.name")}
                      className="bg-background transition-[box-shadow] duration-200"
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-foreground">
                      {t("contact.form.email")}
                    </Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder={t("contact.form.email")}
                      className="bg-background transition-[box-shadow] duration-200"
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone" className="text-foreground">
                      {t("contact.form.phone")}
                    </Label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder={t("contact.form.phone")}
                      className="bg-background transition-[box-shadow] duration-200"
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-subject"
                      className="text-foreground"
                    >
                      {t("contact.form.subject")}
                    </Label>
                    <Input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      placeholder={t("contact.form.subject")}
                      className="bg-background transition-[box-shadow] duration-200"
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-4 sm:mb-6">
                  <Label htmlFor="contact-message" className="text-foreground">
                    {t("contact.form.message")}
                  </Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder={t("contact.form.message")}
                    className="bg-background resize-none transition-[box-shadow] duration-200"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                {submitted && (
                  <motion.p
                    className="text-sm font-medium mb-4 rounded-lg py-2 px-3 bg-green-500/10 text-green-700 dark:text-green-400"
                    style={isRTL ? { textAlign: "right" } : undefined}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: easeOutExpo }}
                  >
                    {t("contact.form.success")}
                  </motion.p>
                )}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg font-medium text-white hover:opacity-90 w-full sm:w-auto min-w-0 sm:min-w-[160px] transition-opacity duration-200"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {loading
                      ? locale === "ar"
                        ? "جاري الإرسال..."
                        : "Sending..."
                      : t("contact.form.submit")}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Contact info */}
            <motion.div
              className="space-y-4 sm:space-y-6 min-w-0"
              initial={{ opacity: 0, x: 16 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12, ease: easeOutExpo }}
            >
              <h3 className="text-base sm:text-lg font-semibold break-words" style={{ color: ACCENT }}>
                {t("footer.contact")}
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {contactInfo.map(
                  ({ key, valueEn, valueAr, icon: Icon }, index) => (
                    <motion.li
                      key={key}
                      className={cn(
                        "flex gap-2 sm:gap-3 items-start min-w-0",
                        isRTL && "flex-row-reverse text-right",
                      )}
                      initial={{ opacity: 0, x: isRTL ? -12 : 12 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: 0.18 + index * 0.06,
                        ease: easeOutExpo,
                      }}
                    >
                      <span
                        className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white transition-transform duration-200 hover:scale-105"
                        style={{ backgroundColor: ACCENT }}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </span>
                      <div className="min-w-0 overflow-hidden">
                        <p className="text-xs font-medium text-muted-foreground mb-0.5">
                          {t(key)}
                        </p>
                        <p
                          className="text-xs sm:text-sm text-foreground break-words"
                          dir={
                            (key === "contact.info.phone" ||
                              key === "contact.info.email") &&
                            isRTL
                              ? "ltr"
                              : undefined
                          }
                        >
                          {locale === "ar" ? valueAr : valueEn}
                        </p>
                      </div>
                    </motion.li>
                  ),
                )}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
