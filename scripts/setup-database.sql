-- Hajj & Umrah Services Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value_en TEXT,
  value_ar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotels Table
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  location_en VARCHAR(255),
  location_ar VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  distance_to_haram VARCHAR(100),
  star_rating INTEGER DEFAULT 5,
  price_per_night DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  image_url TEXT,
  gallery TEXT[],
  amenities TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour Packages Table
CREATE TABLE IF NOT EXISTS tour_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  short_description_en TEXT,
  short_description_ar TEXT,
  package_type VARCHAR(50) NOT NULL,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'SAR',
  inclusions_en TEXT[],
  inclusions_ar TEXT[],
  exclusions_en TEXT[],
  exclusions_ar TEXT[],
  itinerary JSONB,
  image_url TEXT,
  gallery TEXT[],
  max_guests INTEGER,
  departure_dates TIMESTAMP WITH TIME ZONE[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  short_description_en TEXT,
  short_description_ar TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location_en VARCHAR(255),
  location_ar VARCHAR(255),
  image_url TEXT,
  gallery TEXT[],
  price DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  max_attendees INTEGER,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transportation Table
CREATE TABLE IF NOT EXISTS transportation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  vehicle_type VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_trip DECIMAL(10,2),
  price_per_day DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  image_url TEXT,
  features_en TEXT[],
  features_ar TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content_en TEXT,
  content_ar TEXT,
  excerpt_en TEXT,
  excerpt_ar TEXT,
  image_url TEXT,
  author_id UUID REFERENCES admin_users(id),
  category VARCHAR(100),
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  inquiry_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'new',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_type VARCHAR(50) NOT NULL,
  reference_id UUID NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  num_guests INTEGER DEFAULT 1,
  special_requests TEXT,
  total_price DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  status VARCHAR(50) DEFAULT 'pending',
  booking_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  content_en TEXT NOT NULL,
  content_ar TEXT,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  location VARCHAR(255),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions Table for Auth
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123 - should be changed in production)
INSERT INTO admin_users (email, password_hash, name, role)
VALUES ('admin@hajjumrah.com', '$2b$10$rICGJP3VKy5XgdXL0pWOQOKqJq2OY.Y1z8V0YWx5X.qFYWXc9RqKa', 'Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample site settings
INSERT INTO site_settings (key, value_en, value_ar) VALUES
('site_name', 'Hajj & Umrah Services', 'خدمات الحج والعمرة'),
('site_tagline', 'Your Trusted Partner for Sacred Journeys', 'شريكك الموثوق للرحلات المقدسة'),
('contact_email', 'info@hajjumrah.com', 'info@hajjumrah.com'),
('contact_phone', '+966 12 345 6789', '+966 12 345 6789'),
('address', 'Makkah, Saudi Arabia', 'مكة المكرمة، المملكة العربية السعودية')
ON CONFLICT (key) DO NOTHING;

-- Insert sample hotels
INSERT INTO hotels (name_en, name_ar, description_en, description_ar, location_en, location_ar, city, distance_to_haram, star_rating, price_per_night, image_url, amenities, is_featured) VALUES
('Grand Makkah Hotel', 'فندق مكة الكبير', 'Luxury 5-star hotel with stunning views of the Holy Mosque. Experience unparalleled comfort and spirituality.', 'فندق 5 نجوم فاخر مع إطلالات خلابة على المسجد الحرام. استمتع براحة لا مثيل لها وروحانية عالية.', 'Clock Tower, Makkah', 'برج الساعة، مكة', 'Makkah', '50 meters', 5, 1500.00, '/images/hotels/hotel-1.jpg', ARRAY['Free WiFi', 'Room Service', 'Prayer Room', 'Restaurant', 'Spa'], true),
('Madinah Palace', 'قصر المدينة', 'Elegant accommodation steps away from Masjid An-Nabawi. Perfect for pilgrims seeking peace and comfort.', 'إقامة أنيقة على بعد خطوات من المسجد النبوي. مثالي للحجاج الباحثين عن السلام والراحة.', 'Central Area, Madinah', 'المنطقة المركزية، المدينة', 'Madinah', '100 meters', 5, 1200.00, '/images/hotels/hotel-2.jpg', ARRAY['Free WiFi', 'Breakfast Included', 'Shuttle Service', 'Concierge'], true),
('Al Safwa Towers', 'أبراج الصفوة', 'Modern towers offering panoramic views and world-class amenities in the heart of Makkah.', 'أبراج حديثة توفر إطلالات بانورامية ومرافق عالمية في قلب مكة.', 'Ajyad, Makkah', 'أجياد، مكة', 'Makkah', '200 meters', 4, 900.00, '/images/hotels/hotel-3.jpg', ARRAY['Free WiFi', 'Gym', 'Restaurant', 'Laundry'], false)
ON CONFLICT DO NOTHING;

-- Insert sample tour packages
INSERT INTO tour_packages (title_en, title_ar, slug, description_en, description_ar, short_description_en, short_description_ar, package_type, duration_days, price, inclusions_en, inclusions_ar, image_url, is_featured) VALUES
('Premium Umrah Package', 'باقة العمرة المميزة', 'premium-umrah-package', 'Experience the most comprehensive Umrah journey with 5-star accommodations, guided tours, and VIP services throughout your spiritual journey.', 'استمتع برحلة العمرة الأكثر شمولاً مع إقامة 5 نجوم وجولات مرشدة وخدمات كبار الشخصيات طوال رحلتك الروحية.', 'Complete Umrah experience with luxury accommodations and guided services.', 'تجربة عمرة كاملة مع إقامة فاخرة وخدمات مرشدة.', 'umrah', 14, 25000.00, ARRAY['5-star hotel in Makkah', '5-star hotel in Madinah', 'Airport transfers', 'Guided Umrah', 'Ziyarat tours', 'All meals'], ARRAY['فندق 5 نجوم في مكة', 'فندق 5 نجوم في المدينة', 'التوصيل من المطار', 'عمرة مع مرشد', 'جولات الزيارات', 'جميع الوجبات'], '/images/packages/umrah-premium.jpg', true),
('Economy Umrah Package', 'باقة العمرة الاقتصادية', 'economy-umrah-package', 'Affordable Umrah package with comfortable 3-star accommodations and essential services for a meaningful spiritual journey.', 'باقة عمرة بأسعار معقولة مع إقامة مريحة 3 نجوم والخدمات الأساسية لرحلة روحية ذات معنى.', 'Affordable Umrah with comfortable accommodations.', 'عمرة بأسعار معقولة مع إقامة مريحة.', 'umrah', 10, 12000.00, ARRAY['3-star hotel in Makkah', '3-star hotel in Madinah', 'Airport transfers', 'Guided Umrah'], ARRAY['فندق 3 نجوم في مكة', 'فندق 3 نجوم في المدينة', 'التوصيل من المطار', 'عمرة مع مرشد'], '/images/packages/umrah-economy.jpg', true),
('Hajj Premium Package', 'باقة الحج المميزة', 'hajj-premium-package', 'The ultimate Hajj experience with premium tents in Mina, luxury hotels, and comprehensive support throughout all rituals.', 'تجربة الحج المثالية مع خيام مميزة في منى وفنادق فاخرة ودعم شامل خلال جميع المناسك.', 'Ultimate Hajj experience with premium services.', 'تجربة الحج المثالية مع خدمات مميزة.', 'hajj', 21, 75000.00, ARRAY['Premium Mina tents', '5-star Makkah hotel', '5-star Madinah hotel', 'All transportation', 'Meals included', 'Dedicated guide'], ARRAY['خيام منى المميزة', 'فندق 5 نجوم في مكة', 'فندق 5 نجوم في المدينة', 'جميع وسائل النقل', 'الوجبات مشمولة', 'مرشد مخصص'], '/images/packages/hajj-premium.jpg', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample events
INSERT INTO events (title_en, title_ar, slug, description_en, description_ar, short_description_en, short_description_ar, event_date, location_en, location_ar, image_url, is_featured) VALUES
('Ramadan Umrah Special', 'عمرة رمضان الخاصة', 'ramadan-umrah-special', 'Join our special Ramadan Umrah program with exclusive spiritual sessions, Iftar gatherings, and Taraweeh prayers at Masjid Al-Haram.', 'انضم إلى برنامج عمرة رمضان الخاص مع جلسات روحية حصرية وتجمعات الإفطار وصلاة التراويح في المسجد الحرام.', 'Special Ramadan program with spiritual sessions.', 'برنامج رمضان الخاص مع جلسات روحية.', '2026-03-01 00:00:00+00', 'Makkah & Madinah', 'مكة والمدينة', '/images/events/ramadan.jpg', true),
('Islamic Heritage Tour', 'جولة التراث الإسلامي', 'islamic-heritage-tour', 'Explore the rich Islamic heritage of the Holy Lands with expert historians and scholars.', 'استكشف التراث الإسلامي الغني للأراضي المقدسة مع مؤرخين وعلماء خبراء.', 'Explore Islamic heritage with expert guides.', 'استكشف التراث الإسلامي مع مرشدين خبراء.', '2026-04-15 00:00:00+00', 'Makkah, Madinah & Jeddah', 'مكة والمدينة وجدة', '/images/events/heritage.jpg', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample transportation
INSERT INTO transportation (name_en, name_ar, description_en, description_ar, vehicle_type, capacity, price_per_trip, price_per_day, features_en, features_ar, is_featured) VALUES
('Luxury Sedan', 'سيدان فاخرة', 'Premium sedan service for comfortable and private transfers between holy sites.', 'خدمة سيدان فاخرة للتنقل المريح والخاص بين المواقع المقدسة.', 'sedan', 3, 500.00, 1500.00, ARRAY['Air Conditioning', 'WiFi', 'Water bottles', 'Professional driver'], ARRAY['تكييف هواء', 'واي فاي', 'زجاجات مياه', 'سائق محترف'], true),
('VIP Van', 'فان VIP', 'Spacious VIP van perfect for families and small groups traveling together.', 'فان VIP واسع مثالي للعائلات والمجموعات الصغيرة المسافرة معًا.', 'van', 7, 800.00, 2500.00, ARRAY['Air Conditioning', 'WiFi', 'Refreshments', 'Entertainment system'], ARRAY['تكييف هواء', 'واي فاي', 'مرطبات', 'نظام ترفيه'], true),
('Luxury Bus', 'حافلة فاخرة', 'Full-size luxury bus for large groups with premium amenities and experienced drivers.', 'حافلة فاخرة كاملة الحجم للمجموعات الكبيرة مع وسائل راحة مميزة وسائقين ذوي خبرة.', 'bus', 45, 3000.00, 8000.00, ARRAY['Air Conditioning', 'WiFi', 'Restroom', 'Prayer area', 'Refreshments'], ARRAY['تكييف هواء', 'واي فاي', 'دورة مياه', 'مصلى', 'مرطبات'], false)
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (name_en, name_ar, content_en, content_ar, rating, location, is_featured) VALUES
('Ahmed Hassan', 'أحمد حسن', 'An incredible experience from start to finish. The team took care of every detail, allowing us to focus entirely on our spiritual journey. Highly recommended!', 'تجربة لا تصدق من البداية إلى النهاية. اهتم الفريق بكل التفاصيل مما سمح لنا بالتركيز كليًا على رحلتنا الروحية. أنصح به بشدة!', 5, 'Egypt', true),
('Fatima Abdullah', 'فا��مة عبدالله', 'The premium package exceeded all our expectations. The hotels were magnificent, and the guides were knowledgeable and caring. A truly blessed journey.', 'تجاوزت الباقة المميزة كل توقعاتنا. كانت الفنادق رائعة والمرشدون على دراية ومهتمون. رحلة مباركة حقًا.', 5, 'UAE', true),
('Muhammad Ali', 'محمد علي', 'Professional service and attention to detail. They made our Hajj journey smooth and memorable. Will definitely book with them again.', 'خدمة احترافية واهتمام بالتفاصيل. جعلوا رحلة حجنا سلسة ولا تُنسى. سنحجز معهم مرة أخرى بالتأكيد.', 5, 'Pakistan', true)
ON CONFLICT DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title_en, title_ar, slug, content_en, content_ar, excerpt_en, excerpt_ar, category, is_published, published_at) VALUES
('Essential Umrah Guide for First-Timers', 'دليل العمرة الأساسي للمرة الأولى', 'essential-umrah-guide', 'Planning your first Umrah can be both exciting and overwhelming. This comprehensive guide covers everything you need to know...', 'التخطيط لعمرتك الأولى يمكن أن يكون مثيرًا ومربكًا في نفس الوقت. يغطي هذا الدليل الشامل كل ما تحتاج معرفته...', 'A complete guide for those performing Umrah for the first time.', 'دليل كامل لمن يؤدون العمرة لأول مرة.', 'Guides', true, NOW()),
('The Spiritual Benefits of Hajj', 'الفوائد الروحية للحج', 'spiritual-benefits-hajj', 'Hajj is not just a physical journey but a profound spiritual transformation. Discover the deep spiritual benefits...', 'الحج ليس مجرد رحلة جسدية بل تحول روحي عميق. اكتشف الفوائد الروحية العميقة...', 'Explore the profound spiritual transformation that Hajj brings.', 'استكشف التحول الروحي العميق الذي يجلبه الحج.', 'Spirituality', true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_featured ON hotels(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_packages_type ON tour_packages(package_type);
CREATE INDEX IF NOT EXISTS idx_packages_featured ON tour_packages(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
