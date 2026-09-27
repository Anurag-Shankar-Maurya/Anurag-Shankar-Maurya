
import React from 'react';
import { ArrowRight, Trophy, Code, Award } from 'lucide-react';
import { Achievement } from '../types';
import { Button } from './Button';

interface AchievementCardProps {
  achievement: Achievement;
  onClick: (slug: string) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const getIcon = () => {
    switch (achievement.achievement_type) {
      case 'Award': return <Trophy className="h-5 w-5 text-black" />;
      case 'Certification': return <Award className="h-5 w-5 text-black" />;
      case 'Project': return <Code className="h-5 w-5 text-black" />;
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-[3rem] bg-white border border-[#E5E5E5] p-10 transition-all hover:border-black shadow-none">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-[#f9f9f9] border border-[#E5E5E5]">
          {getIcon()}
        </div>
        <span className="text-xs font-semibold text-[#7e7576] uppercase tracking-wider">
          {achievement.date}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-black mb-2 leading-tight">
        {achievement.title}
      </h3>
      
      {/* 
        The description is strictly typed in Achievement interface as string, 
        preventing 'string | undefined' errors.
      */}
      <p className="text-[#4c4546] mb-6 line-clamp-2 h-10 leading-[1.6] text-sm">
        {achievement.description}
      </p>

      <div className="mt-auto">
        <Button 
          variant="ghost" 
          onClick={() => onClick(achievement.slug)}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="pl-0 hover:pl-2 transition-all text-[#7e7576]"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
