'use client'

import { PageHeader } from '@/components/page-header'
import { useI18n } from '@/lib/i18n'
import { ContactFormSection } from '@/components/sections/contact-form'
import { FAQAccordion } from '@/components/sections/faq-accordion'

const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d4571.517193656341!2d39.799724475266125!3d21.379477080359095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDIyJzQ2LjEiTiAzOcKwNDgnMDguMyJF!5e1!3m2!1sen!2s!4v1772175306845!5m2!1sen!2s'

export default function ContactPageClient() {
  const { t } = useI18n()

  return (
    <>
      <PageHeader
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
      />
      <ContactFormSection />
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] border border-border/60">
              <iframe
                src={MAP_EMBED_URL}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location map"
                className="w-full block"
              />
            </div>
          </div>
        </div>
      </section>
      <FAQAccordion />
    </>
  )
}
