import { Link } from 'react-router-dom'
import { AgentList } from '../components/AgentList'

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
        <Link to="/agents" className="btn btn-secondary">
          Agents
        </Link>
      </nav>

      <AgentList />

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Welcome to Orbit Observatory</h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
          Manage your AI agents through the interface above.
        </p>
      </div>
    </div>
  )
}
