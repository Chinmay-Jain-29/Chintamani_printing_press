'use client';

import { gsap, ScrollTrigger, EASE, isReducedMotion } from './index';

/**
 * Initializes ScrollTrigger reveals across all major sections of the page.
 * Returns a cleanup function for React useEffect unmount.
 */
export function initScrollAnimations(scope: HTMLElement): () => void {
  if (isReducedMotion() || typeof window === 'undefined') {
    return () => {};
  }

  const ctx = gsap.context(() => {
    // 1. Section Headings: Upward reveal with fade
    const sectionHeadings = scope.querySelectorAll<HTMLElement>('.gsap-reveal-heading');
    sectionHeadings.forEach((heading) => {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.paper,
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });

    // 2. Cards: Staggered entrance for services and features
    const cardGrids = scope.querySelectorAll<HTMLElement>('.gsap-stagger-grid');
    cardGrids.forEach((grid) => {
      const cards = grid.querySelectorAll<HTMLElement>('.gsap-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: EASE.ink,
            scrollTrigger: {
              trigger: grid,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }
    });

    // 3. Trust Statistics: Numbers count up on scroll into view
    const statCounters = scope.querySelectorAll<HTMLElement>('.gsap-stat-counter');
    statCounters.forEach((counter) => {
      const rawTarget = counter.getAttribute('data-target') || '0';
      const numericTarget = parseInt(rawTarget.replace(/\D/g, ''), 10) || 0;
      const prefix = rawTarget.startsWith('✦') ? '✦ ' : '';
      const suffix = rawTarget.includes('+') ? '+' : rawTarget.includes('%') ? '%' : '';

      const counterObj = { val: 0 };
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(counterObj, {
            val: numericTarget,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              counter.innerText = `${prefix}${Math.floor(counterObj.val)}${suffix}`;
            },
            onComplete: () => {
              counter.innerText = rawTarget;
            },
          });
        },
      });
    });

    // 4. Portfolio / Gallery items: Subtle clip-path image reveal
    const portfolioCards = scope.querySelectorAll<HTMLElement>('.gsap-portfolio-card');
    portfolioCards.forEach((card) => {
      const img = card.querySelector<HTMLElement>('img');
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.08, opacity: 0.8 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: EASE.paper,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    });

    // 5. Timeline Milestones: Step-by-step sequential appearance
    const timelineItems = scope.querySelectorAll<HTMLElement>('.gsap-timeline-item');
    timelineItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: index % 2 === 0 ? -25 : 25 },
        {
          opacity: 1,
          x: 0,
          duration: 0.65,
          ease: EASE.paper,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });
  }, scope);

  return () => ctx.revert();
}
