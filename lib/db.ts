import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

// Re-export types used by the app (ids are string for Supabase UUID)
export interface Hotel {
  id: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  location_en: string | null
  location_ar: string | null
  city: string | null
  star_rating: number
  distance_to_haram: string | null
  price_per_night: number | null
  currency: string
  amenities: string[]
  images: string[]
  featured: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface PackageCategory {
  id: string
  name_en: string
  name_ar: string
  sort_order: number
  image_url: string | null
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
  title_en: string
  title_ar: string
  description_en: string | null
  description_ar: string | null
  event_date: Date | null
  event_time: string | null
  location_en: string | null
  location_ar: string | null
  price: number | null
  currency: string
  capacity: number | null
  images: string[]
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
  vehicle_type: string | null
  capacity: number | null
  price_per_trip: number | null
  price_per_day: number | null
  currency: string
  features: string[]
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
  rating: number
  avatar: string | null
  location_en: string | null
  location_ar: string | null
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

function mapHotel(row: Awaited<ReturnType<typeof prisma.hotel.findFirst>>): Hotel | null {
  if (!row) return null
  const images = row.gallery?.length ? row.gallery : row.imageUrl ? [row.imageUrl] : []
  return {
    id: row.id,
    name_en: row.nameEn,
    name_ar: row.nameAr,
    description_en: row.descriptionEn,
    description_ar: row.descriptionAr,
    location_en: row.locationEn,
    location_ar: row.locationAr,
    city: row.city,
    star_rating: row.starRating,
    distance_to_haram: row.distanceToHaram,
    price_per_night: toNum(row.pricePerNight),
    currency: row.currency,
    amenities: row.amenities ?? [],
    images,
    featured: row.isFeatured,
    is_active: row.isActive,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

function mapTourPackage(row: Awaited<ReturnType<typeof prisma.tourPackage.findFirst>> & { location?: { nameEn: string; nameAr: string; imageUrl: string | null } | null }): TourPackage | null {
  if (!row) return null
  const itinerary = Array.isArray(row.itinerary) ? (row.itinerary as { day: number; title_en: string; title_ar: string }[]) : []
  const images = row.gallery?.length ? row.gallery : row.imageUrl ? [row.imageUrl] : []
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

function mapEvent(row: Awaited<ReturnType<typeof prisma.event.findFirst>>): Event | null {
  if (!row) return null
  const images = row.gallery?.length ? row.gallery : row.imageUrl ? [row.imageUrl] : []
  return {
    id: row.id,
    title_en: row.titleEn,
    title_ar: row.titleAr,
    description_en: row.descriptionEn,
    description_ar: row.descriptionAr,
    event_date: row.eventDate,
    event_time: null,
    location_en: row.locationEn,
    location_ar: row.locationAr,
    price: toNum(row.price),
    currency: row.currency,
    capacity: row.maxAttendees ?? null,
    images,
    is_active: row.isActive,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  }
}

function mapTransportation(row: Awaited<ReturnType<typeof prisma.transportation.findFirst>>): Transportation | null {
  if (!row) return null
  const features = row.featuresEn?.length ? row.featuresEn : []
  const images = row.imageUrl ? [row.imageUrl] : []
  return {
    id: row.id,
    name_en: row.nameEn,
    name_ar: row.nameAr,
    description_en: row.descriptionEn,
    description_ar: row.descriptionAr,
    vehicle_type: row.vehicleType,
    capacity: row.capacity,
    price_per_trip: toNum(row.pricePerTrip),
    price_per_day: toNum(row.pricePerDay),
    currency: row.currency,
    features,
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
    rating: row.rating,
    avatar: row.imageUrl,
    location_en: row.location,
    location_ar: row.location,
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

export async function getHotels(featured?: boolean): Promise<Hotel[]> {
  return safeDb(async () => {
    const list = await prisma.hotel.findMany({
      where: { isActive: true, ...(featured ? { isFeatured: true } : {}) },
      orderBy: { createdAt: 'desc' },
    })
    return list.map((row) => mapHotel(row)!).filter(Boolean)
  }, [])
}

export async function getHotelById(id: string): Promise<Hotel | undefined> {
  const row = await prisma.hotel.findUnique({ where: { id } }).catch(() => null)
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
      include: {
        tourPackages: {
          where: { isActive: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { imageUrl: true, gallery: true },
        },
      },
    })
    return list.map((row) => ({
      id: row.id,
      name_en: row.nameEn,
      name_ar: row.nameAr,
      sort_order: row.sortOrder,
      image_url:
        row.tourPackages?.[0]?.gallery?.[0] ??
        row.tourPackages?.[0]?.imageUrl ??
        null,
    }))
  }, [])
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
