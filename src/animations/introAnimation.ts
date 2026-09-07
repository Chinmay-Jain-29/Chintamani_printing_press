'use client';

import { gsap, EASE, isReducedMotion } from './index';

export interface IntroElements {
  container: HTMLElement;
  paperSheet: HTMLElement;
  cropMarks: HTMLElement[];
  svgMarks: HTMLElement[];
  logoWrap: HTMLElement;
  brandPart1: HTMLElement; // "NEW CHINTAMANI"
  brandPart2: HTMLElement; // "PRINTING PRESS"
  heritageTag: HTMLElement; // "EST. 1999 • DONGAON"
  goldLine: HTMLElement; // Gold registration pass line
  tagline: HTMLElement; // "Printing • Designing • Quality • Trust"
}

export function playCinematicIntro(
  elements: IntroElements,
  onComplete: () => void
): gsap.core.Timeline {
  const {
    container,
    paperSheet,
    cropMarks,
    svgMarks,
    logoWrap,
    brandPart1,
    brandPart2,
    heritageTag,
    goldLine,
    tagline,
  } = elements;

  if (isReducedMotion()) {
    gsap.set(container, { display: 'none', opacity: 0 });
    onComplete();
    return gsap.timeline();
  }

  const tl = gsap.timeline({
    defaults: { ease: EASE.ink },
    onComplete: () => {
      gsap.set(container, { display: 'none' });
      onComplete();
    },
  });

  // Scene 1 setup: Ivory Paper initial frame
  gsap.set(paperSheet, { y: 35, opacity: 0, scale: 0.96 });
  gsap.set(cropMarks, { opacity: 0, scale: 0.6 });
  gsap.set(svgMarks, { opacity: 0, rotation: -45 });
  gsap.set(logoWrap, { scale: 0.8, opacity: 0 });
  gsap.set([brandPart1, brandPart2], { y: 20, opacity: 0, letterSpacing: '0.08em' });
  gsap.set(heritageTag, { opacity: 0, y: 10 });
  gsap.set(goldLine, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(tagline, { opacity: 0, y: 6 });

  // Scene 2: SVG Crop Marks & Registration Crosshairs Animate In
  tl.to(cropMarks, {
    opacity: 0.85,
    scale: 1,
    duration: 0.4,
    stagger: 0.05,
    ease: 'power2.out',
  })
  .to(
    svgMarks,
    {
      opacity: 0.7,
      rotation: 0,
      duration: 0.45,
      stagger: 0.06,
      ease: 'back.out(1.4)',
    },
    '-=0.25'
  )

  // Scene 3: Paper Sheet slides and settles into position
  .to(
    paperSheet,
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: EASE.paper,
    },
    '-=0.2'
  )

  // Scene 4: SVG Logo Monogram Reveal with Gold Illumination
  .to(
    logoWrap,
    {
      scale: 1,
      opacity: 1,
      duration: 0.45,
      ease: EASE.letterpress,
    },
    '-=0.25'
  )

  // Scene 5: Brand Typography Choreography
  .to(
    brandPart1,
    {
      y: 0,
      opacity: 1,
      duration: 0.38,
      ease: EASE.ink,
    },
    '-=0.15'
  )
  .to(
    brandPart2,
    {
      y: 0,
      opacity: 1,
      duration: 0.38,
      ease: EASE.ink,
    },
    '-=0.25'
  )
  .to(
    heritageTag,
    {
      y: 0,
      opacity: 1,
      duration: 0.32,
      ease: EASE.smooth,
    },
    '-=0.15'
  )

  // Scene 6: Gold Registration Pass & Tagline Stamp
  .to(
    goldLine,
    {
      scaleX: 1,
      duration: 0.38,
      ease: 'power2.inOut',
    },
    '-=0.1'
  )
  .to(
    tagline,
    {
      opacity: 1,
      y: 0,
      duration: 0.28,
      ease: EASE.smooth,
    },
    '-=0.18'
  )

  // Brief pause for brand recognition
  .to({}, { duration: 0.3 })

  // Scene 7: Seamless Expansion into Homepage Hero
  .to(
    paperSheet,
    {
      y: -40,
      opacity: 0,
      scale: 1.03,
      duration: 0.5,
      ease: EASE.paper,
    }
  )
  .to(
    container,
    {
      yPercent: -100,
      duration: 0.6,
      ease: 'expo.inOut',
    },
    '-=0.42'
  );

  return tl;
}
