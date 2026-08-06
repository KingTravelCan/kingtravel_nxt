import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // @ts-ignore
  const Icon = LucideIcons[name] || LucideIcons.HelpCircle; // Fallback to HelpCircle if icon not found
  return <Icon {...props} />;
};

export default DynamicIcon;
