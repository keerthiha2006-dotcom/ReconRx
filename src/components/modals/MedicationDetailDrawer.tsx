import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Pill, Clock, ShieldCheck, FileText, CheckCircle2, History, Stethoscope } from 'lucide-react';

export const MedicationDetailDrawer: React.FC = () => {
  const { activeModal, activeMedication, closeAllModals } = useApp();

  if (activeModal !== 'medication_detail' || !activeMedication) return null;

  return (
    <>
      <div className="modal-overlay" onClick={closeAllModals} />
      <div className="drawer-container" style={{ width: 480 }}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{activeMedication.name}</div>
              <div style={{ fontSize: 11, color: '#38BDF8' }}>{activeMedication.category || 'Pharmaceutical Agent'}</div>
            </div>
          </div>
          <button onClick={closeAllModals} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Main Attributes */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Generic Name:</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{activeMedication.genericName}</div>
              </div>
              {activeMedication.brandName && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Brand Name:</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{activeMedication.brandName}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Strength / Dosage:</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0284C7' }}>{activeMedication.dosage}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Frequency:</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{activeMedication.frequency}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Route of Admin:</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{activeMedication.route}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dosage Form:</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{activeMedication.form || 'Tablet'}</div>
              </div>
            </div>
          </div>

          {/* Indication */}
          {activeMedication.indication && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Stethoscope size={13} color="#0284C7" />
                <span>Clinical Indication</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                {activeMedication.indication}
              </p>
            </div>
          )}

          {/* Administration Instructions */}
          {activeMedication.instructions && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={13} color="#0284C7" />
                <span>Administration Instructions</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: 10, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                {activeMedication.instructions}
              </p>
            </div>
          )}

          {/* Source & Prescriber */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Prescribing Authority:</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{activeMedication.prescriber || 'Inpatient Attending'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Originating Source:</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{activeMedication.source}</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#10B981" />
            <span>Monograph extracted and indexed for transition safety audit.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button onClick={closeAllModals} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            Close Monograph
          </button>
        </div>
      </div>
    </>
  );
};
