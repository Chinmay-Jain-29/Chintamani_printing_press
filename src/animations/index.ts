'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins safely on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Sophisticated printing-inspired easing curves
export const EASE = {
  paper: 'expo.out',
  ink: 'power3.out',
  letterpress: 'back.out(1.2)',
  smooth: 'power2.out',
  inOut: 'power2.inOut',
};

// Check for reduced motion preference
export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export { gsap, ScrollTrigger };
