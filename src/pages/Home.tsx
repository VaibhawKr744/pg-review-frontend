import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage, listPgs } from '../lib/api'
import type { Pg } from '../types'

export default function Home() {
  const [pgs, setPgs] = useState<Pg[]>([])
  const [city, setCity] = useState('')
  const [activeCity, setActiveCity] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchPgs(cityFilter?: string) {
    setLoading(true)
    setError('')
    try {
      setPgs(await listPgs(cityFilter))
      setActiveCity(cityFilter ?? '')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPgs()
  }, [])

  function onSearch(e: FormEvent) {
    e.preventDefault()
    fetchPgs(city.trim() || undefined)
  }

  return (
    <>
      <section className="hero-block">
        <p className="eyebrow">Gurgaon &amp; Delhi NCR</p>
        <h1>
          Find a PG you can <em>trust</em>
        </h1>
        <p className="hero-sub">
          Real reviews from real tenants — including the one thing brokers
          won't tell you: <strong>does the owner return the deposit?</strong>
        </p>
        <form className="search-bar" onSubmit={onSearch}>
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search by city, e.g. Gurgaon"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </section>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="card-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card skeleton-card">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
            </div>
          ))}
        </div>
      ) : pgs.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🏠</p>
          <h2>No PGs found{activeCity ? ` for “${activeCity}”` : ''}</h2>
          <p className="muted">
            Know a PG that should be here?{' '}
            <Link to="/add-pg">Add it and leave the first review.</Link>
          </p>
        </div>
      ) : (
        <>
          <div className="list-heading">
            <h2>
              {activeCity ? `PGs in “${activeCity}”` : 'All PGs'}{' '}
              <span className="count-pill">{pgs.length}</span>
            </h2>
          </div>
          <div className="card-grid">
            {pgs.map((pg) => (
              <Link key={pg.id} to={`/pgs/${pg.id}`} className="card pg-card">
                <h3>{pg.name}</h3>
                <p className="muted">
                  {pg.address}, {pg.city}
                </p>
                <span className="card-cta">
                  View reviews <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  )
}
