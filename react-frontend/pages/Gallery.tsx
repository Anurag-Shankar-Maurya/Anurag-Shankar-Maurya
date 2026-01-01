import React, { useState, useEffect } from 'react';
import { ImageIcon, Loader2, RefreshCw, Filter, Layers } from 'lucide-react';
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

  const contentTypes = [
    { label: 'All Types', value: undefined },
    { label: 'Gallery', value: 'gallery' },
    { label: 'Covers', value: 'cover' },
    { label: 'Thumbnails', value: 'thumbnail' },
    { label: 'Logos', value: 'logo' },
  ];

  const linkedObjects = [
    { label: 'All Sources', value: undefined },
    { label: 'Profile', value: 'profile' },
    { label: 'Projects', value: 'project' },
    { label: 'Experience', value: 'workexperience' },
    { label: 'Education', value: 'education' },
    { label: 'Achievements', value: 'achievement' },
  ];

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <ImageIcon className="w-8 h-8"/>
          </div>
          <div>
             <h1 className="text-4xl font-bold text-white tracking-tight">Visual Gallery</h1>
             <p className="text-gray-400 mt-2">A curated collection of captures and achievements.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Content Type Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Content:
            </span>
            {contentTypes.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setTypeFilter(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === cat.value 
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Linked Object Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Linked to:
            </span>
            {linkedObjects.map((obj) => (
              <button
                key={obj.label}
                onClick={() => setObjectFilter(obj.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  objectFilter === obj.value 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {obj.label}
              </button>
            ))}
            <Button variant="ghost" size="sm" onClick={fetchImages} className="ml-2">
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
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
