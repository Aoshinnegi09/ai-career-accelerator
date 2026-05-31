'use client'

interface InputFieldProps {
  label: string
  id: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
  rightSlot?: React.ReactNode
  autoComplete?: string
}

export default function InputField({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  error,
  rightSlot,
  autoComplete,
}: InputFieldProps) {
  return (
    <div>
      {label ? (
        <label htmlFor={id} className="text-xs text-slate-400 mb-1 block uppercase tracking-wider">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          className={`input-field ${rightSlot ? 'pr-10' : ''} ${error ? 'border-red-400/70' : ''}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {rightSlot ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div> : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}
