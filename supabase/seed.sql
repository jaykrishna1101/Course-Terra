-- First, you must sign up via the app using jkkhond@gmail.com to create the admin profile.
-- After the admin profile is created (which happens automatically via trigger), 
-- you can run this script to seed the initial Mathematics course.

DO $$
DECLARE
    admin_id UUID;
    course_id UUID;
    mod1_id UUID;
    mod2_id UUID;
    mod3_id UUID;
    mod4_id UUID;
    mod5_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_id FROM profiles WHERE email = 'jkkhond@gmail.com' LIMIT 1;
    
    IF admin_id IS NULL THEN
        RAISE EXCEPTION 'Admin profile not found. Please sign up with jkkhond@gmail.com first.';
    END IF;

    -- Create Course
    INSERT INTO courses (title, slug, short_description, description, instructor_name, category, level, price_paise, status, created_by)
    VALUES (
        'Mathematics',
        'mathematics',
        'Build a strong foundation in mathematics through clear explanations, structured lessons, examples, and practice-oriented learning.',
        'Mathematics is a structured foundation course designed to strengthen core mathematical concepts through simple explanations, worked examples, visual learning, and practice. The course starts with fundamental concepts and progressively moves toward algebra, geometry, trigonometry, and introductory problem-solving techniques. Each topic is organized into short lessons so learners can study at their own pace.',
        'Course Terra Academy',
        'Mathematics',
        'Beginner to Intermediate',
        1000, -- ₹10 = 1000 paise
        'published',
        admin_id
    ) RETURNING id INTO course_id;

    -- Create Modules
    INSERT INTO course_modules (course_id, title, sort_order) VALUES (course_id, 'Mathematical Foundations', 1) RETURNING id INTO mod1_id;
    INSERT INTO course_modules (course_id, title, sort_order) VALUES (course_id, 'Algebra', 2) RETURNING id INTO mod2_id;
    INSERT INTO course_modules (course_id, title, sort_order) VALUES (course_id, 'Geometry', 3) RETURNING id INTO mod3_id;
    INSERT INTO course_modules (course_id, title, sort_order) VALUES (course_id, 'Trigonometry', 4) RETURNING id INTO mod4_id;
    INSERT INTO course_modules (course_id, title, sort_order) VALUES (course_id, 'Problem Solving', 5) RETURNING id INTO mod5_id;

    -- Seed Module 1 Lessons
    INSERT INTO lessons (module_id, title, lesson_type, content, sort_order, is_preview) VALUES 
    (mod1_id, 'Introduction to Mathematics', 'text', 'Welcome to the Mathematics course. In this lesson, we introduce basic concepts.', 1, true),
    (mod1_id, 'Number Systems', 'text', 'Detailed explanation of number systems...', 2, false),
    (mod1_id, 'Fractions, Decimals and Percentages', 'text', 'Understanding fractions, decimals, and percentages...', 3, false),
    (mod1_id, 'Ratios and Proportions', 'text', 'Basics of ratios and proportions...', 4, false);

    -- Seed Module 2 Lessons
    INSERT INTO lessons (module_id, title, lesson_type, sort_order, is_preview) VALUES 
    (mod2_id, 'Algebraic Expressions', 'text', 1, false),
    (mod2_id, 'Linear Equations', 'text', 2, false),
    (mod2_id, 'Polynomials', 'text', 3, false),
    (mod2_id, 'Quadratic Equations', 'text', 4, false),
    (mod2_id, 'Introduction to Sequences', 'text', 5, false);

    -- Seed Module 3 Lessons
    INSERT INTO lessons (module_id, title, lesson_type, sort_order, is_preview) VALUES 
    (mod3_id, 'Basic Geometric Concepts', 'text', 1, false),
    (mod3_id, 'Lines and Angles', 'text', 2, false),
    (mod3_id, 'Triangles', 'text', 3, false),
    (mod3_id, 'Quadrilaterals and Polygons', 'text', 4, false),
    (mod3_id, 'Circles', 'text', 5, false),
    (mod3_id, 'Area and Perimeter', 'text', 6, false);

    -- Seed Module 4 Lessons
    INSERT INTO lessons (module_id, title, lesson_type, sort_order, is_preview) VALUES 
    (mod4_id, 'Introduction to Trigonometry', 'text', 1, false),
    (mod4_id, 'Trigonometric Ratios', 'text', 2, false),
    (mod4_id, 'Standard Angles', 'text', 3, false),
    (mod4_id, 'Trigonometric Identities', 'text', 4, false),
    (mod4_id, 'Applications of Trigonometry', 'text', 5, false);

    -- Seed Module 5 Lessons
    INSERT INTO lessons (module_id, title, lesson_type, sort_order, is_preview) VALUES 
    (mod5_id, 'Mathematical Problem-Solving Approach', 'text', 1, false),
    (mod5_id, 'Word Problems', 'text', 2, false),
    (mod5_id, 'Pattern Recognition', 'text', 3, false),
    (mod5_id, 'Logical Mathematical Reasoning', 'text', 4, false),
    (mod5_id, 'Mixed Practice', 'text', 5, false);

END $$;
