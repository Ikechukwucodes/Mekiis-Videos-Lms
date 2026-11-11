# LearnPulse — Production-Ready Learning Management System (LMS)

LearnPulse is an enterprise-grade, modern Learning Management System (LMS) built with pure JavaScript (zero Python dependencies or scripts). It features persistent progress tracking, role-based access control, multi-format secure video streaming, and an interactive admin course builder.

---

## 🌟 Key Features

### 🎓 Student Experience
* **Course Catalog**: Filter by category, difficulty level, and search by keywords.
* **Enrollment System**: One-click course enrollment with duplicate enrollment prevention.
* **Persistent Learning Progress**: Backend-calculated progress (0–100%) stored in database.
* **Resume Learning**: Immediately continue from your last active lesson when returning days later.
* **Immersive Course Player**: Fullscreen player with responsive lesson curriculum drawer, duration badges, and previous/next navigation.
* **Multi-Format Video Player**: Supports YouTube, Vimeo, direct HTML5 `.mp4` links, and secure embed iframes.

### 🛡️ Admin Dashboard & Course Studio
* **Analytics Telemetry**: Real-time counts of total users, published courses, draft courses, active learners, and enrollments.
* **Hierarchical Curriculum Studio**:
  * Course Information & Drafting (save drafts before publishing)
  * Module Management (create, edit, delete, reorder)
  * Lesson Management (video links, durations, reading mode, reordering)
  * Real-Time Video Preview directly in lesson creator
* **Student Telemetry**: View all platform users, roles, and course enrollment records.

### 🔒 Enterprise Security
* **Zero Python Stack**: 100% Pure JavaScript & Node.js ecosystem.
* **Strict Role-Based Access Control (RBAC)**: Backend verification on all admin APIs (`STUDENT` vs `ADMIN`).
* **Stateless JWT Authentication**: Secure password hashing with `bcryptjs`.
* **XSS & Video Sanitization**: Protocol validation, iframe sandboxing, and prevention of arbitrary JavaScript injection.

---

## 🚀 Quick Start

### 1. Installation
```bash
# Clone or navigate to the repository
cd C:\Users\user\.gemini\antigravity\scratch\lms-platform

# Install dependencies for both server and client workspaces
npm install
```

### 2. Seed Database
Seeds the database with default demo accounts and rich curriculum:
```bash
npm run seed
```

### 3. Start Development Servers
```bash
# Run backend server (http://localhost:5000)
npm run dev

# In another terminal, run frontend client (http://localhost:5173)
npm run dev:client
```

---

## 🔑 Default Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lms.com` | `AdminPass123!` | Admin Dashboard & Course Studio |
| **Student** | `student@lms.com` | `StudentPass123!` | Student Dashboard & Learning Portal |

*(Both login forms include one-click demo credentials for immediate testing).*

---

## 🧪 Testing

Run the automated integration and unit test suite:
```bash
npm test
```
**Test Coverage Includes:**
* User registration, password hashing & login
* Bearer token authentication & route protection
* Role-Based Access Control (`STUDENT` cannot access admin APIs)
* Course, Module, and Lesson CRUD
* Video URL parsing & malicious iframe/protocol sanitization
* Course enrollment & duplicate enrollment prevention
* Persistent lesson completion, percentage recalculation & sequential resumption
* Admin metrics & student progress auditing

---

## 📁 Repository Structure

```
lms-platform/
├── package.json               # Root monorepo workspace orchestrator
├── .env.example               # Template environment configuration
├── server/                    # Node.js + Express + Mongoose REST API
│   ├── src/
│   │   ├── config/            # Database connection & env loader
│   │   ├── controllers/       # Auth, Course, Module, Lesson, Enrollment, Progress, Admin
│   │   ├── middleware/        # JWT auth, RBAC authorization, error handling
│   │   ├── models/            # User, Course, Module, Lesson, Enrollment, Progress
│   │   ├── routes/            # REST API endpoints
│   │   ├── services/          # Progress engine, stats, video parser
│   │   ├── seeds/             # Seed data with demo courses
│   │   ├── utils/             # ApiError, ApiResponse, slugify, token
│   │   ├── app.js             # Express application setup
│   │   └── server.js          # HTTP server listener
│   └── tests/                 # Supertest and unit test suite
└── client/                    # React 18 + Vite + Tailwind CSS SPA
    ├── src/
    │   ├── components/        # Button, Badge, ProgressBar, VideoPlayer, Modal, Input, Navbar, Footer
    │   ├── context/           # AuthContext, ToastContext
    │   ├── layouts/           # MainLayout, StudentLayout, AdminLayout
    │   ├── pages/
    │   │   ├── public/        # HomePage, CourseCatalogPage, CourseDetailPage
    │   │   ├── auth/          # LoginPage, RegisterPage
    │   │   ├── student/       # StudentDashboardPage, MyCoursesPage, CoursePlayerPage, ProfilePage
    │   │   └── admin/         # AdminDashboardPage, AdminCoursesPage, CourseEditorPage, AdminUsersPage, AdminEnrollmentsPage
    │   ├── services/          # API client, authService, courseService, progressService, enrollmentService, adminService
    │   ├── App.jsx            # React Router v6 routing hierarchy
    │   └── main.jsx           # React DOM root entrypoint
    ├── index.html
    └── vite.config.js
```
