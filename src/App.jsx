import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { ScrollProvider } from './context/ScrollContext'
import PrivateRoute from './context/PrivateRoute'
import './constants/i18n'

// страницы
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './components/Dashboard'
import Forbidden from './pages/Forbidden'
import Administration from './pages/AdministartionOwner'
import UniversitiesOwner from './pages/owner_pages/UniversitiesOwner'
import AdminsOwner from './pages/owner_pages/AdminsOwner'
import DirectionsOwner from './pages/owner_pages/DirectionsOwner'
import KafedraOwner from './pages/owner_pages/KafedraOwner'
import SubjectsOwner from './pages/owner_pages/subjectsOwner'
import LiteartureOwner from './pages/owner_pages/LiteratureOwner'
import AdminstrationAdmin from './pages/AdministrationAdmin'
import UniversityAdmin from './pages/admin_pages/UniversityAdmin'
import DirectionAdmin from './pages/admin_pages/DirectionAdmin'
import KafedraAdmin from './pages/admin_pages/KafedraAdmin'
import SubjectsAdmin from './pages/admin_pages/SubjectsAdmin'
import LiteratureAdmin from './pages/admin_pages/LiteratureAdmin'
import Tr from './pages/Tr'
import InProcess from './components/InProcess'

// новые
import UserLayout from './components/UserLayout'
import Universities from './components/Universities'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import Main from './components/Main'
import AdminLayout from './pages/AdminLayout'
import Footer from './components/Footer'
import NewsOwner from './pages/owner_pages/NewsOwner'
import NewsPage from './pages/newsPage'
import NewsAdmin from './pages/admin_pages/newsAdmin'
import NewsPages from './pages/NewsPages'
import OnlineTests from './pages/OnlineTest'
import Articles from './pages/Articles'

// ----- Layouts -----
function MainLayout({ children }) {
  return (
    <div>
      <div className="header">
        <Navbar />
        <Header />
      </div>
      <div className="content">{children}</div>
      <Footer />
    </div>
  )
}

function PublicLayout({ children }) {
  return (
    <div>
      <div className="content">{children}</div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ScrollProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            ></Route>
            {/* Public pages */}
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />
            <Route
              path="/register"
              element={
                <PublicLayout>
                  <Register />
                </PublicLayout>
              }
            />

            <Route
              path="/administration/*"
              element={
                <PublicLayout>
                  <AdminLayout />
                </PublicLayout>
              }
            >
              <Route index element={<p>Выберите раздел</p>} />

              {/* Owner */}
              <Route
                path="owner/universities"
                element={<UniversitiesOwner />}
              />
              <Route path="owner/admins" element={<AdminsOwner />} />
              <Route path="owner/directions" element={<DirectionsOwner />} />
              <Route path="owner/kafedra" element={<KafedraOwner />} />
              <Route path="owner/subjects" element={<SubjectsOwner />} />
              <Route path="owner/literature" element={<LiteartureOwner />} />
              <Route path="owner/news" element={<NewsOwner />} />

              {/* Admin */}
              <Route
                path="superadmin/university"
                element={<UniversityAdmin />}
              />
              <Route path="superadmin/direction" element={<DirectionAdmin />} />
              <Route path="superadmin/kafedra" element={<KafedraAdmin />} />
              <Route path="superadmin/subject" element={<SubjectsAdmin />} />
              <Route
                path="superadmin/literature"
                element={<LiteratureAdmin />}
              />
              <Route path="superadmin/news" element={<NewsAdmin />} />
            </Route>

            {/* Protected Dashboard */}
            <Route
              path="/"
              element={
                <PrivateRoute roles={['owner', 'superadmin', 'user']}>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            {/* User pages */}
            <Route
              path="/universities/*"
              element={
                <MainLayout>
                  <UserLayout />
                </MainLayout>
              }
            >
              <Route index element={<Universities />} />
            </Route>

            <Route
              path="/in-process"
              element={
                <PrivateRoute roles={['user', 'owner', 'superadmin']}>
                  <UserLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<InProcess />} />
            </Route>

            <Route
              path="/articles"
              element={
                <>
                  <Navbar />
                  <Articles />
                  <Footer />
                </>
              }
            />
            <Route
              path="/online-tests"
              element={
                <>
                  <Navbar />
                  <OnlineTests />
                  <Footer />
                </>
              }
            />
            <Route
              path="/news"
              element={
                <>
                  <Navbar />
                  <NewsPages />
                  <Footer />
                </>
              }
            />
            <Route
              path="news/:id"
              element={
                <>
                  <Navbar />
                  <NewsPage />
                  <Footer />
                </>
              }
            />

            {/* Other */}
            <Route path="/tr" element={<Tr />} />
            <Route path="/forbidden" element={<Forbidden />} />
          </Routes>
        </Router>
      </ScrollProvider>
    </AuthProvider>
  )
}

export default App
