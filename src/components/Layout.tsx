import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">PG</span> Review
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              Browse
            </NavLink>
            {user ? (
              <>
                <NavLink to="/add-pg">Add PG</NavLink>
                <span className="nav-user" title={user.email}>
                  {user.email}
                </span>
                <button type="button" className="btn btn-ghost" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>
            <strong>PG Review</strong> — real tenant reviews for PGs in Gurgaon
            &amp; Delhi NCR. Because your security deposit shouldn't be a
            donation.
          </p>
        </div>
      </footer>
    </div>
  )
}
