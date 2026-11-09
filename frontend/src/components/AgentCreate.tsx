
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, type AgentCreate } from '../api/client'

export function AgentCreateView() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [system_prompt, setSystemPrompt] = useState('')
  const [config, setConfig] = useState('{}')
  const [is_active, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    let parsedConfig: Record<string, unknown> = {}
    try {
      parsedConfig = JSON.parse(config)
    } catch {
      setError('Invalid JSON in config')
      setLoading(false)
      return
    }

    const agentData: AgentCreate = {
      name,
      description: description || undefined,
      system_prompt: system_prompt || undefined,
      config: Object.keys(parsedConfig).length > 0 ? parsedConfig : undefined,
      is_active,
    }

    try {
      const agent = await api.createAgent(agentData)
      navigate(`/agents/${agent.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create agent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Create Agent</h2>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem' }}>
        {error && (
          <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', borderRadius: '0.375rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Name <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem' }}
            placeholder="Enter agent name"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', fontFamily: 'inherit' }}
            placeholder="Optional description"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="system_prompt" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            System Prompt
          </label>
          <textarea
            id="system_prompt"
            value={system_prompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', fontFamily: 'inherit' }}
            placeholder="Optional system prompt"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="config" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Config (JSON)
          </label>
          <textarea
            id="config"
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontFamily: 'monospace' }}
            placeholder='{"model": "gpt-4", "temperature": 0.7}'
          />
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="is_active"
            checked={is_active}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="is_active" style={{ fontWeight: 500 }}>Active</label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Agent'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/agents')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
