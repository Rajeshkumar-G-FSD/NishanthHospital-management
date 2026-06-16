interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color, loading, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</p>
        {loading ? (
          <div className="mt-1.5 h-7 w-16 bg-gray-100 rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{value}</p>
        )}
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
