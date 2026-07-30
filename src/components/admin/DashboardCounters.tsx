'use client';

import { useEffect, useState } from 'react';
import { FileText, Headphones, Video, BookOpen, Newspaper, Mic, Mail, ArrowUpRight } from 'lucide-react';

interface CounterCardProps {
  label: string;
  targetValue: number;
  icon: any;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

function CounterCard({ label, targetValue, icon: Icon, iconBg, iconColor, badge }: CounterCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetValue;
    if (start === end) {
      setCount(end);
      return;
    }
    const duration = 1000; // 1 second animation
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {badge}
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
          {count.toLocaleString()}
          <span className="text-emerald-500 text-[10px] font-bold animate-pulse">● Live</span>
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function DashboardCounters({
  totalPages = 41,
  unreadMessages = 2,
}: {
  totalPages?: number;
  unreadMessages?: number;
}) {
  const counterItems = [
    { label: 'Total Pages', value: totalPages, icon: FileText, bg: '#EFF6FF', color: '#2563EB' },
    { label: 'Audio Lectures', value: 788, icon: Headphones, bg: '#F5F3FF', color: '#7C3AED' },
    { label: 'Videos', value: 190, icon: Video, bg: '#FEF2F2', color: '#DC2626' },
    { label: 'Books', value: 61, icon: BookOpen, bg: '#FFFBEB', color: '#D97706' },
    { label: 'Magazines', value: 4, icon: Newspaper, bg: '#FFF7ED', color: '#EA580C' },
    { label: 'Sermons', value: 2, icon: Mic, bg: '#ECFDF5', color: '#059669' },
    { label: 'Unread Messages', value: unreadMessages, icon: Mail, bg: '#FFF1F2', color: '#E11D48', badge: `${unreadMessages} New` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {counterItems.map((item) => (
        <CounterCard
          key={item.label}
          label={item.label}
          targetValue={item.value}
          icon={item.icon}
          iconBg={item.bg}
          iconColor={item.color}
          badge={item.badge}
        />
      ))}
    </div>
  );
}
