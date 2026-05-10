import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Loader({ onComplete }) {
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    // Stage 1: Wait 1s then expand LT to LiveTech
    const timer1 = setTimeout(() => {
      setShowFullText(true);
    }, 1000);

    // Stage 2: Wait 3s total then trigger onComplete
    const timer2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(20px)",
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const letterVariants = {
    initial: { opacity: 0, y: 10, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  const logoText = "LiveTech";

  return (
    <motion.div
      variants={containerVariants}
      exit="exit"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617] overflow-hidden"
    >
      {/* Background Cyberpunk Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative flex items-center justify-center">
        {/* The Glowing Core */}
        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-150 animate-pulse" />
        
        <div className="relative flex items-center gap-0 overflow-hidden px-10 py-5">
          <AnimatePresence mode="wait">
            {!showFullText ? (
              <motion.div
                key="initial-lt"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-1"
              >
                <span className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_var(--color-primary-glow)]">L</span>
                <span className="text-7xl md:text-9xl font-black text-primary tracking-tighter drop-shadow-[0_0_30px_var(--color-primary-glow)]">T</span>
              </motion.div>
            ) : (
              <motion.div
                key="full-text"
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {logoText.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    initial="initial"
                    animate="animate"
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className={`text-6xl md:text-8xl font-black tracking-tighter ${
                      index < 4 ? 'text-white' : 'text-primary'
                    } ${index === 0 || index === 4 ? 'drop-shadow-[0_0_20px_var(--color-primary-glow)]' : ''}`}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Line */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 2.5, ease: "linear" }}
        className="absolute bottom-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_10px_var(--color-primary-glow)]"
      />
    </motion.div>
  );
}
