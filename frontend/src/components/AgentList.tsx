
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Agent, type AgentListResponse } from '../api/client'

export function AgentList() {
  const [data, setData] = useState<AgentListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchAgents() {
      setLoading(true)
      setError(null)
      try {
        const response = await api.listAgents({
          page,
          page_size: 20,
          is_active: isActiveFilter ?? undefined,
        })
        if (!cancelled) setData(response)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to fetch agents')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAgents()
    return () => { cancelled = true }
  }, [page, isActiveFilter])

  if (loading && !data) {
    return <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading agents...</div>
  }

  if (error) {
    return <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>Error: {error}</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Agents</h2>
        <Link to="/agents/new" className="btn btn-primary">New Agent</Link>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isActiveFilter === true}
            onChange={(e) => setIsActiveFilter(e.target.checked ? true : null)}
          />
          Active only
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isActiveFilter === false}
            onChange={(e) => setIsActiveFilter(e.target.checked ? false : null)}
          />
          Inactive only
        </label>
      </div>

      {data && (
        <>
          {data.items.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#6b7280' }}>No agents found. Create your first agent!</p>
            </div>
          ) : (
            <div className="card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Created</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((agent) => (
                    <tr key={agent.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                        <Link to={`/agents/${agent.id}`}>{agent.name}</Link>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#4b5563', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {agent.description || '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${agent.is_active ? 'badge-success' : 'badge-secondary'}`}>
                          {agent.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(agent.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <Link to={`/agents/${agent.id}`} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.total_pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setPage(1)} disabled={page === 1} className="btn btn-secondary">First</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary">Prev</button>
              <span style={{ display: 'flex', gap: '0.25rem' }}>
                {Array.from({ length: Math.min(data.total_pages, 5) }, (_, i) => {
                  let pageNum: number
                  if (data.total_pages <= 5) pageNum = i + 1
                  else if (page <= 3) pageNum = i + 1
                  else if (page >= data.total_pages - 2) pageNum = data.total_pages - 4 + i
                  else pageNum = page - 2 + i
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`btn ${page === pageNum ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ minWidth: '2.5rem' }}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </span>
              <button onClick={() => setPage(p => Math.min(data.total_pages, p + 1))} disabled={page === data.total_pages} className="btn btn-secondary">Next</button>
              <button onClick={() => setPage(data.total_pages)} disabled={page === data.total_pages} className="btn btn-secondary">Last</button>
            </div>
          )}

          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '0.5rem' }}>
            Page {page} of {data.total_pages} — {data.total} total
          </p>
        </>
      )}
    </div>
  )
}
