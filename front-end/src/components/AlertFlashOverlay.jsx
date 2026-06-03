// src/components/AlertFlashOverlay.jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export default function AlertFlashOverlay({ alert, onDismiss}) {
  const shouldReduceMotion = useReducedMotion();
  const isVisible = !!alert; 



  useEffect(() => {
if (!alert) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [alert, onDismiss]);



  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="sos-overlay"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onDismiss}
        >
          <div className="relative flex flex-col items-center justify-center">

            {/* Container for pulse rings - must be square */}
            <div className="relative w-80 h-80 md:w-96 md:h-96 ">
              {/* Pulse Ring 1 — Outermost */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  animation: shouldReduceMotion
                    ? 'none'
                    : 'pulseRing1 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              >
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-red-500/30" />
              </div>

              {/* Pulse Ring 2 — Middle */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  animation: shouldReduceMotion
                    ? 'none'
                    : 'pulseRing2 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.4s',
                }}
              >
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-red-500/40" />
              </div>

              {/* Pulse Ring 3 — Innermost */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  animation: shouldReduceMotion
                    ? 'none'
                    : 'pulseRing3 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.8s',
                }}
              >
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-red-500/50" />
              </div>

            {/* Main SOS Button */}
            <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-56 md:h-56 flex items-center justify-center rounded-full bg-gradient-to-br from-red-600 via-red-500 to-red-600 shadow-[0_0_60px_rgba(239,68,68,0.5)]"
            aria-label="SOS Emergency Signal Active"
            >
            {/* Inner depth gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-transparent to-red-900/20" />

            {/* SOS Text */}
            <span className="relative text-6xl md:text-7xl font-bold text-white tracking-wider drop-shadow-2xl">
                SOS
            </span>
            </div>

            </div>

           
          </div>

          {/* Keyframes — identical to SOSButton */}
          <style>{`
            @keyframes pulseRing1 {
              0%   { transform: scale(0.7); opacity: 0; }
              50%  { opacity: 0.3; }
              100% { transform: scale(1.4); opacity: 0; }
            }
            @keyframes pulseRing2 {
              0%   { transform: scale(0.7); opacity: 0; }
              50%  { opacity: 0.4; }
              100% { transform: scale(1.4); opacity: 0; }
            }
            @keyframes pulseRing3 {
              0%   { transform: scale(0.7); opacity: 0; }
              50%  { opacity: 0.5; }
              100% { transform: scale(1.4); opacity: 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
