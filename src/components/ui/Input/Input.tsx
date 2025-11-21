import styles from './Input.module.css'

interface InputProps {
  label?: string
  type?: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  error?: string
  textarea?: boolean
  rows?: number
}

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  textarea = false,
  rows = 4
}: InputProps) => {
  const inputId = `input-${name}`
  return (
    <div className={styles['input-group']}>
      {label && (
        <label htmlFor={inputId} className={styles['input-label']}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {textarea ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${styles['input-field']} ${error ? styles['input-error'] : ''}`}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${styles['input-field']} ${error ? styles['input-error'] : ''}`}
        />
      )}
      {error && <span className={styles['error-message']}>{error}</span>}
    </div>
  )
}

