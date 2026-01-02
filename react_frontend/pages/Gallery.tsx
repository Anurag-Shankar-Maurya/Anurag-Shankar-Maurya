import React, { useState, useEffect, useMemo } from 'react';
import { ImageIcon, Loader2, RefreshCw, Filter, Layers, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Gallery from '../components/Gallery';
import { api } from '../services/api';
import { Image } from '../types';
import { Button } from '../components/Button';

export const GalleryView: React.FC = () => {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-pink-500/10 rounded-2xl text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/20">
            <ImageIcon className="w-10 h-10"/>
          </div>
          <div>
             <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Visual Gallery</h1>
             <p className="text-gray-400 mt-1.5 font-light">Explore the visual narrative of my journey.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={fetchImages} className="text-gray-400 hover:text-white">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="glass-card p-2 rounded-2xl mb-12 flex flex-wrap items-center gap-2 bg-white/5 border-white/10 backdrop-blur-md sticky top-24 z-30">
        <div className="flex flex-wrap items-center gap-2 p-1 grow">
          <div className="flex items-center gap-2 px-3 py-2 mr-2 text-gray-500 border-r border-white/10">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
          </div>
          
          {/* Content Type Selector */}
          <div className="relative group/select">
            <select 
              value={typeFilter || ''} 
              onChange={(e) => setTypeFilter(e.target.value || undefined)}
              className="appearance-none bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 pr-10 rounded-xl text-sm font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all cursor-pointer min-w-[140px]"
            >
              {contentTypes.map(c => <option key={c.label} value={c.value || ''} className="bg-gray-900 text-white">{c.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none group-hover/select:text-white transition-colors" />
          </div>

          {/* Linked Object Selector */}
          <div className="relative group/select">
            <select 
              value={objectFilter || ''} 
              onChange={(e) => setObjectFilter(e.target.value || undefined)}
              className="appearance-none bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 pr-10 rounded-xl text-sm font-medium border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer min-w-[140px]"
            >
              {linkedObjects.map(o => <option key={o.label} value={o.value || ''} className="bg-gray-900 text-white">{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none group-hover/select:text-white transition-colors" />
          </div>

          <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>

          {/* Active Filter Pills (Horizontal Scrollable) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
             {typeFilter && (
               <button onClick={() => setTypeFilter(undefined)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 text-xs font-semibold border border-pink-500/20 whitespace-nowrap hover:bg-pink-500/20 transition-colors">
                 Type: {contentTypes.find(c => c.value === typeFilter)?.label} <span>×</span>
               </button>
             )}
             {objectFilter && (
               <button onClick={() => setObjectFilter(undefined)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 whitespace-nowrap hover:bg-blue-500/20 transition-colors">
                 Source: {linkedObjects.find(o => o.value === objectFilter)?.label} <span>×</span>
               </button>
             )}
             {(typeFilter || objectFilter) && (
               <button onClick={() => { setTypeFilter(undefined); setObjectFilter(undefined); }} className="text-gray-500 hover:text-white text-xs font-medium px-2 py-1.5 transition-colors">
                 Reset All
               </button>
             )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
          <p className="text-gray-500 animate-pulse">Filtering visual assets...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="animate-fade-in flex flex-col gap-12">
           <Gallery images={images} className="rounded-3xl overflow-hidden" />
           
           {/* Pagination UI */}
           {totalPages > 1 && (
             <div className="flex items-center justify-center gap-4 pt-8 border-t border-white/5">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-white/10"
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
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all border ${
                          page === p 
                          ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
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
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-white/10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
             </div>
           )}

           <div className="text-center text-gray-500 text-sm">
             Showing {((page-1)*PAGE_SIZE) + 1} to {Math.min(page*PAGE_SIZE, totalCount)} of {totalCount} images
           </div>
        </div>
      ) : (
        <div className="text-center py-32 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02]">
          <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">No matches found</h3>
          <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
          <button 
            onClick={() => { setTypeFilter(undefined); setObjectFilter(undefined); }}
            className="mt-6 text-pink-400 hover:text-pink-300 text-sm font-medium underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      )}
    </main>
  );
};
