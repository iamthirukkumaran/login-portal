# Student Management System - Setup Steps (Order of Creation)

## STEP 1: Initialize Project & Config Files

### Step 1.1: `package.json`
**Path**: `/package.json`
- Install: `npm install`

### Step 1.2: `tsconfig.json`
**Path**: `/tsconfig.json`

### Step 1.3: `next.config.ts`
**Path**: `/next.config.ts`

### Step 1.4: `postcss.config.mjs`
**Path**: `/postcss.config.mjs`

### Step 1.5: `tailwind.config.ts`
**Path**: `/tailwind.config.ts`

### Step 1.6: `eslint.config.mjs`
**Path**: `/eslint.config.mjs`

### Step 1.7: `components.json`
**Path**: `/components.json`

### Step 1.8: `.env.local`
**Path**: `/.env.local`
```
MONGODB_URI=mongodb://localhost:27017/management
JWT_SECRET=d6fe9628f8d37cf1b4e4c3e8b9f4a5c9d7e8f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7
NEXT_PUBLIC_SEMESTER_1_SUBJECTS=Physics,Chemistry,Math,Biology,History,Social
NEXT_PUBLIC_SEMESTER_2_SUBJECTS=Physics,Chemistry,Math,Biology,History,Social
NEXT_PUBLIC_SEMESTER_3_SUBJECTS=Physics,Chemistry,Math,Biology,History,Social
NEXT_PUBLIC_SEMESTER_4_SUBJECTS=Physics,Chemistry,Math,Biology,History,Social
NEXT_PUBLIC_SEMESTER_5_SUBJECTS=Physics,Chemistry,Math,Biology,History,Social
NEXT_PUBLIC_SEMESTER_6_SUBJECTS=Physics,Chemistry,Math,Biology,History,Social
NEXT_PUBLIC_SEMESTER_7_SUBJECTS=Physics,Chemistry,Math,Biology,History,Social
NEXT_PUBLIC_SEMESTER_8_SUBJECTS=Physics,Chemistry,Math,Biology,History,Social
```

### Step 1.9: `middleware.ts`
**Path**: `/middleware.ts`

---

## STEP 2: Create Database Models & Utilities

### Step 2.1: `lib/db/mongoose.ts`
**Path**: `/lib/db/mongoose.ts`

### Step 2.2: `lib/db/dbconnect.tsx`
**Path**: `/lib/db/dbconnect.tsx`

### Step 2.3: `lib/model/MarkSchema.ts`
**Path**: `/lib/model/MarkSchema.ts`

### Step 2.4: `lib/model/UserModel.ts`
**Path**: `/lib/model/UserModel.ts`

### Step 2.5: `lib/model/StudentModel.ts`
**Path**: `/lib/model/StudentModel.ts`

### Step 2.6: `lib/model/TeacherModel.ts`
**Path**: `/lib/model/TeacherModel.ts`

### Step 2.7: `lib/utils/generateStudentId.ts`
**Path**: `/lib/utils/generateStudentId.ts`

### Step 2.8: `lib/utils/feeCalculation.ts`
**Path**: `/lib/utils/feeCalculation.ts`

### Step 2.9: `lib/auth/jwt.ts`
**Path**: `/lib/auth/jwt.ts`

### Step 2.10: `lib/auth/permissions.ts`
**Path**: `/lib/auth/permissions.ts`

### Step 2.11: `lib/utils.ts`
**Path**: `/lib/utils.ts`

### Step 2.12: `types/index.d.ts`
**Path**: `/types/index.d.ts`

### Step 2.13: `lib/validation/validators.ts`
**Path**: `/lib/validation/validators.ts`

### Step 2.14: `utils/formatDate.ts`
**Path**: `/utils/formatDate.ts`

### Step 2.15: `utils/helpers.ts`
**Path**: `/utils/helpers.ts`

---

## STEP 3: Create API Routes

### Step 3.1: `app/api/auth/login/route.ts`
**Path**: `/app/api/auth/login/route.ts`

### Step 3.2: `app/api/auth/register/route.ts`
**Path**: `/app/api/auth/register/route.ts`

### Step 3.3: `app/api/auth/me/route.ts`
**Path**: `/app/api/auth/me/route.ts`

### Step 3.4: `app/api/students/route.ts`
**Path**: `/app/api/students/route.ts`

### Step 3.5: `app/api/students/[id]/route.ts`
**Path**: `/app/api/students/[id]/route.ts`

### Step 3.6: `app/api/student/route.ts`
**Path**: `/app/api/student/route.ts`

### Step 3.7: `app/api/marks/route.ts`
**Path**: `/app/api/marks/route.ts`

---

## STEP 4: Create Context & Hooks

### Step 4.1: `context/AuthContext.tsx`
**Path**: `/context/AuthContext.tsx`

### Step 4.2: `hooks/useAuthGuard.ts`
**Path**: `/hooks/useAuthGuard.ts`

### Step 4.3: `hooks/useFetch.ts`
**Path**: `/hooks/useFetch.ts`

### Step 4.4: `hooks/use-mobile.ts`
**Path**: `/hooks/use-mobile.ts`

---

## STEP 5: Create UI Components (Shadcn/ui)

### Step 5.1: `components/ui/button.tsx`
**Path**: `/components/ui/button.tsx`

### Step 5.2: `components/ui/card.tsx`
**Path**: `/components/ui/card.tsx`

### Step 5.3: `components/ui/input.tsx`
**Path**: `/components/ui/input.tsx`

### Step 5.4: `components/ui/label.tsx`
**Path**: `/components/ui/label.tsx`

### Step 5.5: `components/ui/form.tsx`
**Path**: `/components/ui/form.tsx`

### Step 5.6: `components/ui/dialog.tsx`
**Path**: `/components/ui/dialog.tsx`

### Step 5.7: `components/ui/sheet.tsx`
**Path**: `/components/ui/sheet.tsx`

### Step 5.8: `components/ui/table.tsx`
**Path**: `/components/ui/table.tsx`

### Step 5.9: `components/ui/separator.tsx`
**Path**: `/components/ui/separator.tsx`

### Step 5.10: `components/ui/tooltip.tsx`
**Path**: `/components/ui/tooltip.tsx`

### Step 5.11: `components/ui/dropdown-menu.tsx`
**Path**: `/components/ui/dropdown-menu.tsx`

### Step 5.12: `components/ui/skeleton.tsx`
**Path**: `/components/ui/skeleton.tsx`

---

## STEP 6: Create Feature Components

### Step 6.1: `components/auth/LoginForm.tsx`
**Path**: `/components/auth/LoginForm.tsx`

### Step 6.2: `components/students/StudentTable.tsx`
**Path**: `/components/students/StudentTable.tsx`

### Step 6.3: `components/students/StudentRow.tsx`
**Path**: `/components/students/StudentRow.tsx`

### Step 6.4: `components/students/AddStudentSlider.tsx`
**Path**: `/components/students/AddStudentSlider.tsx`

### Step 6.5: `components/students/StudentDetailsCard.tsx`
**Path**: `/components/students/StudentDetailsCard.tsx`

### Step 6.6: `components/students/StudentMarksCard.tsx`
**Path**: `/components/students/StudentMarksCard.tsx`

### Step 6.7: `components/students/SemesterMarksTable.tsx`
**Path**: `/components/students/SemesterMarksTable.tsx`

### Step 6.8: `components/students/SemesterMarksForm.tsx`
**Path**: `/components/students/SemesterMarksForm.tsx`

### Step 6.9: `components/students/AddSemesterMarksSlider.tsx`
**Path**: `/components/students/AddSemesterMarksSlider.tsx`

---

## STEP 7: Create Global Styles

### Step 7.1: `app/globals.css`
**Path**: `/app/globals.css`

---

## STEP 8: Create Root Layout

### Step 8.1: `app/layout.tsx`
**Path**: `/app/layout.tsx`
- Wrap with AuthContext
- Include globals.css
- Set up metadata

---

## STEP 9: Create Public Pages

### Step 9.1: `app/page.tsx`
**Path**: `/app/page.tsx`
- Home/Landing page

### Step 9.2: `app/login/page.tsx`
**Path**: `/app/login/page.tsx`
- Login form page

---

## STEP 10: Create Dashboard Structure

### Step 10.1: `app/dashboard/layout.tsx`
**Path**: `/app/dashboard/layout.tsx`
- Dashboard wrapper
- Sidebar/Navigation

### Step 10.2: `app/dashboard/page.tsx`
**Path**: `/app/dashboard/page.tsx`
- Dashboard home

---

## STEP 11: Create Students Pages

### Step 11.1: `app/dashboard/students/page.tsx`
**Path**: `/app/dashboard/students/page.tsx`
- All students list page

### Step 11.2: `app/dashboard/students/[id]/page.tsx`
**Path**: `/app/dashboard/students/[id]/page.tsx`
- Individual student view/edit

---

## STEP 12: Create Profile Page (MAIN FEATURE)

### Step 12.1: `app/dashboard/profile/page.tsx`
**Path**: `/app/dashboard/profile/page.tsx`

**Key Functions to Implement**:
- `getSubjectsForSemester(semester)` - Fetch subjects from .env
- `initializeFormForSemester(semester)` - Initialize form with subjects
- `handleAddMarksClick()` - Auto-select next semester
- `handleSubjectChangeInline()` - Update form state
- `handleSaveMarksInline()` - Save marks to API
- `handleEditMark()` - Enter edit mode
- `handleSaveMark()` - Update existing marks
- `handleDeleteMark()` - Delete semester marks

**UI Structure**:
- Student profile info display
- "Add Marks" button (top right)
- Form appears with 6-column grid
- Subject names as headers (read-only from .env)
- Input fields for marks (0-100)
- Save/Cancel buttons
- Display saved marks in 6-column grid
- Edit/Delete buttons for existing marks

---

## STEP 13: Optional - Scripts

### Step 13.1: `scripts/createSuperAdmin.ts`
**Path**: `/scripts/createSuperAdmin.ts`

### Step 13.2: `scripts/resetAllPasswords.ts`
**Path**: `/scripts/resetAllPasswords.ts`

---

## FINAL STEPS

### Step 14: Start Development Server
```bash
npm run dev
```
- Server runs on http://localhost:3000

### Step 15: Create Super Admin
```bash
npm run create-superadmin
```

### Step 16: Test Flow
1. Register student
2. Login
3. View profile
4. Add Semester 1 marks
5. Add Semester 2 marks
6. Edit Semester 1 marks
7. Delete Semester 2 marks
8. Verify auto-increment to next semester

---

## FILE DEPENDENCY ORDER (For Reference)

```
1. Config Files (package.json, tsconfig.json, etc.)
2. Database Setup (mongoose, models)
3. Auth Utils (jwt, permissions)
4. API Routes (auth, students, marks)
5. Context & Hooks
6. UI Components (shadcn)
7. Feature Components
8. Pages (root → dashboard → profile)
```

---

## CRITICAL FILES FOR MARKS FEATURE

**These files handle semester marks**:
1. `/lib/model/MarkSchema.ts` - Data structure
2. `/app/api/students/[id]/route.ts` - Save/update API
3. `/app/dashboard/profile/page.tsx` - Main UI
4. `/.env.local` - Subject configuration

**Environment Variables for Subjects**:
- `NEXT_PUBLIC_SEMESTER_1_SUBJECTS` through `NEXT_PUBLIC_SEMESTER_8_SUBJECTS`
- Format: `Physics,Chemistry,Math,Biology,History,Social`

---

## DATABASE COLLECTIONS (Created Automatically by Mongoose)

1. **users** - User accounts
2. **students** - Student profiles with marks
3. **teachers** - Teacher data

---

## TOTAL FILES TO CREATE: ~70 files
- Config: 9 files
- Database: 7 files
- API Routes: 7 files
- Context/Hooks: 4 files
- UI Components: 12 files
- Feature Components: 9 files
- Pages: 8 files
- Utilities: 5 files
- Styles: 1 file
- Scripts: 2 files

