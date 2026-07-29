import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { getEnquiriesList, updateEnquiryStatus } from '@/actions/enquiryActions';

export default async function AdminEnquiriesPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/letstravel');

  const list = await getEnquiriesList();
  const newCount = list.filter(e => e.status === 'new').length;

  return (
    <AdminLayout user={session}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>CRM Enquiries</h1>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, marginBottom: 0 }}>
              Manage, update, and track pilgrim quote requests
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 12, fontWeight: 700,
              background: '#FFFBEB', color: '#92400E',
              border: '1px solid #FDE68A',
              padding: '5px 14px', borderRadius: 99,
            }}>
              🔥 {newCount} New Leads
            </span>
          </div>
        </div>

        {/* Table Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          {list.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              No enquiries submitted yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#0f172a' }}>
                    {['Ref ID', 'Full Name', 'Email & Phone', 'Package / Type', 'Occupancy', 'Status', 'Submitted', 'Action'].map((h, i) => (
                      <th key={h} style={{
                        padding: '12px 14px',
                        textAlign: i === 7 ? 'right' : 'left',
                        fontSize: 10, fontWeight: 700,
                        color: 'rgba(255,255,255,0.7)',
                        textTransform: 'uppercase', letterSpacing: '0.07em',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc', background: idx % 2 === 0 ? '#fff' : '#fafbff' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#F59E0B', fontSize: 11 }}>
                        {item.enquiryNumber}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.fullName}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{item.city}, {item.province}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#334155' }}>{item.phone}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{item.email}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#004B39' }}>
                        {item.preferredPackageType || item.type}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>
                        {item.adults} Adults ({item.occupancy || 'N/A'})
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 99,
                          fontSize: 10, fontWeight: 800,
                          textTransform: 'uppercase',
                          background: item.status === 'new' ? '#FFFBEB' :
                            item.status === 'booked' ? '#ECFDF5' : '#F8FAFC',
                          color: item.status === 'new' ? '#92400E' :
                            item.status === 'booked' ? '#065F46' : '#475569',
                          border: `1px solid ${item.status === 'new' ? '#FDE68A' : item.status === 'booked' ? '#A7F3D0' : '#e2e8f0'}`,
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: 11 }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <form action={async () => {
                          'use server';
                          await updateEnquiryStatus(item.id, 'contacted');
                        }} style={{ display: 'inline' }}>
                          <button style={{
                            background: '#0f172a',
                            color: '#fff',
                            padding: '5px 12px',
                            borderRadius: 99,
                            fontSize: 10,
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}>
                            Mark Contacted
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
