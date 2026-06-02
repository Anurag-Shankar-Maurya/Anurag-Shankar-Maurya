import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  variant?: 'general' | 'filter';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  variant = 'general'
}) => {
  const isFilter = variant === 'filter';
  
  return (
    <div 
      className={`flex flex-col items-center justify-center text-center mx-auto transition-all duration-500 ${
        isFilter 
          ? 'py-16 px-6 bg-white border border-[#E5E5E5] rounded-[3rem] max-w-xl animate-fade-in w-full' 
          : 'py-24 px-8 bg-white border border-dashed border-[#cfc4c5] rounded-[3.5rem] max-w-2xl animate-fade-in-up w-full'
      }`}
    >
      <div 
        className={`flex items-center justify-center rounded-full border mb-6 transition-all duration-500 hover:scale-110 ${
          isFilter 
            ? 'w-16 h-16 bg-[#f9f9f9] border-[#E5E5E5] text-black animate-pulse-slow' 
            : 'w-24 h-24 bg-[#f9f9f9] border-[#cfc4c5] text-black shadow-sm'
        }`}
      >
        <Icon className={isFilter ? 'w-8 h-8' : 'w-12 h-12'} />
      </div>
      
      <h3 className={`font-extrabold text-black tracking-tight mb-2 ${isFilter ? 'text-xl' : 'text-3xl'}`}>
        {title}
      </h3>
      
      <p className="text-[#4c4546] font-medium text-sm leading-relaxed max-w-md mb-8">
        {description}
      </p>
      
      {actionText && onAction && (
        <Button 
          variant={isFilter ? "primary" : "secondary"}
          onClick={onAction}
          className="shadow-none rounded-full px-8 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
