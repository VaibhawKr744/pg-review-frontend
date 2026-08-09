import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReviewForm from '../components/ReviewForm'
import { errorMessage, getPg, listReviews } from '../lib/api'
import { useAuth } from '../lib/auth'
import type { Pg, Review } from '../types'

export default function PgDetail() {
  const { pgId } = useParams<{ pgId: string }>()
  const { user } = useAuth()
  const [pg, setPg] = useState<Pg | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  const refreshReviews = useCallback(async () => {
    if (!pgId) return
    setReviews(await listReviews(pgId))
  }, [pgId])

  useEffect(() => {
    if (!pgId) return
    setLoading(true)
    Promise.all([getPg(pgId), listReviews(pgId)])
      .then(([pgData, reviewData]) => {
        setPg(pgData)
        setReviews(reviewData)
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true)
        else setError(errorMessage(err))
      })
      .finally(() => setLoading(false))
  }, [pgId])

  if (loading) return <p className="muted">Loading…</p>
  if (notFound)
    return (
      <p className="muted">
        PG not found. <Link to="/">Back to browse</Link>
      </p>
    )
  if (error) return <p className="error">{error}</p>
  if (!pg) return null

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null
  const depositReturnedCount = reviews.filter((r) => r.deposit_returned).length
  const depositRate =
    reviews.length > 0
      ? Math.round((depositReturnedCount / reviews.length) * 100)
      : null

  return (
    <>
      <section className="pg-header">
        <h1>{pg.name}</h1>
        <p className="muted">
          {pg.address}, {pg.city}
        </p>
        {reviews.length > 0 ? (
          <div className="stats">
            <div className="stat">
              <span className="stat-value">★ {avgRating}</span>
              <span className="stat-label">
                {reviews.length} review{reviews.length === 1 ? '' : 's'}
              </span>
            </div>
            <div
              className={`stat ${
                depositRate! >= 70 ? 'stat-good' : depositRate! >= 40 ? 'stat-warn' : 'stat-bad'
              }`}
            >
              <span className="stat-value">{depositRate}%</span>
              <span className="stat-label">deposits returned</span>
            </div>
          </div>
        ) : (
          <p className="muted">No reviews yet — be the first.</p>
        )}
      </section>

      <section>
        <h2>Write a review</h2>
        {user ? (
          <ReviewForm pgId={pg.id} onSubmitted={refreshReviews} />
        ) : (
          <p className="muted">
            <Link to="/login" state={{ from: `/pgs/${pg.id}` }}>
              Log in
            </Link>{' '}
            to write a review.
          </p>
        )}
      </section>

      <section>
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p className="muted">Nothing here yet.</p>
        ) : (
          <ul className="card-list">
            {reviews.map((r) => (
              <li key={r.id} className="card review-card">
                <div className="review-top">
                  <span className="rating">★ {r.rating}</span>
                  <span
                    className={`badge ${r.deposit_returned ? 'badge-good' : 'badge-bad'}`}
                  >
                    {r.deposit_returned
                      ? 'Deposit returned'
                      : 'Deposit NOT returned'}
                  </span>
                  <span className="muted review-date">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p>{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
