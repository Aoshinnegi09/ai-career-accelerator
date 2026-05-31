export default function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/5 border border-indigo-500/20 ${className}`} />
}
