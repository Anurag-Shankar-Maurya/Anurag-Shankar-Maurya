import React, { useState, useEffect, useMemo } from 'react';
import { ImageIcon, Loader2, RefreshCw, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Gallery from '../components/Gallery';
import { MetaTags } from '../components/MetaTags';
import { api } from '../services/api';
import { Image, ViewState } from '../types';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';

export const GalleryView: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [objectFilter, setObjectFilter] = useState<string | undefined>(undefined);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // Since objectFilter (Linked Object) is handled on frontend,
      // and we want proper pagination, we have a challenge.
      
      // If filtering by linked object (which is frontend-only), we have to fetch more
      // or implement backend filtering for content_type model name.
      
      // Let's stick to backend filtering as much as possible.
      // Note: api.getImages in services/api.ts needs to support page/limit.
      const res = await api.getImages({ 
        image_type: typeFilter, 
        limit: 100, // Fetch more if we filter on frontend
      } as any); // cast to any because I might need to update api.ts
      
      let results = res.results;
      
      if (objectFilter) {
        results = results.filter(img => img.linked_object_type === objectFilter);
      }
      
      setTotalCount(results.length);
      
      // Manual pagination for the filtered result set
      const startIndex = (page - 1) * PAGE_SIZE;
      const paginatedResults = results.slice(startIndex, startIndex + PAGE_SIZE);
      
      setImages(paginatedResults);
    } catch (error) {
      console.error("Failed to fetch gallery images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset page on filter change
  }, [typeFilter, objectFilter]);

  useEffect(() => {
    fetchImages();
  }, [typeFilter, objectFilter, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const contentTypes = useMemo(() => [
    { label: 'All Types', value: undefined },
    { label: 'Gallery', value: 'gallery' },
    { label: 'Covers', value: 'cover' },
    { label: 'Thumbnails', value: 'thumbnail' },
    { label: 'Logos', value: 'logo' },
    { label: 'Avatar', value: 'avatar' },
    { label: 'Other', value: 'other' },
  ], []);

  const linkedObjects = useMemo(() => [
    { label: 'All Sources', value: undefined },
    { label: 'Profile', value: 'profile' },
    { label: 'Projects', value: 'project' },
    { label: 'Experience', value: 'workexperience' },
    { label: 'Education', value: 'education' },
    { label: 'Achievements', value: 'achievement' },
    { label: 'Testimonials', value: 'testimonial' },
    { label: 'Blog Posts', value: 'blogpost' },
  ], []);

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
      <MetaTags title="Visual Gallery | Anurag Shankar Maurya" description="Explore the visual narrative of my journey." />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] text-black shadow-none"><ImageIcon className="w-8 h-8"/></div>
          <div>
             <h1 className="text-4xl font-extrabold text-black">Visual Gallery</h1>
             <p className="text-[#4c4546] mt-2">Explore the visual narrative of my journey.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={fetchImages} className="text-[#4c4546] hover:text-black">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-white/80 border border-[#E5E5E5] p-3 rounded-full mb-12 flex flex-wrap items-center gap-2 backdrop-blur-[20px] sticky top-24 z-30 shadow-none">
        <div className="flex flex-wrap items-center gap-2 p-1 grow">
          <div className="flex items-center gap-2 px-3 py-2 mr-2 text-[#7e7576] border-r border-[#E5E5E5]">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
          </div>
          
          {/* Content Type Selector */}
          <div className="relative group/select">
            <select 
              value={typeFilter || ''} 
              onChange={(e) => setTypeFilter(e.target.value || undefined)}
              className="appearance-none bg-[#f9f9f9] hover:bg-[#F2F2F2] text-black px-4 py-2 pr-10 rounded-full text-sm font-semibold border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer min-w-[140px]"
            >
              {contentTypes.map(c => <option key={c.label} value={c.value || ''} className="bg-white text-black">{c.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7e7576] pointer-events-none group-hover/select:text-black transition-colors" />
          </div>

          {/* Linked Object Selector */}
          <div className="relative group/select">
            <select 
              value={objectFilter || ''} 
              onChange={(e) => setObjectFilter(e.target.value || undefined)}
              className="appearance-none bg-[#f9f9f9] hover:bg-[#F2F2F2] text-black px-4 py-2 pr-10 rounded-full text-sm font-semibold border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer min-w-[140px]"
            >
              {linkedObjects.map(o => <option key={o.label} value={o.value || ''} className="bg-white text-black">{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7e7576] pointer-events-none group-hover/select:text-black transition-colors" />
          </div>

          <div className="h-6 w-px bg-[#E5E5E5] mx-2 hidden sm:block"></div>

          {/* Active Filter Pills (Horizontal Scrollable) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
             {typeFilter && (
               <button onClick={() => setTypeFilter(undefined)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F2F2F2] text-black text-xs font-semibold border border-[#E5E5E5] whitespace-nowrap hover:border-black transition-all">
                 Type: {contentTypes.find(c => c.value === typeFilter)?.label} <span>×</span>
               </button>
             )}
             {objectFilter && (
               <button onClick={() => setObjectFilter(undefined)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F2F2F2] text-black text-xs font-semibold border border-[#E5E5E5] whitespace-nowrap hover:border-black transition-all">
                 Source: {linkedObjects.find(o => o.value === objectFilter)?.label} <span>×</span>
               </button>
             )}
             {(typeFilter || objectFilter) && (
               <button onClick={() => { setTypeFilter(undefined); setObjectFilter(undefined); }} className="text-[#7e7576] hover:text-black text-xs font-bold px-2 py-1.5 transition-colors">
                 Reset All
               </button>
             )}
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="gallery-grid" />
      ) : images.length > 0 ? (
        <div className="animate-fade-in flex flex-col gap-12">
           <Gallery images={images} className="rounded-3xl overflow-hidden" />
           
           {/* Pagination UI */}
           {totalPages > 1 && (
             <div className="flex items-center justify-center gap-4 pt-8 border-t border-[#E5E5E5]">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-full bg-[#f9f9f9] border border-[#E5E5E5] text-[#4c4546] hover:text-black hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1;
                    // Only show first, last, and around current page if there are many
                    if (totalPages > 7 && (p > 1 && p < totalPages && Math.abs(p - page) > 1)) {
                      if (p === 2 || p === totalPages - 1) return <span key={p} className="text-gray-600 px-1">...</span>;
                      return null;
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-full text-sm font-bold transition-all border shadow-none ${
                          page === p 
                          ? 'bg-black border-black text-white' 
                          : 'bg-[#f9f9f9] border-[#E5E5E5] text-[#4c4546] hover:border-black hover:text-black'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-full bg-[#f9f9f9] border border-[#E5E5E5] text-[#4c4546] hover:text-black hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
             </div>
           )}

           <div className="text-center text-[#7e7576] font-semibold text-sm">
             Showing {((page-1)*PAGE_SIZE) + 1} to {Math.min(page*PAGE_SIZE, totalCount)} of {totalCount} images
           </div>
        </div>
      ) : (
        !typeFilter && !objectFilter ? (
          <EmptyState
            title="Visual Gallery is Empty"
            description="Photos, visual notes, and screenshots of my professional milestones are currently being compiled. Stay tuned!"
            icon={ImageIcon}
            actionText="Back to Home"
            onAction={() => onNavigate({ type: 'HOME' })}
            variant="general"
          />
        ) : (
          <EmptyState
            title="No matching media found"
            description="We couldn't find any images matching your active type or source selections. Try adjusting your filters!"
            icon={Filter}
            actionText="Reset Filters"
            onAction={() => {
              setTypeFilter(undefined);
              setObjectFilter(undefined);
            }}
            variant="filter"
          />
        )
      )}
    </main>
  );
};
