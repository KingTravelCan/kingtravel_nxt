'use client';

import { useState, useEffect } from 'react';
import { ActivityItem, getRecentActivities } from '@/actions/activityActions';
import { Search, Filter, ShieldCheck, Layers, Users, Sliders, Package, FileText, Mail } from 'lucide-react';

interface ActivityLogsClientProps {
  initialActivities: ActivityItem[];
}

const TYPE_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  pages: { label: 'Pages', bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6', border: '#BFDBFE' },
  users: { label: 'Users / Login', bg: '#ECFDF5', text: '#047857', dot: '#10B981', border: '#A7F3D0' },
  settings: { label: 'Settings', bg: '#F5F3FF', text: '#6D28D9', dot: '#8B5CF6', border: '#DDD6FE' },
  packages: { label: 'Packages', bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B', border: '#FDE68A' },
  visas: { label: 'Visas', bg: '#E0F2FE', text: '#0369A1', dot: '#0EA5E9', border: '#BAE6FD' },
  enquiries: { label: 'Enquiries', bg: '#FFF1F2', text: '#BE123C', dot: '#F43F5E', border: '#FECDD3' },
  menus: { label: 'Menus', bg: '#F0FDFA', text: '#0F766E', dot: '#14B8A6', border: '#99F6E4' },
};

export default function ActivityLogsClient({ initialActivities }: ActivityLogsClientProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await getRecentActivities(100);
        setActivities(data);
      } catch (err) {
        console.error('Failed to refresh activity logs:', err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = activities.filter((act) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      act.action.toLowerCase().includes(q) ||
      act.user.toLowerCase().includes(q) ||
      (act.details || '').toLowerCase().includes(q);
    const matchesType = selectedType === 'all' || act.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-slate-900 m-0">Activity Logs</h1>
          <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {filtered.length} entries
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Detailed chronological record of all administrative actions and system events.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, user, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004B39] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-semibold outline-none cursor-pointer"
          >
            <option value="all">All Entities</option>
            <option value="pages">Pages</option>
            <option value="users">Users / Login</option>
            <option value="settings">Settings</option>
            <option value="packages">Packages</option>
            <option value="visas">Visas</option>
            <option value="enquiries">Enquiries</option>
            <option value="menus">Menus</option>
          </select>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 flex-wrap">
        <span className="text-xs font-bold text-slate-700 mr-2">Dot Color Legend:</span>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <span
            key={key}
            onClick={() => setSelectedType(selectedType === key ? 'all' : key)}
            ref={(el) => {
              if (el) {
                el.style.backgroundColor = cfg.bg;
                el.style.color = cfg.text;
                el.style.borderColor = cfg.border;
              }
            }}
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform hover:scale-105 border ${
              selectedType === key ? 'ring-2 ring-emerald-500' : ''
            }`}
          >
            <span
              ref={(dot) => {
                if (dot) dot.style.backgroundColor = cfg.dot;
              }}
              className="w-2 h-2 rounded-full"
            />
            {cfg.label}
          </span>
        ))}
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Type</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No activity log entries found matching filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((act) => {
                const cfg = TYPE_CONFIG[act.type] || TYPE_CONFIG.pages;
                return (
                  <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <span
                        ref={(dot) => {
                          if (dot) dot.style.backgroundColor = cfg.dot;
                        }}
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        title={cfg.label}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{act.action}</span>
                        <span
                          ref={(badge) => {
                            if (badge) {
                              badge.style.backgroundColor = cfg.bg;
                              badge.style.color = cfg.text;
                            }
                          }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center">
                          {act.user.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{act.user}</div>
                          {act.userEmail && (
                            <div className="text-[10px] text-slate-400">{act.userEmail}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                      {act.details || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-bold text-slate-700">{act.timeAgo || 'Recently'}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(act.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
