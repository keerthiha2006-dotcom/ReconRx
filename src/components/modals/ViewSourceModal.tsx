import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, FileText, Calendar, Building2, User, CheckCircle2 } from 'lucide-react';

export const ViewSourceModal: React.FC = () => {
  const { activeModal, activeSource, closeAllModals } = useApp();

  if (activeModal !== 'view_source' || !activeSource) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: 620 }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={18} color="#0284C7" />
            <span>Medication Source Document</span>
          </div>
          <button onClick={closeAllModals} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{activeSource.title}</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} /> {activeSource.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Building2 size={13} /> {activeSource.facility}
                </span>
              </div>
            </div>
            <span className="badge badge-unchanged">
              <CheckCircle2 size={12} /> {activeSource.status}
            </span>
          </div>

          <div style={{ padding: '10px 14px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <User size={14} color="#0284C7" />
            <span>Ordering / Documenting Provider: <strong>{activeSource.provider}</strong></span>
          </div>

          {/* Raw snippet */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: 6 }}>
              Electronic Health Record Excerpt / OCR Text
            </div>
            <pre
              style={{
                background: '#0B132B',
                color: '#E2E8F0',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12.5,
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                border: '1px solid #1E293B',
              }}
            >
              {activeSource.rawDocumentSnippet}
            </pre>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Total extracted pharmacotherapeutic entities: <strong>{activeSource.medicationCount} medications</strong>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={closeAllModals} className="btn btn-primary btn-sm">
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
