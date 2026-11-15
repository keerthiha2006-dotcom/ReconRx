import React from 'react';
import { DiscrepancyType, PatientStatus, PriorityLevel } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, PlusCircle, Copy, ArrowRightLeft, Clock } from 'lucide-react';

export const StatusBadge: React.FC<{ status: PatientStatus }> = ({ status }) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="badge badge-status-completed">
          <CheckCircle2 size={12} /> Completed
        </span>
      );
    case 'In Progress':
      return (
        <span className="badge badge-status-progress">
          <Clock size={12} /> In Progress
        </span>
      );
    case 'Needs Review':
    default:
      return (
        <span className="badge badge-status-review">
          <AlertTriangle size={12} /> Needs Review
        </span>
      );
  }
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  switch (priority) {
    case 'High':
      return <span className="badge badge-priority-high">High Priority</span>;
    case 'Medium':
      return <span className="badge badge-priority-med">Medium</span>;
    case 'Low':
    default:
      return <span className="badge badge-priority-low">Routine</span>;
  }
};

export const DiscrepancyBadge: React.FC<{ type: DiscrepancyType }> = ({ type }) => {
  switch (type) {
    case 'POTENTIAL_OMISSION':
      return (
        <span className="badge badge-omission">
          <AlertCircle size={12} /> Potential Omission
        </span>
      );
    case 'DOSE_FREQUENCY_CHANGE':
      return (
        <span className="badge badge-changed">
          <ArrowRightLeft size={12} /> Dose/Freq Changed
        </span>
      );
    case 'NEWLY_ADDED':
      return (
        <span className="badge badge-new">
          <PlusCircle size={12} /> Newly Added
        </span>
      );
    case 'POSSIBLE_DUPLICATE':
      return (
        <span className="badge badge-duplicate">
          <Copy size={12} /> Possible Duplicate
        </span>
      );
    case 'ROUTE_CHANGE':
      return (
        <span className="badge badge-changed">
          <ArrowRightLeft size={12} /> Route Changed
        </span>
      );
    case 'UNCHANGED':
    default:
      return (
        <span className="badge badge-unchanged">
          <CheckCircle2 size={12} /> No Change / Concordant
        </span>
      );
  }
};

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
      {icon && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: 'var(--text-muted)' }}>{icon}</div>}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 16px' }}>{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-outline btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
