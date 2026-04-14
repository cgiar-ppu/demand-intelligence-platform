interface BadgeProps {
  label: string
  variant?: 'default' | 'primary' | 'accent' | 'muted'
}

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-amber-100 text-amber-800',
  muted: 'bg-gray-200 text-gray-500',
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${variantClasses[variant]}`}
    >
      {label}
    </span>
  )
}
