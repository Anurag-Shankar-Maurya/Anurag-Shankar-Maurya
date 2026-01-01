import React, { useState, useEffect } from 'react';
import { ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import Gallery from '../components/Gallery';
import { api } from '../services/api';
import { Image } from '../types';
import { Button } from '../components/Button';

export const GalleryView: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | undefined>(undefined);

  const fetchImages = async (imageType?: string) => {
    try {
      setLoading(true);
      const res = await api.getImages({ image_type: imageType, limit: 100 });
      setImages(res.results);
    } catch (error) {
      console.error("Failed to fetch gallery images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(filter);
  }, [filter]);

  const categories = [
    { label: 'All', value: undefined },
    { label: 'Gallery', value: 'gallery' },
    { label: 'Projects', value: 'cover' },
    { label: 'Achievements', value: 'other' },
  ];

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <ImageIcon className="w-8 h-8"/>
          </div>
          <div>
             <h1 className="text-4xl font-bold text-white">Visual Gallery</h1>
             <p className="text-gray-400 mt-2">A curated collection of captures and achievements.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat.value 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => fetchImages(filter)} className="ml-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
          <p className="text-gray-500 animate-pulse">Loading visual assets...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="animate-fade-in">
           <Gallery images={images} columns={3} className="rounded-3xl overflow-hidden shadow-2xl" />
           <div className="mt-12 text-center text-gray-500 text-sm">
             Showing {images.length} images
           </div>
        </div>
      ) : (
        <div className="text-center py-32 rounded-3xl border-2 border-dashed border-white/5 bg-white/2">
          <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">No images found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </main>
  );
};
