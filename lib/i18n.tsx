"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type Locale = "en" | "ar";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.hotels": "Hotels",
    "nav.packages": "Tour Packages",
    "nav.events": "Events",
    "nav.transportation": "Transportation",
    "nav.visas": "Visas",
    "nav.blog": "Our Blog",
    "nav.about": "About Us",
    "nav.contact": "Contact Us",
    "nav.destinations": "Destinations",
    "nav.bookTrip": "Book Your Trip",
    "nav.services": "Services",

    // Hero
    "hero.title": "Your journey to Umrah starts with peace of mind",
    "hero.subtitle":
      "Integrated service worthy of the guests of the Most Merciful.",
    "hero.cta": "Browse Umrah packages",
    "hero.secondary": "Contact WhatsApp",
    "hero.destinations": "Destinations",
    "hero.tours": "Tours",
    "hero.umrahPackage": "Umrah Package",

    // Common
    "common.learnMore": "Learn More",
    "common.viewAll": "View All",
    "common.bookNow": "Book Now",
    "common.startingFrom": "Starting from",
    "common.perNight": "per night",
    "common.days": "days",
    "common.guests": "guests",
    "common.loading": "Loading...",
    "common.readMore": "Read More",

    // Home
    "home.featuredPackages": "Featured Packages",
    "home.featuredPackages.subtitle":
      "Discover our carefully curated pilgrimage experiences",
    "home.featuredPackages.exploreWithUs": "Explore with us",
    "home.featuredPackages.allTrips": "All Trips",
    "common.perPerson": "per person",
    "home.featuredHotels": "Premium Accommodations",
    "home.featuredHotels.subtitle": "Stay in comfort near the holy sites",
    "home.whyChooseUs": "Why Choose Us",
    "home.testimonials": "What Our Pilgrims Say",
    "home.testimonials.subtitle":
      "Hear from those who have experienced our services",

    // Features
    "feature.experience": "Years of Experience",
    "feature.experience.desc":
      "Over 15 years of trusted service in Hajj & Umrah",
    "feature.support": "24/7 Support",
    "feature.support.desc":
      "Round-the-clock assistance throughout your journey",
    "feature.guides": "Expert Guides",
    "feature.guides.desc":
      "Knowledgeable scholars to guide your spiritual journey",
    "feature.quality": "Premium Quality",
    "feature.quality.desc": "Luxury accommodations and VIP transportation",
    "feature.luxuryHotel": "Luxury hotel",
    "feature.luxuryHotel.desc": "Premium stays near the holy sites",
    "feature.vipPlanes": "VIP Planes",
    "feature.vipPlanes.desc": "Comfortable flights for your journey",
    "feature.easyVisa": "Easy Visa",
    "feature.easyVisa.desc": "We handle visa processing for you",
    "feature.roadmapGuide": "Roadmap Guide",
    "feature.roadmapGuide.desc": "Expert guides for every step",
    "feature.avoidHassle": "Avoid Hassle",
    "feature.avoidHassle.desc": "Smooth, worry-free experience",
    "feature.support24": "24/7 Service",
    "feature.support24.desc": "Round-the-clock assistance",

    // Hotels
    "hotels.title": "Premium Hotels",
    "hotels.subtitle": "Comfortable stays near the holy sites",
    "hotels.starRating": "Star Rating",
    "hotels.distanceToHaram": "Distance to Haram",
    "hotels.amenities": "Amenities",
    "hotels.backToPlaces": "Back to places",
    "hotels.hotelsIn": "Hotels in",
    "hotels.searchPlaceholder": "Search by name, description, city, location, rating or price...",
    "hotels.rooms": "Rooms",
    "hotels.pricePerNight": "Price per night",
    "hotels.maxGuests": "Max guests",
    "hotels.whatsIncluded": "What's Included",
    "hotels.accommodation": "Accommodation",
    "hotels.roomOnly": "Room only",
    "hotels.guests": "Guests",
    "hotels.fitsPerson": "Fits {{count}} person",
    "hotels.fitsPersons": "Fits {{count}} persons",
    "hotels.stay": "Stay",
    "hotels.priceDisclaimer":
      "Prices may vary by period and are subject to change. Final price confirmed at booking.",

    // Packages
    "packages.title": "Tour Packages",
    "packages.subtitle": "Complete pilgrimage experiences tailored for you",
    "packages.duration": "Duration",
    "packages.includes": "Package Includes",
    "packages.exclusions": "Exclusions",
    "packages.itinerary": "Itinerary",
    "packages.fullDescription": "Full Description",
    "packages.day": "Day",
    "packages.searchPlaceholder": "Search by name, description, location, type, or duration...",
    "packages.filterAll": "All",
    "packages.hajj": "Hajj",
    "packages.umrah": "Umrah",
    "packages.discoverLocations": "Discover Saudi Arabia",
    "packages.browseCategories": "Browse by category",
    "packages.backToCategories": "Back to categories",
    "packages.selectLocation": "Select a location",
    "packages.packagesIn": "Packages in",
    "packages.form.adults": "Adults",
    "packages.form.children": "Children",
    "packages.form.rooms": "Rooms",
    "packages.form.dateOfTravel": "Date of Travel",
    "packages.form.ticketBooked": "Is the Ticket booked?",
    "list.sortBy": "Sort by",
    "list.sort.priceAsc": "Price (low to high)",
    "list.sort.priceDesc": "Price (high to low)",
    "list.sort.durationAsc": "Duration (shortest first)",
    "list.sort.durationDesc": "Duration (longest first)",
    "list.sort.nameAsc": "Name (A–Z)",
    "list.sort.nameDesc": "Name (Z–A)",
    "list.sort.starDesc": "Rating (highest first)",
    "list.sort.starAsc": "Rating (lowest first)",
    "list.sort.capacityAsc": "Capacity (smallest first)",
    "list.sort.capacityDesc": "Capacity (largest first)",

    // Services (page hero)
    "services.title": "Our Services",
    "services.subtitle": "Comprehensive support for your pilgrimage journey",
    "services.visas.title": "Issuing Visas",
    "services.visas.desc":
      "We handle Umrah and Hajj visa applications and paperwork so you can travel with peace of mind.",
    "services.visas.explanation":
      "From Umrah and Hajj visas to tourist and business visas, we manage the full application process—document preparation, submission, and follow-up—so you can focus on your journey. Our team stays up to date with requirements and processing times to keep your application on track.",
    "services.hotels.title": "Hotel Bookings",
    "services.hotels.desc":
      "Quality accommodation near the Haram. We secure the best rates and locations for your stay.",
    "services.hotels.explanation":
      "We partner with carefully selected hotels close to the holy sites to offer comfortable, well-located accommodation. Whether you prefer proximity to the Haram or a quieter area, we help you find the right option and secure the best available rates for your dates.",
    "services.transportation.title": "Transportation",
    "services.transportation.desc":
      "Comfortable transfers and travel between holy sites throughout your pilgrimage.",
    "services.transportation.explanation":
      "From airport pickups to transfers between Mecca, Medina, and Jeddah, we provide reliable, comfortable vehicles and professional drivers. Choose from sedans for small groups or larger vehicles for families and groups, with transparent pricing and flexible scheduling.",

    // Events
    "events.title": "Upcoming Events",
    "events.subtitle": "Join our special programs and gatherings",
    "events.date": "Date",
    "events.time": "Time",
    "events.location": "Location",
    "events.capacity": "Capacity",
    "events.price": "Price",
    "events.bookNow": "Book Now",
    "events.overview": "Overview",
    "events.eventDate": "Event Date",
    "events.information": "Information",
    "events.fromPrice": "From",
    "events.perPerson": "Per Person",
    "events.audience": "Audience",
    "events.all": "All",
    "events.backToEvents": "Back to Events",
    "events.searchPlaceholder": "Search by title, description, location, frequency or price...",

    // Transportation
    "transport.title": "Transportation Services",
    "transport.subtitle": "Comfortable travel between holy sites",
    "transport.perTrip": "per trip",
    "transport.perDay": "per day",
    "transport.capacity": "Capacity",
    "transport.features": "Features",
    "transport.seats": "Seats",
    "transport.overview": "Overview",
    "transport.offerIncludes": "Offer includes",
    "transport.offerExcludes": "Offer excludes",
    "transport.searchPlaceholder": "Search by name, description, vehicle type, location, capacity or price...",

    // Visas
    "visa.title": "Issuing Visas",
    "visa.subtitle": "Visa services for Umrah, Hajj, and travel",
    "visa.viewDetails": "View details",
    "visa.apply": "Apply now",
    "visa.processingTime": "Processing time",
    "visa.validity": "Validity",
    "visa.requiredDocuments": "Required documents",
    "visa.whatIncluded": "What's included",
    "visa.whatExcluded": "What's excluded",
    "visa.eligibility": "Eligibility",
    "visa.notes": "Notes & conditions",
    "visa.overview": "Overview",
    "visa.backToVisas": "Back to Visas",
    "visa.searchPlaceholder": "Search by name, description, visa type, processing time, validity or price...",

    // Blog
    "blog.title": "Our Blog",
    "blog.magazineTitle": "The Travel Magazine",
    "blog.tag": "Information & Tips",
    "blog.subtitle":
      "Diverse articles about travel, information and tips on unique destinations, activities, and places for travelers.",
    "blog.allArticles": "All Articles",
    "blog.articles": "Articles",
    "blog.events": "Events",
    "blog.place": "Place",
    "blog.date": "Date",
    "blog.readTime": "min read",
    "blog.category": "Category",

    // About
    "about.title": "About Us",
    "about.subtitle": "Your trusted partner for sacred journeys",
    "about.badge": "Who we are",
    "about.companyName": "Elham Nasser Abu Sarahd Company",
    "about.intro1":
      "Elham Nasser Abu Sarahd Company is a company specialized in organizing Umrah programs and related tourism services.",
    "about.intro2":
      "We work to provide an integrated experience that places the comfort and peace of mind of the pilgrim at the forefront of our priorities.",
    "about.intro3":
      "We believe that the journey of Umrah is a unique spiritual experience, and therefore we take care of the finest details, from planning and organization to execution and continuous follow-up, to ensure a journey of ease and tranquility.",
    "about.intro4":
      "We offer integrated services including visa issuance, hotel reservations, flights, transportation, tourism, and catering, with carefully studied offers that meet various needs.",
    "about.intro5":
      "We seek to build relationships based on trust and professionalism, and we are proud to serve the guests of the Most Merciful and provide an experience worthy of the sanctity of the journey.",
    "about.vision": "Vision",
    "about.vision.text":
      "To be among the leading entities in organizing Umrah and related tourism services, by building long-term trust and providing a quality standard worthy of the guests of the Most Merciful.",
    "about.objective": "Objective",
    "about.objective.text":
      "To provide organized and trusted Umrah programs that focus on the comfort of the pilgrim and ease of procedures, with guaranteed quality of accommodation, transport, and related services.",
    "about.message": "Message",
    "about.message.text":
      "We are committed to providing an integrated Umrah experience that respects the sanctity of the journey, through professional service, continuous follow-up, and well-considered details that enhance peace of mind and ease.",
    "about.learnMore": "Learn More About Us",
    "about.stats.years": "Years Experience",
    "about.stats.pilgrims": "Pilgrims Served",
    "about.stats.hotels": "Hotel Partners",
    "about.stats.rating": "Rating",
    "about.values": "Our Values",
    "about.value.integrity": "Integrity",
    "about.value.excellence": "Excellence",
    "about.value.compassion": "Compassion",
    "about.value.reliability": "Reliability",

    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "We are here to assist you",
    "contact.form.name": "Your Name",
    "contact.form.email": "Email Address",
    "contact.form.phone": "Phone Number",
    "contact.form.subject": "Subject",
    "contact.form.message": "Your Message",
    "contact.form.submit": "Send Message",
    "contact.form.success": "Thank you! Your message has been sent.",
    "contact.info.address": "Address",
    "contact.info.phone": "Phone",
    "contact.info.email": "Email",
    "contact.info.hours": "Working Hours",

    // Inquiry form (visa, hotel, etc.)
    "inquiry.form.nationality": "Nationality",
    "inquiry.form.countryCode": "Country Code",
    "inquiry.form.phone": "Phone",
    "inquiry.form.destination": "Destination",
    "inquiry.form.dateOfBooking": "Date of Booking",
    "inquiry.form.send": "Send",
    "booking.needVisa": "Do you need a visa?",
    "booking.bookedFlight": "Have you booked a flight?",
    "booking.needTransport": "Do you need transportation services?",
    "booking.yes": "Yes",
    "booking.no": "No",

    // FAQ (Contact page)
    "faq.title": "Frequently Asked Questions",
    "faq.1.question": "How can I book an Umrah package?",
    "faq.1.answer":
      "You can book through our website by choosing a package and filling the form, or contact us via WhatsApp or phone. Our team will guide you through the steps and required documents.",
    "faq.2.question": "What services do you offer?",
    "faq.2.answer":
      "We offer Umrah packages (with flights, accommodation, and transport), Hajj packages, hotel reservations near the Haram, transportation, and visa services. We also provide ongoing support before and during the trip.",
    "faq.3.question": "Do you offer custom or group packages?",
    "faq.3.answer":
      "Yes. We can tailor packages to your dates, budget, and group size. For groups and families we offer special rates and dedicated follow-up.",
    "faq.4.question": "What is included in the Umrah package?",
    "faq.4.answer":
      "Typically: round-trip flights, accommodation in Mecca and Medina, ground transport between cities and to the Haram, visa fees, and support from our team. Details vary by package—check each offer or ask us for a quote.",
    "faq.5.question": "How can I reach you in an emergency during the trip?",
    "faq.5.answer":
      "We provide a 24/7 contact number and WhatsApp for all our guests. Our team is available to assist with any issue during your stay.",
    "faq.6.question": "Do you help with visa procedures?",
    "faq.6.answer":
      "Yes. We handle visa application support and required documentation as part of our packages or as a standalone service. Contact us for your travel dates and we will outline the steps.",

    // Footer
    "footer.description": "Your trusted partner for Hajj and Umrah services.",
    "footer.quickLinks": "Quick Links",
    "footer.services": "Our Services",
    "footer.contact": "Contact Info",
    "footer.newsletter": "Newsletter",
    "footer.newsletter.placeholder": "Enter your email",
    "footer.newsletter.button": "Subscribe",
    "footer.rights": "All rights reserved.",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.companyName": "Elham Nasser Abu Sarahd Company",
    "footer.hajjPackages": "Hajj Packages",
    "footer.umrahPackages": "Umrah Packages",
    "why.competent": "Competent",
    "why.competent.desc":
      "Expert team with years of experience in Hajj & Umrah.",
    "why.affordable": "Affordable Rates",
    "why.affordable.desc": "Transparent pricing with no hidden costs.",
    "why.responsive": "Responsive",
    "why.responsive.desc": "We respond quickly to all your queries and needs.",
    "why.trust": "Trust & Safety",
    "why.trust.desc":
      "Licensed and trusted by thousands of pilgrims worldwide.",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.hotels": "الفنادق",
    "nav.packages": "الباقات",
    "nav.events": "الفعاليات",
    "nav.transportation": "النقل",
    "nav.visas": "التأشيرات",
    "nav.blog": "المجلة السياحية",
    "nav.about": "من نحن",
    "nav.services": "خدماتنا",
    "nav.contact": "تواصل معنا",
    "nav.destinations": "الوجهات",
    "nav.bookTrip": "احجز رحلتك",

    // Hero
    "hero.title": "رحلتك للعمرة تبدأ من الطمأنينة",
    "hero.subtitle": "خدمة متكاملة تليق بضيوف الرحمن",
    "hero.cta": "استعرض الباقات",
    "hero.secondary": "تواصل واتساب",
    "hero.destinations": "الوجهات",
    "hero.tours": "الجولات",
    "hero.umrahPackage": "باقة العمرة",

    // Common
    "common.learnMore": "اعرف المزيد",
    "common.viewAll": "عرض الكل",
    "common.bookNow": "احجز الآن",
    "common.startingFrom": "تبدأ من",
    "common.perNight": "لليلة",
    "common.days": "أيام",
    "common.guests": "ضيوف",
    "common.loading": "جاري التحميل...",
    "common.readMore": "اقرأ المزيد",

    // Home
    "home.featuredPackages": "الباقات",
    "home.featuredPackages.subtitle":
      "اكتشف تجارب الحج والعمرة المختارة بعناية",
    "home.featuredPackages.exploreWithUs": "إستكشف معنا",
    "home.featuredPackages.allTrips": "كل الرحلات",
    "common.perPerson": "للشخص الواحد",
    "home.featuredHotels": "الإقامة الفاخرة",
    "home.featuredHotels.subtitle": "إقامة مريحة بالقرب من الأماكن المقدسة",
    "home.whyChooseUs": "لماذا تختارنا",
    "home.testimonials": "آراء حجاجنا",
    "home.testimonials.subtitle": "استمع لتجارب من سافروا معنا",

    // Features
    "feature.experience": "سنوات من الخبرة",
    "feature.experience.desc":
      "أكثر من 15 عاماً من الخدمة الموثوقة في الحج والعمرة",
    "feature.support": "دعم على مدار الساعة",
    "feature.support.desc": "مساعدة متواصلة طوال رحلتك",
    "feature.guides": "مرشدون متخصصون",
    "feature.guides.desc": "علماء متخصصون لإرشادك في رحلتك الروحانية",
    "feature.quality": "جودة متميزة",
    "feature.quality.desc": "إقامة فاخرة ونقل VIP",
    "feature.luxuryHotel": "حجوزات الفنادق",
    "feature.luxuryHotel.desc": "إقامة متميزة قرب الأماكن المقدسة",
    "feature.vipPlanes": "خدمات النقل",
    "feature.vipPlanes.desc": "رحلات مريحة لرحلتك",
    "feature.easyVisa": "اصدار تأشيرات",
    "feature.easyVisa.desc": "نتولى إجراءات التأشيرة",
    "feature.roadmapGuide": "السياحة والفعاليات",
    "feature.roadmapGuide.desc": "مرشدون خبراء في كل خطوة",
    "feature.avoidHassle": "بدون متاعب",
    "feature.avoidHassle.desc": "تجربة سلسة وآمنة",
    "feature.support24": "خدمة 24/7",
    "feature.support24.desc": "دعم على مدار الساعة",

    // Hotels
    "hotels.title": "الفنادق الفاخرة",
    "hotels.subtitle": "إقامة مريحة بالقرب من الأماكن المقدسة",
    "hotels.starRating": "تصنيف النجوم",
    "hotels.distanceToHaram": "المسافة للحرم",
    "hotels.amenities": "المرافق",
    "hotels.backToPlaces": "العودة للأماكن",
    "hotels.hotelsIn": "الفنادق في",
    "hotels.searchPlaceholder": "البحث بالاسم أو الوصف أو المدينة أو الموقع أو التصنيف أو السعر...",
    "hotels.rooms": "الغرف",
    "hotels.pricePerNight": "السعر لليلة",
    "hotels.maxGuests": "عدد الضيوف",
    "hotels.whatsIncluded": "ما المشمول",
    "hotels.accommodation": "الإقامة",
    "hotels.roomOnly": "غرفة فقط",
    "hotels.guests": "الضيوف",
    "hotels.fitsPerson": "لشخص واحد",
    "hotels.fitsPersons": "لـ {{count}} أشخاص",
    "hotels.stay": "الإقامة",
    "hotels.priceDisclaimer":
      "الأسعار قد تختلف حسب الفترة. السعر النهائي عند الحجز.",

    // Packages
    "packages.title": "باقات السفر",
    "packages.subtitle": "تجارب حج وعمرة متكاملة مصممة لك",
    "packages.duration": "المدة",
    "packages.includes": "تشمل الباقة",
    "packages.exclusions": "لا تشمل",
    "packages.itinerary": "البرنامج",
    "packages.fullDescription": "الوصف الكامل",
    "packages.day": "اليوم",
    "packages.searchPlaceholder": "البحث بالاسم أو الوصف أو الموقع أو النوع أو المدة  ...",
    "packages.filterAll": "الكل",
    "packages.hajj": "حج",
    "packages.umrah": "عمرة",
    "packages.discoverLocations": "اكتشف السعودية",
    "packages.browseCategories": "تصفح حسب الفئة",
    "packages.backToCategories": "العودة للفئات",
    "packages.selectLocation": "اختر الموقع",
    "packages.packagesIn": "الباقات في",
    "packages.form.adults": "البالغون",
    "packages.form.children": "الأطفال",
    "packages.form.rooms": "الغرف",
    "packages.form.dateOfTravel": "تاريخ السفر",
    "packages.form.ticketBooked": "هل تم حجز التذكرة؟",
    "list.sortBy": "ترتيب حسب",
    "list.sort.priceAsc": "السعر (من الأقل للأعلى)",
    "list.sort.priceDesc": "السعر (من الأعلى للأقل)",
    "list.sort.durationAsc": "المدة (الأقصر أولاً)",
    "list.sort.durationDesc": "المدة (الأطول أولاً)",
    "list.sort.nameAsc": "الاسم (أ–ي)",
    "list.sort.nameDesc": "الاسم (ي–أ)",
    "list.sort.starDesc": "التصنيف (الأعلى أولاً)",
    "list.sort.starAsc": "التصنيف (الأقل أولاً)",
    "list.sort.capacityAsc": "السعة (الأصغر أولاً)",
    "list.sort.capacityDesc": "السعة (الأكبر أولاً)",
    "list.sort.dateAsc": "التاريخ (الأقرب أولاً)",
    "list.sort.dateDesc": "التاريخ (الأبعد أولاً)",

    // Services (page hero)
    "services.title": "خدماتنا",
    "services.subtitle": "دعم متكامل لرحلة حجك وعمرتك",
    "services.visas.title": "إصدار التأشيرات",
    "services.visas.desc":
      "نقوم بإجراءات تأشيرة العمرة والحج والمستندات نيابة عنك لسفر مريح.",
    "services.visas.explanation":
      "من تأشيرات العمرة والحج إلى التأشيرات السياحية والتجارية، نتابع عملية التقديم بالكامل—إعداد المستندات والتقديم والمتابعة—حتى تركز على رحلتك. فريقنا يتابع المتطلبات ومواعيد المعالجة لضمان إكمال طلبك في الوقت المناسب.",
    "services.hotels.title": "حجز الفنادق",
    "services.hotels.desc":
      "إقامة مريحة قريبة من الحرم. نوفر أفضل الأسعار والمواقع لإقامتك.",
    "services.hotels.explanation":
      "نتعاون مع فنادق مختارة قريبة من الأماكن المقدسة لتوفير إقامة مريحة ومواقع مناسبة. سواء كنت تفضل القرب من الحرم أو منطقة أكثر هدوءاً، نساعدك في اختيار الأنسب ونضمن أفضل الأسعار المتاحة لتواريخ إقامتك.",
    "services.transportation.title": "النقل",
    "services.transportation.desc":
      "تنقلات مريحة بين الأماكن المقدسة طوال رحلتك.",
    "services.transportation.explanation":
      "من الاستقبال في المطار إلى التنقل بين مكة والمدينة وجدة، نوفر مركبات مريحة وسائقين محترفين. اختر بين سيارات سيدان للمجموعات الصغيرة أو مركبات أكبر للعائلات والمجموعات، مع أسعار واضحة ومواعيد مرنة.",

    // Events
    "events.title": "الفعاليات القادمة",
    "events.subtitle": "انضم لبرامجنا وفعالياتنا الخاصة",
    "events.date": "التاريخ",
    "events.time": "الوقت",
    "events.location": "الموقع",
    "events.capacity": "السعة",
    "events.price": "السعر",
    "events.bookNow": "احجز الآن",
    "events.overview": "نظرة عامة",
    "events.eventDate": "تاريخ الفعالية",
    "events.information": "معلومات",
    "events.fromPrice": "من",
    "events.perPerson": "للشخص",
    "events.audience": "الجمهور",
    "events.all": "الكل",
    "events.backToEvents": "العودة للفعاليات",
    "events.searchPlaceholder": "البحث بالعنوان أو الوصف أو الموقع أو التكرار أو السعر...",

    // Transportation
    "transport.title": "خدمات النقل",
    "transport.subtitle": "تنقل مريح بين الأماكن المقدسة",
    "transport.perTrip": "للرحلة",
    "transport.perDay": "لليوم",
    "transport.capacity": "السعة",
    "transport.features": "المميزات",
    "transport.seats": "مقاعد",
    "transport.overview": "نظرة عامة",
    "transport.offerIncludes": "يشمل العرض",
    "transport.offerExcludes": "لا يشمل العرض",
    "transport.searchPlaceholder": "البحث بالاسم أو الوصف أو نوع المركبة أو الموقع أو السعة أو السعر...",

    // Visas
    "visa.title": "إصدار التأشيرات",
    "visa.subtitle": "خدمات التأشيرات للعمرة والحج والسفر",
    "visa.viewDetails": "عرض التفاصيل",
    "visa.apply": "قدم الآن",
    "visa.processingTime": "مدة المعالجة",
    "visa.validity": "الصلاحية",
    "visa.requiredDocuments": "المستندات المطلوبة",
    "visa.whatIncluded": "ما المشمول",
    "visa.whatExcluded": "ما غير المشمول",
    "visa.eligibility": "الأهلية",
    "visa.notes": "ملاحظات وشروط",
    "visa.overview": "نظرة عامة",
    "visa.backToVisas": "العودة للتأشيرات",
    "visa.searchPlaceholder": "البحث بالاسم أو الوصف أو نوع التأشيرة أو مدة المعالجة أو الصلاحية أو السعر...",

    // Blog
    "blog.title": "المدونة",
    "blog.magazineTitle": "المجلة السياحية",
    "blog.tag": "معلومات & نصائح",
    "blog.subtitle":
      "مقالات منوعة عن السفر معلومات ونصائح حول الوجهات السياحية والأنشطة والأماكن المميزة للمسافرين",
    "blog.allArticles": "كل المقالات",
    "blog.articles": "المقالات",
    "blog.events": "الفعاليات",
    "blog.place": "المكان",
    "blog.date": "التاريخ",
    "blog.readTime": "دقائق للقراءة",
    "blog.category": "التصنيف",

    // About
    "about.title": "من نحن",
    "about.subtitle": "شريكك الموثوق للرحلات المقدسة",
    "about.badge": "من نحن",
    "about.companyName": "شركة إلهام ناصر أبو سرهد",
    "about.intro1":
      "شركة إلهام ناصر أبو سرهد هي شركة متخصصة في تنظيم برامج العمرة والخدمات السياحية المصاحبة.",
    "about.intro2":
      "نعمل على تقديم تجربة متكاملة تضع راحة المعتمر وطمأنينته في مقدمة أولوياتنا.",
    "about.intro3":
      "نؤمن بأن رحلة العمرة تجربة روحانية فريدة، ولذلك نحرص على العناية بأدق التفاصيل، بدءًا من التخطيط والتنظيم، وصولًا إلى التنفيذ والمتابعة المستمرة، لنضمن رحلة يسودها اليسر والسكينة.",
    "about.intro4":
      "نقدم خدمات متكاملة تشمل إصدار التأشيرات، حجز الفنادق، الطيران، خدمات النقل، السياحة، والإعاشة، مع عروض مدروسة بعناية تلبي مختلف الاحتياجات.",
    "about.intro5":
      "نسعى لبناء علاقات قائمة على الثقة والاحترافية، ونفخر بخدمة ضيوف الرحمن وتقديم تجربة تليق بقدسية الرحلة.",
    "about.vision": "الرؤية",
    "about.vision.text":
      "أن نكون من الشركات الرائدة في تنظيم العمرة والخدمات السياحية المصاحبة، عبر بناء ثقة طويلة المدى وتقديم معيار جودة يليق بضيوف الرحمن.",
    "about.objective": "الهدف",
    "about.objective.text":
      "تقديم برامج عمرة منظمة وموثوقة تركز على راحة المعتمر وسهولة الإجراءات، مع ضمان جودة السكن والتنقل والخدمات المصاحبة.",
    "about.message": "الرسالة",
    "about.message.text":
      "نلتزم بتوفير تجربة عمرة متكاملة تراعي قدسية الرحلة، عبر خدمة احترافية ومتابعة مستمرة، وتفاصيل مدروسة تعزز الطمأنينة واليسر.",
    "about.learnMore": "اعرف المزيد عنا",
    "about.stats.years": "سنوات الخبرة",
    "about.stats.pilgrims": "معتمرون نخدمهم",
    "about.stats.hotels": "فنادق شريكة",
    "about.stats.rating": "التقييم",
    "about.values": "قيمنا",
    "about.value.integrity": "النزاهة",
    "about.value.excellence": "التميز",
    "about.value.compassion": "الرحمة",
    "about.value.reliability": "الموثوقية",

    // Contact
    "contact.title": "اتصل بنا",
    "contact.subtitle": "نحن هنا لمساعدتك",
    "contact.form.name": "الاسم",
    "contact.form.email": "البريد الإلكتروني",
    "contact.form.phone": "رقم الهاتف",
    "contact.form.subject": "الموضوع",
    "contact.form.message": "رسالتك",
    "contact.form.submit": "إرسال الرسالة",
    "contact.form.success": "شكراً لك! تم إرسال رسالتك.",
    "contact.info.address": "العنوان",
    "contact.info.phone": "الهاتف",
    "contact.info.email": "البريد الإلكتروني",
    "contact.info.hours": "ساعات العمل",

    // Inquiry form (visa, hotel, etc.)
    "inquiry.form.nationality": "الجنسية",
    "inquiry.form.countryCode": "رمز الدولة",
    "inquiry.form.phone": "رقم الهاتف",
    "inquiry.form.destination": "الوجهة",
    "inquiry.form.dateOfBooking": "تاريخ الحجز",
    "inquiry.form.send": "إرسال",
    "booking.needVisa": "هل تحتاج إلى تأشيرة؟",
    "booking.bookedFlight": "هل حجزت تذكرة الطيران؟",
    "booking.needTransport": "هل تحتاج إلى خدمات النقل؟",
    "booking.yes": "نعم",
    "booking.no": "لا",

    // FAQ (Contact page)
    "faq.title": "الأسئلة الشائعة",
    "faq.1.question": "كيف يمكنني حجز باقة عمرة؟",
    "faq.1.answer":
      "يمكنك الحجز عبر الموقع باختيار الباقة وتعبئة النموذج، أو التواصل معنا عبر واتساب أو الهاتف. فريقنا يرشدك للخطوات والمستندات المطلوبة.",
    "faq.2.question": "ما الخدمات التي تقدمونها؟",
    "faq.2.answer":
      "نقدم باقات (طيران، إقامة، نقل)، حجز فنادق قريبة من الحرم، النقل، وخدمات التأشيرة. كما نقدم متابعة قبل الرحلة وأثناءها.",
    "faq.3.question": "هل تقدمون باقات مخصصة أو للجماعات؟",
    "faq.3.answer":
      "نعم. نعدّل الباقات حسب تواريخك وميزانيتك وعدد المجموعة. للجماعات والعائلات نقدم أسعاراً خاصة ومتابعة مخصصة.",
    "faq.4.question": "ماذا يشمل باقة العمرة؟",
    "faq.4.answer":
      "عادة: تذاكر ذهاب وعودة، إقامة في مكة والمدينة، نقل بري بين المدن وإلى الحرم، رسوم التأشيرة، ودعم من فريقنا. التفاصيل تختلف حسب الباقة—راجع كل عرض أو اطلب عرض سعر.",
    "faq.5.question": "كيف أتواصل معكم في حال طارئ أثناء الرحلة؟",
    "faq.5.answer":
      "نوفر رقم اتصال وواتساب على مدار الساعة لجميع الضيوف. فريقنا متاح لمساعدتك في أي أمر أثناء إقامتك.",
    "faq.6.question": "هل تساعدون في إجراءات التأشيرة؟",
    "faq.6.answer":
      "نعم. نتابع طلب التأشيرة والمستندات المطلوبة ضمن الباقات أو كخدمة مستقلة. تواصل معنا لمواعيد سفرك ونوضح لك الخطوات.",

    // Footer
    "footer.description": "شريكك الموثوق لخدمات الحج والعمرة.",
    "footer.quickLinks": "روابط سريعة",
    "footer.services": "خدماتنا",
    "footer.contact": "معلومات الاتصال",
    "footer.newsletter": "النشرة الإخبارية",
    "footer.newsletter.placeholder": "أدخل بريدك الإلكتروني",
    "footer.newsletter.button": "اشترك",
    "footer.rights": "جميع الحقوق محفوظة.",
    "footer.destinations": "الوجهات",
    "footer.tours": "الجولات",
    "footer.privacyPolicy": "سياسة الخصوصية",
    "footer.termsOfService": "شروط الخدمة",
    "footer.companyName": "شركة إلهام ناصر أبو سرهد",
    "footer.hajjPackages": "باقات الحج",
    "footer.umrahPackages": "الباقات",
    "why.competent": "كفاءة",
    "why.competent.desc": "فريق خبير بسنوات من الخبرة في الحج والعمرة.",
    "why.affordable": "أسعار مناسبة",
    "why.affordable.desc": "أسعار شفافة بدون تكاليف خفية.",
    "why.responsive": "استجابة",
    "why.responsive.desc": "نرد بسرعة على استفساراتك واحتياجاتك.",
    "why.trust": "الثقة والأمان",
    "why.trust.desc": "مرخصون وموثوقون من آلاف الحجاج حول العالم.",
  },
};

const LOCALE_STORAGE_KEY = "elhamas-locale";

function getStoredLocale(defaultLocale: Locale): Locale {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "ar") return stored;
  } catch {
    // ignore
  }
  return defaultLocale;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  defaultLocale = "ar",
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    getStoredLocale(defaultLocale),
  );

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch {
      // ignore
    }
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
  }, []);

  // Set initial dir/lang on mount (e.g. first load or refresh)
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const t = useCallback(
    (key: string) => {
      return translations[locale][key] || key;
    },
    [locale],
  );

  const isRTL = locale === "ar";

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Helper function to get localized content
export function getLocalizedContent<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: Locale,
): string {
  const localizedField = `${field}_${locale}` as keyof T;
  const fallbackField = `${field}_en` as keyof T;
  return (
    (item[localizedField] as string) || (item[fallbackField] as string) || ""
  );
}
