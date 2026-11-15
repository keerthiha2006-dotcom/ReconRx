import React from 'react';
import { useApp } from '../context/AppContext';
import { DiscrepancyBadge, StatusBadge } from '../components/common/Badges';
import {
  GitCompare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRightLeft,
  PlusCircle,
  Copy,
  ArrowRight,
  HelpCircle,
  FileCheck2,
  RotateCcw,
  CheckCheck,
  ExternalLink,
  Stethoscope,
} from 'lucide-react';

export const ReconciliationWorkspacePage: React.FC = () => {
  const {
    selectedPatient,
    discrepancies,
    selectedPatientId,
    openExplainDrawer,
    openResolveModal,
    openFinalizeModal,
    resolveAllDiscrepancies,
    setRoute,
    justFinalized,
  } = useApp();

  if (!selectedPatient) {
    return <div>Patient not found.</div>;
  }

  const patientDiscs = discrepancies[selectedPatientId] || [];
  const pendingCount = patientDiscs.filter(d => d.status === 'REQUIRES_REVIEW').length;
  const reviewedCount = patientDiscs.filter(d => d.status === 'REVIEWED' || d.status === 'DISMISSED').length;

  const omissionCount = patientDiscs.filter(d => d.type === 'POTENTIAL_OMISSION').length;
  const changedCount = patientDiscs.filter(d => d.type === 'DOSE_FREQUENCY_CHANGE' || d.type === 'ROUTE_CHANGE').length;
  const newCount = patientDiscs.filter(d => d.type === 'NEWLY_ADDED').length;
  const duplicateCount = patientDiscs.filter(d => d.type === 'POSSIBLE_DUPLICATE').length;
  const unchangedCount = patientDiscs.filter(d => d.type === 'UNCHANGED').length;

  const isAllResolved = pendingCount === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Workspace Header */}
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
              Transition Reconciliation Workspace
            </span>
            <span style={{ color: 'var(--text-faint)' }}>•</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Encounter: {selectedPatient.encounterType}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
              {selectedPatient.name}
            </h1>
            <span style={{ fontFamily: 'monospace', fontSize: 13, background: 'var(--bg-surface-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
              {selectedPatient.mrn}
            </span>
            {pendingCount > 0 ? (
              <span className="badge badge-omission" style={{ fontSize: 12, padding: '4px 10px' }}>
                <AlertTriangle size={13} /> {pendingCount} Issues Require Review
              </span>
            ) : (
              <span className="badge badge-unchanged" style={{ fontSize: 12, padding: '4px 10px' }}>
                <CheckCircle2 size={13} /> All Issues Resolved & Concordant
              </span>
            )}
          </div>
        </div>

        {/* Action Controls & Finalize Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {pendingCount > 0 && (
            <button
              onClick={() => resolveAllDiscrepancies(selectedPatient.id)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <CheckCheck size={14} color="#0284C7" />
              <span>Batch Resolve All</span>
            </button>
          )}

          <button
            onClick={openFinalizeModal}
            className={`btn ${selectedPatient.isReconciled ? 'btn-success' : 'btn-accent'} btn-lg`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)' }}
          >
            <ShieldCheck size={18} />
            <span>{selectedPatient.isReconciled ? 'Reconciliation Finalized ✓' : 'Finalize Medication Reconciliation'}</span>
          </button>
        </div>
      </div>

      {/* Reconciliation Summary Bar */}
      <div className="card" style={{ padding: '16px 22px', background: 'linear-gradient(135deg, #0B132B, #162544)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Multi-Source Analysis Ledger
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>
              {patientDiscs.length} medication items analyzed across 3 transition records
            </div>
          </div>

          {/* Compact summary badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 600 }}>
              {unchangedCount} Unchanged
            </span>
            <span style={{ fontSize: 12, background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(245, 158, 11, 0.4)', fontWeight: 600 }}>
              {changedCount} Changed
            </span>
            <span style={{ fontSize: 12, background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: 600 }}>
              {omissionCount} Potential Omission
            </span>
            <span style={{ fontSize: 12, background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(56, 189, 248, 0.4)', fontWeight: 600 }}>
              {newCount} Newly Added
            </span>
            {duplicateCount > 0 && (
              <span style={{ fontSize: 12, background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(139, 92, 246, 0.4)', fontWeight: 600 }}>
                {duplicateCount} Duplicate
              </span>
            )}
          </div>
        </div>

        {/* Completeness Bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#94A3B8', marginBottom: 4 }}>
            <span>Review Progress: <strong>{selectedPatient.reconciliationProgress}%</strong></span>
            <span>{reviewedCount} of {patientDiscs.length} Items Validated</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${selectedPatient.reconciliationProgress}%`,
                height: '100%',
                background: selectedPatient.reconciliationProgress === 100 ? '#10B981' : '#38BDF8',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Completion Banner if Finalized */}
      {selectedPatient.isReconciled && (
        <div
          style={{
            background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)',
            border: '1.5px solid #10B981',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#065F46' }}>
                Medication Reconciliation Complete & Signed Off
              </div>
              <div style={{ fontSize: 12.5, color: '#047857' }}>
                Reviewed by <strong>{selectedPatient.finalizedBy || 'Dr. Ananya Sharma'}</strong> on September 25, 2026. Unified medication story published.
              </div>
            </div>
          </div>

          <button
            onClick={() => setRoute(`/reports/${selectedPatient.id}`)}
            className="btn btn-success btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <FileCheck2 size={15} />
            <span>View Final Clinical Report</span>
          </button>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">
              <GitCompare size={17} color="#0284C7" />
              <span>Side-by-Side Transition Comparison Matrix</span>
            </div>
            <div className="card-subtitle">Direct comparison between previous community regimens and current inpatient orders</div>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Previous Record</th>
                <th>Current Record</th>
                <th>Discrepancy Classification</th>
                <th>Review Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patientDiscs.map(disc => (
                <tr key={disc.id}>
                  {/* Drug Name */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{disc.medicationName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{disc.genericName}</div>
                  </td>

                  {/* Previous Record */}
                  <td>
                    {disc.previousRecord ? (
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{disc.previousRecord.dosage}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{disc.previousRecord.frequency} • {disc.previousRecord.route}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{disc.previousRecord.source}</div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-faint)', fontStyle: 'italic' }}>Not Found</span>
                    )}
                  </td>

                  {/* Current Record */}
                  <td>
                    {disc.currentRecord ? (
                      <div>
                        <div style={{ fontWeight: 600, color: '#0284C7' }}>{disc.currentRecord.dosage}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{disc.currentRecord.frequency} • {disc.currentRecord.route}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{disc.currentRecord.source}</div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Omitted / Not Ordered</span>
                    )}
                  </td>

                  {/* Discrepancy Classification */}
                  <td>
                    <DiscrepancyBadge type={disc.type} />
                  </td>

                  {/* Status */}
                  <td>
                    {disc.status === 'REVIEWED' ? (
                      <span style={{ color: '#10B981', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={13} /> Reviewed
                      </span>
                    ) : (
                      <span style={{ color: '#D97706', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={13} /> Needs Review
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => openExplainDrawer(disc)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 11.5 }}
                      >
                        <Sparkles size={12} color="#0284C7" />
                        <span>Explain</span>
                      </button>
                      <button
                        onClick={() => openResolveModal(disc)}
                        className="btn btn-accent btn-sm"
                        style={{ fontSize: 11.5 }}
                      >
                        {disc.status === 'REVIEWED' ? 'Edit Decision' : 'Resolve'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discrepancy Cards Section */}
      <div>
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
            Clinical Discrepancy Review Cards
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Each flagged item includes AI observation analysis and requires explicit clinician reconciliation.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {patientDiscs.map(disc => {
            const isResolved = disc.status === 'REVIEWED';
            return (
              <div
                key={disc.id}
                className={`discrepancy-card ${disc.severity}`}
                style={{ opacity: isResolved ? 0.92 : 1 }}
              >
                {/* Card Header */}
                <div className="disc-header">
                  <div>
                    <div className="disc-med-title">
                      <span>{disc.medicationName}</span>
                      <span className="disc-generic">({disc.genericName})</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {disc.clinicalContext}
                    </div>
                  </div>
                  <DiscrepancyBadge type={disc.type} />
                </div>

                {/* Comparison Grid */}
                <div className="comparison-grid">
                  {/* Previous */}
                  <div className="record-box">
                    <div className="record-source-tag">Previous Outpatient Regimen</div>
                    {disc.previousRecord ? (
                      <>
                        <div className="record-val">{disc.previousRecord.dosage}</div>
                        <div className="record-sub">{disc.previousRecord.frequency} • {disc.previousRecord.route}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-faint)', marginTop: 2 }}>Source: {disc.previousRecord.source}</div>
                      </>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>No record in previous medication list</div>
                    )}
                  </div>

                  <div className="compare-arrow">
                    <ArrowRight size={18} />
                  </div>

                  {/* Current */}
                  <div className="record-box">
                    <div className="record-source-tag" style={{ color: '#0284C7' }}>Current Inpatient Order</div>
                    {disc.currentRecord ? (
                      <>
                        <div className="record-val" style={{ color: '#0284C7' }}>{disc.currentRecord.dosage}</div>
                        <div className="record-sub">{disc.currentRecord.frequency} • {disc.currentRecord.route}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-faint)', marginTop: 2 }}>Source: {disc.currentRecord.source}</div>
                      </>
                    ) : (
                      <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Omitted / Absent from Inpatient Orders</div>
                    )}
                  </div>
                </div>

                {/* AI Observation Quote Box */}
                <div className={`ai-observation-box ${disc.severity === 'critical' ? 'red' : disc.severity === 'warning' ? 'amber' : 'purple'}`}>
                  <Sparkles size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <span style={{ fontWeight: 700 }}>AI Observation: </span>
                    <span>{disc.observation}</span>
                  </div>
                </div>

                {/* Resolved Status Banner or Action Buttons */}
                <div className="disc-actions">
                  {isResolved ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#065F46', background: '#ECFDF5', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid #A7F3D0', width: '100%', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={15} color="#10B981" />
                        <span><strong>Resolved:</strong> {disc.resolvedAction || 'Clinically Accepted'}</span>
                        <span style={{ color: '#64748B' }}>• Reviewed by {disc.resolvedBy || 'Dr. Ananya Sharma'} at {disc.resolvedAt || '22:42'}</span>
                      </div>
                      <button
                        onClick={() => openResolveModal(disc)}
                        style={{ background: 'transparent', border: 'none', color: '#0284C7', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Edit Decision
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Suggested: <strong style={{ color: 'var(--text-secondary)' }}>{disc.suggestedAction}</strong>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => openExplainDrawer(disc)}
                          className="btn btn-outline btn-sm"
                        >
                          <Sparkles size={13} color="#0284C7" />
                          <span>Explain Issue</span>
                        </button>
                        <button
                          onClick={() => openResolveModal(disc)}
                          className="btn btn-accent btn-sm"
                        >
                          <CheckCircle2 size={13} />
                          <span>Resolve</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
