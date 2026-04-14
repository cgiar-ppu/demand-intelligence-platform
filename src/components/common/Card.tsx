import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 ${className}`}>
      {title && (
        <h3 className="text-base font-semibold text-gray-800 mb-3">{title}</h3>
      )}
      {children}
    </div>
  )
}
