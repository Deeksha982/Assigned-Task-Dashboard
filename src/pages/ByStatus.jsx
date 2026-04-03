import { useState, useMemo } from 'react';
import { Select, Tag, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { mockTasks } from '../data/mockData';
import TaskCard, { statusConfig } from '../components/TaskCard';

const statusOrder = ['in-progress', 'blocked', 'on-hold', 'todo', 'completed'];

const assignedPersons = [...new Set(mockTasks.map((t) => t.assignedTo.name))];

function ByStatus() {
  const [filterPerson, setFilterPerson] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [reasonModal, setReasonModal] = useState({ open: false, title: '', reason: '' });

  const filteredTasks = useMemo(() => {
    return mockTasks.filter((t) => {
      if (filterPerson && t.assignedTo.name !== filterPerson) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      return true;
    });
  }, [filterPerson, filterStatus]);

  const groupedTasks = useMemo(() => {
    const groups = {};
    for (const status of statusOrder) {
      const tasks = filteredTasks.filter((t) => t.status === status);
      if (tasks.length > 0) groups[status] = tasks;
    }
    return groups;
  }, [filteredTasks]);

  const handleBlocked = (task) => {
    setReasonModal({ open: true, title: `Why is "${task.title}" Blocked?`, reason: task.blockedReason });
  };

  const handleHold = (task) => {
    setReasonModal({ open: true, title: `Why is "${task.title}" On Hold?`, reason: task.holdReason });
  };

  return (
    <div>
      <div className="page-header">
        <h2>Tasks by Status</h2>
        <p>View tasks grouped by their current status</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <Select
          placeholder="Filter by Person"
          allowClear
          style={{ width: 220 }}
          size="large"
          onChange={(val) => setFilterPerson(val)}
          options={assignedPersons.map((p) => ({ label: p, value: p }))}
        />
        <Select
          placeholder="Filter by Status"
          allowClear
          style={{ width: 200 }}
          size="large"
          onChange={(val) => setFilterStatus(val)}
          options={statusOrder.map((s) => ({
            label: statusConfig[s].label,
            value: s,
          }))}
        />
      </div>

      {Object.entries(groupedTasks).map(([status, tasks]) => {
        const config = statusConfig[status];
        return (
          <div key={status} className="group-section">
            <div className="group-title">
              <Tag
                style={{
                  color: config.color,
                  background: config.bg,
                  border: `1px solid ${config.color}20`,
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {config.label}
              </Tag>
              <span className="group-count">{tasks.length}</span>
            </div>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onBlockedClick={handleBlocked} onHoldClick={handleHold} />
            ))}
          </div>
        );
      })}

      {Object.keys(groupedTasks).length === 0 && (
        <div className="empty-state">
          <p style={{ fontSize: 16 }}>No tasks match the selected filters</p>
        </div>
      )}

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

export default ByStatus;
