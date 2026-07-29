import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAllPackages, createPackage, deletePackage } from '@/actions/packageActions';

export default async function AdminPackagesPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/letstravel');

  const packagesList = await getAllPackages();

  return (
    <AdminLayout user={session}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Pilgrimage Packages</h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, marginBottom: 0 }}>
            Manage Hajj & Umrah package offerings, prices, and availability
          </p>
        </div>

        {/* Create Package Form */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px 24px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            ✦ Create New Package
          </div>
          <form action={createPackage} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10 }}>
            <input
              type="text" name="title"
              placeholder="Package Title (e.g. 5 Star September Umrah)"
              required
              style={inputStyle}
            />
            <select name="type" style={inputStyle}>
              <option value="umrah">Umrah</option>
              <option value="hajj">Hajj</option>
            </select>
            <input type="text" name="month" placeholder="Month/Year (e.g. Sept 2026)" required style={inputStyle} />
            <input type="text" name="startingPrice" placeholder="Start Price (e.g. 2695.00)" required style={inputStyle} />
            <button
              type="submit"
              style={{
                gridColumn: '1 / -1',
                background: '#DB9E30',
                color: '#132723',
                border: 'none',
                borderRadius: 10,
                padding: '11px 0',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              ➕ Save & Publish Package
            </button>
          </form>
        </div>

        {/* Packages Table */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Package Title', 'Type', 'Month', 'Starting Price', 'Status', 'Action'].map((h, i) => (
                    <th key={h} style={{
                      padding: '12px 14px',
                      textAlign: i === 5 ? 'right' : 'left',
                      fontSize: 10, fontWeight: 700,
                      color: 'rgba(255,255,255,0.7)',
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {packagesList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                      No packages created yet. Add your first package above.
                    </td>
                  </tr>
                ) : (
                  packagesList.map((pkg, idx) => (
                    <tr key={pkg.id} style={{ borderBottom: '1px solid #f8fafc', background: idx % 2 === 0 ? '#fff' : '#fafbff' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{pkg.title}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 800,
                          textTransform: 'uppercase',
                          color: pkg.type === 'umrah' ? '#F59E0B' : '#3B82F6',
                          background: pkg.type === 'umrah' ? '#FFFBEB' : '#EFF6FF',
                          padding: '2px 8px', borderRadius: 99,
                        }}>
                          {pkg.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{pkg.month}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#10B981' }}>${pkg.startingPrice}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                          padding: '3px 10px', borderRadius: 99,
                          background: pkg.status === 'available' ? '#ECFDF5' : '#F8FAFC',
                          color: pkg.status === 'available' ? '#065F46' : '#475569',
                          border: `1px solid ${pkg.status === 'available' ? '#A7F3D0' : '#e2e8f0'}`,
                        }}>
                          {pkg.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <form action={async () => {
                          'use server';
                          await deletePackage(pkg.id);
                        }} style={{ display: 'inline' }}>
                          <button style={{
                            background: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
                            padding: '4px 12px',
                            borderRadius: 99,
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}>
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '9px 13px',
  fontSize: 12,
  background: '#F8FAFC',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  outline: 'none',
  color: '#0f172a',
  width: '100%',
};
