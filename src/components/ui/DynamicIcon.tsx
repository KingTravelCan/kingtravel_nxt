import React from 'react';
import { icons, HelpCircle, LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  if (!name) return <HelpCircle {...props} />;
  
  const cleanName = name.trim();
  
  // Try exact match first
  let Icon = (icons as any)[cleanName];
  
  if (!Icon) {
    // Try PascalCase transformation (e.g. "map-pin" -> "MapPin", "utensils" -> "Utensils")
    const pascalName = cleanName
      .split(/[-_ ]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
    Icon = (icons as any)[pascalName];
  }

  if (!Icon) {
    // Fallback: case-insensitive match (e.g. "map pin" -> "MapPin")
    const lowerName = cleanName.toLowerCase().replace(/[-_ ]/g, '');
    const foundKey = Object.keys(icons || {}).find(
      key => key.toLowerCase() === lowerName
    );
    if (foundKey) {
      Icon = (icons as any)[foundKey];
    }
  }

  Icon = Icon || HelpCircle;
  return <Icon {...props} />;
};

export default DynamicIcon;
