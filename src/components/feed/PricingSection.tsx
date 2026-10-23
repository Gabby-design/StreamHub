'use client';

import React, { useState } from 'react';
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  ShieldCheck,
  Tv,
} from 'lucide-react';

export const PricingSection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('platinum');
  const [trialSuccessPlan, setTrialSuccessPlan] = useState<string | null>(null);

  const handleGetTrial = (planName: string) => {
    setTrialSuccessPlan(planName);
    setTimeout(() => {
      setTrialSuccessPlan(null);
    }, 3500);
  };

  const plans = [
    {
      id: 'gold',
      name: 'Gold Plan',
      price: '$9.99',
      period: '/ month',
      description: 'Essential streaming package for everyday movies and series.',
      highlight: false,
      features: [
        '100% Ad-Free Experience',
        '2 Simultaneous Streams',
        'Full HD 1080p Video Quality',
        '15 Offline Downloads per Device',
        'Dolby 5.1 Surround Sound',
        'Watch on Phone, Tablet & Laptop',
      ],
      buttonText: 'Get Trial Period',
      buttonClass:
        'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-white/20',
    },
    {
      id: 'platinum',
      name: 'Platinum Plan',
      price: '$14.99',
      period: '/ month',
      badge: 'RECOMMENDED',
      description: 'Ultra-HD cinematic package for movie buffs and home theaters.',
      highlight: true,
      features: [
        '100% Ad-Free Everywhere',
        '4 Simultaneous 4K Streams',
        '4K Ultra HD + HDR10 + Dolby Vision',
        '50 Offline Downloads per Month',
        'Dolby Atmos & Spatial Audio',
        'Day-One Access to Theatrical Releases',
        'Multi-Device Support including Apple TV & Consoles',
      ],
      buttonText: 'Get Trial Period',
      buttonClass:
        'bg-gradient-to-r from-[#E50914] to-[#FF1E44] hover:from-[#c70811] hover:to-[#e0183b] text-white font-extrabold shadow-[0_0_25px_rgba(229,9,20,0.6)] hover:shadow-[0_0_35px_rgba(229,9,20,0.85)]',
    },
    {
      id: 'diamond',
      name: 'Diamond Plan',
      price: '$19.99',
      period: '/ month',
      description: 'Ultimate all-inclusive plan for family sharing and 4K power users.',
      highlight: false,
      features: [
        '100% Ad-Free & Zero Throttling',
        '6 Simultaneous Streams',
        '4K Ultra HD + IMAX Enhanced',
        'Unlimited Offline Downloads',
        'Lossless Studio Audio Master',
        'Exclusive VIP Watch Parties & Live Streams',
        '6 Independent Household Profiles',
      ],
      buttonText: 'Get Trial Period',
      buttonClass:
        'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-white/20',
    },
  ];

  return (
    <section className="w-full mt-14 sm:mt-20 pt-10 border-t border-white/10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-[#E50914] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Flexible Membership
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
          Choose your plan
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-zinc-400">
          Enjoy unlimited cinema, top-rated series, and 4K streaming. Cancel or switch anytime with zero cancellation fees.
        </p>

        {/* Feedback Alert for Trial Activation */}
        {trialSuccessPlan && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>14-day free trial activated for {trialSuccessPlan}! Welcome to filmbox.</span>
          </div>
        )}
      </div>

      {/* 3-Card Comparison Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => {
          const isHighlighted = plan.highlight;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                isHighlighted
                  ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-2 border-[#E50914] shadow-[0_0_40px_rgba(229,9,20,0.3)] md:-translate-y-2'
                  : 'bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Highlight Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#E50914] to-[#FF1E44] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-[0_0_15px_rgba(229,9,20,0.6)] flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {isHighlighted ? (
                    <Zap className="h-5 w-5 text-[#E50914]" />
                  ) : (
                    <Tv className="h-5 w-5 text-zinc-500" />
                  )}
                </div>

                <p className="mt-2 text-xs text-zinc-400 min-h-[32px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-5 pb-5 border-b border-white/10 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-zinc-400">{plan.period}</span>
                </div>

                {/* Feature List */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isHighlighted
                            ? 'bg-[#E50914]/20 text-[#E50914]'
                            : 'bg-white/10 text-zinc-300'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetTrial(plan.name);
                  }}
                  className={`w-full py-3 px-4 rounded-full text-xs font-bold transition-all duration-200 ${plan.buttonClass}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
