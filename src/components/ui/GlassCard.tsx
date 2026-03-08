"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  intensity = "medium",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const intensities = {
    low: "bg-white/5 backdrop-blur-sm border-white/10",
    medium: "bg-white/10 backdrop-blur-md border-white/20",
    high: "bg-white/20 backdrop-blur-xl border-white/30",
  };

  useEffect(() => {
    if (!cardRef.current || !glowRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = cardRef.current!.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      gsap.to(glowRef.current, {
        x: x - 100,
        y: y - 100,
        opacity: 0.6,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.4,
      });
    };

    const card = cardRef.current;
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-luxury border p-1 shadow-2xl ${intensities[intensity]} ${className}`}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-52 w-52 rounded-full bg-accent-gold-soft/20 blur-3xl opacity-0"
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
};
