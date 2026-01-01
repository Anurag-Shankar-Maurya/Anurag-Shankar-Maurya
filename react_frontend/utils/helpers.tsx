
import React from 'react';
import { Icons, SocialIcons } from '../components/Icons';

export const getSocialIcon = (platform: string, className?: string) => {
  const key = platform.toLowerCase();
  const IconComponent = SocialIcons[key] || Icons.globe;
  return <IconComponent className={className || "w-5 h-5"} />;
};
