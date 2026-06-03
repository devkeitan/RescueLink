// src/components/AlertFlashOverlay.jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export default function AlertFlashOverlay({ alert, onDismiss }) {
  const shouldReduceMotion = useReducedMotion();
  const isVisible = !!alert;

  // Determine type
  const getType = () => {
    if (alert?.event_type === 'auto_crash') return 'crash';
    if (alert?.alert_type) return 'alert';
    return 'ble';
  };

  const type = getType();

  // Color variables based on type
  const colors = {
    crash: {
      ring1: 'border-red-500/30',
      ring2: 'border-red-500/40',
      ring3: 'border-red-500/50',
      bg: 'from-red-600 via-red-500 to-red-600',
      shadow: 'shadow-[0_0_60px_rgba(239,68,68,0.5)]',
      text: 'SOS',
    },
    alert: {
      ring1: 'border-purple-500/30',
      ring2: 'purple-500/40',
      ring3: 'border-purple-500/50',
      bg: 'from-purple-600 via-purple-500 to-purple-600',
      shadow: 'shadow-[0_0_60px_rgba(168,85,247,0.5)]',
      text: 'ALERT',
    },
    ble: {
      ring1: 'border-amber-500/30',
      ring2: 'border-amber-500/40',
      ring3: 'border-amber-500/50',
      bg: 'from-amber-500 via-amber-400 to-amber-500',
      shadow: 'shadow-[0_0_60px_rgba(245,158,11,0.5)]',
      text: 'BLE',
    },
  };

  const currentColor = colors[type];

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
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Pulse Ring 1 — Outermost */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  animation: shouldReduceMotion
                    ? 'none'
                    : 'pulseRing1 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              >
                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-8 ${currentColor.ring1}`} />
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
                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-8 ${currentColor.ring2}`} />
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
                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-4 ${currentColor.ring3}`} />
              </div>

              {/* Main SOS Button */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-56 md:h-56 flex items-center justify-center rounded-full bg-gradient-to-br ${currentColor.bg} ${currentColor.shadow}`}
                aria-label="SOS Emergency Signal Active"
              >
                {/* Inner depth gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-transparent to-red-900/20" />

                {/* SOS Text */}
                <span className="relative text-6xl md:text-7xl font-bold text-white tracking-wider drop-shadow-2xl">
                  {currentColor.text}
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