'use client';

import React, { useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryPills: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="relative sticky top-16 z-20 flex items-center bg-[#090a0f]/95 backdrop-blur-md py-2.5 sm:py-3 px-2.5 sm:px-4 lg:px-6 border-b border-white/5 w-full max-w-full overflow-hidden"
      suppressHydrationWarning
    >
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex items-center justify-center h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white mr-2 border border-white/5 flex-shrink-0"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 min-w-0 touch-pan-x overscroll-x-contain"
        suppressHydrationWarning
      >
        {MOCK_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              suppressHydrationWarning
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex items-center justify-center h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white ml-2 border border-white/5 flex-shrink-0"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
