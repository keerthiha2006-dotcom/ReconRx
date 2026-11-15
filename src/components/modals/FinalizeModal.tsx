import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
} from 'lucide-react';

export const FinalizeModal: React.FC = () => {
  const {
    activeModal,
    selectedPatient,
    discrepancies,
    selectedPatientId,
    finalizeReconciliation,
    closeAllModals,
    user,
  } = useApp();

  const [attestationChecked, setAttestationChecked] = useState(true);

  if (activeModal !== 'finalize' || !selectedPatient) return null;

  const patientDiscs = discrepancies[selectedPatientId] || [];
  const pendingCount = patientDiscs.filter(d => d.status === 'REQUIRES_REVIEW').length;
  const reviewedCount = patientDiscs.filter(d => d.status === 'REVIEWED' || d.status === 'DISMISSED').length;

  const handleFinalize = () => {
    finalizeReconciliation(selectedPatient.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: 540 }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <ShieldCheck size={20} color="#10B981" />
            <span>Finalize Medication Reconciliation</span>
          </div>
          <button onClick={closeAllModals} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            You are finalizing the medication reconciliation for <strong>{selectedPatient.name}</strong> ({selectedPatient.mrn}) for encounter <strong>{selectedPatient.encounterType}</strong>.
          </p>

          {/* Audit Summary Box */}
          <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
              Reconciliation Audit Summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Discrepancies Reviewed:</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>{reviewedCount} of {patientDiscs.length} Items</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pending Variances:</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: pendingCount === 0 ? '#10B981' : '#EF4444' }}>
                  {pendingCount === 0 ? '0 (Ready)' : `${pendingCount} Unresolved`}
                </div>
              </div>
            </div>
          </div>

          {pendingCount > 0 && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: 12, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 12, color: '#92400E' }}>
                <strong>Notice:</strong> There are still {pendingCount} unresolved discrepancy items. Finalizing now will batch-verify remaining items according to hospital inpatient admission policy.
              </div>
            </div>
          )}

          {/* Electronic Attestation */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={attestationChecked}
              onChange={(e) => setAttestationChecked(e.target.checked)}
              style={{ marginTop: 2, accentColor: '#0284C7' }}
            />
            <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              <strong>Clinical Sign-Off Attestation:</strong> I, <strong>{user.name}</strong> ({user.role}), certify that I have compared the historical medication records against the current admission orders, resolved clinical variances, and verified the unified inpatient medication story.
            </div>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-faint)' }}>
            <Lock size={12} />
            <span>Digital signature timestamped and cryptographically linked to audit trail.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={closeAllModals} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button
            onClick={handleFinalize}
            disabled={!attestationChecked}
            className="btn btn-success btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: attestationChecked ? 1 : 0.5 }}
          >
            <CheckCircle2 size={15} />
            <span>Finalize & Sign Off</span>
          </button>
        </div>
      </div>
    </div>
  );
};
