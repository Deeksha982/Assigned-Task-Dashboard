import { useState } from 'react';
import { Card, Tag, Avatar, Tooltip, Button, Modal, Typography } from 'antd';
import {
  CalendarOutlined,
  StopOutlined,
  PauseCircleOutlined,
  BulbOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const statusConfig = {
  'completed': { color: '#10b981', bg: '#ecfdf5', label: 'Completed' },
  'in-progress': { color: '#3b82f6', bg: '#eff6ff', label: 'In Progress' },
  'blocked': { color: '#ef4444', bg: '#fef2f2', label: 'Blocked' },
  'on-hold': { color: '#f59e0b', bg: '#fffbeb', label: 'On Hold' },
  'todo': { color: '#8b5cf6', bg: '#f5f3ff', label: 'Todo' },
};

const priorityConfig = {
  P1: { color: '#ef4444', bg: '#fef2f2' },
  P2: { color: '#f59e0b', bg: '#fffbeb' },
  P3: { color: '#3b82f6', bg: '#eff6ff' },
  P4: { color: '#6b7280', bg: '#f9fafb' },
};

const avatarColors = ['#4f46e5', '#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626'];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function TaskCard({ task, onBlockedClick, onHoldClick }) {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const status = statusConfig[task.status] || statusConfig['todo'];
  const priority = priorityConfig[task.priority] || priorityConfig['P4'];

  return (
    <>
      <Card
        className="task-card"
        style={{ borderRadius: 12, marginBottom: 12 }}
        bodyStyle={{ padding: 20 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <Tag
                className="priority-tag"
                style={{
                  color: priority.color,
                  background: priority.bg,
                  border: `1px solid ${priority.color}20`,
                  borderRadius: 6,
                }}
              >
                {task.priority}
              </Tag>
              <Tag
                className="status-tag"
                style={{
                  color: status.color,
                  background: status.bg,
                  border: `1px solid ${status.color}20`,
                  borderRadius: 6,
                }}
              >
                {status.label}
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>#{task.id}</Text>
            </div>

            <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>
              {task.title}
            </Text>
            <Paragraph
              type="secondary"
              ellipsis
              style={{ marginBottom: 12, fontSize: 13 }}
            >
              {task.description}
            </Paragraph>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Tooltip title={task.assignedTo.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar
                    size={28}
                    style={{
                      background: getAvatarColor(task.assignedTo.name),
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {task.assignedTo.avatar}
                  </Avatar>
                  <Text style={{ fontSize: 13, color: '#6b7280' }}>{task.assignedTo.name}</Text>
                </div>
              </Tooltip>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9ca3af', fontSize: 13 }}>
                <CalendarOutlined style={{ fontSize: 12 }} />
                <span>{task.dueDate || '—'}</span>
              </div>

              <Text style={{ fontSize: 12, color: '#9ca3af' }}>PS: {task.psId}</Text>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            <Button
              size="small"
              className="ai-summary-btn"
              icon={<BulbOutlined />}
              onClick={() => setAiModalOpen(true)}
              style={{
                borderRadius: 6,
                fontSize: 12,
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: 'white',
                border: 'none',
              }}
            >
              View Summary
            </Button>
            {task.status === 'blocked' && (
              <Button
                size="small"
                danger
                icon={<StopOutlined />}
                onClick={() => onBlockedClick(task)}
                style={{ borderRadius: 6, fontSize: 12 }}
              >
                Why Blocked?
              </Button>
            )}
            {task.status === 'on-hold' && (
              <Button
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={() => onHoldClick(task)}
                style={{ borderRadius: 6, fontSize: 12, borderColor: '#f59e0b', color: '#f59e0b' }}
              >
                Why On-Hold?
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BulbOutlined style={{ color: '#7c3aed' }} />
            <span>AI Summary — {task.title}</span>
          </div>
        }
        open={aiModalOpen}
        onCancel={() => setAiModalOpen(false)}
        footer={null}
        centered
        width={520}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Tag style={{ color: priority.color, background: priority.bg, border: `1px solid ${priority.color}20`, borderRadius: 6 }}>
              {task.priority}
            </Tag>
            <Tag style={{ color: status.color, background: status.bg, border: `1px solid ${status.color}20`, borderRadius: 6 }}>
              {status.label}
            </Tag>
            <Text type="secondary" style={{ fontSize: 12, lineHeight: '22px' }}>Assigned to {task.assignedTo.name} | Due: {task.dueDate || 'Not set'}</Text>
          </div>
          <div className="task-ai-summary-content" style={{
            background: '#f8f7ff',
            borderRadius: 10,
            padding: 16,
            border: '1px solid #e8e5ff',
            fontSize: 14,
            lineHeight: 1.8,
            color: '#374151',
          }}>
            {task.aiSummary || 'No AI summary available for this task.'}
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <BulbOutlined style={{ color: '#9ca3af', fontSize: 12 }} />
            <Text type="secondary" style={{ fontSize: 11 }}>Generated by AI based on task data and activity</Text>
          </div>
        </div>
      </Modal>
    </>
  );
}

export { statusConfig, priorityConfig };
export default TaskCard;
