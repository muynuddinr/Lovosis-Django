'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import logo from '../../../public/logo0bg.png';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-white flex items-center justify-center z-[9999] w-screen h-screen overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Animated Background Circle */}
      <motion.div
        className="absolute inset-0 -z-10 w-80 h-80 bg-red-600/5 rounded-full blur-3xl"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        <motion.img
          src={logo.src}
          alt="Logo"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: 2.5, opacity: 1 }}
          transition={{
            duration: 3,
            ease: 'easeOut',
            delay: 0.3,
          }}
        />

        {/* Animated Bottom Line */}
        <motion.div
          className="mt-6 sm:mt-8 h-1 w-32 sm:w-40 bg-red-600 rounded-full mx-auto"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
}
