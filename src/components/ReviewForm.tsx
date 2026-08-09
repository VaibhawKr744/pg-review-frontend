import { useState, type FormEvent } from 'react'
import { createReview, errorMessage } from '../lib/api'

interface Props {
  pgId: number
  onSubmitted: () => void | Promise<void>
}

export default function ReviewForm({ pgId, onSubmitted }: Props) {
  const [rating, setRating] = useState(5)
  const [depositReturned, setDepositReturned] = useState(true)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await createReview(pgId, {
        rating,
        deposit_returned: depositReturned,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      })
      setComment('')
      setRating(5)
      setDepositReturned(true)
      await onSubmitted()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        Rating
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {'★'.repeat(n)} ({n})
            </option>
          ))}
        </select>
      </label>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={depositReturned}
          onChange={(e) => setDepositReturned(e.target.checked)}
        />
        Owner returned my security deposit
      </label>
      <label>
        Comment (optional)
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was your stay? Any issues getting the deposit back?"
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  )
}
