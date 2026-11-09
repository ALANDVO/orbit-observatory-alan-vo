import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { HealthCheck } from './pages/HealthCheck'
import { AgentList } from './components/AgentList'
import { AgentDetail } from './components/AgentDetail'
import { AgentCreateView } from './components/AgentCreate'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/health" element={<HealthCheck />} />
      <Route path="/agents" element={<AgentList />} />
      <Route path="/agents/new" element={<AgentCreateView />} />
      <Route path="/agents/:id" element={<AgentDetail />} />
    </Routes>
  )
}

export default App