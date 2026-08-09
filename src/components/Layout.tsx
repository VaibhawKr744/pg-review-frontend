import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            PG Review
          </Link>
          <nav className="nav">
            <NavLink to="/">Browse</NavLink>
            {user ? (
              <>
                <NavLink to="/add-pg">Add PG</NavLink>
                <span className="nav-user">{user.email}</span>
                <button type="button" className="btn btn-ghost" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <NavLink to="/signup" className="btn btn-primary">
                  Sign up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}
