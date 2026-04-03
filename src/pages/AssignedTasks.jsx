import { useState, useMemo } from 'react';
import { Input, Pagination, Button, Modal, Empty, Typography } from 'antd';
import { SearchOutlined, BulbOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { mockTasks, mockAiSummary } from '../data/mockData';
import TaskCard from '../components/TaskCard';

const { Text } = Typography;

function AssignedTasks() {
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [reasonModal, setReasonModal] = useState({ open: false, title: '', reason: '' });
  const pageSize = 10;

  const triggerSearch = () => {
    setSearchQuery(searchValue.trim());
    setCurrentPage(1);
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return mockTasks;
    return mockTasks.filter((t) => t.psId.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage]);

  const handleBlocked = (task) => {
    setReasonModal({ open: true, title: `Why is "${task.title}" Blocked?`, reason: task.blockedReason });
  };

  const handleHold = (task) => {
    setReasonModal({ open: true, title: `Why is "${task.title}" On Hold?`, reason: task.holdReason });
  };

  const renderAiSummary = () => {
    return mockAiSummary.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>;
      if (line.startsWith('- **')) {
        const parts = line.replace('- **', '').split('**');
        return <li key={i}><strong>{parts[0]}</strong>{parts.slice(1).join('')}</li>;
      }
      if (line.match(/^\d+\./)) return <li key={i}>{line.replace(/^\d+\.\s/, '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i}>{line}</p>;
    });
  };

  return (
    <div>
      <div className="page-header">
        <h2>Assigned Tasks</h2>
        <p>Search and manage all assigned tasks by PS ID</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-container" style={{ flex: 1, minWidth: 250 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            placeholder="Search by PS ID (e.g. PS1001)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={triggerSearch}
            allowClear
            onClear={() => { setSearchValue(''); setSearchQuery(''); setCurrentPage(1); }}
            size="large"
          />
        </div>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={triggerSearch}
          size="large"
          style={{ borderRadius: 10, height: 44 }}
        >
          Search
        </Button>
        <Button
          icon={<BulbOutlined />}
          onClick={() => setAiModalOpen(true)}
          size="large"
          style={{
            borderRadius: 10,
            height: 44,
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            color: 'white',
            border: 'none',
          }}
        >
          View Summary using AI
        </Button>
      </div>

      {!searchQuery && !filteredTasks.length ? (
        <Empty description="No tasks found" />
      ) : searchQuery && !filteredTasks.length ? (
        <div className="empty-state">
          <SearchOutlined />
          <Text type="secondary" style={{ fontSize: 16 }}>No tasks found for PS ID "{searchQuery}"</Text>
          <Text type="secondary" style={{ fontSize: 13, marginTop: 4 }}>Try a different PS ID</Text>
        </div>
      ) : !searchQuery && searchValue === '' ? (
        <>
          <div style={{ textAlign: 'center', padding: '8px 0 20px', color: '#9ca3af', fontSize: 13 }}>
            Showing all tasks. Search by PS ID to filter.
          </div>
          {paginatedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onBlockedClick={handleBlocked} onHoldClick={handleHold} />
          ))}
        </>
      ) : (
        paginatedTasks.map((task) => (
          <TaskCard key={task.id} task={task} onBlockedClick={handleBlocked} onHoldClick={handleHold} />
        ))
      )}

      {filteredTasks.length > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <Pagination
            current={currentPage}
            total={filteredTasks.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showTotal={(total) => `${total} tasks`}
          />
        </div>
      )}

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BulbOutlined style={{ color: '#7c3aed' }} />
            <span>AI Task Summary</span>
          </div>
        }
        open={aiModalOpen}
        onCancel={() => setAiModalOpen(false)}
        footer={null}
        width={640}
        centered
      >
        <div className="ai-summary-content" style={{ maxHeight: 500, overflowY: 'auto', padding: '8px 0' }}>
          {renderAiSummary()}
        </div>
      </Modal>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ExclamationCircleOutlined style={{ color: '#ef4444' }} />
            <span>{reasonModal.title}</span>
          </div>
        }
        open={reasonModal.open}
        onCancel={() => setReasonModal({ open: false, title: '', reason: '' })}
        footer={null}
        centered
      >
        <div style={{ padding: '12px 0', fontSize: 14, lineHeight: 1.7, color: '#374151' }}>
          {reasonModal.reason}
        </div>
      </Modal>
    </div>
  );
}

export default AssignedTasks;
