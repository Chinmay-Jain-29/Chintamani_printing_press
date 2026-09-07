'use client';

import { gsap, EASE, isReducedMotion } from './index';

export interface HeroElements {
  badge: HTMLElement;
  headline: HTMLElement;
  subtitle: HTMLElement;
  ctaButtons: HTMLElement[];
  trustPills: HTMLElement;
  visualLayers: HTMLElement[];
  goldSeal: HTMLElement;
}

export function playHeroEntrance(elements: HeroElements): gsap.core.Timeline {
  const {
    badge,
    headline,
    subtitle,
    ctaButtons,
    trustPills,
    visualLayers,
    goldSeal,
  } = elements;

  if (isReducedMotion()) {
    gsap.set([badge, headline, subtitle, ...ctaButtons, trustPills, ...visualLayers, goldSeal], {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
    });
    return gsap.timeline();
  }

  const tl = gsap.timeline({ defaults: { ease: EASE.ink } });

  // Initial hero elements setup
  gsap.set(badge, { opacity: 0, y: 15 });
  gsap.set(headline, { opacity: 0, y: 30 });
  gsap.set(subtitle, { opacity: 0, y: 20 });
  gsap.set(ctaButtons, { opacity: 0, y: 18, scale: 0.95 });
  gsap.set(trustPills, { opacity: 0 });
  gsap.set(visualLayers, { opacity: 0, y: 35, scale: 0.94 });
  gsap.set(goldSeal, { opacity: 0, scale: 0.5, rotate: -30 });

  tl.to(badge, {
    opacity: 1,
    y: 0,
    duration: 0.5,
  })
  .to(
    headline,
    {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: EASE.paper,
    },
    '-=0.35'
  )
  .to(
    subtitle,
    {
      opacity: 1,
      y: 0,
      duration: 0.55,
    },
    '-=0.45'
  )
  .to(
    ctaButtons,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.45,
      stagger: 0.1,
      ease: EASE.letterpress,
    },
    '-=0.35'
  )
  .to(
    trustPills,
    {
      opacity: 1,
      duration: 0.45,
    },
    '-=0.2'
  )
  // Layered craftsman visual entrance
  .to(
    visualLayers,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.75,
      stagger: 0.12,
      ease: EASE.paper,
    },
    '-=0.6'
  )
  // Gold seal stamps into place
  .to(
    goldSeal,
    {
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 0.6,
      ease: 'back.out(1.5)',
    },
    '-=0.4'
  );

  return tl;
}
