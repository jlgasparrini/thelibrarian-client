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

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${iconBgStyles[variant]}`}>
            <Icon className={`h-6 w-6 ${variantStyles[variant]}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-gray-500">{label}</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
