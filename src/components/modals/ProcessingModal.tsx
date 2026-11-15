import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Loader2, Sparkles, Brain, Stethoscope } from 'lucide-react';

export const ProcessingModal: React.FC = () => {
  const { activeModal, processingStep, processingSteps, isProcessing } = useApp();

  if (activeModal !== 'processing' && !isProcessing) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: 520, padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #0B132B, #1C2541)', padding: '24px 28px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.25)', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={20} color="#38BDF8" className="animate-spin" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>MediSync AI Clinical Reconciliation</h3>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>Cross-referencing historical records with inpatient orders</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {processingSteps.map((step, idx) => {
              const isDone = idx < processingStep;
              const isCurrent = idx === processingStep;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 13,
                    color: isDone ? 'var(--text-primary)' : isCurrent ? '#0284C7' : 'var(--text-muted)',
                    fontWeight: isCurrent ? 600 : isDone ? 500 : 400,
                    opacity: isDone || isCurrent ? 1 : 0.45,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isDone ? '#ECFDF5' : isCurrent ? '#E0F2FE' : 'var(--bg-surface-subtle)',
                      border: isDone ? '1px solid #10B981' : isCurrent ? '1px solid #0284C7' : '1px solid var(--border-subtle)',
                      color: isDone ? '#10B981' : isCurrent ? '#0284C7' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? <Check size={13} strokeWidth={3} /> : isCurrent ? <Loader2 size={13} className="animate-spin" /> : <span style={{ fontSize: 10 }}>{idx + 1}</span>}
                  </div>
                  <span>{step}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, padding: '10px 14px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <Sparkles size={14} color="#0284C7" />
            <span>AI model analyzing dose equivalence, routes, omission risks, and duplicate therapies.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
