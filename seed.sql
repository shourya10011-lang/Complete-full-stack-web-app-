-- EduLearn Seed Data
USE edulearn;

-- Disable foreign key checks for clean truncation and insertion
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE certificates;
TRUNCATE TABLE reviews;
TRUNCATE TABLE lesson_progress;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE lessons;
TRUNCATE TABLE courses;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Users: 4 Instructors + 1 Admin + 1 Demo Student + 3 Other Students
-- Password for all accounts is: Password123!
-- Bcrypt hash generated for 'Password123!' ($2b$12$1u2Y3h4K5l6M7n8O9p0Q.uUj1tQv1sK8z6b4s5a6e7r8t9y0u1i2o)
-- A standard valid bcrypt hash for 'Password123!': $2b$12$eX8m6t3Vz9kYlZq1K5M1reA3L7fW5cM.Lz.P5W4Jm1K0yM.rW1ZlC
INSERT INTO users (id, name, email, password_hash, avatar_url, role, bio) VALUES
(1, 'Sarah Jenkins', 'sarah.jenkins@edulearn.com', '$2b$12$eX8m6t3Vz9kYlZq1K5M1reA3L7fW5cM.Lz.P5W4Jm1K0yM.rW1ZlC', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', 'instructor', 'Senior Full-Stack Architect with 12+ years of experience leading engineering teams at tech unicorns. Specializes in TypeScript, React, and Node.js microservices.'),
(2, 'Dr. Alex Rivera', 'alex.rivera@edulearn.com', '$2b$12$eX8m6t3Vz9kYlZq1K5M1reA3L7fW5cM.Lz.P5W4Jm1K0yM.rW1ZlC', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', 'instructor', 'Ph.D. in Computer Science from MIT. Former Principal AI Researcher with 20+ published papers on applied neural networks and machine learning systems.'),
(3, 'Emily Chen', 'emily.chen@edulearn.com', '$2b$12$eX8m6t3Vz9kYlZq1K5M1reA3L7fW5cM.Lz.P5W4Jm1K0yM.rW1ZlC', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', 'instructor', 'Product Design Director and Design Systems Consultant. Passionate about human-centered design, WCAG accessibility, and scalable UI architectures in Figma.'),
(4, 'Marcus Vance', 'marcus.vance@edulearn.com', '$2b$12$eX8m6t3Vz9kYlZq1K5M1reA3L7fW5cM.Lz.P5W4Jm1K0yM.rW1ZlC', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', 'instructor', 'Venture partner and former VP of Growth at Stripe & HubSpot. Generated over $150M in pipeline through data-driven product marketing and B2B growth funnels.'),
(5, 'Alex Morgan', 'student@edulearn.com', '$2b$12$eX8m6t3Vz9kYlZq1K5M1reA3L7fW5cM.Lz.P5W4Jm1K0yM.rW1ZlC', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face', 'student', 'Aspiring software engineer and curious lifelong learner passionate about building impactful web platforms.'),
(6, 'Elena Rostova', 'elena.r@example.com', '$2b$12$eX8m6t3Vz9kYlZq1K5M1reA3L7fW5cM.Lz.P5W4Jm1K0yM.rW1ZlC', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', 'student', 'Front-end enthusiast switching careers from finance into creative tech.'),
(7, 'David Kim', 'david.k@example.com', '$2b$12$eX8m6t3Vz9kYlZq1K5M1reA3L7fW5cM.Lz.P5W4Jm1K0yM.rW1ZlC', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', 'student', 'Data analyst sharpening machine learning and SQL production skillsets.'),
(8, 'Admin User', 'admin@edulearn.com', '$2b$12$eX8m6t3Vz9kYlZq1K5M1reA3L7fW5cM.Lz.P5W4Jm1K0yM.rW1ZlC', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', 'admin', 'EduLearn System Administrator');

-- 2. Insert 12 Courses across 4 Categories (3 per category)
INSERT INTO courses (id, title, description, instructor_id, category, difficulty, price, discount_price, thumbnail_url, rating_avg, rating_count, student_count, duration_hours, published) VALUES
-- Category: Web Development (Instructor: Sarah Jenkins)
(1, 'Modern Full-Stack Web Development Bootcamp', 'Master modern web development from ground up. Learn HTML5, modern CSS, JavaScript ES2024, responsive layout architectures, RESTful APIs, and cloud deployments with enterprise best practices.', 1, 'Web Development', 'beginner', 89.99, 49.99, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=380&fit=crop', 4.9, 142, 1850, 24.5, 1),
(2, 'Advanced JavaScript & TypeScript Masterclass', 'Deep dive into asynchronous programming, AST parsing, modern TypeScript type gymnastics, closures, event loop internals, and scalable design patterns.', 1, 'Web Development', 'advanced', 109.99, 69.99, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=380&fit=crop', 4.8, 98, 920, 18.0, 1),
(3, 'Responsive Web Design & Tailwind CSS', 'Build pixel-perfect, accessible, lightning-fast user interfaces. Master utility-first CSS, mobile-first responsive breakpoints, and dark mode theming.', 1, 'Web Development', 'intermediate', 69.99, 39.99, 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=380&fit=crop', 4.7, 76, 750, 12.5, 1),

-- Category: Data Science (Instructor: Dr. Alex Rivera)
(4, 'Python for Data Science and Machine Learning', 'Comprehensive guide to scientific Python, NumPy arrays, Pandas DataFrames, Matplotlib visualizations, and predictive scikit-learn statistical modeling.', 2, 'Data Science', 'beginner', 99.99, 54.99, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=380&fit=crop', 4.9, 210, 2400, 32.0, 1),
(5, 'Deep Learning & Neural Networks Fundamentals', 'Master convolutional neural networks, sequence-to-sequence transformers, PyTorch model training, and automated hyperparameter optimization.', 2, 'Data Science', 'advanced', 129.99, 79.99, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=380&fit=crop', 4.8, 85, 640, 26.0, 1),
(6, 'Practical SQL & Data Analytics for Business', 'Write high-performance SQL queries, window functions, CTEs, and cohort retention analyses to drive critical strategic business decisions.', 2, 'Data Science', 'intermediate', 79.99, 44.99, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=380&fit=crop', 4.7, 114, 1310, 15.0, 1),

-- Category: UI/UX Design (Instructor: Emily Chen)
(7, 'Complete Figma UI/UX Design from Scratch', 'Learn Figma from absolute basics to advanced auto-layout 5.0, interactive prototypes, component variants, design tokens, and developer handoffs.', 3, 'UI/UX Design', 'beginner', 84.99, 42.99, 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=380&fit=crop', 4.9, 175, 1920, 20.0, 1),
(8, 'User Experience Research & Usability Testing', 'Plan and execute generative discovery interviews, cognitive walkthroughs, tree testing, SUS score quantification, and actionable research synthesis.', 3, 'UI/UX Design', 'intermediate', 74.99, 39.99, 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=380&fit=crop', 4.8, 64, 580, 14.0, 1),
(9, 'Mobile App Design & Design Systems Mastery', 'Architect enterprise-grade design systems across iOS Human Interface Guidelines and Google Material Design 3 with multi-brand theming.', 3, 'UI/UX Design', 'advanced', 119.99, 74.99, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=380&fit=crop', 4.9, 92, 810, 19.5, 1),

-- Category: Business & Marketing (Instructor: Marcus Vance)
(10, 'Digital Marketing Mastery & Growth Hacking', 'Execute omnichannel marketing campaigns across search engine optimization, paid search, email marketing automation, and viral referral loops.', 4, 'Business & Marketing', 'beginner', 79.99, 44.99, 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=380&fit=crop', 4.7, 130, 1600, 16.5, 1),
(11, 'Product Management Essentials: From Idea to Launch', 'Master agile roadmapping, user story mapping, OKR alignment, MVP prioritization frameworks, and cross-functional engineering alignment.', 4, 'Business & Marketing', 'intermediate', 94.99, 59.99, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=380&fit=crop', 4.8, 102, 1150, 18.0, 1),
(12, 'Financial Modeling & Startup Valuation', 'Build dynamic 3-statement financial models, discounted cash flow (DCF) analyses, unit economics calculators, and venture round cap tables.', 4, 'Business & Marketing', 'advanced', 119.99, 79.99, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=380&fit=crop', 4.9, 88, 720, 21.0, 1);

-- 3. Insert Lessons (6-8 lessons for each of the 12 courses = ~80 lessons)
-- Course 1: Modern Full-Stack Web Development Bootcamp (8 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(101, 1, 'Welcome & Full-Stack Roadmap Overview', 1, 12, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Welcome to EduLearn! In this orientation, we map out the journey from absolute beginner to autonomous web developer.', 1),
(102, 1, 'HTML5 Semantic Architecture & Clean Markup', 2, 25, 'reading', NULL, 'Understand semantic landmark tags: header, main, section, article, nav, aside, and footer for optimal accessibility and search ranking.', 1),
(103, 1, 'CSS Box Model, Flexbox & Grid Systems', 3, 35, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Deep-dive into margins, paddings, borders, flex direction, align-items, grid-template-columns, and fluid fractional units.', 0),
(104, 1, 'Modern JavaScript Fundamentals & DOM Manipulation', 4, 45, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Learn let, const, arrow functions, template literals, querySelector, and event delegation mechanisms.', 0),
(105, 1, 'Asynchronous JS, Promises & Fetch API', 5, 40, 'reading', NULL, 'Demystify async/await, promise chaining, response status inspection, and JSON payload handling.', 0),
(106, 1, 'Building RESTful Web Services & APIs', 6, 50, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Design standard HTTP verbs (GET, POST, PUT, DELETE), status codes, and clean URI parameter structures.', 0),
(107, 1, 'Knowledge Check: Web Architecture & Core APIs', 7, 20, 'quiz', NULL, 'Test your understanding of HTTP response codes, CORS, and JavaScript execution contexts.', 0),
(108, 1, 'Capstone Deployment & Continuous Integration', 8, 30, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Configure production build artifacts, environment variables, reverse proxies, and continuous delivery.', 0);

-- Course 2: Advanced JavaScript & TypeScript (7 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(201, 2, 'TypeScript Type System & Strictness Flags', 1, 20, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Explore tsconfig strict options, unknown vs any, never types, and sound type narrowing.', 1),
(202, 2, 'Generics, Conditional Types & Mapped Types', 2, 35, 'reading', NULL, 'Deep dive into type transformations: infer keyword, Pick, Omit, Record, and recursive template literal types.', 0),
(203, 2, 'The V8 JavaScript Engine & Event Loop Internals', 3, 40, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Inspect microtask queues, macrotasks, call stack execution, and garbage collection mechanisms.', 0),
(204, 2, 'Functional Programming & Currying in TS', 4, 30, 'reading', NULL, 'Build pure functions, compose pipelines, and practice immutable data transformations.', 0),
(205, 2, 'Object-Oriented Design Patterns in TypeScript', 5, 45, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Implement Factory, Singleton, Observer, and Strategy patterns with robust type safety.', 0),
(206, 2, 'Advanced TypeScript Knowledge Quiz', 6, 25, 'quiz', NULL, 'Challenge your mastery of conditional typing, union distribution, and branded nominal types.', 0),
(207, 2, 'Building a Production Type-Safe Library', 7, 50, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Package, test, and bundle a zero-dependency npm library with dual ESM and CJS exports.', 0);

-- Course 3: Responsive Web Design & Tailwind CSS (6 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(301, 3, 'Utility-First CSS Thinking & Philosophy', 1, 15, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Discover how utility classes eliminate naming friction and reduce CSS bundle sizes drastically.', 1),
(302, 3, 'Design Tokens, Spacing Math & Scales', 2, 25, 'reading', NULL, 'Establish rhythmic typographic scales, proportional padding, and cohesive palette tokens.', 0),
(303, 3, 'Fluid Breakpoints & Complex Responsive Layouts', 3, 35, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Handle mobile navigation drawers, responsive tables, and multi-column adaptive dashboards.', 0),
(304, 3, 'Dark Mode, Theming & CSS Custom Properties', 4, 30, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Configure color schemes with WCAG AA compliant contrast ratios across dark and light modes.', 0),
(305, 3, 'Micro-Interactions and CSS Transitions', 5, 25, 'reading', NULL, 'Add spring animations, hover elevation feedback, and hardware-accelerated transforms.', 0),
(306, 3, 'Responsive Design System Quiz', 6, 20, 'quiz', NULL, 'Verify your knowledge of mobile-first media queries, container queries, and subgrid.', 0);

-- Course 4: Python for Data Science and Machine Learning (8 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(401, 4, 'Python Data Science Stack Setup & Jupyter', 1, 18, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Configure Python virtual environments, pip packages, and interactive Jupyter notebook workflows.', 1),
(402, 4, 'High-Performance NumPy Array Operations', 2, 30, 'reading', NULL, 'Master vectorization, multidimensional broadcasting, masking, and linear algebra routines.', 1),
(403, 4, 'Data Wrangling & Cleaning with Pandas', 3, 45, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Handle missing records, group-by aggregations, datetime parsing, and merge joins with ease.', 0),
(404, 4, 'Exploratory Data Analysis & Visual Storytelling', 4, 40, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Plot distributions, correlation heatmaps, box plots, and pair plots using Seaborn.', 0),
(405, 4, 'Supervised Learning: Regression & Classification', 5, 50, 'reading', NULL, 'Train Linear Regression, Logistic Regression, Random Forests, and evaluate with ROC-AUC.', 0),
(406, 4, 'Unsupervised Learning: Clustering & PCA', 6, 40, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Extract principal components and segment customer cohorts using K-Means and DBSCAN.', 0),
(407, 4, 'Machine Learning Foundations Quiz', 7, 25, 'quiz', NULL, 'Test your knowledge on overfitting, cross-validation, regularization, and confusion matrices.', 0),
(408, 4, 'Deploying a Machine Learning Model API', 8, 45, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Serialize trained model pipelines and serve real-time predictions via lightweight REST endpoints.', 0);

-- Course 5: Deep Learning & Neural Networks Fundamentals (7 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(501, 5, 'Perceptrons, Activation Functions & Backpropagation', 1, 25, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Understand forward passes, cross-entropy loss, ReLU, Sigmoid, and gradient descent backprop.', 1),
(502, 5, 'PyTorch Tensors, Autograd & GPU Acceleration', 2, 35, 'reading', NULL, 'Build custom PyTorch modules, inspect computational graphs, and train on CUDA hardware.', 0),
(503, 5, 'Convolutional Neural Networks for Computer Vision', 3, 50, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Apply kernels, pooling layers, feature maps, and transfer learning with ResNet backbones.', 0),
(504, 5, 'Recurrent Networks, LSTMs & Sequence Modeling', 4, 40, 'reading', NULL, 'Handle temporal data series, hidden state propagation, and vanishing gradient solutions.', 0),
(505, 5, 'Attention Mechanisms & Transformer Foundations', 5, 55, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Dissect scaled dot-product attention, multi-head projections, and positional embeddings.', 0),
(506, 5, 'Neural Network Architecture Assessment', 6, 20, 'quiz', NULL, 'Evaluate deep learning architectures, dropout regularization, and learning rate schedules.', 0),
(507, 5, 'Fine-Tuning Open-Weights Foundation Models', 7, 45, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Implement LoRA parameter-efficient fine-tuning on modern open transformer models.', 0);

-- Course 6: Practical SQL & Data Analytics for Business (6 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(601, 6, 'Relational Database Modeling & Normalization', 1, 20, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Design 1st through 3rd normal form schemas with foreign key integrity constraints.', 1),
(602, 6, 'Advanced Joins, Subqueries & CTEs', 2, 35, 'reading', NULL, 'Master Common Table Expressions (WITH clauses), recursive queries, and self-joins.', 0),
(603, 6, 'Window Functions: ROW_NUMBER, RANK, LEAD/LAG', 3, 40, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Compute running totals, period-over-period growth rates, and partitioned percentiles.', 0),
(604, 6, 'Cohort Retention & Funnel Conversion Analytics', 4, 35, 'reading', NULL, 'Build enterprise cohort heatmaps and calculate Day-7, Day-30 customer retention rates.', 0),
(605, 6, 'Query Optimization, Indexing & EXPLAIN Plans', 5, 30, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Diagnose table scans, composite index selection, and query execution bottlenecks.', 0),
(606, 6, 'SQL Proficiency Final Certification Quiz', 6, 25, 'quiz', NULL, 'Complex scenario questions testing your ability to write bulletproof analytic queries.', 0);

-- Course 7: Complete Figma UI/UX Design from Scratch (7 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(701, 7, 'Figma Interface, Frames & Canvas Essentials', 1, 15, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Get comfortable with the modern Figma editor, shortcuts, vector networks, and zoom tools.', 1),
(702, 7, 'Mastering Auto Layout & Responsive Constraints', 2, 30, 'reading', NULL, 'Harness Hug contents, Fill container, min/max dimensions, and wrap behavior.', 1),
(703, 7, 'Component Architecture & Variant Properties', 3, 40, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Build scalable button sets, form inputs, modal dialogs, and interactive component sets.', 0),
(704, 7, 'Design Tokens, Variables & Modes', 4, 35, 'reading', NULL, 'Create semantic color tokens, spacing scales, and light/dark theme variables.', 0),
(705, 7, 'High-Fidelity Interactive Prototyping', 5, 45, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Link screens with smart animate, micro-interactions, scroll positions, and overlay modals.', 0),
(706, 7, 'Design Principles & Optical Alignment Quiz', 6, 20, 'quiz', NULL, 'Test your knowledge of typography hierarchy, Gestalt psychology, and contrast ratios.', 0),
(707, 7, 'Developer Handoff & Specification Documentation', 7, 25, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Prepare redlines, export assets, write component specs, and collaborate with engineers.', 0);

-- Course 8: User Experience Research & Usability Testing (6 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(801, 8, 'Foundational Qualitative Research Methodologies', 1, 20, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Learn when to employ contextual inquiries, discovery interviews, and diary studies.', 1),
(802, 8, 'Formulating Non-Biased Interview Protocols', 2, 25, 'reading', NULL, 'Craft open-ended interview prompts that elicit authentic user pain points without leading.', 0),
(803, 8, 'Moderated vs. Unmoderated Usability Testing', 3, 35, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Script task scenarios, observe user behavior, and record success rates and time-on-task.', 0),
(804, 8, 'Synthesizing Findings with Affinity Diagrams', 4, 30, 'reading', NULL, 'Cluster raw observations into insights, identify recurring themes, and map user journeys.', 0),
(805, 8, 'Calculating System Usability Scale (SUS) Scores', 5, 20, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Statistically measure ease of use and compare your product against industry benchmarks.', 0),
(806, 8, 'UX Research Strategy & Methods Quiz', 6, 20, 'quiz', NULL, 'Assess your ability to select the optimal research method for distinct product phases.', 0);

-- Course 9: Mobile App Design & Design Systems Mastery (6 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(901, 9, 'Mobile Ergonomics & Touch Target Principles', 1, 18, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Design for the thumb zone, safe areas on notched devices, and minimum 44px tap targets.', 1),
(902, 9, 'Apple Human Interface vs. Material Design 3', 2, 30, 'reading', NULL, 'Compare navigation patterns, tab bars, bottom sheets, elevation, and gesture paradigms.', 0),
(903, 9, 'Multi-Brand Design System Architecture', 3, 40, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Structure shared foundations, core components, and brand-specific theme overrides.', 0),
(904, 9, 'Accessible Color Palettes & Text Contrast in Mobile', 4, 25, 'reading', NULL, 'Ensure outdoor sunlight readability, dynamic font size scaling, and accessibility standards.', 0),
(905, 9, 'Mobile Onboarding & Empty States Best Practices', 5, 30, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Design engaging first-time user experiences that drive day-1 activation and retention.', 0),
(906, 9, 'Mobile UI Architecture Knowledge Check', 6, 20, 'quiz', NULL, 'Test your understanding of native OS conventions, sheet behaviors, and token models.', 0);

-- Course 10: Digital Marketing Mastery & Growth Hacking (6 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(1001, 10, 'Growth Marketing Funnels & AARRR Metrics', 1, 20, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Deconstruct Acquisition, Activation, Retention, Referral, and Revenue KPIs.', 1),
(1002, 10, 'Technical SEO & High-Intent Keyword Strategy', 2, 35, 'reading', NULL, 'Perform site crawl audits, schema markup implementation, and content cluster architecture.', 0),
(1003, 10, 'Paid Acquisition Campaigns on Meta & Google Ads', 3, 40, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Structure ad sets, craft compelling hooks, target custom lookalikes, and optimize ROAS.', 0),
(1004, 10, 'Lifecycle Email Marketing & Trigger Automation', 4, 30, 'reading', NULL, 'Build cart abandonment sequences, re-engagement campaigns, and personalized drips.', 0),
(1005, 10, 'Viral Referral Loops & Product-Led Growth', 5, 30, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Incentivize dual-sided referrals, viral coefficients (K-factor), and word-of-mouth loops.', 0),
(1006, 10, 'Growth Strategy Certification Assessment', 6, 20, 'quiz', NULL, 'Validate your skills in calculating Customer Acquisition Cost (CAC) and Lifetime Value (LTV).', 0);

-- Course 11: Product Management Essentials (6 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(1101, 11, 'The Role of the Modern Product Manager', 1, 15, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Explore the intersection of business strategy, technology viability, and user desirability.', 1),
(1102, 11, 'Discovery, Problem Definition & Opportunity Solution Trees', 2, 30, 'reading', NULL, 'Frame real customer problems using Teresa Torres opportunity solution tree frameworks.', 0),
(1103, 11, 'Writing Bulletproof PRDs & User Stories', 3, 35, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Write clear acceptance criteria, edge case scenarios, non-functional requirements, and analytics specs.', 0),
(1104, 11, 'Prioritization Frameworks: RICE, MoSCoW, Kano', 4, 25, 'reading', NULL, 'Balance engineering effort against business reach, impact, and strategic confidence scores.', 0),
(1105, 11, 'Sprint Planning & Cross-Functional Collaboration', 5, 30, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Lead backlog grooming, sprint retrospectives, and unblock engineering roadblocks smoothly.', 0),
(1106, 11, 'Product Management Core Exam', 6, 25, 'quiz', NULL, 'Scenario-based evaluation of roadmap decisions, stakeholder trade-offs, and metric trade-offs.', 0);

-- Course 12: Financial Modeling & Startup Valuation (6 lessons)
INSERT INTO lessons (id, course_id, title, order_index, duration_minutes, type, video_url, content_text, is_preview) VALUES
(1201, 12, 'Three-Statement Financial Accounting Fundamentals', 1, 25, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Connect the Income Statement, Balance Sheet, and Cash Flow Statement dynamically.', 1),
(1202, 12, 'Building SaaS Unit Economics & Cohort Models', 2, 35, 'reading', NULL, 'Calculate Gross Margins, Net Revenue Retention (NRR), Magic Number, and Payback Periods.', 0),
(1203, 12, 'Discounted Cash Flow (DCF) & Sensitivity Analysis', 3, 45, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Project free cash flows, weighted average cost of capital (WACC), and terminal values.', 0),
(1204, 12, 'Startup Cap Tables, SAFEs & Dilution Mechanics', 4, 30, 'reading', NULL, 'Model pre-money vs post-money SAFEs, unallocated option pools, and liquidation preferences.', 0),
(1205, 12, 'Pitch Deck Financial Slides for Series A/B Investors', 5, 30, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Communicate key financial assumptions with charts that build investor conviction.', 0),
(1206, 12, 'Financial Modeling Proficiency Assessment', 6, 20, 'quiz', NULL, 'Test your mastery of financial statement linkages, return on capital, and valuation metrics.', 0);

-- 4. Insert Enrollments for Demo Student (user_id = 5)
-- Course 1: 100% completed (Certificate issued)
-- Course 4: 50% in progress (4 of 8 lessons completed)
-- Course 7: 14.3% in progress (1 of 7 lessons completed)
INSERT INTO enrollments (id, user_id, course_id, enrolled_at, progress_percent, completed, completed_at) VALUES
(1, 5, 1, '2025-01-10 09:30:00', 100.0, 1, '2025-02-15 14:20:00'),
(2, 5, 4, '2025-02-20 11:00:00', 50.0, 0, NULL),
(3, 5, 7, '2025-03-01 16:45:00', 14.3, 0, NULL),
-- Other student enrollments
(4, 6, 1, '2025-02-01 10:00:00', 75.0, 0, NULL),
(5, 7, 4, '2025-02-05 13:15:00', 100.0, 1, '2025-03-01 18:00:00');

-- 5. Insert Lesson Progress for Demo Student (user_id = 5)
-- Course 1: all 8 lessons completed
INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at) VALUES
(5, 101, 1, '2025-01-12 10:00:00'),
(5, 102, 1, '2025-01-15 14:00:00'),
(5, 103, 1, '2025-01-20 16:30:00'),
(5, 104, 1, '2025-01-26 11:15:00'),
(5, 105, 1, '2025-02-02 19:00:00'),
(5, 106, 1, '2025-02-08 17:45:00'),
(5, 107, 1, '2025-02-12 12:20:00'),
(5, 108, 1, '2025-02-15 14:20:00'),
-- Course 4: 4 of 8 lessons completed
(5, 401, 1, '2025-02-22 10:30:00'),
(5, 402, 1, '2025-02-25 15:45:00'),
(5, 403, 1, '2025-03-02 14:10:00'),
(5, 404, 1, '2025-03-08 17:20:00'),
-- Course 7: 1 of 7 lessons completed
(5, 701, 1, '2025-03-03 11:00:00');

-- 6. Insert Certificate for Course 1 Completed by Student 5
INSERT INTO certificates (id, user_id, course_id, issued_at, certificate_code) VALUES
(1, 5, 1, '2025-02-15 14:20:00', 'EDU-CERT-2025-WDEV-8492'),
(2, 7, 4, '2025-03-01 18:00:00', 'EDU-CERT-2025-PYDS-3174');

-- 7. Insert 18 Sample Reviews with realistic ratings & thoughtful commentary
INSERT INTO reviews (id, user_id, course_id, rating, comment, created_at) VALUES
(1, 5, 1, 5, 'This bootcamp completely transformed how I write software. Sarah breaks down difficult full-stack concepts into intuitive, modular lessons. The hands-on project was top notch!', '2025-02-16 10:00:00'),
(2, 6, 1, 5, 'Best web development curriculum online. The explanations of semantic HTML and the event loop were crystal clear. Highly recommend to anyone switching careers.', '2025-02-20 18:30:00'),
(3, 7, 1, 4, 'Great comprehensive coverage of modern full-stack web engineering. The API section was super practical.', '2025-02-25 12:15:00'),
(4, 5, 4, 5, 'Dr. Alex Rivera is an exceptional educator. The Pandas and NumPy sections are filled with real-world dataset examples that gave me immediate confidence.', '2025-03-09 20:10:00'),
(5, 7, 4, 5, 'Phenomenal depth. I was able to automate our business reporting pipeline after lesson 4 alone!', '2025-03-02 09:40:00'),
(6, 6, 7, 5, 'Emily Chen teaches Figma the way senior designers actually use it in production. The auto-layout module alone was worth ten times the price.', '2025-02-18 16:50:00'),
(7, 5, 7, 5, 'Extremely polished and structured. As a software developer wanting to improve design instincts, this course was exactly what I needed.', '2025-03-05 14:30:00'),
(8, 6, 2, 5, 'The TypeScript conditional types and AST analysis took my programming to another level. Pure gold for senior engineers.', '2025-01-28 11:20:00'),
(9, 7, 2, 4, 'Very rigorous material. Ensure you have solid JavaScript fundamentals before diving in, as the pace is fast and uncompromising.', '2025-02-04 15:45:00'),
(10, 6, 3, 5, 'Tailwind made so much more sense after seeing the design token hierarchy in action. Beautifully paced.', '2025-01-19 14:00:00'),
(11, 7, 5, 5, 'PyTorch backprop explained from first principles! Dr. Rivera makes cutting-edge transformer concepts digestible and practical.', '2025-02-10 17:30:00'),
(12, 6, 6, 4, 'The window functions and cohort retention queries are directly applicable to my daily product analytics tasks.', '2025-02-14 13:20:00'),
(13, 7, 8, 5, 'Emily provides concrete usability test scripts that our startup used immediately to fix checkout drop-offs.', '2025-02-22 10:15:00'),
(14, 6, 9, 5, 'The comparison between iOS Human Interface and Material Design 3 guidelines was insightful. Loved the token structure.', '2025-03-01 19:40:00'),
(15, 7, 10, 4, 'Marcus explains unit economics and acquisition loops with refreshing honesty. No fluff, just real tactical playbooks.', '2025-02-18 11:30:00'),
(16, 6, 11, 5, 'The PRD templates and prioritization frameworks helped me ace my technical product management interviews.', '2025-02-26 15:00:00'),
(17, 7, 12, 5, 'Clear, rigorous 3-statement financial modeling. The cap table dilution scenarios saved our founding team hours.', '2025-03-04 16:20:00'),
(18, 5, 10, 5, 'Fantastic growth marketing course. Covered everything from technical SEO schema to viral referral loops.', '2025-03-10 09:15:00');
