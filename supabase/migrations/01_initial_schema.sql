-- Supabase Schema for Course Terra

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT,
    instructor_name TEXT NOT NULL,
    category TEXT,
    level TEXT,
    price_paise INTEGER NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'INR' NOT NULL,
    thumbnail_path TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- 3. Course Modules
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Lessons
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    lesson_type TEXT NOT NULL CHECK (lesson_type IN ('text', 'video', 'pdf', 'image', 'download', 'external')),
    content TEXT, -- Markdown or rich text for text lessons
    storage_path TEXT, -- For pdf/image/video/download
    external_url TEXT, -- For external videos
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_preview BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Purchases
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE RESTRICT NOT NULL,
    amount_paise INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
    payment_provider TEXT,
    provider_order_id TEXT,
    provider_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE RESTRICT NOT NULL,
    purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- 7. Payment Events (for webhook idempotency)
CREATE TABLE payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL,
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    payload JSONB,
    processed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON course_modules FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'full_name',
      CASE WHEN new.email = 'jkkhond@gmail.com' THEN 'admin' ELSE 'user' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Row Level Security (RLS)

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published courses are viewable by everyone." ON courses FOR SELECT USING (status = 'published' OR (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')));
CREATE POLICY "Admins can insert courses." ON courses FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can update courses." ON courses FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can delete courses." ON courses FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Course Modules
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules of published courses are viewable by everyone." ON course_modules FOR SELECT USING (
    course_id IN (SELECT id FROM courses WHERE status = 'published') 
    OR (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
);
CREATE POLICY "Admins can insert modules." ON course_modules FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can update modules." ON course_modules FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can delete modules." ON course_modules FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Lessons
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
-- For lessons, list view (metadata) is public for published courses.
CREATE POLICY "Lessons of published courses are viewable by everyone." ON lessons FOR SELECT USING (
    module_id IN (SELECT id FROM course_modules WHERE course_id IN (SELECT id FROM courses WHERE status = 'published'))
    OR (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
);
CREATE POLICY "Admins can insert lessons." ON lessons FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can update lessons." ON lessons FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can delete lessons." ON lessons FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own purchases." ON purchases FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Users can insert their own purchases." ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own enrollments." ON enrollments FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
-- Enrollments are created by backend/service role, so no INSERT/UPDATE/DELETE for users.

-- Payment Events
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
-- No policies, handled by backend via service role

-- Storage (Requires Storage to be setup)
-- We assume bucket 'course-thumbnails' and 'course-content' exist. 
-- Policies for storage are usually handled in supabase dashboard or via separate script.
