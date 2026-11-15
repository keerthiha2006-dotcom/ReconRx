import React from 'react';
import { useApp } from '../../context/AppContext';
import { generateDiscrepancyExplanation } from '../../services/aiAssistant';
import { DiscrepancyBadge } from '../common/Badges';
import {
  X,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Stethoscope,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';

export const AIExplanationDrawer: React.FC = () => {
  const {
    activeModal,
    activeDiscrepancy,
    selectedPatient,
    closeAllModals,
    openResolveModal,
  } = useApp();

  if (activeModal !== 'explain' || !activeDiscrepancy) return null;

  const explanation = generateDiscrepancyExplanation(activeDiscrepancy, selectedPatient?.name || 'Patient');

  return (
    <>
      <div className="modal-overlay" onClick={closeAllModals} />
      <div className="drawer-container">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #0284C7, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: 'white' }}>AI Review Assistant</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Intelligent Clinical Observation & Verification Support</div>
            </div>
          </div>
          <button
            onClick={closeAllModals}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Drug Title & Badge */}
          <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeDiscrepancy.medicationName}
              </h2>
              <DiscrepancyBadge type={activeDiscrepancy.type} />
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              Generic: <strong style={{ color: 'var(--text-secondary)' }}>{activeDiscrepancy.genericName}</strong>
            </div>
          </div>

          {/* Side-by-side transition preview */}
          <div className="card" style={{ padding: 14, background: 'var(--bg-surface-subtle)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
              Transition Comparison
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
              <div style={{ background: 'white', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Previous Record</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                  {activeDiscrepancy.previousRecord ? activeDiscrepancy.previousRecord.dosage : 'Not Found'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {activeDiscrepancy.previousRecord ? activeDiscrepancy.previousRecord.frequency : 'Absent in home list'}
                </div>
              </div>

              <ArrowRight size={16} color="var(--text-faint)" />

              <div style={{ background: 'white', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0284C7', textTransform: 'uppercase' }}>Current Order</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                  {activeDiscrepancy.currentRecord ? activeDiscrepancy.currentRecord.dosage : 'Not Found / Omitted'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {activeDiscrepancy.currentRecord ? activeDiscrepancy.currentRecord.frequency : 'Absent in inpatient order'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: What Changed? */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span>1. What Changed?</span>
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-surface)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {explanation.whatChanged}
            </p>
          </div>

          {/* Section 2: Why was it Flagged? */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span>2. Why was this Flagged?</span>
            </h4>
            <div className={`ai-observation-box ${activeDiscrepancy.severity === 'critical' ? 'red' : activeDiscrepancy.severity === 'warning' ? 'amber' : 'purple'}`}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ lineHeight: 1.45, fontWeight: 500 }}>{explanation.whyFlagged}</p>
                {activeDiscrepancy.potentialRisk && (
                  <p style={{ marginTop: 6, fontSize: 11.5, opacity: 0.9 }}>
                    <strong>Potential Risk:</strong> {activeDiscrepancy.potentialRisk}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Clinical Context */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span>3. Pharmacotherapeutic Context</span>
            </h4>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {explanation.clinicalContext}
            </p>
          </div>

          {/* Section 4: Suggested Clinician Review Action */}
          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: 14, borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: 12.5, fontWeight: 700, color: '#0369A1', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Stethoscope size={14} />
              <span>Recommended Review Action</span>
            </h4>
            <p style={{ fontSize: 12.5, color: '#0C4A6E', lineHeight: 1.45 }}>
              {explanation.suggestedAction}
            </p>
          </div>

          {/* Safety Guardrail Disclaimer */}
          <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', padding: 12, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <ShieldCheck size={16} color="#0D9488" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Clinical Decision Support Notice:</strong> {explanation.safetyDisclaimer}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={closeAllModals} className="btn btn-outline btn-sm">
            Close
          </button>
          <button
            onClick={() => openResolveModal(activeDiscrepancy)}
            className="btn btn-accent btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <CheckCircle2 size={14} />
            <span>Resolve Discrepancy</span>
          </button>
        </div>
      </div>
    </>
  );
};
