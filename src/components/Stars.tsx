interface Props {
  value: number
  size?: 'sm' | 'lg'
}

export default function Stars({ value, size = 'sm' }: Props) {
  return (
    <span
      className={`stars ${size === 'lg' ? 'stars-lg' : ''}`}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? 'star star-filled' : 'star'}>
          ★
        </span>
      ))}
    </span>
  )
}
