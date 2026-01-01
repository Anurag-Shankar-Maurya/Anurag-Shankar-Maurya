import React, { useState, useEffect, useMemo } from 'react';
import { ImageIcon, Loader2, RefreshCw, Filter, Layers, ChevronDown } from 'lucide-react';
import Gallery from '../components/Gallery';
import { api } from '../services/api';
import { Image } from '../types';
import { Button } from '../components/Button';

export const GalleryView: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [objectFilter, setObjectFilter] = useState<string | undefined>(undefined);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // We fetch all images (with a high limit) and filter on the frontend for Linked Object
      // because the backend content_type filter uses IDs, not names.
      // Filtering image_type on the backend is fine.
      const res = await api.getImages({ 
        image_type: typeFilter, 
        limit: 200 
      });
      
      let filteredResults = res.results;
      
      if (objectFilter) {
        filteredResults = filteredResults.filter(img => img.linked_object_type === objectFilter);
      }
      
      setImages(filteredResults);
    } catch (error) {
      console.error("Failed to fetch gallery images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [typeFilter, objectFilter]);

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
        <div className="animate-fade-in">
           <Gallery images={images} columns={3} className="rounded-3xl overflow-hidden" />
           <div className="mt-12 text-center text-gray-500 text-sm">
             Showing {images.length} images
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
