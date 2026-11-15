import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badges';
import {
  Stethoscope,
  Sparkles,
  FileText,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Play,
  ArrowRight,
  ShieldAlert,
  Pill,
  Clock,
  User,
  History,
  FileCheck2,
} from 'lucide-react';

export const PatientDetailPage: React.FC = () => {
  const {
    selectedPatient,
    sources,
    medications,
    selectedPatientId,
    runReconciliation,
    openSourceModal,
    openMedicationDetail,
    setRoute,
  } = useApp();

  if (!selectedPatient) {
    return <div>Patient not found.</div>;
  }

  const patientSources = sources[selectedPatientId] || [];
  const patientMeds = medications[selectedPatientId] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Patient Header Banner */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
              {selectedPatient.name}
            </h1>
            <span style={{ fontFamily: 'monospace', fontSize: 13, background: 'var(--bg-surface-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {selectedPatient.mrn}
            </span>
            <StatusBadge status={selectedPatient.status} />
            <PriorityBadge priority={selectedPatient.priority} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span><strong>Age/Gender:</strong> {selectedPatient.age}y {selectedPatient.gender} (DOB: {selectedPatient.dob})</span>
            <span>•</span>
            <span><strong>Encounter:</strong> {selectedPatient.encounterType}</span>
            <span>•</span>
            <span><strong>Room:</strong> {selectedPatient.room}</span>
            <span>•</span>
            <span><strong>Attending:</strong> {selectedPatient.attendingPhysician}</span>
          </div>

          {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#991B1B' }}>Allergies:</span>
              {selectedPatient.allergies.map((all, idx) => (
                <span key={idx} className="badge" style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA', fontSize: 11 }}>
                  {all}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => runReconciliation(selectedPatient.id)}
            className="btn btn-accent btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)' }}
          >
            <Sparkles size={17} />
            <span>Run AI Reconciliation</span>
          </button>
        </div>
      </div>

      {/* Grid: Overview & Reconciliation Completeness */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Patient Clinical Overview */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Stethoscope size={17} color="#0284C7" />
              <span>Transition Care Context</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Primary Admission Diagnosis
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                {selectedPatient.primaryDiagnosis}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Admission Timestamp:</div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{new Date(selectedPatient.admissionDate).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last Chart Update:</div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{new Date(selectedPatient.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reconciliation Progress Meter */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #0B132B, #162544)', color: 'white' }}>
          <div className="card-header" style={{ marginBottom: 8 }}>
            <div className="card-title" style={{ color: 'white' }}>
              <FileCheck2 size={17} color="#38BDF8" />
              <span>Reconciliation Review Progress</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#38BDF8' }}>
              {selectedPatient.reconciliationProgress}%
            </span>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>Workflow Reviewed</span>
          </div>

          <div style={{ height: 8, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
            <div
              style={{
                width: `${selectedPatient.reconciliationProgress}%`,
                height: '100%',
                background: selectedPatient.isReconciled ? '#10B981' : 'linear-gradient(90deg, #0284C7, #38BDF8)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <p style={{ fontSize: 11.5, color: '#94A3B8', lineHeight: 1.4 }}>
            {selectedPatient.isReconciled
              ? '✓ All identified discrepancies reviewed and signed off.'
              : `${selectedPatient.discrepancyCount} items currently require clinician validation.`}
          </p>
        </div>
      </div>

      {/* Medication Sources Section (3 Cards) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              Medication Sources Consolidated
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              Heterogeneous records parsed and indexed by MediSync AI engine.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {patientSources.map((source, idx) => (
            <div key={source.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="badge" style={{ background: idx === 2 ? '#E0F2FE' : '#F1F5F9', color: idx === 2 ? '#0284C7' : '#475569', fontWeight: 700 }}>
                    {idx === 0 ? '1. Previous Prescription' : idx === 1 ? '2. Patient Stated Record' : '3. Current Hospital Inpatient'}
                  </span>
                  <span className="badge badge-unchanged">
                    <CheckCircle2 size={11} /> {source.status}
                  </span>
                </div>

                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {source.title}
                </h3>

                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Calendar size={12} /> {source.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Building2 size={12} /> {source.facility}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <User size={12} /> {source.provider}
                  </span>
                </div>
              </div>

              <div style={{ paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {source.medicationCount} medications
                </span>
                <button
                  onClick={() => openSourceModal(source)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: 11.5 }}
                >
                  <FileText size={12} />
                  <span>View Source</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Inpatient Medication Orders Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div className="card-title">
              <Pill size={17} color="#0284C7" />
              <span>Current Inpatient Medication Orders ({patientMeds.length})</span>
            </div>
            <div className="card-subtitle">Active order set entered during present encounter</div>
          </div>

          <button
            onClick={() => setRoute(`/reconciliation/${selectedPatientId}`)}
            className="btn btn-accent btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>Open Comparison Workspace</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Medication Name</th>
                <th>Dosage / Strength</th>
                <th>Frequency</th>
                <th>Route</th>
                <th>Prescribing Provider</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Monograph</th>
              </tr>
            </thead>
            <tbody>
              {patientMeds.map(med => (
                <tr key={med.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{med.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{med.genericName} • {med.category}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0284C7' }}>{med.dosage}</span>
                  </td>
                  <td>{med.frequency}</td>
                  <td>{med.route}</td>
                  <td>{med.prescriber}</td>
                  <td>
                    <span className={`badge ${med.status === 'New' ? 'badge-new' : med.status === 'Modified' ? 'badge-changed' : 'badge-unchanged'}`}>
                      {med.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => openMedicationDetail(med)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 11.5, padding: '3px 8px' }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
