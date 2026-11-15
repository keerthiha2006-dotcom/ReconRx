import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Stethoscope,
} from 'lucide-react';

export const DemoTourModal: React.FC = () => {
  const {
    activeModal,
    closeAllModals,
    selectPatient,
    setRoute,
    runReconciliation,
    openExplainDrawer,
    openResolveModal,
    discrepancies,
    finalizeReconciliation,
    resetDemoData,
  } = useApp();

  const [step, setStep] = useState(1);

  if (activeModal !== 'tour') return null;

  const demoSteps = [
    {
      step: 1,
      title: '1. Select Primary Patient (Ravi Kumar)',
      desc: 'Open Ravi Kumar (P-10291), admitted for acute glycemic fluctuation with scattered outpatient records.',
      actionLabel: 'Select Ravi Kumar & View Sources',
      action: () => {
        selectPatient('p-10291');
        setRoute('/patients/p-10291');
        setStep(2);
      },
    },
    {
      step: 2,
      title: '2. Run AI Multi-Source Reconciliation',
      desc: 'Execute MediSync AI normalization, dose comparison, omission detection, and duplicate checking.',
      actionLabel: 'Run AI Reconciliation Scan',
      action: async () => {
        closeAllModals();
        await runReconciliation('p-10291');
      },
    },
    {
      step: 3,
      title: '3. Review AI Discrepancy (Atorvastatin Omission)',
      desc: 'Examine why chronic Atorvastatin 20mg was flagged as a critical omission across hospital admission.',
      actionLabel: 'Open AI Explanation Drawer',
      action: () => {
        const discs = discrepancies['p-10291'] || [];
        const atorv = discs.find(d => d.medicationName.includes('Atorvastatin')) || discs[0];
        if (atorv) {
          openExplainDrawer(atorv);
        }
      },
    },
    {
      step: 4,
      title: '4. Finalize & Generate Clinical Audit Report',
      desc: 'Sign off on the reconciled medication story and generate a printable clinical transition report.',
      actionLabel: 'Finalize & View Report',
      action: () => {
        finalizeReconciliation('p-10291');
        setRoute('/reports/p-10291');
        closeAllModals();
      },
    },
  ];

  const currentStepData = demoSteps[step - 1];

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: 520 }}>
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0B132B, #0284C7)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#38BDF8" />
            <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>2-Minute Hackathon Demo Tour</span>
          </div>
          <button onClick={closeAllModals} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            This quick walkthrough guides you through the full clinician workflow from scattered records to signed-off medication reconciliation.
          </p>

          {/* Stepper Progress */}
          <div style={{ display: 'flex', gap: 6 }}>
            {demoSteps.map(s => (
              <div
                key={s.step}
                onClick={() => setStep(s.step)}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  background: s.step === step ? '#0284C7' : s.step < step ? '#10B981' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>

          {/* Active Step Card */}
          <div className="card" style={{ background: 'var(--bg-surface-subtle)', padding: 16, border: '1.5px solid #BAE6FD' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0369A1' }}>{currentStepData.title}</div>
              <span className="badge badge-new">Step {step} of 4</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: 14 }}>
              {currentStepData.desc}
            </p>
            <button
              onClick={currentStepData.action}
              className="btn btn-accent btn-sm"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Play size={13} />
              <span>{currentStepData.actionLabel}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => {
                resetDemoData();
                setStep(1);
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 11.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <RotateCcw size={12} />
              <span>Reset Demo State</span>
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="btn btn-outline btn-sm">
                  Back
                </button>
              )}
              {step < 4 ? (
                <button onClick={() => setStep(step + 1)} className="btn btn-primary btn-sm">
                  Next Step <ArrowRight size={13} />
                </button>
              ) : (
                <button onClick={closeAllModals} className="btn btn-success btn-sm">
                  Finish Tour
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
