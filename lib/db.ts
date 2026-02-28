import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

// Re-export types used by the app (ids are string for Supabase UUID)
export interface HotelLocation {
  id: string
  name_en: string
  name_ar: string
  sort_order: number
  image_url: string | null
  image_urls: string[]
}

export interface Room {
  id: string
  hotel_id: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  price_per_night: number
  currency: string
  max_guests: number
  amenities: string[]
  amenities_ar: string[]
  image_url: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Hotel {
  id: string
  location_id: string | null
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  location_en: string | null
  location_ar: string | null
  location_image_url: string | null
  city: string | null
  city_ar: string | null
  star_rating: number
  distance_to_haram: string | null
  price_per_night: number | null
  currency: string
  amenities: string[]
  amenities_ar: string[]
  images: string[]
  featured: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
  rooms?: Room[]
}

export interface PackageCategory {
  id: string
  name_en: string
  name_ar: string
  sort_order: number
  image_url: string | null
  /** All featured images of packages in this category (for animated category card) */
  image_urls: string[]
}

export interface PackageDiscoverCard {
  id: string
  title_en: string
  title_ar: string
  image_url: string | null
  is_visible: boolean
}

export interface Location {
  id: string
  name_en: string
  name_ar: string
  image_url: string | null
}

export interface TourPackage {
  id: string
  category_id: string | null
  location_id: string | null
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  short_description_en: string | null
  short_description_ar: string | null
  location_en: string | null
  location_ar: string | null
  location_image_url: string | null
  package_type: string | null
  duration_days: number | null
  price: number | null
  currency: string
  includes: string[]
  inclusions_ar: string[]
  exclusions_en: string[]
  exclusions_ar: string[]
  itinerary: { day: number; title_en: string; title_ar: string }[]
  images: string[]
  featured: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Event {
  id: string
  slug: string
  title_en: string
  title_ar: string
  description_en: string | null
  description_ar: string | null
  short_description_en: string | null
  short_description_ar: string | null
  event_date: Date
  end_date: Date | null
  frequency_en: string | null
  frequency_ar: string | null
  location_en: string | null
  location_ar: string | null
  featured_image: string | null
  images: string[]
  price: number | null
  currency: string
  max_attendees: number | null
  is_featured: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Transportation {
  id: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  vehicle_type: string
  vehicle_type_ar: string | null
  capacity: number
  location_en: string | null
  location_ar: string | null
  price_per_trip: number | null
  price_per_day: number | null
  currency: string
  features: string[]
  features_ar: string[]
  excludes: string[]
  excludes_ar: string[]
  images: string[]
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Visa {
  id: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  visa_type_en: string
  visa_type_ar: string | null
  processing_time_en: string | null
  processing_time_ar: string | null
  validity_en: string | null
  validity_ar: string | null
  price: number | null
  currency: string
  requirements: string[]
  requirements_ar: string[]
  includes: string[]
  includes_ar: string[]
  excludes: string[]
  excludes_ar: string[]
  eligibility_en: string | null
  eligibility_ar: string | null
  notes_en: string | null
  notes_ar: string | null
  images: string[]
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface BlogPost {
  id: string
  slug: string
  title_en: string
  title_ar: string
  place_en: string | null
  place_ar: string | null
  excerpt_en: string | null
  excerpt_ar: string | null
  content_en: string | null
  content_ar: string | null
  author: string | null
  category: string | null
  tags: string[]
  featured_image: string | null
  is_published: boolean
  published_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface Testimonial {
  id: string
  name_en: string
  name_ar: string | null
  content_en: string
  content_ar: string | null
  work_en: string | null
  work_ar: string | null
  rating: number
  is_active: boolean
  created_at: Date
}

export interface ContactInquiry {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  created_at: Date
}

export interface Booking {
  id: string
  booking_type: string
  reference_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  num_guests: number
  check_in_date: Date | null
  check_out_date: Date | null
  special_requests: string | null
  total_price: number | null
  currency: string
  status: string
  created_at: Date
  updated_at: Date
}

export interface AdminUser {
  id: string
  email: string
  password_hash: string
  name: string
  role: string
  created_at: Date
  updated_at: Date
}

function toNum(d: Decimal | null | undefined): number | null {
  if (d == null) return null
  return Number(d)
}

type HotelRow = Awaited<ReturnType<typeof prisma.hotel.findFirst>> & {
  location?: { nameEn: string; nameAr: string; imageUrl: string | null } | null
  rooms?: Array<{
    id: string
    hotelId: string
    nameEn: string
    nameAr: string
    descriptionEn: string | null
    descriptionAr: string | null
    pricePerNight: Decimal
    currency: string
    maxGuests: number
    amenities: string[]
    imageUrl: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }>
}

function mapHotel(row: HotelRow | null): Hotel | null {
  if (!row) return null
  const featured = row.imageUrl ?? null
  const gallery = row.gallery ?? []
  const images = featured ? [featured, ...gallery.filter((u: string) => u !== featured)] : gallery
  const loc = row.location
  return {
    id: row.id,
    location_id: row.locationId ?? null,
    name_en: row.nameEn,
    name_ar: row.nameAr,
    description_en: row.descriptionEn,
    description_ar: row.descriptionAr,
    location_en: loc?.nameEn ?? row.locationEn ?? null,
    location_ar: loc?.nameAr ?? row.locationAr ?? null,
    location_image_url: loc?.imageUrl ?? null,
    city: row.city,
    city_ar: (row as { cityAr?: string | null }).cityAr ?? null,
    star_rating: row.starRating,
    distance_to_haram: row.distanceToHaram,
    price_per_night: toNum(row.pricePerNight),
    currency: row.currency,
    amenities: row.amenities ?? [],
    amenities_ar: (row as { amenitiesAr?: string[] }).amenitiesAr ?? [],
    images,
    featured: row.isFeatured,
    is_active: row.isActive,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
    rooms: row.rooms?.map((r) => ({
      id: r.id,
      hotel_id: r.hotelId,
      name_en: r.nameEn,
      name_ar: r.nameAr,
      description_en: r.descriptionEn,
      description_ar: r.descriptionAr,
      price_per_night: Number(r.pricePerNight),
      currency: r.currency,
      max_guests: r.maxGuests,
      amenities: r.amenities ?? [],
      amenities_ar: (r as { amenitiesAr?: string[] }).amenitiesAr ?? [],
      image_url: r.imageUrl,
      is_active: r.isActive,
      created_at: r.createdAt,
      updated_at: r.updatedAt,
    })),
  }
}

export async function getHotelLocations(): Promise<HotelLocation[]> {
  return safeDb(async () => {
    const list = await prisma.hotelLocation.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return list.map((row) => {
      const locationImageUrl = row.imageUrl ?? null
      const image_url = locationImageUrl
      const image_urls = locationImageUrl ? [locationImageUrl] : []
      return {
        id: row.id,
        name_en: row.nameEn,
        name_ar: row.nameAr,
        sort_order: row.sortOrder,
        image_url,
        image_urls,
      }
    })
  }, [])
}

function mapTourPackage(row: Awaited<ReturnType<typeof prisma.tourPackage.findFirst>> & { location?: { nameEn: string; nameAr: string; imageUrl: string | null } | null }): TourPackage | null {
  if (!row) return null
  const itinerary = Array.isArray(row.itinerary) ? (row.itinerary as { day: number; title_en: string; title_ar: string }[]) : []
  // Featured image (imageUrl) is always the cover; then gallery (without duplicating featured)
  const featured = row.imageUrl ?? null
  const gallery = row.gallery ?? []
  const images = featured
    ? [featured, ...gallery.filter((u) => u !== featured)]
    : gallery
  const loc = row.location
  return {
    id: row.id,
    category_id: row.categoryId ?? null,
    location_id: row.locationId ?? null,
    name_en: row.titleEn,
    name_ar: row.titleAr,
    description_en: row.descriptionEn,
    description_ar: row.descriptionAr,
    short_description_en: row.shortDescriptionEn ?? null,
    short_description_ar: row.shortDescriptionAr ?? null,
    location_en: loc?.nameEn ?? null,
    location_ar: loc?.nameAr ?? null,
    location_image_url: loc?.imageUrl ?? null,
    package_type: row.packageType,
    duration_days: row.durationDays,
    price: toNum(row.price),
    currency: row.currency,
    includes: row.inclusionsEn ?? [],
    inclusions_ar: row.inclusionsAr ?? [],
    exclusions_en: row.exclusionsEn ?? [],
    exclusions_ar: row.exclusionsAr ?? [],
    itinerary,
    images,
    featured: row.isFeatured,
    is_active: row.isActive,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

function mapEvent(row: Awaited<ReturnType<typeof prisma.event.findFirst>> | null): Event | null {
  if (!row) return null
  const featured = row.imageUrl ?? null
  const gallery = row.gallery ?? []
  const images = featured ? [featured, ...gallery.filter((u: string) => u !== featured)] : gallery
  const r = row as typeof row & { frequencyEn?: string | null; frequencyAr?: string | null }
  return {
    id: row.id,
    slug: row.slug,
    title_en: row.titleEn,
    title_ar: row.titleAr,
    description_en: row.descriptionEn,
    description_ar: row.descriptionAr,
    short_description_en: row.shortDescriptionEn ?? null,
    short_description_ar: row.shortDescriptionAr ?? null,
    event_date: row.eventDate,
    end_date: row.endDate ?? null,
    frequency_en: r.frequencyEn ?? null,
    frequency_ar: r.frequencyAr ?? null,
    location_en: row.locationEn,
    location_ar: row.locationAr,
    featured_image: featured,
    images,
    price: toNum(row.price),
    currency: row.currency,
    max_attendees: row.maxAttendees ?? null,
    is_featured: row.isFeatured,
    is_active: row.isActive,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

function mapTransportation(row: Awaited<ReturnType<typeof prisma.transportation.findFirst>> | null): Transportation | null {
  if (!row) return null
  const featured = row.imageUrl ?? null
  const gallery = (row as { gallery?: string[] }).gallery ?? []
  const images = featured ? [featured, ...gallery.filter((u: string) => u !== featured)] : gallery
  const features = (row as { featuresEn?: string[] }).featuresEn ?? []
  const excludesEn = (row as { excludesEn?: string[] }).excludesEn ?? []
  const excludesAr = (row as { excludesAr?: string[] }).excludesAr ?? []
  return {
    id: row.id,
    name_en: row.nameEn,
    name_ar: row.nameAr,
    description_en: row.descriptionEn,
    description_ar: row.descriptionAr,
    vehicle_type: row.vehicleType,
    vehicle_type_ar: (row as { vehicleTypeAr?: string | null }).vehicleTypeAr ?? null,
    capacity: row.capacity,
    location_en: (row as { locationEn?: string | null }).locationEn ?? null,
    location_ar: (row as { locationAr?: string | null }).locationAr ?? null,
    price_per_trip: toNum(row.pricePerTrip),
    price_per_day: toNum(row.pricePerDay),
    currency: row.currency,
    features: (row as { featuresEn?: string[] }).featuresEn ?? [],
    features_ar: (row as { featuresAr?: string[] }).featuresAr ?? [],
    excludes: excludesEn,
    excludes_ar: excludesAr,
    images,
    is_active: row.isActive,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

type VisaPrismaRow = {
  id: string
  nameEn: string
  nameAr: string
  descriptionEn: string | null
  descriptionAr: string | null
  visaTypeEn: string
  visaTypeAr?: string | null
  processingTimeEn?: string | null
  processingTimeAr?: string | null
  validityEn?: string | null
  validityAr?: string | null
  price: unknown
  currency: string
  imageUrl: string | null
  gallery?: string[]
  requirementsEn?: string[]
  requirementsAr?: string[]
  includesEn?: string[]
  includesAr?: string[]
  excludesEn?: string[]
  excludesAr?: string[]
  eligibilityEn?: string | null
  eligibilityAr?: string | null
  notesEn?: string | null
  notesAr?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

function mapVisa(row: VisaPrismaRow | null): Visa | null {
  if (!row) return null
  const featured = row.imageUrl ?? null
  const gallery = row.gallery ?? []
  const images = featured ? [featured, ...gallery.filter((u: string) => u !== featured)] : gallery
  return {
    id: row.id,
    name_en: row.nameEn,
    name_ar: row.nameAr,
    description_en: row.descriptionEn,
    description_ar: row.descriptionAr,
    visa_type_en: row.visaTypeEn,
    visa_type_ar: row.visaTypeAr ?? null,
    processing_time_en: row.processingTimeEn ?? null,
    processing_time_ar: row.processingTimeAr ?? null,
    validity_en: row.validityEn ?? null,
    validity_ar: row.validityAr ?? null,
    price: toNum(row.price as Parameters<typeof toNum>[0]),
    currency: row.currency,
    requirements: row.requirementsEn ?? [],
    requirements_ar: row.requirementsAr ?? [],
    includes: row.includesEn ?? [],
    includes_ar: row.includesAr ?? [],
    excludes: row.excludesEn ?? [],
    excludes_ar: row.excludesAr ?? [],
    eligibility_en: row.eligibilityEn ?? null,
    eligibility_ar: row.eligibilityAr ?? null,
    notes_en: row.notesEn ?? null,
    notes_ar: row.notesAr ?? null,
    images,
    is_active: row.isActive,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

function mapTestimonial(row: Awaited<ReturnType<typeof prisma.testimonial.findFirst>>): Testimonial | null {
  if (!row) return null
  return {
    id: row.id,
    name_en: row.nameEn,
    name_ar: row.nameAr,
    content_en: row.contentEn,
    content_ar: row.contentAr,
    work_en: row.workEn ?? null,
    work_ar: row.workAr ?? null,
    rating: row.rating,
    is_active: row.isActive,
    created_at: row.createdAt,
  }
}

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    if (!process.env.DATABASE_URL) return fallback
    return await fn()
  } catch {
    return fallback
  }
}

// --- Database queries (Prisma + Supabase) ---

export async function getHotels(featured?: boolean, locationId?: string | null): Promise<Hotel[]> {
  return safeDb(async () => {
    const list = await prisma.hotel.findMany({
      where: {
        isActive: true,
        ...(featured ? { isFeatured: true } : {}),
        ...(locationId ? { locationId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { location: true },
    })
    return list.map((row) => mapHotel(row)!).filter(Boolean)
  }, [])
}

export async function getHotelById(id: string): Promise<Hotel | undefined> {
  const row = await prisma.hotel
    .findUnique({
      where: { id },
      include: { location: true, rooms: { where: { isActive: true }, orderBy: { createdAt: 'asc' } } },
    })
    .catch(() => null)
  return mapHotel(row) ?? undefined
}

export async function getTourPackages(featured?: boolean): Promise<TourPackage[]> {
  return safeDb(async () => {
    const list = await prisma.tourPackage.findMany({
      where: { isActive: true, ...(featured ? { isFeatured: true } : {}) },
      orderBy: { createdAt: 'desc' },
      include: { location: true },
    })
    return list.map((row) => mapTourPackage(row)!).filter(Boolean)
  }, [])
}

export async function getTourPackageById(id: string): Promise<TourPackage | undefined> {
  const row = await prisma.tourPackage.findUnique({
    where: { id },
    include: { location: true },
  }).catch(() => null)
  return (row ? mapTourPackage(row) : null) ?? undefined
}

export async function getPackageCategories(): Promise<PackageCategory[]> {
  return safeDb(async () => {
    const list = await prisma.packageCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return list.map((row) => {
      const categoryImageUrl = row.imageUrl ?? null
      const image_url = categoryImageUrl
      const image_urls = categoryImageUrl ? [categoryImageUrl] : []
      return {
        id: row.id,
        name_en: row.nameEn,
        name_ar: row.nameAr,
        sort_order: row.sortOrder,
        image_url,
        image_urls,
      }
    })
  }, [])
}

export async function getPackageDiscoverCard(): Promise<PackageDiscoverCard | null> {
  return safeDb(async () => {
    const row = await (prisma as { packageDiscoverCard?: { findFirst: () => Promise<{ id: string; titleEn: string; titleAr: string; imageUrl: string | null; isVisible: boolean } | null> } }).packageDiscoverCard?.findFirst()
    if (!row) return null
    return {
      id: row.id,
      title_en: row.titleEn,
      title_ar: row.titleAr,
      image_url: row.imageUrl ?? null,
      is_visible: row.isVisible,
    }
  }, null)
}

export async function getLocations(): Promise<Location[]> {
  return safeDb(async () => {
    const list = await prisma.location.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return list.map((row) => ({
      id: row.id,
      name_en: row.nameEn,
      name_ar: row.nameAr,
      image_url: row.imageUrl ?? null,
    }))
  }, [])
}

export async function getEvents(): Promise<Event[]> {
  return safeDb(async () => {
    const list = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { eventDate: 'asc' },
    })
    return list.map((row) => mapEvent(row)!).filter(Boolean)
  }, [])
}

export async function getEventById(id: string): Promise<Event | undefined> {
  const row = await prisma.event.findUnique({ where: { id } }).catch(() => null)
  return mapEvent(row) ?? undefined
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const row = await prisma.event.findUnique({ where: { slug } }).catch(() => null)
  if (!row || !row.isActive) return undefined
  return mapEvent(row) ?? undefined
}

export async function getTransportation(): Promise<Transportation[]> {
  return safeDb(async () => {
    const list = await prisma.transportation.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return list.map((row) => mapTransportation(row)!).filter(Boolean)
  }, [])
}

export async function getTransportationById(id: string): Promise<Transportation | undefined> {
  const row = await prisma.transportation.findUnique({ where: { id } }).catch(() => null)
  return mapTransportation(row) ?? undefined
}

export async function getVisas(): Promise<Visa[]> {
  return safeDb(async () => {
    const list = await (prisma as unknown as { visa: { findMany: (opts: { where: { isActive: boolean }; orderBy: { createdAt: string } }) => Promise<VisaPrismaRow[]> } }).visa.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return list.map((row) => mapVisa(row)!).filter(Boolean)
  }, [])
}

export async function getVisaById(id: string): Promise<Visa | undefined> {
  const row = await (prisma as unknown as { visa: { findUnique: (opts: { where: { id: string } }) => Promise<VisaPrismaRow | null> } }).visa.findUnique({ where: { id } }).catch(() => null)
  return mapVisa(row) ?? undefined
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  return safeDb(async () => {
    const list = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    })
    return list.map((row) => ({
      id: row.id,
      slug: row.slug,
      title_en: row.titleEn,
      title_ar: row.titleAr,
      place_en: (row as { placeEn?: string | null }).placeEn ?? null,
      place_ar: (row as { placeAr?: string | null }).placeAr ?? null,
      excerpt_en: row.excerptEn,
      excerpt_ar: row.excerptAr,
      content_en: row.contentEn,
      content_ar: row.contentAr,
      author: row.authorId,
      category: row.category,
      tags: row.tags ?? [],
      featured_image: row.imageUrl,
      is_published: row.isPublished,
      published_at: row.publishedAt,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    }))
  }, [])
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const row = await prisma.blogPost.findUnique({ where: { slug } }).catch(() => null)
  if (!row) return undefined
  return {
    id: row.id,
    slug: row.slug,
    title_en: row.titleEn,
    title_ar: row.titleAr,
    place_en: (row as { placeEn?: string | null }).placeEn ?? null,
    place_ar: (row as { placeAr?: string | null }).placeAr ?? null,
    excerpt_en: row.excerptEn,
    excerpt_ar: row.excerptAr,
    content_en: row.contentEn,
    content_ar: row.contentAr,
    author: row.authorId,
    category: row.category,
    tags: row.tags ?? [],
    featured_image: row.imageUrl,
    is_published: row.isPublished,
    published_at: row.publishedAt,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return safeDb(async () => {
    const list = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return list.map((row) => mapTestimonial(row)!).filter(Boolean)
  }, [])
}

export async function createContactInquiry(
  data: Omit<ContactInquiry, 'id' | 'status' | 'created_at'>
): Promise<ContactInquiry | null> {
  try {
    const row = await prisma.contactInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    })
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      subject: row.subject,
      message: row.message,
      status: row.status,
      created_at: row.createdAt,
    }
  } catch {
    return null
  }
}

export async function createBooking(
  data: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at'>
): Promise<Booking | null> {
  try {
    const referenceId = data.reference_id ?? crypto.randomUUID()
    const row = await prisma.booking.create({
      data: {
        bookingType: data.booking_type,
        referenceId,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        numGuests: data.num_guests,
        specialRequests: data.special_requests,
        totalPrice: data.total_price,
        currency: data.currency,
      },
    })
    return {
      id: row.id,
      booking_type: row.bookingType,
      reference_id: row.referenceId,
      customer_name: row.customerName,
      customer_email: row.customerEmail,
      customer_phone: row.customerPhone,
      num_guests: row.numGuests,
      check_in_date: null,
      check_out_date: null,
      special_requests: row.specialRequests,
      total_price: toNum(row.totalPrice),
      currency: row.currency,
      status: row.status,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    }
  } catch {
    return null
  }
}
