import { Link } from 'react-router-dom'

export function Dashboard() {
  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Orbit Observatory</h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          The open-source app everyone uses to manage agents at work
        </p>
      </header>

      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/health" className="btn btn-primary">
          Health Checks
        </Link>
      </nav>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Welcome to Orbit Observatory</h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
          This is the initial skeleton. The following features are planned:
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-info">Planned</span>
            Agent Management (CRUD, listing, detail views)
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-info">Planned</span>
            Workflow Execution (DAG-based, monitoring, history)
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-info">Planned</span>
            OIDC Authentication (Keycloak, JWT validation)
          </li>
        </ul>
      </div>
    </div>
  )
}