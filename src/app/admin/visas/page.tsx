import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { getVisaServicesList, createVisaService } from '@/actions/visaActions';

export default async function AdminVisasPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/letstravel');

  const visas = await getVisaServicesList();

  return (
    <AdminLayout user={session}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Saudi Visa Services</h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, marginBottom: 0 }}>
            Manage authorized Saudi visa processing categories & document guidelines
          </p>
        </div>

        {/* Add Visa Form */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px 24px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            ✦ Add Visa Service Category
          </div>
          <form action={createVisaService} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <input type="text" name="title" placeholder="Visa Title (e.g. Tourist eVisa)" required style={inputStyle} />
            <input type="text" name="processingTime" placeholder="Processing Time (e.g. 24-48 Hours)" required style={inputStyle} />
            <input type="text" name="shortDescription" placeholder="Short summary for pilgrims" required style={inputStyle} />
            <button
              type="submit"
              style={{
                gridColumn: '1 / -1',
                background: '#004B39',
                color: '#F5EFE1',
                border: 'none',
                borderRadius: 10,
                padding: '11px 0',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              ➕ Save Visa Category
            </button>
          </form>
        </div>

        {/* Visa Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {visas.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              padding: '60px 0',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: 14,
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #f1f5f9',
            }}>
              No visa categories added yet.
            </div>
          ) : (
            visas.map((v) => (
              <div key={v.id} style={{
                background: '#fff',
                borderRadius: 16,
                padding: '20px 22px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Gold accent bar */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 3,
                  background: 'linear-gradient(to right, #DB9E30, #E7BE6E)',
                  borderRadius: '16px 16px 0 0',
                }} />

                <span style={{
                  display: 'inline-block',
                  fontSize: 10, fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: '#92400E',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  padding: '3px 10px',
                  borderRadius: 99,
                  width: 'fit-content',
                }}>
                  ⏱ {v.processingTime}
                </span>

                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {v.title}
                </h3>

                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {v.shortDescription}
                </p>

                <div style={{
                  paddingTop: 10,
                  marginTop: 4,
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: '#10B981',
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    padding: '3px 10px',
                    borderRadius: 99,
                  }}>
                    ✓ Active
                  </span>
                </div>
              </div>
            ))
          )}
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
