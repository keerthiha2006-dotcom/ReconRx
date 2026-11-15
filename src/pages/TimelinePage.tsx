import React from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Calendar,
  FileText,
  User,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Pill,
} from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const { selectedPatient, timelines, selectedPatientId, setRoute } = useApp();

  if (!selectedPatient) {
    return <div>Patient not found.</div>;
  }

  const patientTimelines = timelines[selectedPatientId] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Chronological Pharmacotherapy Trail
            </span>
            <span style={{ color: 'var(--text-faint)' }}>•</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedPatient.encounterType}</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
            Medication Journey — {selectedPatient.name}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Complete historical audit trail connecting outpatient renewals, pre-admission triage, inpatient orders, and AI reconciliation.
          </p>
        </div>

        <button
          onClick={() => setRoute(`/reconciliation/${selectedPatient.id}`)}
          className="btn btn-accent btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span>Reconciliation Workspace</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Vertical Timeline */}
      <div className="card" style={{ padding: '32px 28px' }}>
        <div className="timeline-list">
          {patientTimelines.map((evt, idx) => {
            const isSuccess = evt.badgeType === 'success';
            const isDanger = evt.badgeType === 'danger';
            const isWarning = evt.badgeType === 'warning';

            return (
              <div key={evt.id} className="timeline-item">
                <div
                  className={`timeline-dot ${isSuccess ? 'success' : isDanger ? 'danger' : isWarning ? 'warning' : ''}`}
                >
                  {isSuccess ? (
                    <CheckCircle2 size={12} />
                  ) : isDanger ? (
                    <AlertTriangle size={12} />
                  ) : (
                    <Calendar size={12} />
                  )}
                </div>

                <div
                  style={{
                    background: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 20px',
                    marginLeft: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {evt.dateStr}
                      </span>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                        {evt.title}
                      </h3>
                    </div>

                    {evt.badge && (
                      <span className={`badge badge-${evt.badgeType || 'info'}`} style={{ fontSize: 11 }}>
                        {evt.badge}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 10 }}>
                    {evt.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-muted)', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <User size={13} color="#0284C7" />
                      <span>Documented by: <strong>{evt.actor}</strong></span>
                    </span>

                    {evt.metadata?.details && (
                      <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        {evt.metadata.details}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
