import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { HealthCheck } from './pages/HealthCheck'

// Mock the API client
vi.mock('./api/client', () => ({
  api: {
    get: vi.fn(),
  },
}))

import { api } from './api/client'

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Dashboard', () => {
  it('renders the dashboard title', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('Orbit Observatory')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('The open-source app everyone uses to manage agents at work')).toBeInTheDocument()
  })

  it('renders navigation to health checks', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByRole('link', { name: /Health Checks/i })).toBeInTheDocument()
  })

  it('shows planned features', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('Agent Management (CRUD, listing, detail views)')).toBeInTheDocument()
    expect(screen.getByText('Workflow Execution (DAG-based, monitoring, history)')).toBeInTheDocument()
    expect(screen.getByText('OIDC Authentication (Keycloak, JWT validation)')).toBeInTheDocument()
  })
})

describe('HealthCheck', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state initially', () => {
    renderWithRouter(<HealthCheck />)
    expect(screen.getByText('Loading health checks...')).toBeInTheDocument()
  })

  it('renders health data when loaded', async () => {
    const mockHealth = { status: 'healthy', app: 'Orbit Observatory', version: '1.0.0' }
    const mockDbHealth = { status: 'healthy', database: 'connected' }
    ;(api.get as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockHealth)
      .mockResolvedValueOnce(mockDbHealth)

    renderWithRouter(<HealthCheck />)

    await waitFor(() => {
      expect(screen.getByText('Health Checks')).toBeInTheDocument()
    })

    expect(screen.getAllByText('healthy')).toHaveLength(2)
    expect(screen.getByText('Orbit Observatory')).toBeInTheDocument()
    expect(screen.getByText('connected')).toBeInTheDocument()
  })
})