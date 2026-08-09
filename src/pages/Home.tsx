import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage, listPgs } from '../lib/api'
import type { Pg } from '../types'

export default function Home() {
  const [pgs, setPgs] = useState<Pg[]>([])
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchPgs(cityFilter?: string) {
    setLoading(true)
    setError('')
    try {
      setPgs(await listPgs(cityFilter))
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
        <h1>Find a PG you can trust</h1>
        <p className="muted">
          Real reviews from tenants in Gurgaon &amp; Delhi NCR — including
          whether the owner actually returned the security deposit.
        </p>
        <form className="search-bar" onSubmit={onSearch}>
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
        <p className="muted">Loading PGs…</p>
      ) : pgs.length === 0 ? (
        <p className="muted">
          No PGs found{city ? ` for “${city}”` : ''}.{' '}
          <Link to="/add-pg">Add one?</Link>
        </p>
      ) : (
        <ul className="card-list">
          {pgs.map((pg) => (
            <li key={pg.id} className="card">
              <Link to={`/pgs/${pg.id}`} className="card-link">
                <h2>{pg.name}</h2>
                <p className="muted">
                  {pg.address}, {pg.city}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
