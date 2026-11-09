/// <reference types="vite/client" />

export interface Agent {
  id: number
  name: string
  description: string | null
  system_prompt: string | null
  config: Record<string, unknown> | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AgentListResponse {
  items: Agent[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface AgentCreate {
  name: string
  description?: string
  system_prompt?: string
  config?: Record<string, unknown>
  is_active?: boolean
}

export interface AgentUpdate {
  name?: string
  description?: string
  system_prompt?: string
  config?: Record<string, unknown>
  is_active?: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Agent API methods
  async listAgents(params?: {
    page?: number
    page_size?: number
    is_active?: boolean
  }): Promise<AgentListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.page_size) searchParams.set('page_size', params.page_size.toString())
    if (params?.is_active !== undefined) searchParams.set('is_active', params.is_active.toString())
    const query = searchParams.toString()
    return this.get<AgentListResponse>(`/agents${query ? `?${query}` : ''}`)
  }

  async getAgent(id: number): Promise<Agent> {
    return this.get<Agent>(`/agents/${id}`)
  }

  async getAgentByName(name: string): Promise<Agent> {
    return this.get<Agent>(`/agents/name/${name}`)
  }

  async createAgent(data: AgentCreate): Promise<Agent> {
    return this.post<Agent>('/agents', data)
  }

  async updateAgent(id: number, data: AgentUpdate): Promise<Agent> {
    return this.patch<Agent>(`/agents/${id}`, data)
  }

  async deleteAgent(id: number): Promise<void> {
    return this.delete<void>(`/agents/${id}`)
  }
}

export const api = new ApiClient()
