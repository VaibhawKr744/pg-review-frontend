import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPg, errorMessage } from '../lib/api'

export default function AddPg() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const pg = await createPg({ name, city, address })
      navigate(`/pgs/${pg.id}`)
    } catch (err) {
      setError(errorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>Add a PG</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Name
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sunrise PG for Boys"
          />
        </label>
        <label>
          City
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Gurgaon"
          />
        </label>
        <label>
          Address
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Sector 45, near Huda City Centre"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add PG'}
        </button>
      </form>
    </div>
  )
}
