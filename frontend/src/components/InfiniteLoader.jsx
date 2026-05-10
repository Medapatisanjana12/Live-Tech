import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function InfiniteLoader() {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary shadow-[0_0_15px_var(--color-primary-glow)]"
        />
        <Loader2 className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-[10px] font-black text-primary/50 uppercase tracking-[0.3em] animate-pulse">
        Synchronizing Next Intelligence
      </p>
    </div>
  );
}
