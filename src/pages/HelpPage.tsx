import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  BrainCircuit,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  PlusCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Layers,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does MediSync AI prescribe or discontinue medications autonomously?',
      a: 'No. MediSync AI is strictly a clinical decision-support copilot designed to cross-reference multi-source records, normalize pharmacotherapeutic nomenclature, and identify variances. All prescribing, modification, and discontinuation decisions remain exclusively in the hands of the licensed healthcare professional.',
    },
    {
      q: 'How does MediSync AI handle dosage and frequency equivalence?',
      a: 'The deterministic reconciliation engine parses drug strengths, formulations (such as immediate-release vs extended-release), and administration frequencies (e.g. 500mg BID vs 1000mg QD). It flags schedule consolidations to prevent adverse gastrointestinal effects or altered bioavailability.',
    },
    {
      q: 'What care transitions are supported by MediSync?',
      a: 'MediSync AI is engineered for hospital admissions, inter-facility and intra-unit transfers (e.g. ICU to step-down), specialist outpatient referrals, and surgical post-operative discharge reconciliation.',
    },
    {
      q: 'How are therapeutic duplications detected?',
      a: 'The engine cross-references drug chemical taxonomy against clinical pharmacotherapeutic classes (such as ACE Inhibitors, Beta Blockers, NSAIDs, PPIs). If concurrent agents within the same therapeutic class are ordered simultaneously without clear indication, an urgent duplicate alert is generated.',
    },
    {
      q: 'Can clinical reports be exported to existing Hospital Information Systems (EHR)?',
      a: 'Yes. Reconciled patient stories can be printed directly, saved as standardized transition PDFs, or exported as structured JSON audit records compatible with HL7 FHIR reconciliation profiles.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 880, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
          MediSync AI Clinical Help & Safety Documentation
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Comprehensive guide to transition care reconciliation, discrepancy taxonomy, and AI safety protocols.
        </p>
      </div>

      {/* Safety Manifesto Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0B132B, #162544)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <ShieldCheck size={20} color="#38BDF8" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Core Safety Principle</h2>
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#38BDF8', marginBottom: 6 }}>
          “Before the medication list is finalized, make sure important changes don't go unnoticed.”
        </p>
        <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.55 }}>
          MediSync AI is built on the clinician-in-the-loop paradigm. The AI assists by organizing, matching, and observing variances across transitions — but the healthcare professional verifies and signs off on every decision.
        </p>
      </div>

      {/* 6-Step Workflow */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Layers size={17} color="#0284C7" />
            <span>The 6-Step Medication Reconciliation Flow</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { step: '1. Consolidate', desc: 'Ingest and normalize historical prescriptions, patient stated lists, and inpatient orders.' },
            { step: '2. Compare', desc: 'Execute deterministic & AI cross-referencing of dosage, route, schedule, and drug class.' },
            { step: '3. Understand', desc: 'Generate clinical observations explaining what changed and why it was flagged.' },
            { step: '4. Review', desc: 'Clinician evaluates flagged omissions, titrations, and duplicate therapy alerts.' },
            { step: '5. Resolve', desc: 'Record explicit clinical actions (reinstate, modify, or document intentional discontinuation).' },
            { step: '6. Finalize', desc: 'Publish a unified, cryptographically signed medication story to the clinical chart.' },
          ].map((s, idx) => (
            <div key={idx} style={{ background: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0284C7', marginBottom: 4 }}>{s.step}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Discrepancy Taxonomy */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <BrainCircuit size={17} color="#0D9488" />
            <span>Discrepancy Taxonomy & Classification Rules</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              type: 'Potential Omission (Critical)',
              color: '#EF4444',
              bg: '#FEF2F2',
              desc: 'Medication appears on historical chronic outpatient regimens but is absent from the inpatient admission order set.',
            },
            {
              type: 'Dose / Frequency Change (Warning)',
              color: '#D97706',
              bg: '#FFFBEB',
              desc: 'The medication strength, daily dosage, or administration timing differs across transitions (e.g. 500mg BID vs 1000mg QD).',
            },
            {
              type: 'Newly Added Medication (Info)',
              color: '#0369A1',
              bg: '#F0F9FF',
              desc: 'New medication initiated during the present encounter; requires clinical indication and allergy verification.',
            },
            {
              type: 'Possible Duplicate Therapy (Critical)',
              color: '#5B21B6',
              bg: '#F5F3FF',
              desc: 'Co-prescribing multiple agents within the same pharmacotherapeutic class (e.g. two concurrent ACE inhibitors).',
            },
            {
              type: 'Concordant / Unchanged (Verified)',
              color: '#065F46',
              bg: '#ECFDF5',
              desc: 'Exact match identified across outpatient records, patient history, and inpatient orders.',
            },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: item.bg, border: `1px solid ${item.color}30` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 2 }}>{item.type}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <HelpCircle size={17} color="#0284C7" />
            <span>Frequently Asked Questions</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                <div
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    padding: '12px 16px',
                    background: isOpen ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                    color: 'var(--text-primary)',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                </div>

                {isOpen && (
                  <div style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
