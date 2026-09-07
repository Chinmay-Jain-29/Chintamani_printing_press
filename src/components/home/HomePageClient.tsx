'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { HeritageTimeline } from '@/components/home/HeritageTimeline';
import { TrustStats } from '@/components/home/TrustStats';
import { FeaturedServices } from '@/components/home/FeaturedServices';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { TopWorks } from '@/components/home/TopWorks';
import { PrintCraftHighlight } from '@/components/home/PrintCraftHighlight';
import { HomeReviews } from '@/components/home/HomeReviews';
import { HomeContactPreview } from '@/components/home/HomeContactPreview';
import { QuoteModal } from '@/components/quote/QuoteModal';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { LandingIntro } from '@/components/home/LandingIntro';
import { OwnerIntro } from '@/components/home/OwnerIntro';
import { initScrollAnimations } from '@/animations/scrollAnimations';
import { AppDatabase } from '@/lib/schema';

interface HomePageClientProps {
  initialData: AppDatabase;
}

export const HomePageClient: React.FC<HomePageClientProps> = ({ initialData }) => {
  const [data, setData] = useState<AppDatabase>(initialData);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Force scroll to top immediately on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  // Background fetch keeps content fresh without blocking initial paint or intro
  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((res) => {
        if (res.database) {
          setData(res.database);
        }
      })
      .catch((err) => console.error('Failed to refresh site content:', err));
  }, []);

  // Initialize GSAP ScrollTrigger after intro has completed and DOM is ready
  useEffect(() => {
    if (!pageRef.current) return;

    const timer = setTimeout(() => {
      if (pageRef.current) {
        initScrollAnimations(pageRef.current);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [introFinished]);

  const handleOpenQuote = (serviceName = '') => {
    setSelectedService(serviceName);
    setQuoteModalOpen(true);
  };

  const handleOpenReview = () => {
    setReviewModalOpen(true);
  };

  const { homepage, businessInfo, services, portfolio, reviews } = data;

  return (
    <div ref={pageRef} style={{ position: 'relative' }}>
      {/* 
        Opening Animation: Rendered immediately from frame 0 as the topmost layer.
        Plays independently while homepage components and assets prepare in the background.
      */}
      <LandingIntro onComplete={() => setIntroFinished(true)} />

      {/* 1. Hero Section with GSAP Orchestration */}
      <HeroSection
        hero={homepage.hero}
        business={businessInfo}
        onOpenQuoteModal={handleOpenQuote}
        triggerAnimation={introFinished}
      />

      {/* 1.5. Owner's Intro & Bio Section (Above Decades of Dedication) */}
      <OwnerIntro
        business={businessInfo}
        onOpenQuoteModal={handleOpenQuote}
      />

      {/* 2. Heritage Timeline (Since 1999 — Decades of Dedication) */}
      {homepage.showTimeline && (
        <HeritageTimeline timeline={homepage.timeline} />
      )}

      {/* 3. Trust Statistics with Animated GSAP Counters */}
      {homepage.showStats && (
        <TrustStats stats={homepage.stats} />
      )}

      {/* 4. Featured Services with Staggered Cards */}
      {homepage.showFeaturedServices && (
        <FeaturedServices
          services={services}
          onOpenQuoteModal={handleOpenQuote}
        />
      )}

      {/* 5. Why Choose Us */}
      {homepage.showWhyChooseUs && (
        <WhyChooseUs />
      )}

      {/* 6. Top Works / Curated Portfolio Gallery */}
      {homepage.showTopWorks && (
        <TopWorks portfolio={portfolio} />
      )}

      {/* 7. Printing + Designing In-House Highlight */}
      <PrintCraftHighlight />

      {/* 8. Customer Reviews */}
      {homepage.showReviews && (
        <HomeReviews reviews={reviews} onOpenReviewModal={handleOpenReview} />
      )}

      {/* 9. Contact Preview & Visit Shop Card */}
      <HomeContactPreview business={businessInfo} onOpenQuoteModal={handleOpenQuote} />

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedService={selectedService}
      />

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </div>
  );
};
