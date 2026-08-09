import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './lib/auth'
import AddPg from './pages/AddPg'
import Home from './pages/Home'
import Login from './pages/Login'
import PgDetail from './pages/PgDetail'
import Signup from './pages/Signup'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pgs/:pgId" element={<PgDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/add-pg"
              element={
                <ProtectedRoute>
                  <AddPg />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<p className="muted">Page not found.</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
