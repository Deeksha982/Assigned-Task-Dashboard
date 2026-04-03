import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  FlagOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: 'Assigned Tasks' },
  { key: '/by-status', icon: <AppstoreOutlined />, label: 'Based on Status' },
  { key: '/by-priority', icon: <FlagOutlined />, label: 'Based on Priority' },
];

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      width={240}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: collapsed ? '20px 12px' : '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <div style={{ color: 'white', fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>
            TaskBoard
          </div>
        )}
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            padding: 4,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>

      <Menu
        className="sidebar-menu"
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{
          background: 'transparent',
          borderRight: 'none',
          marginTop: 8,
        }}
      />
    </Sider>
  );
}

export default Sidebar;
