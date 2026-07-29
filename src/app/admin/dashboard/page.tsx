import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { getEnquiriesList } from '@/actions/enquiryActions';
import { getAllPackages } from '@/actions/packageActions';
import { getVisaServicesList } from '@/actions/visaActions';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/letstravel');

  const enquiries = await getEnquiriesList();
  const packages = await getAllPackages();
  const visas = await getVisaServicesList();

  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;
  const umrahCount = packages.filter(p => p.type === 'umrah').length;
  const hajjCount = packages.filter(p => p.type === 'hajj').length;

  // Stats config
  const stats = [
    {
      label: 'Total Enquiries',
      value: enquiries.length,
      badge: `${newEnquiriesCount} New`,
      badgeColor: '#10B981',
      badgeBg: '#ECFDF5',
      iconBg: '#ECFDF5',
      iconColor: '#10B981',
      icon: '📋',
    },
    {
      label: 'Umrah Packages',
      value: umrahCount,
      badge: 'Active',
      badgeColor: '#F59E0B',
      badgeBg: '#FFFBEB',
      iconBg: '#FFFBEB',
      iconColor: '#F59E0B',
      icon: '🕋',
    },
    {
      label: 'Hajj Packages',
      value: hajjCount,
      badge: '2027 Open',
      badgeColor: '#3B82F6',
      badgeBg: '#EFF6FF',
      iconBg: '#EFF6FF',
      iconColor: '#3B82F6',
      icon: '🕌',
    },
    {
      label: 'Visa Categories',
      value: visas.length,
      badge: 'Authorized',
      badgeColor: '#8B5CF6',
      badgeBg: '#F5F3FF',
      iconBg: '#F5F3FF',
      iconColor: '#8B5CF6',
      icon: '📜',
    },
  ];

  return (
    <AdminLayout user={session}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Page Header Row ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, marginBottom: 0 }}>Real-time Operations & Pilgrimage CRM</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 99,
              overflow: 'hidden',
              fontSize: 12,
              fontWeight: 600,
            }}>
              {['Today', 'Last Week', 'Last Month'].map((t, i) => (
                <button
                  key={t}
                  style={{
                    padding: '7px 14px',
                    border: 'none',
                    background: i === 0 ? '#0f172a' : 'transparent',
                    color: i === 0 ? '#fff' : '#64748b',
                    cursor: 'pointer',
                    fontWeight: i === 0 ? 700 : 500,
                    fontSize: 11,
                  }}
                >{t}</button>
              ))}
            </div>
            <button style={{
              padding: '7px 14px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
            }}>
              Filter ∨
            </button>
          </div>
        </div>

        {/* ── 4 Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: '#fff',
              borderRadius: 16,
              padding: '18px 20px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}>
              <div style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: s.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{s.value}</span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: s.badgeColor,
                    background: s.badgeBg,
                    padding: '2px 7px',
                    borderRadius: 99,
                  }}>↑ {s.badge}</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
          
          {/* Enquiry Growth Chart */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 24px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Enquiry Growth & Demand</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Weekly pilgrim traffic trends</div>
              </div>
              <div style={{
                display: 'flex',
                background: '#f1f5f9',
                borderRadius: 8,
                padding: 3,
                gap: 2,
              }}>
                {['Day', 'Weekly', 'Monthly'].map((t, i) => (
                  <button key={t} style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 600,
                    background: i === 1 ? '#fff' : 'transparent',
                    color: i === 1 ? '#0f172a' : '#94a3b8',
                    cursor: 'pointer',
                    boxShadow: i === 1 ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* SVG Chart — FIXED: explicit height, no overflow */}
            <div style={{ position: 'relative', height: 180 }}>
              <svg
                width="100%"
                height="180"
                viewBox="0 0 600 180"
                preserveAspectRatio="xMidYMid meet"
                style={{ display: 'block', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Y-axis grid lines */}
                {[30, 70, 110, 150].map(y => (
                  <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}

                {/* Red curve + fill */}
                <path
                  d="M0,130 C100,50 150,110 220,70 S350,30 420,60 S520,90 600,50"
                  fill="url(#gRed)"
                  stroke="none"
                />
                <path
                  d="M0,130 C100,50 150,110 220,70 S350,30 420,60 S520,90 600,50"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Blue curve + fill */}
                <path
                  d="M0,155 C80,100 160,140 240,115 S360,85 450,120 S540,140 600,110"
                  fill="url(#gBlue)"
                  stroke="none"
                />
                <path
                  d="M0,155 C80,100 160,140 240,115 S360,85 450,120 S540,140 600,110"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Highlight dot at peak */}
                <circle cx="350" cy="30" r="5" fill="#EF4444" />
                <circle cx="350" cy="30" r="3" fill="#fff" />
              </svg>

              {/* Tooltip */}
              <div style={{
                position: 'absolute',
                top: 18,
                left: '55%',
                transform: 'translateX(-50%)',
                background: '#0f172a',
                color: '#fff',
                padding: '5px 12px',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                Active Leads: {enquiries.length}
              </div>
            </div>

            {/* X-axis labels */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 10,
              borderTop: '1px solid #f1f5f9',
              marginTop: 4,
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{d}</span>
              ))}
            </div>
          </div>

          {/* Donut Chart */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 24px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Package Distribution</div>
              <Link href="/admin/packages" style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600, textDecoration: 'none' }}>View Details</Link>
            </div>

            {/* SVG Donut */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '12px 0' }}>
              <div style={{ position: 'relative', width: 140, height: 140 }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {/* Track */}
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                  {/* Umrah arc */}
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#10B981" strokeWidth="16"
                    strokeDasharray={`${(umrahCount / Math.max(packages.length, 1)) * 327} 327`}
                    strokeDashoffset="81.75" strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                  {/* Hajj arc */}
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#3B82F6" strokeWidth="16"
                    strokeDasharray={`${(hajjCount / Math.max(packages.length, 1)) * 327} 327`}
                    strokeDashoffset={`${81.75 + (umrahCount / Math.max(packages.length, 1)) * 327}`}
                    strokeLinecap="round"
                  />
                  {/* Center text */}
                  <text x="70" y="65" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">Total</text>
                  <text x="70" y="83" textAnchor="middle" fontSize="18" fill="#0f172a" fontWeight="800">{packages.length}</text>
                </svg>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 6,
              paddingTop: 12,
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
            }}>
              {[
                { label: 'Umrah', val: umrahCount, color: '#10B981' },
                { label: 'Hajj', val: hajjCount, color: '#3B82F6' },
                { label: 'Visas', val: visas.length, color: '#F59E0B' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 11, color: item.color, fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Tables Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

          {/* Recent Enquiries Table */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 24px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Recent Pilgrim Enquiries</div>
              <Link href="/admin/enquiries" style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
            </div>

            {enquiries.length === 0 ? (
              <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                No lead enquiries received yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {['Enquiry ID', 'Pilgrim Name', 'Phone', 'Status', 'Action'].map((h, i) => (
                      <th key={h} style={{
                        padding: '0 0 10px',
                        textAlign: i === 4 ? 'right' : 'left',
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enquiries.slice(0, 5).map((e) => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #fafafa' }}>
                      <td style={{ padding: '11px 0', fontFamily: 'monospace', fontWeight: 700, color: '#F59E0B', fontSize: 11 }}>{e.enquiryNumber}</td>
                      <td style={{ padding: '11px 0', fontWeight: 600, color: '#0f172a' }}>{e.fullName}</td>
                      <td style={{ padding: '11px 0', color: '#64748b' }}>{e.phone}</td>
                      <td style={{ padding: '11px 0' }}>
                        <span style={{
                          padding: '3px 9px',
                          borderRadius: 99,
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          background: e.status === 'new' ? '#FFFBEB' : '#ECFDF5',
                          color: e.status === 'new' ? '#92400E' : '#065F46',
                        }}>
                          {e.status}
                        </span>
                      </td>
                      <td style={{ padding: '11px 0', textAlign: 'right' }}>
                        <Link href="/admin/enquiries" style={{ fontSize: 11, fontWeight: 700, color: '#475569', textDecoration: 'none' }}>
                          Review →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Active Packages Panel */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 24px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Active Offerings</div>
              <Link href="/admin/packages" style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700, textDecoration: 'none' }}>Manage</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {packages.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>No packages yet.</div>
              ) : (
                packages.slice(0, 5).map((p) => (
                  <div key={p.id} style={{
                    padding: '10px 12px',
                    background: '#F8FAFC',
                    borderRadius: 10,
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginTop: 2 }}>
                        {p.type} • {p.month}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#10B981',
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '3px 8px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      ${p.startingPrice}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
