import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const [inquiriesCount, bookingsCount, hotelsCount, packagesCount] =
    await Promise.all([
      prisma.contactInquiry.count(),
      prisma.booking.count(),
      prisma.hotel.count(),
      prisma.tourPackage.count(),
    ])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.name || session.email}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contact inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{inquiriesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{bookingsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hotels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{hotelsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tour packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{packagesCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick start</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Use the sidebar to manage Site Settings, Hotels, Packages, Events,
          Transportation, Blog, Testimonials, Inquiries, and Bookings. This is
          a temporary dashboard; full CRUD for each section will be added in
          the next phases.
        </CardContent>
      </Card>
    </div>
  )
}
