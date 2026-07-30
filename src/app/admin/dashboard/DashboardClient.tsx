'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ActivityItem } from '@/actions/activityActions';
import {
  ClipboardList,
  Compass,
  Landmark,
  FileText,
  FileCode2,
  Users as UsersIcon,
  Mail,
  ArrowUpRight,
  ChevronDown,
  Filter,
  Sparkles,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface DashboardClientProps {
  session: any;
  initialEnquiries: any[];
  initialPackages: any[];
  initialVisas: any[];
  initialPages: any[];
  initialUsers: any[];
  initialActivities: ActivityItem[];
}

export default function DashboardClient({
  session,
  initialEnquiries,
  initialPackages,
  initialVisas,
  initialPages,
  initialUsers,
  initialActivities,
}: DashboardClientProps) {
  const [timeRange, setTimeRange] = useState<'Today' | '7 Days' | '30 Days'>('Today');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Animated counters state
  const [animatedValues, setAnimatedValues] = useState({
    enquiries: 0,
    umrah: 0,
    hajj: 0,
    visas: 0,
    pages: 0,
    users: 0,
    unread: 0,
  });

  const newEnquiriesCount = initialEnquiries.filter((e) => e.status === 'new').length;
  const umrahCount = initialPackages.filter((p) => p.type === 'umrah').length;
  const hajjCount = initialPackages.filter((p) => p.type === 'hajj').length;
  const visaCount = initialVisas.length;
  const totalPackages = initialPackages.length;

  const targetValues = {
    enquiries: initialEnquiries.length,
    umrah: umrahCount,
    hajj: hajjCount,
    visas: visaCount,
    pages: initialPages.length,
    users: initialUsers.length,
    unread: newEnquiriesCount,
  };

  // Smooth Count-Up Animation
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 900;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        enquiries: Math.floor(targetValues.enquiries * easeProgress),
        umrah: Math.floor(targetValues.umrah * easeProgress),
        hajj: Math.floor(targetValues.hajj * easeProgress),
        visas: Math.floor(targetValues.visas * easeProgress),
        pages: Math.floor(targetValues.pages * easeProgress),
        users: Math.floor(targetValues.users * easeProgress),
        unread: Math.floor(targetValues.unread * easeProgress),
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setAnimatedValues(targetValues);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Pie Chart calculations
  const totalOfferings = Math.max(umrahCount + hajjCount + visaCount, 1);
  const umrahPct = Math.round((umrahCount / totalOfferings) * 100);
  const hajjPct = Math.round((hajjCount / totalOfferings) * 100);
  const visaPct = Math.round((visaCount / totalOfferings) * 100);

  return (
    <div className="max-w-[1550px] mx-auto flex flex-col gap-6 font-sans">
      {/* ── Cinematic Hero Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071814] via-[#0E2C24] to-[#004B39] text-white p-6 lg:p-7 border border-[#DB9E30]/25 shadow-2xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#DB9E30_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#DB9E30] rounded-full blur-[100px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#DB9E30]/15 border border-[#DB9E30]/35 px-3 py-1 rounded-full text-[10px] font-extrabold text-[#DB9E30] uppercase tracking-widest mb-2 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-[#DB9E30]" /> Executive Operations Suite
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif text-white m-0 tracking-tight">
              Welcome Back, {session?.name || 'Super Admin'} 👋
            </h1>
            <p className="text-xs text-emerald-100/70 mt-1 mb-0 font-medium">
              King Travel Real-Time Pilgrimage CRM &amp; Dynamic Content Engine
            </p>
          </div>

          {/* Time Filter & Actions Controls */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#051410]/80 border border-emerald-500/20 rounded-full p-1 text-xs font-semibold backdrop-blur-md shadow-inner">
              {(['Today', '7 Days', '30 Days'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeRange(t)}
                  className={`px-3 py-1 rounded-full border-none cursor-pointer transition-all text-xs font-bold ${
                    timeRange === t
                      ? 'bg-[#DB9E30] text-[#071814] shadow-md'
                      : 'bg-transparent text-emerald-100/70 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className="px-3.5 py-1.5 bg-[#051410]/80 border border-emerald-500/20 rounded-full text-xs font-bold text-white hover:bg-[#08221B] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm backdrop-blur-md"
              >
                <Filter className="w-3 h-3 text-[#DB9E30]" />
                Filter
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {filterMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0C221C] border border-[#DB9E30]/30 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Time Interval
                  </div>
                  <button
                    type="button"
                    onClick={() => { setTimeRange('Today'); setFilterMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs rounded-xl hover:bg-[#13332B] font-medium cursor-pointer border-none bg-transparent text-white"
                  >
                    Today (24h)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTimeRange('7 Days'); setFilterMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs rounded-xl hover:bg-[#13332B] font-medium cursor-pointer border-none bg-transparent text-white"
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTimeRange('30 Days'); setFilterMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs rounded-xl hover:bg-[#13332B] font-medium cursor-pointer border-none bg-transparent text-white"
                  >
                    Last 30 Days
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Compact 4 Stat Cards Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Enquiries */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs group-hover:scale-110 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ↑ {newEnquiriesCount} New
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {animatedValues.enquiries}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Total Enquiries</div>
        </div>

        {/* Card 2: Umrah Packages */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              ↑ Active
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {animatedValues.umrah}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Umrah Packages</div>
        </div>

        {/* Card 3: Hajj Packages */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ↑ 2027 Open
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {animatedValues.hajj}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Hajj Packages</div>
        </div>

        {/* Card 4: Visa Categories */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              ↑ Authorized
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {animatedValues.visas}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Visa Solutions</div>
        </div>
      </div>

      {/* ── Main Dashboard 2-Column Grid (Left: 7/12, Right: 5/12) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Pie Chart Card + Recent Pilgrim Enquiries Table */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Aesthetic Pie & Donut Graph Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-emerald-600" /> Offerings Breakdown &amp; Package Distribution
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 mb-0">
                  Ratio of live Umrah, Hajj &amp; Visa services
                </p>
              </div>
              <Link
                href="/admin/packages"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 no-underline flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 transition-colors"
              >
                View Details <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center py-2">
              {/* SVG Pie Chart */}
              <div className="flex justify-center items-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
                    <circle cx="88" cy="88" r="64" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                    {/* Umrah segment */}
                    <circle
                      cx="88"
                      cy="88"
                      r="64"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="20"
                      strokeDasharray={`${(umrahCount / totalOfferings) * 402} 402`}
                      strokeDashoffset="0"
                      className="transition-all duration-700 ease-out"
                    />
                    {/* Hajj segment */}
                    <circle
                      cx="88"
                      cy="88"
                      r="64"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="20"
                      strokeDasharray={`${(hajjCount / totalOfferings) * 402} 402`}
                      strokeDashoffset={`-${(umrahCount / totalOfferings) * 402}`}
                      className="transition-all duration-700 ease-out"
                    />
                    {/* Visas segment */}
                    <circle
                      cx="88"
                      cy="88"
                      r="64"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="20"
                      strokeDasharray={`${(visaCount / totalOfferings) * 402} 402`}
                      strokeDashoffset={`-${((umrahCount + hajjCount) / totalOfferings) * 402}`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Total
                    </span>
                    <span className="text-2xl font-black text-slate-900 leading-tight">
                      {totalOfferings}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                      Offerings
                    </span>
                  </div>
                </div>
              </div>

              {/* Pie Chart Legend Breakdown */}
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Umrah Packages</div>
                      <div className="text-[10px] text-slate-500">{umrahPct}% of total CRM offerings</div>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-700">{umrahCount}</span>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500 shadow-xs" />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Hajj Packages</div>
                      <div className="text-[10px] text-slate-500">{hajjPct}% of total CRM offerings</div>
                    </div>
                  </div>
                  <span className="text-sm font-black text-blue-700">{hajjCount}</span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Visa Solutions</div>
                      <div className="text-[10px] text-slate-500">{visaPct}% of total CRM offerings</div>
                    </div>
                  </div>
                  <span className="text-sm font-black text-amber-700">{visaCount}</span>
                </div>
              </div>
            </div>

            {/* Quick Secondary Stats Bar Integrated Inside Card */}
            <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-slate-100">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <FileCode2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">CMS Pages</div>
                  <div className="text-sm font-black text-slate-900">{animatedValues.pages}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <UsersIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Users</div>
                  <div className="text-sm font-black text-slate-900">{animatedValues.users}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Unread</div>
                  <div className="text-sm font-black text-slate-900">{animatedValues.unread}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Pilgrim Enquiries Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0">Recent Pilgrim Enquiries</h3>
                <p className="text-xs text-slate-400 mt-0.5 mb-0">Incoming lead inquiries and booking requests</p>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 no-underline"
              >
                View All →
              </Link>
            </div>

            {initialEnquiries.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">No lead enquiries received yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 pb-3">Enquiry ID</th>
                      <th className="py-2.5 pb-3">Pilgrim Name</th>
                      <th className="py-2.5 pb-3">Phone</th>
                      <th className="py-2.5 pb-3">Status</th>
                      <th className="py-2.5 pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {initialEnquiries.slice(0, 5).map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-amber-600 text-[11px]">
                          {e.enquiryNumber}
                        </td>
                        <td className="py-3 font-semibold text-slate-900">{e.fullName}</td>
                        <td className="py-3 text-slate-500 font-mono text-[11px]">{e.phone}</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              e.status === 'new'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {e.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href="/admin/enquiries"
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 no-underline"
                          >
                            Review →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity + Recent Pages + Active Offerings */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Recent Activity Card */}
          <div className="bg-[#F2F6F5] rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-700" /> Recent Activity
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-0">
                  Real-time action audit trail
                </p>
              </div>
              <Link
                href="/admin/activity"
                className="bg-[#004B39] hover:bg-[#00382B] text-white text-xs font-extrabold px-3 py-1.5 rounded-full no-underline transition-colors flex items-center gap-1 shadow-xs"
              >
                View all →
              </Link>
            </div>

            <div className="text-[10px] text-slate-500 font-semibold mb-3 flex items-center gap-2 flex-wrap bg-white/60 p-2 rounded-xl border border-slate-200/60">
              <span>Legend:</span>
              <span className="text-emerald-700">● Pages</span>
              <span className="text-teal-700">● Users</span>
              <span className="text-purple-700">● Settings</span>
              <span className="text-amber-700">● Packages</span>
              <span className="text-blue-700">● Visas</span>
            </div>

            {/* Activity List */}
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {initialActivities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-200/50 shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-slate-900 truncate">{act.action}</span>
                      <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md uppercase shrink-0">
                        {act.type}
                      </span>
                    </div>
                    {act.details && (
                      <div className="text-[10px] font-mono text-slate-600 mt-0.5 truncate">
                        {act.details}
                      </div>
                    )}
                    <div className="text-[9px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>⏱ {act.timeAgo || 'Recently'}</span>
                      <span className="bg-lime-300 text-slate-950 font-bold px-1.5 py-0.2 rounded-xs">
                        {act.user}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Pages Card */}
          <div className="bg-[#F2F6F5] rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-700" /> Recent Pages
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-0">Last 5 edited website pages</p>
              </div>
              <Link
                href="/admin/pages"
                className="text-xs font-extrabold text-slate-600 hover:text-slate-900 no-underline transition-colors"
              >
                All pages →
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {initialPages.slice(0, 5).map((p) => (
                <div key={p.id} className="p-2.5 bg-white/80 rounded-xl border border-slate-200/50 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs text-slate-900 truncate">{p.title}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">{p.slug}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                        p.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      • {p.status || 'Published'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Packages Panel */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm font-extrabold text-slate-900">Active Offerings</div>
              <Link
                href="/admin/packages"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 no-underline"
              >
                Manage
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {initialPackages.length === 0 ? (
                <div className="py-4 text-center text-slate-400 text-xs">No packages yet.</div>
              ) : (
                initialPackages.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                        {p.type} • {p.month}
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-white border border-slate-200 rounded-lg px-2 py-0.5 shrink-0 shadow-2xs">
                      ${p.startingPrice}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
