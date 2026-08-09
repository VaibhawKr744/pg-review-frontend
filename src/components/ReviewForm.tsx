import { useState, type FormEvent } from 'react'
import { createReview, errorMessage } from '../lib/api'

interface Props {
  pgId: number
  onSubmitted: () => void | Promise<void>
}

export default function ReviewForm({ pgId, onSubmitted }: Props) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [depositReturned, setDepositReturned] = useState<boolean | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      setError('Pick a star rating first')
      return
    }
    if (depositReturned === null) {
      setError('Tell us whether your deposit was returned')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await createReview(pgId, {
        rating,
        deposit_returned: depositReturned,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      })
      setComment('')
      setRating(0)
      setDepositReturned(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await onSubmitted()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form review-form" onSubmit={onSubmit}>
      <div className="form-row">
        <span className="form-label">Your rating</span>
        <div className="star-input" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`star-btn ${n <= (hovered || rating) ? 'star-btn-on' : ''}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              aria-label={`${n} star${n === 1 ? '' : 's'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <span className="form-label">Did the owner return your security deposit?</span>
        <div className="segmented">
          <button
            type="button"
            className={`seg-btn ${depositReturned === true ? 'seg-on seg-good' : ''}`}
            onClick={() => setDepositReturned(true)}
          >
            ✓ Yes, returned
          </button>
          <button
            type="button"
            className={`seg-btn ${depositReturned === false ? 'seg-on seg-bad' : ''}`}
            onClick={() => setDepositReturned(false)}
          >
            ✕ No, withheld
          </button>
        </div>
      </div>

      <label className="form-row">
        <span className="form-label">Comment (optional)</span>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was your stay? Any issues getting the deposit back?"
        />
      </label>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">Review posted — thank you!</p>}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  )
}
