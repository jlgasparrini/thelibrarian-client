import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  variant?: 'default' | 'warning' | 'danger' | 'success'
}

export function StatCard({ icon: Icon, label, value, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-blue-50 text-blue-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
    success: 'bg-green-50 text-green-600',
  }

  const iconBgStyles = {
    default: 'bg-blue-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    success: 'bg-green-100',
  }

  const iconBgClass = `flex-shrink-0 rounded-md p-3 ${iconBgStyles[variant]}`
  const iconColorClass = `h-6 w-6 ${variantStyles[variant]}`

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center">
        <div className={iconBgClass}>
          <Icon className={iconColorClass} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
