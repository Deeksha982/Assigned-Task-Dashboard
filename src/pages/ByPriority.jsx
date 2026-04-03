import { useState, useMemo } from 'react';
import { Select, Tag, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { mockTasks } from '../data/mockData';
import TaskCard, { statusConfig, priorityConfig } from '../components/TaskCard';

const priorityOrder = ['P1', 'P2', 'P3', 'P4'];
const statusList = ['in-progress', 'blocked', 'on-hold', 'todo', 'completed'];
const assignedPersons = [...new Set(mockTasks.map((t) => t.assignedTo.name))];

const priorityLabels = {
  P1: 'P1 — Critical',
  P2: 'P2 — High',
  P3: 'P3 — Medium',
  P4: 'P4 — Low',
};

function ByPriority() {
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
    for (const priority of priorityOrder) {
      const tasks = filteredTasks.filter((t) => t.priority === priority);
      if (tasks.length > 0) groups[priority] = tasks;
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
        <h2>Tasks by Priority</h2>
        <p>View tasks grouped by priority level</p>
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
          options={statusList.map((s) => ({
            label: statusConfig[s].label,
            value: s,
          }))}
        />
      </div>

      {Object.entries(groupedTasks).map(([priority, tasks]) => {
        const config = priorityConfig[priority];
        return (
          <div key={priority} className="group-section">
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
                {priorityLabels[priority]}
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

export default ByPriority;
