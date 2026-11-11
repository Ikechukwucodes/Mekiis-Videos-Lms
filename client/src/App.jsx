import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

// Layouts
import { MainLayout } from './layouts/MainLayout.jsx';
import { StudentLayout } from './layouts/StudentLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';

// Public Pages
import { HomePage } from './pages/public/HomePage.jsx';
import { CourseCatalogPage } from './pages/public/CourseCatalogPage.jsx';
import { CourseDetailPage } from './pages/public/CourseDetailPage.jsx';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { RegisterPage } from './pages/auth/RegisterPage.jsx';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage.jsx';
import { MyCoursesPage } from './pages/student/MyCoursesPage.jsx';
import { CoursePlayerPage } from './pages/student/CoursePlayerPage.jsx';
import { ProfilePage } from './pages/student/ProfilePage.jsx';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.jsx';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage.jsx';
import { CourseEditorPage } from './pages/admin/CourseEditorPage.jsx';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.jsx';
import { AdminEnrollmentsPage } from './pages/admin/AdminEnrollmentsPage.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Layout Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CourseCatalogPage />} />
                <Route path="/courses/:id" element={<CourseDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Immersive Course Learning Page (Fullscreen) */}
              <Route path="/learn/:courseId" element={<CoursePlayerPage />} />

              {/* Student Protected Routes */}
              <Route path="/dashboard" element={<StudentLayout />}>
                <Route index element={<StudentDashboardPage />} />
                <Route path="courses" element={<MyCoursesPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route path="courses/:id/edit" element={<CourseEditorPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="enrollments" element={<AdminEnrollmentsPage />} />
              </Route>

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
