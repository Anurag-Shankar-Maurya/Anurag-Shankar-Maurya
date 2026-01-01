
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
      case 'Award': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'Certification': return <Award className="h-5 w-5 text-blue-500" />;
      case 'Project': return <Code className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface border border-white/10 p-6 transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
          {getIcon()}
        </div>
        <span className="text-xs font-medium text-secondary uppercase tracking-wider">
          {achievement.date}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
        {achievement.title}
      </h3>
      
      {/* 
        The description is strictly typed in Achievement interface as string, 
        preventing 'string | undefined' errors.
      */}
      <p className="text-gray-400 mb-6 line-clamp-2 h-10">
        {achievement.description}
      </p>

      <div className="mt-auto">
        <Button 
          variant="ghost" 
          onClick={() => onClick(achievement.slug)}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="pl-0 hover:pl-2 transition-all"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
