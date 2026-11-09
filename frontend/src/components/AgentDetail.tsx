
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, type Agent } from '../api/client'

export function AgentDetail() {
  const { id } = useParams<{ id: string }>()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function fetchAgent() {
      setLoading(true)
      setError(null)
      try {
        const data = await api.getAgent(parseInt(id, 10))
        if (!cancelled) setAgent(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to fetch agent')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAgent()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading agent...</div>
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#dc2626' }}>Error: {error}</p>
        <Link to="/agents" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Agents</Link>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#dc2626' }}>Agent not found</p>
        <Link to="/agents" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Agents</Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>{agent.name}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/agents" className="btn btn-secondary">Back to List</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Configuration</h3>
          {agent.description && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Description:</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#4b5563' }}>{agent.description}</p>
            </div>
          )}
          {agent.system_prompt && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>System Prompt:</strong>
              <pre style={{ margin: '0.5rem 0 0', padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem', overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.875rem', maxHeight: '200px' }}>{agent.system_prompt}</pre>
            </div>
          )}
          {agent.config && Object.keys(agent.config).length > 0 && (
            <div>
              <strong>Config:</strong>
              <pre style={{ margin: '0.5rem 0 0', padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem', overflow: 'auto', fontSize: '0.875rem' }}>{JSON.stringify(agent.config, null, 2)}</pre>
            </div>
          )}
          {!agent.description && !agent.system_prompt && (!agent.config || Object.keys(agent.config).length === 0) && (
            <p style={{ color: '#6b7280' }}>No configuration set.</p>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Status & Metadata</h3>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontSize: '0.875rem' }}>
            <dt style={{ color: '#6b7280' }}>ID</dt>
            <dd style={{ margin: 0, fontFamily: 'monospace' }}>{agent.id}</dd>
            <dt style={{ color: '#6b7280' }}>Status</dt>
            <dd style={{ margin: 0 }}>
              <span className={`badge ${agent.is_active ? 'badge-success' : 'badge-secondary'}`}>
                {agent.is_active ? 'Active' : 'Inactive'}
              </span>
            </dd>
            <dt style={{ color: '#6b7280' }}>Created</dt>
            <dd style={{ margin: 0 }}>{new Date(agent.created_at).toLocaleString()}</dd>
            <dt style={{ color: '#6b7280' }}>Updated</dt>
            <dd style={{ margin: 0 }}>{new Date(agent.updated_at).toLocaleString()}</dd>
          </dl>
        </div>
      </div>
    </div>
  )
}
