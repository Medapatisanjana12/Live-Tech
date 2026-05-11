import { motion } from 'framer-motion';

export default function LoaderCard() {
  return (
    <div className="glass-panel p-6 flex flex-col h-80 relative overflow-hidden border border-white/5 bg-card/50">
      {/* Shimmer Effect */}
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent z-0"
      />

      <div className="relative z-10 flex flex-col h-full space-y-4">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <div className="h-6 w-3/4 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-4 w-1/2 bg-primary/20 rounded-md animate-pulse" />
          </div>
          <div className="h-10 w-10 bg-white/5 rounded-lg border border-white/10 shrink-0" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 pt-2 min-h-[4.5rem]">
          <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 pt-2 min-h-[2.5rem]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-16 bg-primary/10 rounded-md border border-primary/10 animate-pulse" />
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
          <div className="h-10 w-28 bg-primary/20 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
