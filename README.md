# Student Management System

A comprehensive web application for managing students, teachers, marks, and fees in an educational institution. Built with Next.js, React, MongoDB Atlas, and deployed on Vercel.

## 🎯 Features

### **Student Management**
- Create, view, and manage student profiles
- Track student information (name, email, phone, city, DOB, group, 12th marks)
- Edit student details with modern UI

### **Semester Marks Tracking**
- Record marks for 8 semesters
- 6 subjects per semester
- View and edit semester marks
- Delete marks if needed

### **Fees Management System**
- Track full fees amount (already discounted)
- Record student payments with multiple payment methods
- Monitor total paid and remaining balance
- View complete payment history with transaction details
- Real-time payment progress tracking
- Payment status indicators

### **Teacher Management**
- Add and manage teachers
- Track teacher information
- Assign teachers to subjects

### **User Authentication**
- Role-based access control (Super Admin, Teacher, Student)
- Secure password hashing with bcrypt
- JWT-based authentication
- Protected API routes

### **Admin Panel**
- Full system administration capabilities
- Manage all users and data
- View comprehensive reports

## 🛠️ Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcrypt
- **UI Components**: Shadcn/ui
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Vercel account (for deployment)
- Git

## 🚀 Getting Started

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/student-management-system.git
   cd student-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env.local` in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?appName=Cluster0
   JWT_SECRET=your-secret-key-here
   ```

4. **Create Super Admin (First Time Only)**
   ```bash
   npx ts-node scripts/pushSuperAdminToAtlas.ts
   ```
   This will create a super admin account with credentials:
   - Email: `superadmin@institute.com`
   - Password: `SuperAdmin@123`

5. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Production Build

```bash
npm run build
npm run start
```

This creates an optimized production build and starts the server.

## 🔐 Default Super Admin Credentials

**First login only:**
- Email: `superadmin@institute.com`
- Password: `SuperAdmin@123`

⚠️ **Important**: Change the password after first login!

## 📱 API Routes

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - List all students
- `GET /api/students/[id]` - Get student details
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student
- `POST /api/students/[id]/payment` - Record payment
- `GET /api/students/email/[email]` - Get student by email

### Teachers
- `GET /api/teachers` - List all teachers
- `GET /api/teachers/[id]` - Get teacher details
- `POST /api/teachers` - Create teacher

### Marks
- `GET /api/marks` - Get marks

## 🌐 Deployment on Vercel

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Student Management System"

# Add remote
git remote add origin https://github.com/yourusername/student-management-system.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Select your repository
5. Configure environment variables:
   - Add `MONGODB_URI`
   - Add `JWT_SECRET`
6. Click "Deploy"

**Option B: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### 3. Configure Environment Variables in Vercel

In your Vercel project settings:
1. Go to Settings → Environment Variables
2. Add the following variables:
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## 🔄 Database Setup

### MongoDB Atlas

1. Create an account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user
4. Get connection string
5. Set it in `.env.local` as `MONGODB_URI`

### Collections Created Automatically

- `users` - Store user accounts
- `students` - Student profiles
- `teachers` - Teacher profiles

## 📊 Fee Management Workflow

1. **Set Student Fees**
   - Navigate to student profile
   - Click "Edit" button
   - Enter the full fees amount (already discounted)
   - Save

2. **Record Payment**
   - Click "Pay" button
   - Enter payment amount
   - Select payment method
   - Add optional remarks
   - Submit

3. **View Payment History**
   - Click "Summary" button
   - See all transactions
   - Track total paid and remaining balance
   - Monitor payment progress

## 🎓 User Roles

### Super Admin
- Full system access
- Manage all students and teachers
- Manage user accounts
- View all reports

### Teacher
- View assigned students
- Record student marks
- Record student payments
- View student details

### Student
- View own profile
- View own marks
- View own fee information
- View own payment history

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string is URL-encoded
- Check IP whitelist in MongoDB Atlas
- Ensure database user permissions are correct

### Build Errors
- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Deployment Issues
- Check Vercel logs: `vercel logs`
- Verify environment variables are set
- Ensure MongoDB Atlas cluster is accessible

## 📞 Support

For issues and questions:
1. Check GitHub Issues
2. Review documentation
3. Contact admin

## 📄 License

This project is private and proprietary.

## 👥 Contributors

- Your Name (Lead Developer)

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Production Ready ✅
