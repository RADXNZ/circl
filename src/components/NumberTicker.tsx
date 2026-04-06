import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

type Props = {
  value: number | string;
  className?: string;
};

export const NumberTicker: React.FC<Props> = ({ value, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Parse the value carefully (e.g., "490" or "0.2%")
  const strVal = String(value);
  const match = strVal.match(/^([\d\.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const isFloat = strVal.includes('.');
  const decimals = isFloat ? strVal.split('.')[1].length : 0;

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [motionValue, isInView, target]);

  useEffect(() => {
    const unsub = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${latest.toFixed(decimals)}${suffix}`;
      }
    });
    return () => unsub();
  }, [springValue, decimals, suffix]);

  return <span ref={ref} className={className}>{0}{suffix}</span>;
};
