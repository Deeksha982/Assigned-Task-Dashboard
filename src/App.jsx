import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import AssignedTasks from './pages/AssignedTasks';
import ByStatus from './pages/ByStatus';
import ByPriority from './pages/ByPriority';
import Chatbot from './components/Chatbot';

const { Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Content style={{ padding: '24px', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<AssignedTasks />} />
            <Route path="/by-status" element={<ByStatus />} />
            <Route path="/by-priority" element={<ByPriority />} />
          </Routes>
        </Content>
      </Layout>
      <Chatbot />
    </Layout>
  );
}

export default App;
