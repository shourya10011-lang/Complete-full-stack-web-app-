# EduLearn - Production E-Learning Platform

EduLearn is a complete, production-grade e-learning web platform built with a clean three-tier separation of concerns:
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES6+, zero client frameworks).
- **Backend**: Python 3 with Flask, Flask-SQLAlchemy, Flask-JWT-Extended, and PyMySQL.
- **Database**: MySQL relational database schema with referential integrity, indexes, and full seed data.

---

## 📁 Architecture & Directory Structure

```
.
├── schema.sql                     # MySQL database schema (DDL, constraints, indexes)
├── seed.sql                       # MySQL seed data (Users, courses, lessons, enrollments, reviews)
├── backend/                       # Python Flask REST API Backend
│   ├── app.py                     # Application factory, CORS, JWT error handlers
│   ├── config.py                  # Database & JWT configuration loader
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Backend environment variables reference
│   ├── models/                    # SQLAlchemy ORM Models
│   │   ├── __init__.py
│   │   ├── user.py                # User model with bcrypt password hashing
│   │   ├── course.py              # Course model with relationships
│   │   ├── lesson.py              # Lesson model (video, reading, quiz)
│   │   ├── enrollment.py          # Enrollment progress tracking
│   │   ├── lesson_progress.py     # Per-lesson completion status
│   │   ├── review.py              # Course ratings and reviews
│   │   └── certificate.py         # Issued digital certificates
│   ├── utils/                     # Utility modules
│   │   ├── __init__.py
│   │   ├── auth_decorators.py     # @token_required & @role_required RBAC decorators
│   │   └── validators.py          # Input validation helpers
│   └── routes/                    # Modular Flask Blueprints
│       ├── __init__.py
│       ├── auth.py                # POST /login, POST /signup, GET /me
│       ├── courses.py             # Course search, filtering, CRUD
│       ├── lessons.py             # Lessons, order sequencing, preview access
│       ├── enrollments.py         # Course enrollment handlers
│       ├── lesson_progress.py     # Lesson completion & automatic certificate trigger
│       ├── reviews.py             # Course review submissions & ratings breakdown
│       └── users.py               # Student dashboard analytics & profile updates
└── frontend/                      # Vanilla Web Client (Zero Frameworks)
    ├── index.html                 # Landing page with hero, stats, and featured courses
    ├── courses.html               # Course catalog with live search, filters & pagination
    ├── course-detail.html         # Curriculum, syllabus tabs, reviews & enrollment
    ├── dashboard.html             # Student portal: progress tracking, certificates
    ├── lesson-player.html         # Interactive player (video, readings, quizzes)
    ├── login.html                 # Auth portal with 1-click demo login buttons
    ├── profile.html               # Student profile settings & avatar editor
    ├── css/
    │   └── style.css              # Design system: tokens, components, responsive layouts
    └── js/
        ├── api.js                 # Central fetch client with JWT attachment & 401 handling
        ├── auth.js                # Auth state management & navbar synchronization
        ├── courses.js             # Catalog filtering, search debounce & detail view
        ├── dashboard.js           # Student stats, in-progress courses & certificates
        ├── lesson-player.js       # Lesson sequence navigation & progress completion
        ├── profile.js             # User account settings management
        └── utils.js               # Toast notifications, currency & date formatters
```

---

## 🗄️ Database Setup (MySQL)

### 1. Create Database & Run Schema
In your MySQL terminal or GUI client (MySQL Workbench, TablePlus, DBeaver):

```bash
# Log in to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE edulearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import the schema tables
mysql -u root -p edulearn_db < schema.sql

# Import the sample seed data
mysql -u root -p edulearn_db < seed.sql
```

### Tables Included:
1. `users`: Stores students, instructors, and administrators with secure bcrypt password hashes.
2. `courses`: Course metadata, pricing, category, difficulty, ratings, duration, and student counts.
3. `lessons`: Course modules supporting `video`, `reading`, and `quiz` lesson types.
4. `enrollments`: Tracks student enrollments, completion percentage, and completion timestamps.
5. `lesson_progress`: Tracks individual lesson completion states.
6. `reviews`: Course ratings (1-5 stars) and student text feedback.
7. `certificates`: Cryptographic certificates generated upon 100% course completion.

---

## 🐍 Backend Setup (Python & Flask)

### 1. Prerequisites
- Python 3.10 or higher
- MySQL Server 8.0 or higher

### 2. Environment Configuration
Navigate to the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MySQL database credentials and secret key:
```ini
FLASK_ENV=development
SECRET_KEY=your_secure_secret_key_here
JWT_SECRET_KEY=your_secure_jwt_secret_here

DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=edulearn_db
```

### 3. Install Dependencies & Run
Create a virtual environment and launch the Flask server:

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required Python packages
pip install -r requirements.txt

# Start the Flask development server
python app.py
```

The Flask API will run on `http://localhost:5000`.

---

## 🌐 Frontend Setup (Vanilla HTML/CSS/JS)

The frontend uses standard web standards (HTML5, modern CSS3, and ES6+ modules). No build tools, Webpack, or npm dependencies are required for the client layer!

You can serve the `frontend/` directory with any static file server:

```bash
# Option A: Using Python's built-in HTTP server
cd frontend
python3 -m http.server 3000

# Option B: Using npx serve
npx serve frontend -p 3000

# Option C: Using Live Server in VS Code
# Simply right-click frontend/index.html and select "Open with Live Server"
```

---

## 🔑 Demo User Accounts

The database seed provides ready-to-test accounts for every role. All accounts share the password: `Password123!`

| Role | Name | Email | Password |
|---|---|---|---|
| **Student** | Alex Morgan | `student@edulearn.com` | `Password123!` |
| **Instructor** | Sarah Jenkins | `sarah.jenkins@edulearn.com` | `Password123!` |
| **Instructor** | Marcus Rivera | `marcus.rivera@edulearn.com` | `Password123!` |
| **Instructor** | Emily Chen | `emily.chen@edulearn.com` | `Password123!` |
| **Admin** | System Admin | `admin@edulearn.com` | `Password123!` |

*(Note: The login page includes convenient 1-click demo login buttons to auto-populate credentials).*

---

## 📡 REST API Reference

All API responses follow consistent JSON formats:
- Success: `{ ...payload }`
- Errors: `{ "error": { "code": "ERROR_CODE", "message": "Human readable description" } }`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | No | Register a new user account |
| `POST` | `/api/auth/login` | No | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Yes | Get authenticated user profile |
| `GET` | `/api/courses` | No | List courses with filters, search, sorting & pagination |
| `GET` | `/api/courses/<id>` | No (optional) | Course details, syllabus & enrollment status |
| `POST` | `/api/courses` | Instructor / Admin | Create a new course |
| `GET` | `/api/lessons/course/<id>` | No (optional) | List lessons with locked/unlocked statuses |
| `GET` | `/api/lessons/<id>` | Yes / Preview | Fetch lesson media, content & completion state |
| `POST` | `/api/lessons` | Instructor / Admin | Add a lesson to a course |
| `GET` | `/api/enrollments` | Yes | List authenticated student enrollments |
| `POST` | `/api/enrollments` | Yes | Enroll in a course |
| `POST` | `/api/lesson-progress` | Yes | Mark lesson complete & mint certificate if 100% |
| `GET` | `/api/reviews/course/<id>` | No | Course reviews list and 1-5 star breakdown |
| `POST` | `/api/reviews/course/<id>` | Yes | Post a course review and rating |
| `GET` | `/api/users/me/dashboard` | Yes | Student dashboard stats, in-progress & certificates |
| `PUT` | `/api/users/me` | Yes | Update user profile, avatar URL, and biography |

---

## 🛡️ Security Features
- **Bcrypt Hashing**: Password hashes are generated with salted bcrypt rounds.
- **JWT Authorization**: Bearer tokens with expiration and signature verification.
- **Role-Based Access Control (RBAC)**: Fine-grained `@role_required` decorators restricting course creation and administrative tasks.
- **XSS Sanitization**: Frontend HTML escaping prevents script injections in user-authored reviews.
- **SQL Injection Prevention**: SQLAlchemy parameterized queries across all database operations.
