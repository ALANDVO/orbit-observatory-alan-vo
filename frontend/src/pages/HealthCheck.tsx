import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface HealthResponse {
  status: string
  app: string
  version: string
}

interface DbHealthResponse {
  status: string
  database: string
  error?: string
}

export function HealthCheck() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [dbHealth, setDbHealth] = useState<DbHealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHealth() {
      try {
        setLoading(true)
        const [healthRes, dbHealthRes] = await Promise.all([
          api.get<HealthResponse>('/health'),
          api.get<DbHealthResponse>('/health/db'),
        ])
        setHealth(healthRes)
        setDbHealth(dbHealthRes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch health')
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
  }, [])

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Loading health checks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', border: '1px solid #dc2626' }}>
          <h2 style={{ color: '#dc2626' }}>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const badgeClass = status === 'healthy' ? 'badge-success' : 'badge-error'
    return <span className={`badge ${badgeClass}`}>{status}</span>
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Health Checks</h1>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2>Application</h2>
        {health && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <strong>Status:</strong> {getStatusBadge(health.status)}
            </div>
            <div>
              <strong>App:</strong> {health.app}
            </div>
            <div>
              <strong>Version:</strong> {health.version}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Database</h2>
        {dbHealth && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <strong>Status:</strong> {getStatusBadge(dbHealth.status)}
            </div>
            <div>
              <strong>Database:</strong> {dbHealth.database}
            </div>
            {dbHealth.error && (
              <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                Error: {dbHealth.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}