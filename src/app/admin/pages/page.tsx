import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { getPagesList } from '@/actions/pageActions';
import Link from 'next/link';

export default async function AdminPagesListPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/letstravel');

  const pages = await getPagesList();

  return (
    <AdminLayout user={session}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Top Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Pages</h1>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, marginBottom: 0 }}>Manage live website pages, titles, slugs, dynamic page sections &amp; SEO</p>
          </div>
          <Link
            href="/admin/pages/edit"
            style={{
              background: '#004B39',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(0,75,57,0.25)',
            }}
          >
            + Create New Page
          </Link>
        </div>

        {/* Filter / Search Bar */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '16px 20px',
          border: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
        }}>
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            style={{
              flex: 1,
              maxWidth: 400,
              padding: '10px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              fontSize: 13,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <select style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, background: '#fff', outline: 'none' }}>
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
            <select style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, background: '#fff', outline: 'none' }}>
              <option>Newest first</option>
              <option>Oldest first</option>
            </select>
          </div>
        </div>

        {/* Pages Table — Dynamic from Database */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 20px', width: 40 }}><input type="checkbox" /></th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Title</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Slug</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Updated</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}><input type="checkbox" /></td>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0f172a' }}>{p.title}</td>
                  <td style={{ padding: '16px 20px', color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>{p.slug}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      background: p.status === 'published' ? '#ecfdf5' : '#fffbe0',
                      color: p.status === 'published' ? '#059669' : '#d97706',
                      padding: '4px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      textTransform: 'capitalize',
                    }}>
                      • {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8', fontSize: 12 }}>
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <Link href={`/admin/pages/edit?id=${p.id}`} style={{ padding: '6px 10px', borderRadius: 8, background: '#f1f5f9', color: '#0f172a', textDecoration: 'none', fontSize: 11, fontWeight: 700 }}>
                        ✎ Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
