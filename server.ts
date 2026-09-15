import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { quizzesData } from "./quizzes-data.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Detect frontend directory for development or standalone container deployment
const frontendDir = fs.existsSync(path.join(process.cwd(), "frontend"))
  ? path.join(process.cwd(), "frontend")
  : fs.existsSync(path.join(__dirname, "frontend"))
    ? path.join(__dirname, "frontend")
    : path.join(process.cwd(), "dist");

app.use(express.static(frontendDir));
app.use("/frontend", express.static(frontendDir));

// --- In-Memory Seed Data matching seed.sql & schema.sql ---
let users = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "student@edulearn.com",
    password_hash: "Password123!",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
    role: "student",
    bio: "Passionate software engineering student passionate about full-stack web architectures and cloud microservices.",
    created_at: "2025-01-10T08:00:00Z"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    email: "sarah.jenkins@edulearn.com",
    password_hash: "Password123!",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    role: "instructor",
    bio: "Principal Frontend Architect with 12+ years of experience shipping production web applications at high-scale tech firms.",
    created_at: "2024-11-15T09:30:00Z"
  },
  {
    id: 3,
    name: "Marcus Rivera",
    email: "marcus.rivera@edulearn.com",
    password_hash: "Password123!",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    role: "instructor",
    bio: "Staff AI Researcher and Data Science Lead specializing in transformer architectures and applied deep learning.",
    created_at: "2024-10-01T10:00:00Z"
  },
  {
    id: 4,
    name: "Emily Chen",
    email: "emily.chen@edulearn.com",
    password_hash: "Password123!",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    role: "instructor",
    bio: "VP of Product Design, Figma community advocate, and specialist in design tokens and scalable multi-brand component libraries.",
    created_at: "2024-12-05T14:15:00Z"
  },
  {
    id: 5,
    name: "System Admin",
    email: "admin@edulearn.com",
    password_hash: "Password123!",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    role: "admin",
    bio: "Platform Administrator maintaining system reliability, security, and curriculum quality assurance.",
    created_at: "2024-09-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Emma Watson, ESL",
    email: "emma.watson@edulearn.com",
    password_hash: "Password123!",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    role: "instructor",
    bio: "Cambridge CELTA-certified English Linguist and Pronunciation Specialist. Passionate about empowering non-native speakers with real-world conversational fluency through curated YouTube video lectures.",
    created_at: "2025-01-01T08:00:00Z"
  }
];

let courses = [
  {
    id: 1,
    title: "Full-Stack Web Development: Zero to Production",
    description: "Master modern web engineering from clean semantic HTML, CSS, and modern JavaScript to responsive layouts, REST API integrations, and robust application architecture.",
    instructor_id: 2,
    category: "Web Development",
    difficulty: "beginner",
    price: 89.99,
    discount_price: 49.99,
    thumbnail_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=380&fit=crop",
    rating_avg: 4.85,
    rating_count: 142,
    student_count: 1250,
    duration_hours: 18.5,
    published: true,
    created_at: "2025-01-05T10:00:00Z"
  },
  {
    id: 2,
    title: "Python Data Science and Machine Learning Masterclass",
    description: "Build robust machine learning models using Python, Pandas, NumPy, and Scikit-Learn. Learn statistical inference, feature engineering, and neural network foundations.",
    instructor_id: 3,
    category: "Data Science",
    difficulty: "intermediate",
    price: 119.99,
    discount_price: 69.99,
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=380&fit=crop",
    rating_avg: 4.92,
    rating_count: 89,
    student_count: 840,
    duration_hours: 24.0,
    published: true,
    created_at: "2025-01-08T11:30:00Z"
  },
  {
    id: 3,
    title: "UI/UX Design Systems: From Wireframe to High-Fidelity",
    description: "Learn professional user interface design, accessibility standards (WCAG 2.1), auto-layout, token-driven typography, and user testing frameworks.",
    instructor_id: 4,
    category: "UI/UX Design",
    difficulty: "beginner",
    price: 79.99,
    discount_price: 39.99,
    thumbnail_url: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=600&h=380&fit=crop",
    rating_avg: 4.78,
    rating_count: 65,
    student_count: 610,
    duration_hours: 14.0,
    published: true,
    created_at: "2025-01-12T09:00:00Z"
  },
  {
    id: 4,
    title: "Advanced SQL & Database Architecture for Engineers",
    description: "Deep dive into relational database design, query optimization, indexing strategies (B-Trees, Composite), ACID transactions, and scaling high-throughput MySQL workloads.",
    instructor_id: 3,
    category: "Data Science",
    difficulty: "advanced",
    price: 99.99,
    discount_price: null,
    thumbnail_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=380&fit=crop",
    rating_avg: 4.90,
    rating_count: 38,
    student_count: 420,
    duration_hours: 16.0,
    published: true,
    created_at: "2025-01-15T15:00:00Z"
  },
  {
    id: 5,
    title: "Modern JavaScript & TypeScript Architecture",
    description: "Go beyond basic scripting. Master closures, prototypes, asynchronous event loops, TypeScript generics, decorators, and clean modular software design patterns.",
    instructor_id: 2,
    category: "Web Development",
    difficulty: "intermediate",
    price: 84.99,
    discount_price: 44.99,
    thumbnail_url: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=380&fit=crop",
    rating_avg: 4.88,
    rating_count: 52,
    student_count: 580,
    duration_hours: 15.5,
    published: true,
    created_at: "2025-01-18T13:45:00Z"
  },
  {
    id: 6,
    title: "Product Growth, Analytics & Venture Strategy",
    description: "Discover data-informed product management frameworks. Learn cohort retention analysis, customer acquisition cost (CAC) optimization, viral loops, and pricing models.",
    instructor_id: 4,
    category: "Business & Marketing",
    difficulty: "intermediate",
    price: 94.99,
    discount_price: 54.99,
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=380&fit=crop",
    rating_avg: 4.75,
    rating_count: 31,
    student_count: 330,
    duration_hours: 12.0,
    published: true,
    created_at: "2025-01-20T10:15:00Z"
  },
  {
    id: 7,
    title: "English Fluency & Spoken Communication: Complete YouTube Playlist Masterclass",
    description: "Master everyday conversational English, clear pronunciation, essential grammar, and workplace communication using curated YouTube video lectures, synchronized notes, and interactive knowledge checks.",
    instructor_id: 6,
    category: "English Language",
    difficulty: "beginner",
    price: 69.99,
    discount_price: 0,
    thumbnail_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=380&fit=crop",
    rating_avg: 4.95,
    rating_count: 248,
    student_count: 3120,
    duration_hours: 14.5,
    published: true,
    created_at: "2025-01-22T08:00:00Z",
    youtube_playlist_url: "https://www.youtube.com/playlist?list=PLcetZ6gSk96-9Cg_7lWbF_2u_2r_d6k7A"
  },
  {
    id: 8,
    title: "BBC 6-Minute English: Vocabulary, Idioms & Listening Series",
    description: "Accelerate your listening comprehension, idioms, and natural British & international English vocabulary through the acclaimed BBC English video-audio playlist.",
    instructor_id: 6,
    category: "English Language",
    difficulty: "intermediate",
    price: 49.99,
    discount_price: 0,
    thumbnail_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=380&fit=crop",
    rating_avg: 4.92,
    rating_count: 184,
    student_count: 2210,
    duration_hours: 8.5,
    published: true,
    created_at: "2025-01-24T10:00:00Z",
    youtube_playlist_url: "https://www.youtube.com/playlist?list=PLD6B222E02447DC07"
  }
];

let lessons = [
  // Course 1: Full-Stack Web Development
  { id: 1, course_id: 1, title: "Web Development 2025: Complete Roadmap & Technology Overview (English)", order_index: 1, duration_minutes: 25, type: "video", video_url: "https://www.youtube.com/watch?v=zJSY8tbf_ys", content_text: "Welcome to EduLearn Full-Stack Web Development! In this masterclass lecture, we unpack the modern web architecture stack, HTTP/HTTPS request lifecycles, DNS resolution, and client-server dynamics with Brad Traversy.", is_preview: true },
  { id: 2, course_id: 1, title: "Semantic HTML5 Elements & Modern Document Structure (English)", order_index: 2, duration_minutes: 25, type: "reading", video_url: null, content_text: "Semantic HTML forms the structural foundation of accessible, performant, and search-optimized web applications. Study landmark elements (<main>, <nav>, <section>, <article>, <aside>, <header>, <footer>) and ARIA live regions.\n\n### Key Principles:\n1. Use landmark tags to give screen readers structural navigational boundaries.\n2. Prefer semantic <button> and <a> elements over click-handled <div> tags.\n3. Implement proper heading hierarchies (H1 down to H6) without skipping levels.", is_preview: true },
  { id: 3, course_id: 1, title: "CSS3 Grid, Flexbox & Modern Responsive Layouts (English)", order_index: 3, duration_minutes: 35, type: "video", video_url: "https://www.youtube.com/watch?v=1PnVor36_40", content_text: "Master CSS Grid areas, 2D fractional unit tracks, flexbox axis alignments, and responsive container queries for desktop, tablet, and mobile layouts.", is_preview: false },
  { id: 4, course_id: 1, title: "JavaScript Fundamentals, ES6+ & DOM Engineering (English)", order_index: 4, duration_minutes: 45, type: "video", video_url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", content_text: "Explore modern ECMAScript features: arrow functions, destructuring, template literals, array methods (map, filter, reduce), closures, and high-performance DOM event delegation.", is_preview: false },
  { id: 5, course_id: 1, title: "React 18 & Modern Component Architecture (English)", order_index: 5, duration_minutes: 50, type: "video", video_url: "https://www.youtube.com/watch?v=bMknfKXIFA8", content_text: "Deep-dive into React 18 functional components, hooks (useState, useEffect, useMemo, useCallback), unidirectional data flow, and virtual DOM reconciliation.", is_preview: false },
  { id: 6, course_id: 1, title: "Node.js & Express RESTful API Engineering (English)", order_index: 6, duration_minutes: 40, type: "video", video_url: "https://www.youtube.com/watch?v=Oe421EPjeBE", content_text: "Architect high-performance RESTful APIs in Node.js and Express with middleware pipelines, JSON request parsing, error-handling middleware, and CORS security.", is_preview: false },
  { id: 7, course_id: 1, title: "Module Assessment: Full-Stack Web Development Architecture (20-Min Timed Examination)", order_index: 7, duration_minutes: 20, type: "quiz", video_url: null, content_text: "Comprehensive 20-minute timed certification exam testing HTTP specifications, HTML5 semantics, CSS Grid, event loop mechanics, CORS, and React architecture.", is_preview: false },

  // Course 2: Python Data Science and Machine Learning
  { id: 8, course_id: 2, title: "Setting Up Your Data Science & Python Environment (English)", order_index: 1, duration_minutes: 20, type: "video", video_url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", content_text: "Configure a clean Python development workspace with virtual environments, JupyterLab notebooks, and essential scientific data libraries.", is_preview: true },
  { id: 9, course_id: 2, title: "Vectorized Operations with NumPy & Array Manipulation (English)", order_index: 2, duration_minutes: 30, type: "video", video_url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", content_text: "Master n-dimensional array manipulation, broadcasting rules, matrix multiplication, and linear algebra routines in NumPy.", is_preview: true },
  { id: 10, course_id: 2, title: "Data Wrangling, Cleaning & GroupBy Aggregations with Pandas (English)", order_index: 3, duration_minutes: 40, type: "video", video_url: "https://www.youtube.com/watch?v=vmEHCJofslg", content_text: "Handle missing values, aggregate time-series datasets, and reshape DataFrames using loc/iloc, groupby, pivot tables, and merge operations.", is_preview: false },
  { id: 11, course_id: 2, title: "Exploratory Data Analysis & Statistical Visualizations with Matplotlib (English)", order_index: 4, duration_minutes: 25, type: "reading", video_url: null, content_text: "Plot distributions, correlation heatmaps, box plots, and pair plots to extract actionable insights from raw data.\n\n### Core Techniques:\n1. Histograms and KDE plots for feature distributions.\n2. Correlation matrices to identify multi-collinearity.\n3. Outlier identification using Interquartile Ranges (IQR).", is_preview: false },
  { id: 12, course_id: 2, title: "Supervised Machine Learning & Scikit-Learn Classification Pipelines (English)", order_index: 5, duration_minutes: 45, type: "video", video_url: "https://www.youtube.com/watch?v=0B5eIE_1vpU", content_text: "Build end-to-end classification pipelines using Scikit-Learn: train/test split, StandardScaler, LogisticRegression, Random Forests, and ROC-AUC evaluation.", is_preview: false },
  { id: 13, course_id: 2, title: "Module Assessment: Python Data Science & Applied Machine Learning (20-Min Timed Examination)", order_index: 6, duration_minutes: 20, type: "quiz", video_url: null, content_text: "Standardized 20-minute timed certification exam testing NumPy broadcasting, Pandas indexing, bias-variance tradeoffs, and Scikit-Learn pipelines.", is_preview: false },

  // Course 3: UI/UX Design Systems
  { id: 14, course_id: 3, title: "Foundations of Human-Centered Interaction Design (English)", order_index: 1, duration_minutes: 25, type: "video", video_url: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", content_text: "Explore cognitive psychology principles, Nielsen Norman heuristics, and mental models applied to modern digital interfaces.", is_preview: true },
  { id: 15, course_id: 3, title: "Color Theory, Contrast Ratios & WCAG 2.1 AA Compliance (English)", order_index: 2, duration_minutes: 25, type: "reading", video_url: null, content_text: "Design accessible, high-contrast color palettes ensuring 4.5:1 text-to-background contrast ratios and mathematical color stepping.\n\n### Standards Covered:\n- WCAG 2.1 Success Criterion 1.4.3 (Level AA): 4.5:1 for body text, 3:1 for large text.\n- Semantic token naming conventions: primary, surface, text-subtle, border-muted.\n- Dark mode luminescence balancing.", is_preview: true },
  { id: 16, course_id: 3, title: "Building Tokenized Design Systems & Auto-Layout in Figma (English)", order_index: 3, duration_minutes: 35, type: "video", video_url: "https://www.youtube.com/watch?v=20SHvU2PKsM", content_text: "Construct production Figma component libraries using Auto Layout, variants, component properties, and design tokens.", is_preview: false },
  { id: 17, course_id: 3, title: "Typography Hierarchy, Baseline Grids & Responsive Breakpoints (English)", order_index: 4, duration_minutes: 20, type: "reading", video_url: null, content_text: "Learn typographic scaling ratios (Major Third 1.25, Perfect Fourth 1.333), line-height rhythms, character width limits (65-75ch), and nested border radius formulas.", is_preview: false },
  { id: 18, course_id: 3, title: "Usability Testing, Heuristics Evaluation & Micro-interactions (English)", order_index: 5, duration_minutes: 30, type: "video", video_url: "https://www.youtube.com/watch?v=4Y7b1zN_8yQ", content_text: "Plan cognitive walkthroughs, tree testing, and quantitative SUS benchmarking, accompanied by purposeful micro-interactions.", is_preview: false },
  { id: 19, course_id: 3, title: "Module Assessment: UI/UX Design Systems & Accessibility (20-Min Timed Examination)", order_index: 6, duration_minutes: 20, type: "quiz", video_url: null, content_text: "Standardized 20-minute examination covering WCAG 2.1 AA contrast requirements, Fitts's Law, design tokens, and Nielsen Norman usability heuristics.", is_preview: false },

  // Course 4: Advanced SQL & Database Architecture
  { id: 20, course_id: 4, title: "Relational Modeling, Codd's Rules & Database Normalization (English)", order_index: 1, duration_minutes: 30, type: "video", video_url: "https://www.youtube.com/watch?v=HXV3zeRR3h4", content_text: "Study relational algebra, primary/foreign key constraints, and 1NF, 2NF, and 3NF normalization rules with freeCodeCamp's database curriculum.", is_preview: true },
  { id: 21, course_id: 4, title: "Deep Dive into SQL Joins: Inner, Outer, Cross & Self Joins (English)", order_index: 2, duration_minutes: 25, type: "reading", video_url: null, content_text: "Master the mathematical set operations underlying INNER JOIN, LEFT OUTER JOIN, RIGHT JOIN, FULL OUTER JOIN, and CROSS JOIN with Venn diagram equivalents and execution plans.", is_preview: true },
  { id: 22, course_id: 4, title: "Indexing Architecture: B-Trees, Hash, and Covering Indexes (English)", order_index: 3, duration_minutes: 35, type: "video", video_url: "https://www.youtube.com/watch?v=clhyN-yG59c", content_text: "Deep-dive with database architect Hussein Nasser into B-Tree balanced pages, index leaf pointers, covering indexes, and index-only scans.", is_preview: false },
  { id: 23, course_id: 4, title: "ACID Transactions, Row Locking & Concurrency Control (English)", order_index: 4, duration_minutes: 30, type: "reading", video_url: null, content_text: "Understand transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and concurrency anomalies like dirty reads, non-repeatable reads, and phantom reads.", is_preview: false },
  { id: 24, course_id: 4, title: "Query Execution Plans, EXPLAIN ANALYZE & Performance Optimization (English)", order_index: 5, duration_minutes: 40, type: "video", video_url: "https://www.youtube.com/watch?v=70y6zKqF4uQ", content_text: "Read EXPLAIN and EXPLAIN ANALYZE execution trees in PostgreSQL and MySQL, detecting sequential scans, temporary tables, and index range scans.", is_preview: false },
  { id: 25, course_id: 4, title: "Module Assessment: Advanced SQL & Database Architecture (20-Min Timed Examination)", order_index: 6, duration_minutes: 20, type: "quiz", video_url: null, content_text: "Standardized 20-minute timed certification exam testing ACID isolation, B-Tree internals, covering indexes, HAVING vs WHERE, and OLTP write performance.", is_preview: false },

  // Course 5: Modern JavaScript & TypeScript Architecture
  { id: 26, course_id: 5, title: "V8 Engine Internals, Event Loop & Microtask Queues (English)", order_index: 1, duration_minutes: 30, type: "video", video_url: "https://www.youtube.com/watch?v=eiC58R1442k", content_text: "Dissect the Chrome V8 and Node.js runtime engines: JIT compilation, hidden classes, the call stack, microtasks, and macrotasks.", is_preview: true },
  { id: 27, course_id: 27, title: "Closures, Lexical Scope & Garbage Collection Lifecycles (English)", order_index: 2, duration_minutes: 25, type: "reading", video_url: null, content_text: "Understand lexical scope chains, closure memory retention, mark-and-sweep garbage collection, and preventing circular memory leaks in production applications.", is_preview: true },
  { id: 28, course_id: 5, title: "TypeScript Type System: Generics, Unions & Conditional Types (English)", order_index: 3, duration_minutes: 40, type: "video", video_url: "https://www.youtube.com/watch?v=BCg4U1FzODs", content_text: "Master advanced TypeScript type gymnastics: generics, conditional types with infer, template literal types, and utility types.", is_preview: false },
  { id: 29, course_id: 5, title: "Asynchronous Programming: Promises, Async/Await & Error Boundaries (English)", order_index: 4, duration_minutes: 35, type: "video", video_url: "https://www.youtube.com/watch?v=vn3tm0quoqE", content_text: "Handle asynchronous control flow, Promise.all vs Promise.allSettled, cancellation controllers, and unhandled rejection handling.", is_preview: false },
  { id: 30, course_id: 5, title: "Module Assessment: Modern JavaScript & TypeScript Architecture (20-Min Timed Examination)", order_index: 5, duration_minutes: 20, type: "quiz", video_url: null, content_text: "Standardized 20-minute technical assessment testing declaration merging, closures, shallow utility types, unhandled rejections, and prototype chains.", is_preview: false },

  // Course 6: Product Growth, Analytics & Venture Strategy
  { id: 31, course_id: 6, title: "Foundations of Product-Led Growth & Value Metrics (English)", order_index: 1, duration_minutes: 25, type: "video", video_url: "https://www.youtube.com/watch?v=C27RVio2rOs", content_text: "Understand product-led growth (PLG) motions, time-to-value (TTV), friction removal, and value metric alignment with leading venture operators.", is_preview: true },
  { id: 32, course_id: 6, title: "SaaS Unit Economics: LTV, CAC, Payback Periods & Net Retention (English)", order_index: 2, duration_minutes: 25, type: "reading", video_url: null, content_text: "Calculate core SaaS benchmarks: LTV:CAC ratios, CAC Payback Period (in months), Gross Margins, and Net Revenue Retention (NRR > 120%).\n\n### Standard Formulas:\n- LTV = (ARPU * Gross Margin %) / Churn Rate\n- CAC Payback = CAC / (Monthly ARPU * Gross Margin %)\n- Net Revenue Retention (NRR) = (Start ARR + Expansions - Churn) / Start ARR", is_preview: true },
  { id: 33, course_id: 6, title: "Retention Curves, Cohort Analysis & Churn Diagnostics (English)", order_index: 3, duration_minutes: 35, type: "video", video_url: "https://www.youtube.com/watch?v=aWp8Z2b67f4", content_text: "Diagnose user retention curves, identifying whether cohorts flatten asymptotically to confirm Product-Market Fit.", is_preview: false },
  { id: 34, course_id: 6, title: "Viral Loops, Referral Engines & Growth Experimentation (English)", order_index: 4, duration_minutes: 30, type: "video", video_url: "https://www.youtube.com/watch?v=r3PfbS9mXg0", content_text: "Model viral K-factors, invitation loops, user incentives, and structured A/B growth testing frameworks.", is_preview: false },
  { id: 35, course_id: 6, title: "Module Assessment: Product Growth & Venture Strategy (20-Min Timed Examination)", order_index: 5, duration_minutes: 20, type: "quiz", video_url: null, content_text: "Standardized 20-minute assessment testing LTV:CAC benchmarks, retention curve geometry, viral coefficients, and payback periods.", is_preview: false },

  // Course 7: English Fluency & Spoken Communication (YouTube Playlist)
  { id: 36, course_id: 7, title: "Everyday English Speaking: 100 Most Essential Real-Life Phrases (English)", order_index: 1, duration_minutes: 25, type: "video", video_url: "https://www.youtube.com/watch?v=juKd26qkNAw", content_text: "In this foundational lesson from the YouTube English series, learn the top 100 conversational phrases native speakers use every single day in greetings, asking for directions, polite requests, and small talk.", is_preview: true },
  { id: 37, course_id: 7, title: "English Grammar Essentials: Sentence Structures & Tense Mastery (English)", order_index: 2, duration_minutes: 35, type: "video", video_url: "https://www.youtube.com/watch?v=haZX7lY30Gk", content_text: "A structured breakdown of English tenses: present, past, future, and perfect aspects. Understand subject-verb agreement, auxiliary verbs, and how to formulate questions effortlessly.", is_preview: true },
  { id: 38, course_id: 7, title: "Idioms & Phrasal Verbs in Context: Reading & Practice Guide (English)", order_index: 3, duration_minutes: 20, type: "reading", video_url: null, content_text: "Comprehensive study guide covering 40 high-frequency English phrasal verbs ('figure out', 'look forward to', 'bring up', 'run into') and idioms with practical dialogues and usage exercises.", is_preview: true },
  { id: 39, course_id: 7, title: "Pronunciation & Accent Training: Connected Speech & Intonation (English)", order_index: 4, duration_minutes: 28, type: "video", video_url: "https://www.youtube.com/watch?v=yRhpO1rA5_c", content_text: "Unlock the secrets of connected speech: consonant-to-vowel linking, weak forms, reduction of 'and' / 'to', and rhythmic intonation to sound natural and clear.", is_preview: false },
  { id: 40, course_id: 7, title: "Professional & Workplace English: Meetings, Presentations & Emails (English)", order_index: 5, duration_minutes: 32, type: "video", video_url: "https://www.youtube.com/watch?v=2nff1-eHqE4", content_text: "Sharpen your business communication: leading meetings, pitching proposals, tactfully negotiating, and writing concise, professional emails for global workplaces.", is_preview: false },
  { id: 41, course_id: 7, title: "Module Assessment: English Grammar, Fluency & Cambridge B2/C1 Assessment (20-Min Timed Examination)", order_index: 6, duration_minutes: 20, type: "quiz", video_url: null, content_text: "Standardized 20-minute timed certification exam testing Cambridge B2/C1 conditionals, diplomatic workplace English, phrasal verbs, and connected speech.", is_preview: false },

  // Course 8: BBC 6-Minute English Series
  { id: 42, course_id: 8, title: "BBC English: Everyday Science, Curiosity & Human Behavior (English)", order_index: 1, duration_minutes: 15, type: "video", video_url: "https://www.youtube.com/watch?v=sQkLhA7_q_o", content_text: "Listen to topical British English dialogues, breakdown advanced vocabulary in context, and train your ear for natural conversational cadence.", is_preview: true },
  { id: 43, course_id: 8, title: "BBC English: Technology, Artificial Intelligence & Future Trends (English)", order_index: 2, duration_minutes: 15, type: "video", video_url: "https://www.youtube.com/watch?v=8V4qg21QxM4", content_text: "Learn how to discuss modern technological breakthroughs, AI, and digital culture using nuanced English phrases and expressions.", is_preview: true },
  { id: 44, course_id: 8, title: "BBC English: Global Cultures, Travel & Cross-Cultural Fluency (English)", order_index: 3, duration_minutes: 15, type: "video", video_url: "https://www.youtube.com/watch?v=L9AWrJnhsRI", content_text: "Explore international travel expressions, environmental discussions, and multi-cultural dialogue strategies.", is_preview: false },
  { id: 45, course_id: 8, title: "Advanced Idiomatic English & British Collocations Study Guide (English)", order_index: 4, duration_minutes: 20, type: "reading", video_url: null, content_text: "Explore common British idioms: 'bite the bullet', 'sit on the fence', 'chuffed', 'a blessing in disguise', and 'devil's advocate' with historical origins and context.", is_preview: false },
  { id: 46, course_id: 8, title: "BBC English: Work-Life Balance, Productivity & Modern Society (English)", order_index: 5, duration_minutes: 15, type: "video", video_url: "https://www.youtube.com/watch?v=3zO4H3p4p2w", content_text: "Discuss modern lifestyle trends, wellbeing, remote work culture, and societal change with natural British English idioms.", is_preview: false },
  { id: 47, course_id: 8, title: "Module Assessment: BBC English Vocabulary, Idioms & Listening Comprehension (20-Min Timed Examination)", order_index: 6, duration_minutes: 20, type: "quiz", video_url: null, content_text: "Standardized 20-minute examination covering British conversational vocabulary, idioms, and listening comprehension.", is_preview: false }
];

let enrollments = [
  { id: 1, user_id: 1, course_id: 1, progress_percent: 50, completed: false, enrolled_at: "2025-01-12T10:00:00Z" },
  { id: 2, user_id: 1, course_id: 3, progress_percent: 100, completed: true, enrolled_at: "2025-01-14T09:00:00Z" },
  { id: 3, user_id: 1, course_id: 7, progress_percent: 33, completed: false, enrolled_at: "2025-01-22T09:00:00Z" }
];

let lesson_progress = [
  { id: 1, user_id: 1, lesson_id: 1, completed: true, completed_at: "2025-01-12T11:00:00Z" },
  { id: 2, user_id: 1, lesson_id: 2, completed: true, completed_at: "2025-01-13T14:30:00Z" },
  { id: 3, user_id: 1, lesson_id: 14, completed: true, completed_at: "2025-01-14T10:00:00Z" },
  { id: 4, user_id: 1, lesson_id: 15, completed: true, completed_at: "2025-01-14T11:30:00Z" },
  { id: 5, user_id: 1, lesson_id: 36, completed: true, completed_at: "2025-01-22T10:30:00Z" },
  { id: 6, user_id: 1, lesson_id: 37, completed: true, completed_at: "2025-01-22T12:00:00Z" }
];

let reviews = [
  { id: 1, course_id: 1, user_id: 1, rating: 5, comment: "One of the most coherent and well-structured full-stack courses I have ever taken. The instructor does not skip any fundamental steps.", created_at: "2025-01-14T16:00:00Z" },
  { id: 2, course_id: 1, user_id: 4, rating: 5, comment: "Top tier production insights! The section explaining DOM rendering lifecycles and layout reflows was pure gold.", created_at: "2025-01-15T12:00:00Z" },
  { id: 3, course_id: 2, user_id: 1, rating: 5, comment: "Marcus makes complex linear algebra and matrix operations feel intuitive and applicable. Highly recommended.", created_at: "2025-01-16T18:00:00Z" },
  { id: 4, course_id: 7, user_id: 1, rating: 5, comment: "The combination of the YouTube video lessons with the in-app syllabus, synchronized notes, and quizzes makes learning English so engaging! My speaking confidence improved tremendously.", created_at: "2025-01-23T14:00:00Z" },
  { id: 5, course_id: 7, user_id: 4, rating: 5, comment: "Superb pronunciation breakdown and everyday phrases. Highly recommended for international engineers and students.", created_at: "2025-01-24T18:30:00Z" },
  { id: 6, course_id: 8, user_id: 1, rating: 5, comment: "The BBC 6-Minute series is unmatched for real British English listening practice and idiomatic vocabulary.", created_at: "2025-01-25T11:00:00Z" }
];

let certificates = [
  {
    id: 1,
    user_id: 1,
    course_id: 3,
    certificate_code: "EDU-CERT-2025-UIUX-001",
    issued_at: "2025-01-14T12:00:00Z",
    recipient_name: "Alex Morgan",
    course_title: "UI/UX Design Systems: From Wireframe to High-Fidelity",
    instructor_name: "Emily Chen"
  }
];

// Helper: Get user from token header
function getAuthUser(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  // Simple token decoding or fallback to user 1
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      const user = users.find(u => u.id === payload.sub || u.email === payload.sub);
      if (user) return user;
    }
  } catch (e) {}

  // Fallback for demo token
  return users[0];
}

// Generate simple mock JWT
function createToken(user: typeof users[0]) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + (86400 * 7)
  })).toString("base64");
  const sig = crypto.createHash("sha256").update(`${header}.${payload}`).digest("hex");
  return `${header}.${payload}.${sig}`;
}

// --- API ROUTES ---

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "EduLearn API", timestamp: new Date().toISOString() });
});

// Auth Routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid email or password credentials." } });
  }

  const token = createToken(user);
  const { password_hash, ...safeUser } = user;
  res.json({ message: "Login successful", token, user: safeUser });
});

app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Name, email, and password are required." } });
  }

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: { code: "CONFLICT", message: "An account with this email address already exists." } });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password_hash: password,
    avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200`,
    role: role === "instructor" ? "instructor" : "student",
    bio: "New learner at EduLearn.",
    created_at: new Date().toISOString()
  };

  users.push(newUser);
  const token = createToken(newUser);
  const { password_hash: _, ...safeUser } = newUser;
  res.status(201).json({ message: "Account registered successfully", token, user: safeUser });
});

app.get("/api/auth/me", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required." } });
  }
  const { password_hash, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Course Routes
app.get("/api/courses", (req, res) => {
  let result = [...courses];
  const { category, difficulty, search, sort, page = "1", limit = "9" } = req.query;

  if (category && category !== "all") {
    result = result.filter(c => c.category.toLowerCase() === String(category).toLowerCase());
  }

  if (difficulty && difficulty !== "all") {
    result = result.filter(c => c.difficulty.toLowerCase() === String(difficulty).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }

  if (sort === "rating") {
    result.sort((a, b) => b.rating_avg - a.rating_avg);
  } else if (sort === "newest") {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sort === "price_asc") {
    result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
  } else if (sort === "price_desc") {
    result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
  } else {
    // popular
    result.sort((a, b) => b.student_count - a.student_count);
  }

  const p = parseInt(String(page), 10) || 1;
  const lim = parseInt(String(limit), 10) || 9;
  const total = result.length;
  const start = (p - 1) * lim;
  const paginated = result.slice(start, start + lim).map(c => {
    const instructor = users.find(u => u.id === c.instructor_id);
    return {
      ...c,
      instructor: instructor ? { id: instructor.id, name: instructor.name, avatar_url: instructor.avatar_url } : null
    };
  });

  res.json({
    courses: paginated,
    total,
    page: p,
    limit: lim,
    pages: Math.ceil(total / lim) || 1,
    has_next: start + lim < total,
    has_prev: p > 1
  });
});

app.get("/api/courses/:id", (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  const course = courses.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Course not found." } });
  }

  const instructor = users.find(u => u.id === course.instructor_id);
  const courseLessons = lessons.filter(l => l.course_id === courseId).sort((a, b) => a.order_index - b.order_index);

  const user = getAuthUser(req);
  const isEnrolled = user ? enrollments.some(e => e.user_id === user.id && e.course_id === courseId) : false;

  res.json({
    course: {
      ...course,
      instructor: instructor ? { id: instructor.id, name: instructor.name, avatar_url: instructor.avatar_url, bio: instructor.bio } : null,
      lessons: courseLessons.map(l => ({
        id: l.id,
        title: l.title,
        order_index: l.order_index,
        duration_minutes: l.duration_minutes,
        type: l.type,
        is_preview: l.is_preview,
        video_url: l.video_url
      })),
      is_enrolled: isEnrolled
    }
  });
});

// YouTube Playlists Directory
app.get("/api/youtube/playlists", (req, res) => {
  res.json({
    playlists: [
      {
        id: "PLcetZ6gSk96-9Cg_7lWbF_2u_2r_d6k7A",
        title: "English Fluency & Spoken Communication Complete Series",
        channel: "Oxford & BBC English Collective",
        video_count: 24,
        category: "Spoken English & Fluency",
        description: "Comprehensive English speaking, pronunciation, grammar, and daily dialogues playlist.",
        url: "https://www.youtube.com/playlist?list=PLcetZ6gSk96-9Cg_7lWbF_2u_2r_d6k7A",
        embed_url: "https://www.youtube-nocookie.com/embed/videoseries?list=PLcetZ6gSk96-9Cg_7lWbF_2u_2r_d6k7A"
      },
      {
        id: "PLD6B222E02447DC07",
        title: "BBC 6-Minute English: Vocabulary & Listening",
        channel: "BBC Learning English",
        video_count: 40,
        category: "Listening & British English",
        description: "Short, engaging 6-minute episodes discussing science, culture, technology, and language.",
        url: "https://www.youtube.com/playlist?list=PLD6B222E02447DC07",
        embed_url: "https://www.youtube-nocookie.com/embed/videoseries?list=PLD6B222E02447DC07"
      },
      {
        id: "PLba-HnvA66npE14s49L212gXk7R6jD2F_",
        title: "Business English & Professional Workplace Communication",
        channel: "Global Career ESL",
        video_count: 18,
        category: "Business & Career",
        description: "Essential business vocabulary, corporate presentations, email etiquette, and interview techniques.",
        url: "https://www.youtube.com/playlist?list=PLba-HnvA66npE14s49L212gXk7R6jD2F_",
        embed_url: "https://www.youtube-nocookie.com/embed/videoseries?list=PLba-HnvA66npE14s49L212gXk7R6jD2F_"
      }
    ]
  });
});

// Lessons
app.get("/api/lessons/course/:course_id", (req, res) => {
  const courseId = parseInt(req.params.course_id, 10);
  const user = getAuthUser(req);
  const isEnrolled = user ? enrollments.some(e => e.user_id === user.id && e.course_id === courseId) : false;
  const course = courses.find(c => c.id === courseId);

  const courseLessons = lessons
    .filter(l => l.course_id === courseId)
    .sort((a, b) => a.order_index - b.order_index)
    .map(l => {
      const isCompleted = user ? lesson_progress.some(lp => lp.user_id === user.id && lp.lesson_id === l.id && lp.completed) : false;
      const isLocked = !isEnrolled && !l.is_preview;
      return {
        ...l,
        completed: isCompleted,
        is_locked: isLocked
      };
    });

  res.json({ 
    lessons: courseLessons, 
    is_enrolled: isEnrolled,
    course_title: course?.title,
    youtube_playlist_url: (course as any)?.youtube_playlist_url || null
  });
});

app.get("/api/lessons/:id", (req, res) => {
  const lessonId = parseInt(req.params.id, 10);
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Lesson not found." } });
  }

  const user = getAuthUser(req);
  const isCompleted = user ? lesson_progress.some(lp => lp.user_id === user.id && lp.lesson_id === lesson.id && lp.completed) : false;

  res.json({
    lesson: {
      ...lesson,
      completed: isCompleted
    }
  });
});

// Lesson Progress & Completion
app.post("/api/lesson-progress", (req, res) => {
  const user = getAuthUser(req) || users[0];
  const { lesson_id } = req.body;
  const lessonId = parseInt(lesson_id, 10);

  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Lesson not found." } });
  }

  // Mark lesson progress
  let progressItem = lesson_progress.find(lp => lp.user_id === user.id && lp.lesson_id === lessonId);
  if (!progressItem) {
    progressItem = {
      id: lesson_progress.length + 1,
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    };
    lesson_progress.push(progressItem);
  } else {
    progressItem.completed = true;
  }

  // Check course completion
  const courseLessons = lessons.filter(l => l.course_id === lesson.course_id);
  const completedLessons = courseLessons.filter(l => lesson_progress.some(lp => lp.user_id === user.id && lp.lesson_id === l.id && lp.completed));
  const progressPercent = Math.round((completedLessons.length / courseLessons.length) * 100);

  let enrollment = enrollments.find(e => e.user_id === user.id && e.course_id === lesson.course_id);
  if (enrollment) {
    enrollment.progress_percent = progressPercent;
    if (progressPercent >= 100) {
      enrollment.completed = true;
    }
  } else {
    enrollment = {
      id: enrollments.length + 1,
      user_id: user.id,
      course_id: lesson.course_id,
      progress_percent: progressPercent,
      completed: progressPercent >= 100,
      enrolled_at: new Date().toISOString()
    };
    enrollments.push(enrollment);
  }

  let certificate = null;
  if (progressPercent >= 100) {
    certificate = certificates.find(c => c.user_id === user.id && c.course_id === lesson.course_id);
    if (!certificate) {
      const course = courses.find(c => c.id === lesson.course_id);
      const instructor = users.find(u => u.id === course?.instructor_id);
      certificate = {
        id: certificates.length + 1,
        user_id: user.id,
        course_id: lesson.course_id,
        certificate_code: `EDU-CERT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        issued_at: new Date().toISOString(),
        recipient_name: user.name,
        course_title: course?.title || "Masterclass",
        instructor_name: instructor?.name || "EduLearn Faculty"
      };
      certificates.push(certificate);
    }
  }

  res.json({
    message: "Lesson progress updated successfully.",
    progress_percent: progressPercent,
    course_completed: progressPercent >= 100,
    certificate
  });
});

// Quizzes & Assessments (20-Minute Timed Examinations)
app.get("/api/quizzes/lesson/:lesson_id", (req, res) => {
  const lessonId = parseInt(req.params.lesson_id, 10);
  const quiz = quizzesData.find(q => q.lesson_id === lessonId);
  if (!quiz) {
    // If not direct match by lesson_id, check if this lesson belongs to a course with a quiz
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      const courseQuiz = quizzesData.find(q => q.course_id === lesson.course_id);
      if (courseQuiz) {
        return res.json({ quiz: courseQuiz });
      }
    }
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Quiz assessment not found for this lesson." } });
  }
  res.json({ quiz });
});

app.get("/api/quizzes/course/:course_id", (req, res) => {
  const courseId = parseInt(req.params.course_id, 10);
  const quiz = quizzesData.find(q => q.course_id === courseId);
  if (!quiz) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Quiz assessment not found for this course." } });
  }
  res.json({ quiz });
});

app.post("/api/quizzes/submit", (req, res) => {
  const user = getAuthUser(req) || users[0];
  const { lesson_id, answers, time_spent_seconds } = req.body;
  const lessonId = parseInt(lesson_id, 10);

  let quiz = quizzesData.find(q => q.lesson_id === lessonId);
  if (!quiz) {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      quiz = quizzesData.find(q => q.course_id === lesson.course_id);
    }
  }

  if (!quiz) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Quiz not found." } });
  }

  let correctCount = 0;
  const results = quiz.questions.map((q, idx) => {
    const userAnswer = answers ? answers[idx] : undefined;
    const isCorrect = userAnswer !== undefined && Number(userAnswer) === q.correct;
    if (isCorrect) correctCount++;
    return {
      question_id: q.id,
      question: q.question,
      options: q.options,
      user_answer: userAnswer !== undefined ? Number(userAnswer) : null,
      correct_answer: q.correct,
      is_correct: isCorrect,
      explanation: q.explanation,
      source: q.source,
      source_url: q.source_url
    };
  });

  const totalQuestions = quiz.questions.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= quiz.pass_percentage;

  let certificate = null;

  if (passed) {
    // Record lesson progress
    let progressItem = lesson_progress.find(lp => lp.user_id === user.id && lp.lesson_id === lessonId);
    if (!progressItem) {
      progressItem = {
        id: lesson_progress.length + 1,
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString()
      };
      lesson_progress.push(progressItem);
    } else {
      progressItem.completed = true;
      progressItem.completed_at = new Date().toISOString();
    }

    // Recompute course progress
    const courseLessons = lessons.filter(l => l.course_id === quiz.course_id);
    const completedLessons = courseLessons.filter(l => lesson_progress.some(lp => lp.user_id === user.id && lp.lesson_id === l.id && lp.completed));
    const progressPercent = Math.round((completedLessons.length / courseLessons.length) * 100);

    let enrollment = enrollments.find(e => e.user_id === user.id && e.course_id === quiz.course_id);
    if (enrollment) {
      enrollment.progress_percent = progressPercent;
      if (progressPercent >= 100) {
        enrollment.completed = true;
      }
    }

    if (progressPercent >= 100) {
      certificate = certificates.find(c => c.user_id === user.id && c.course_id === quiz.course_id);
      if (!certificate) {
        const course = courses.find(c => c.id === quiz.course_id);
        const instructor = users.find(u => u.id === course?.instructor_id);
        certificate = {
          id: certificates.length + 1,
          user_id: user.id,
          course_id: quiz.course_id,
          certificate_code: `EDU-CERT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
          issued_at: new Date().toISOString(),
          recipient_name: user.name,
          course_title: course?.title || "Masterclass",
          instructor_name: instructor?.name || "EduLearn Faculty"
        };
        certificates.push(certificate);
      }
    }
  }

  res.json({
    passed,
    score_percent: scorePercent,
    correct_count: correctCount,
    total_questions: totalQuestions,
    pass_percentage: quiz.pass_percentage,
    time_spent_seconds: time_spent_seconds || 0,
    time_limit_minutes: quiz.duration_minutes,
    results,
    certificate
  });
});

// Enrollments
app.post("/api/enrollments", (req, res) => {
  const user = getAuthUser(req) || users[0];
  const { course_id } = req.body;
  const courseId = parseInt(course_id, 10);

  const course = courses.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Course not found." } });
  }

  let enrollment = enrollments.find(e => e.user_id === user.id && e.course_id === courseId);
  if (!enrollment) {
    enrollment = {
      id: enrollments.length + 1,
      user_id: user.id,
      course_id: courseId,
      progress_percent: 0,
      completed: false,
      enrolled_at: new Date().toISOString()
    };
    enrollments.push(enrollment);
    course.student_count = (course.student_count || 0) + 1;
  }

  res.status(201).json({ message: "Successfully enrolled in course", enrollment });
});

// Reviews
app.get("/api/reviews/course/:course_id", (req, res) => {
  const courseId = parseInt(req.params.course_id, 10);
  const courseReviews = reviews.filter(r => r.course_id === courseId);

  const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  courseReviews.forEach(r => {
    if (breakdown[r.rating] !== undefined) {
      breakdown[r.rating]++;
    }
  });

  const formattedReviews = courseReviews.map(r => {
    const user = users.find(u => u.id === r.user_id);
    return {
      ...r,
      user: user ? { id: user.id, name: user.name, avatar_url: user.avatar_url } : null
    };
  });

  res.json({
    reviews: formattedReviews,
    breakdown,
    rating_count: courseReviews.length
  });
});

app.post("/api/reviews/course/:course_id", (req, res) => {
  const user = getAuthUser(req) || users[0];
  const courseId = parseInt(req.params.course_id, 10);
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Rating must be an integer between 1 and 5." } });
  }

  const newReview = {
    id: reviews.length + 1,
    course_id: courseId,
    user_id: user.id,
    rating: Number(rating),
    comment: comment || "",
    created_at: new Date().toISOString()
  };
  reviews.push(newReview);

  // Recalculate average
  const courseReviews = reviews.filter(r => r.course_id === courseId);
  const course = courses.find(c => c.id === courseId);
  if (course) {
    const sum = courseReviews.reduce((acc, r) => acc + r.rating, 0);
    course.rating_avg = Math.round((sum / courseReviews.length) * 100) / 100;
    course.rating_count = courseReviews.length;
  }

  res.status(201).json({ message: "Review posted successfully.", review: newReview });
});

// Dashboard
app.get("/api/users/me/dashboard", (req, res) => {
  const user = getAuthUser(req) || users[0];
  const userEnrollments = enrollments.filter(e => e.user_id === user.id);

  const inProgressList = userEnrollments
    .filter(e => !e.completed)
    .map(e => {
      const course = courses.find(c => c.id === e.course_id);
      const instructor = users.find(u => u.id === course?.instructor_id);
      return {
        ...e,
        course: course ? { ...course, instructor: instructor ? { name: instructor.name } : null } : null
      };
    });

  const completedList = userEnrollments
    .filter(e => e.completed)
    .map(e => {
      const course = courses.find(c => c.id === e.course_id);
      return { ...e, course };
    });

  const userCerts = certificates.filter(c => c.user_id === user.id);

  // Recommended (courses user is not enrolled in)
  const enrolledIds = new Set(userEnrollments.map(e => e.course_id));
  const recommended = courses
    .filter(c => !enrolledIds.has(c.id))
    .slice(0, 3)
    .map(c => {
      const instructor = users.find(u => u.id === c.instructor_id);
      return { ...c, instructor: instructor ? { name: instructor.name, avatar_url: instructor.avatar_url } : null };
    });

  const { password_hash, ...safeUser } = user;

  res.json({
    user: safeUser,
    stats: {
      total_enrolled: userEnrollments.length,
      in_progress_count: inProgressList.length,
      completed_count: completedList.length,
      certificates_count: userCerts.length
    },
    in_progress_courses: inProgressList,
    completed_courses: completedList,
    certificates: userCerts,
    recommended_courses: recommended
  });
});

// Profile update
app.put("/api/users/me", (req, res) => {
  const user = getAuthUser(req) || users[0];
  const { name, bio, avatar_url } = req.body;

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar_url) user.avatar_url = avatar_url;

  const { password_hash, ...safeUser } = user;
  res.json({ message: "Profile updated successfully.", user: safeUser });
});

// Fallback: Serve frontend/index.html for any unhandled routes
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`EduLearn Full-Stack Server running on port ${PORT}`);
});
