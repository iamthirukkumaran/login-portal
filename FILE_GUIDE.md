# Student Management System - File Guide

## Project Structure & File Purpose Overview

This guide shows the complete file structure with a 4-line purpose for each file. Start reading from the **Entry Point** and follow the flow.

---

## 📌 ENTRY POINT - START HERE

### `app/page.tsx` ✅ START
- Landing page displayed when user visits root URL (/)
- Redirects authenticated users to dashboard
- Shows login link for new users
- Handles automatic redirect based on auth status

### `app/login/page.tsx` ✅ SECOND
- Login form page for user authentication
- Validates email and password credentials
- Calls `/api/auth/login` endpoint for verification
- Redirects to dashboard on successful login

---

## 🔐 AUTHENTICATION FLOW

### `context/AuthContext.tsx` ⚠️ CRITICAL
- Provides global auth state (user, token) to entire app
- Manages login/logout functionality across components
- Wraps all pages with authentication provider
- Used by `useAuthGuard` hook for protected routes

### `hooks/useAuthGuard.ts` ⚠️ CRITICAL
- Custom hook that enforces authentication checks
- Redirects unauthenticated users to login page
- Used in dashboard pages to protect routes
- Returns user object and loading state

### `lib/auth/jwt.ts` ⚠️ CRITICAL
- Handles JWT token encoding and decoding
- Signs tokens with secret key from environment
- Verifies token authenticity and expiration
- Used by login and auth middleware

### `lib/auth/permissions.ts` ⚠️ CRITICAL
- Defines role-based access control (RBAC) rules
- Checks if user has permission for specific actions
- Supports roles: admin, teacher, student
- Used in API routes and components

### `middleware.ts` ⚠️ CRITICAL
- Intercepts all requests before they reach routes
- Validates JWT tokens on protected paths
- Redirects unauthenticated requests to login
- Runs on every API and page request

---

## 📊 API ENDPOINTS - BACKEND LOGIC

### `app/api/auth/login/route.ts` 🔗 API
- Handles POST request with email and password
- Validates credentials against database
- Generates JWT token on success
- Returns token and user info to frontend

### `app/api/auth/me/route.ts` 🔗 API
- Handles GET request to fetch current user
- Validates JWT token from request header
- Returns authenticated user's profile data
- Used by AuthContext to get current user

### `app/api/auth/register/route.ts` 🔗 API
- Handles POST request to create new user account
- Validates email doesn't already exist
- Hashes password using bcryptjs
- Creates user document in database

### `app/api/students/route.ts` 🔗 API
- GET: Fetches all students with pagination
- POST: Creates new student record
- Used by students list page
- Requires admin or teacher role

### `app/api/students/[id]/route.ts` 🔗 API
- GET: Fetches single student by ID
- PUT: Updates student details (fees, marks, etc)
- DELETE: Removes student from database
- Used by student profile page

### `app/api/students/[id]/payment/route.ts` 🔗 API
- POST: Records new payment transaction
- Validates payment amount against outstanding fees
- Updates student's payment history array
- Returns updated payment status

### `app/api/students/email/[email]/route.ts` 🔗 API
- GET: Checks if email already exists in system
- Used during student registration to validate email
- Returns student data if found
- Prevents duplicate email registration

### `app/api/marks/route.ts` 🔗 API
- GET: Fetches marks for all students
- POST: Creates/updates semester marks
- Used by semester marks table
- Stores marks for up to 8 semesters

### `app/api/teachers/route.ts` 🔗 API
- GET: Fetches all teachers with pagination
- POST: Creates new teacher record
- Returns list of teachers for dashboard
- Requires admin role

### `app/api/teachers/[id]/route.ts` 🔗 API
- GET: Fetches single teacher by ID
- PUT: Updates teacher details and status
- DELETE: Removes teacher from database
- Used by teacher profile management

---

## 🗄️ DATABASE MODELS

### `lib/model/UserModel.ts` 📦 DATABASE
- Defines base User schema for all user types
- Fields: email, password (hashed), role, createdAt
- Used by login and registration endpoints
- Base model inherited by Student/Teacher

### `lib/model/StudentModel.ts` 📦 DATABASE
- Extends UserModel with student-specific fields
- Tracks: customFee, totalPaid, paymentHistory, marks
- Stores semester grades for up to 8 semesters
- Payment tracking with transaction dates

### `lib/model/TeacherModel.ts` 📦 DATABASE
- Extends UserModel with teacher-specific fields
- Tracks: subject, department, joinDate, status
- Manages teacher availability and schedule
- Used by teacher management page

### `lib/model/MarkSchema.ts` 📦 DATABASE
- Defines marks for individual student-semester
- Fields: studentId, semester, subjects (6 subjects)
- Each subject stores 3 internal marks + 1 final
- Used by semester marks tracking

### `lib/db/mongoose.ts` 📦 DATABASE
- Manages MongoDB Mongoose connection
- Handles connection pooling and errors
- Exports Mongoose instance for model usage
- Called on first API request

### `lib/db/dbconnect.tsx` 📦 DATABASE
- Ensures MongoDB connection is active
- Called before database operations
- Prevents multiple connection attempts
- Handles connection errors gracefully

---

## 🎨 COMPONENTS - UI ELEMENTS

### `components/auth/LoginForm.tsx` 🧩 UI
- Form component for user login
- Validates email and password inputs
- Calls login API endpoint
- Handles loading and error states

### `components/students/StudentTable.tsx` 🧩 UI
- Displays all students in table/card format
- Desktop: Traditional table layout
- Mobile: Card-based responsive layout
- Links to individual student profiles

### `components/students/StudentRow.tsx` 🧩 UI
- Single row in students table
- Shows student name, email, roll number
- Action buttons: view, edit, delete
- Used within StudentTable component

### `components/students/StudentDetailsCard.tsx` 🧩 UI
- Displays student personal information
- Shows name, email, roll number, DOB
- Edit button for profile updates
- Used on student profile page

### `components/students/StudentMarksCard.tsx` 🧩 UI
- Shows student's semester marks summary
- Displays all 8 semesters with subject grades
- View/edit buttons for each semester
- Calculates GPA from marks

### `components/students/SemesterMarksTable.tsx` 🧩 UI
- Detailed table of marks for one semester
- Shows 6 subjects with internal and final marks
- Edit functionality for marks entry
- Calculates total and average

### `components/students/SemesterMarksForm.tsx` 🧩 UI
- Form to enter/edit marks for semester
- Input fields for 6 subjects
- Validates marks are within valid range
- Saves to database on submission

### `components/students/AddStudentSlider.tsx` 🧩 UI
- Slide-out panel to add new student
- Form inputs: name, email, roll number, DOB, fees
- Validates email doesn't exist
- Calls POST /api/students to create

### `components/students/PaymentModal.tsx` 🧩 UI
- Modal popup for recording payment
- Input: payment amount and method
- Validates payment doesn't exceed outstanding fees
- Updates payment history

### `components/students/PaymentHistoryModal.tsx` 🧩 UI
- Modal showing transaction history
- Lists all payments with dates and amounts
- Shows payment method and status
- Displays total paid vs total fees

### `components/teachers/TeacherTable.tsx` 🧩 UI
- Displays all teachers in table/card format
- Desktop: Traditional table layout
- Mobile: Card-based responsive layout
- Links to teacher management

### `components/teachers/TeacherRow.tsx` 🧩 UI
- Single row in teachers table
- Shows teacher name, subject, department
- Action buttons: view, edit, delete
- Used within TeacherTable component

### `components/teachers/TeacherForm.tsx` 🧩 UI
- Form to create/edit teacher details
- Fields: name, email, subject, department, status
- Validation and error handling
- Used by AddTeacherSlider

### `components/teachers/AddTeacherSlider.tsx` 🧩 UI
- Slide-out panel to add new teacher
- Embeds TeacherForm component
- Form submission triggers API call
- Refreshes teacher list on success

### `components/ui/*.tsx` 🧩 UI
- Shadcn/ui component library files
- Provides: Button, Card, Dialog, Input, Form, etc
- Reusable UI primitives with Tailwind styling
- Used by all custom components

---

## 📄 DASHBOARD PAGES

### `app/dashboard/layout.tsx` 📖 PAGE
- Main dashboard layout with sidebar navigation
- Fixed sidebar on desktop, toggle on mobile
- Sticky header with logo and user menu
- Wraps all dashboard child pages

### `app/dashboard/page.tsx` 📖 PAGE
- Dashboard home/overview page
- Shows welcome message and quick stats
- Recent students/teachers activity
- Links to main sections

### `app/dashboard/students/page.tsx` 📖 PAGE
- Students management page
- Displays StudentTable component
- Add Student button opens AddStudentSlider
- Search and filter functionality

### `app/dashboard/students/[id]/page.tsx` 📖 PAGE
- Individual student profile page
- Shows StudentDetailsCard
- Displays StudentMarksCard
- Fee management and payment buttons

### `app/dashboard/profile/page.tsx` 📖 PAGE
- Current logged-in user's profile
- Edit personal information
- View and manage own fees
- Payment history and record payment

### `app/dashboard/teachers/page.tsx` 📖 PAGE
- Teachers management page
- Displays TeacherTable component
- Add Teacher button opens AddTeacherSlider
- Search and filter functionality

### `app/dashboard/teachers/[id]/page.tsx` 📖 PAGE
- Individual teacher profile page
- Shows teacher details and assignments
- Edit teacher information
- View classes and schedule

---

## 🛠️ UTILITIES & HELPERS

### `lib/utils.ts` 🔧 UTILITY
- Classname merging utility (cn function)
- Used for conditional Tailwind CSS classes
- Helper for component styling
- General utility functions

### `utils/helpers.ts` 🔧 UTILITY
- Business logic helper functions
- Fee calculations and validations
- Date formatting helpers
- Common operations across pages

### `utils/formatDate.ts` 🔧 UTILITY
- Date formatting to readable strings
- Converts timestamps to DD/MM/YYYY format
- Used throughout app for date display
- Handles timezone conversions

### `hooks/use-mobile.ts` 🔧 UTILITY
- Custom hook to detect mobile device
- Uses matchMedia API for responsive detection
- Breakpoint: 768px (Tailwind md breakpoint)
- Used by components for mobile-specific logic

### `hooks/useFetch.ts` 🔧 UTILITY
- Custom hook for API requests
- Handles loading, error, and data states
- Automatic error handling
- Used by pages for data fetching

### `lib/validation/validators.ts` 🔧 UTILITY
- Form validation rules and functions
- Email, password, phone validation
- Fee and marks range validation
- Used by forms and API endpoints

### `types/index.d.ts` 📝 TYPES
- TypeScript type definitions
- Student, Teacher, User interfaces
- Mark and Payment data types
- API request/response types

---

## ⚙️ CONFIGURATION FILES

### `next.config.ts` ⚙️ CONFIG
- Next.js configuration and build settings
- Specifies static export or server rendering
- Image optimization settings
- Environment variable configuration

### `tsconfig.json` ⚙️ CONFIG
- TypeScript compiler configuration
- Path aliases (@/* for imports)
- Strict type checking rules
- Target ES version and lib

### `postcss.config.mjs` ⚙️ CONFIG
- PostCSS configuration for Tailwind CSS
- Plugins: Tailwind, Autoprefixer
- Used during CSS compilation
- Build pipeline configuration

### `components.json` ⚙️ CONFIG
- Shadcn/ui component library configuration
- Specifies component alias and paths
- Tailwind and CSS variables setup
- Used by shadcn/ui commands

### `eslint.config.mjs` ⚙️ CONFIG
- ESLint code quality rules
- Enforces code style and best practices
- React and Next.js specific rules
- Used during development and CI/CD

### `package.json` ⚙️ CONFIG
- Project dependencies and versions
- Build, dev, and test scripts
- Project metadata (name, version)
- NPM package registry configuration

### `.env.local` ⚙️ CONFIG
- Environment variables (NOT in git)
- MongoDB Atlas connection string
- JWT secret key
- Database credentials

### `.gitignore` ⚙️ CONFIG
- Files excluded from git repository
- node_modules, .next, .env.local
- Prevents sensitive/large files from uploading
- Keeps repository clean

### `vercel.json` ⚙️ CONFIG
- Vercel deployment configuration
- Build and deployment settings
- Environment variables for production
- Region and performance settings

---

## 📚 DOCUMENTATION

### `README.md` 📖 DOCS
- Project overview and description
- Setup instructions for developers
- Feature list and capabilities
- Deployment guides

### `FILE_GUIDE.md` 📖 DOCS
- This file - complete file reference guide
- Shows purpose of every file
- Explains data flow and relationships
- Starting point for new developers

---

## 🔄 DATA FLOW SUMMARY

### User Registration Flow:
`LoginForm.tsx` → `POST /api/auth/register` → `UserModel.ts` → MongoDB → Login

### User Login Flow:
`LoginForm.tsx` → `POST /api/auth/login` → `jwt.ts` → `AuthContext.tsx` → Dashboard

### Protected Route Access:
`middleware.ts` → Validate JWT → `useAuthGuard.ts` → Show Dashboard

### Student Profile View:
`dashboard/students/[id]/page.tsx` → `GET /api/students/[id]` → `StudentModel.ts` → Display Components

### Fee Payment Recording:
`PaymentModal.tsx` → `POST /api/students/[id]/payment` → Update `totalPaid` → `PaymentHistoryModal.tsx`

### Semester Marks Entry:
`SemesterMarksForm.tsx` → `POST /api/marks` → `MarkSchema.ts` → Display in `SemesterMarksTable.tsx`

---

## 🎯 WHERE TO START CODING

**For New Features:**
1. Start with database model in `lib/model/`
2. Create API endpoint in `app/api/`
3. Add UI component in `components/`
4. Integrate into page in `app/dashboard/`

**For Bug Fixes:**
1. Check error in browser console
2. Find related file from this guide
3. Review logic in that file
4. Test in development locally

**For UI Changes:**
1. Edit component in `components/`
2. Use Tailwind CSS for styling
3. Test on mobile with `use-mobile.ts`
4. Rebuild and deploy

---

## 📋 QUICK REFERENCE

| Category | Key Files | Purpose |
|----------|-----------|---------|
| **Auth** | AuthContext, useAuthGuard, jwt.ts, middleware.ts | User authentication & protection |
| **Database** | StudentModel, TeacherModel, UserModel, MarkSchema | Data storage & models |
| **API** | /api/students, /api/teachers, /api/auth, /api/marks | Backend endpoints |
| **UI** | components/students, components/teachers, ui/* | Visual components |
| **Pages** | dashboard/*, login/page.tsx | User-facing pages |
| **Config** | package.json, tsconfig.json, next.config.ts | Project setup |

---

**Last Updated:** November 26, 2025  
**Project:** Student Management System  
**Tech Stack:** Next.js 16, React 19, MongoDB Atlas, TypeScript, Tailwind CSS
