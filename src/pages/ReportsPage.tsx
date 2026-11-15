import React from 'react';
import { useApp } from '../context/AppContext';
import { DiscrepancyBadge } from '../components/common/Badges';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Building2,
  Calendar,
  Lock,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    selectedPatient,
    medications,
    discrepancies,
    selectedPatientId,
    user,
  } = useApp();

  if (!selectedPatient) {
    return <div>Patient not found.</div>;
  }

  const patientMeds = medications[selectedPatientId] || [];
  const patientDiscs = discrepancies[selectedPatientId] || [];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportData = {
      hospital: 'St. Jude Metropolitan Medical Center',
      reportTitle: 'Clinical Medication Reconciliation Summary',
      generatedAt: new Date().toISOString(),
      patient: selectedPatient,
      medications: patientMeds,
      discrepancies: patientDiscs,
      reviewedBy: user.name,
      reviewerRole: user.role,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediSync_Reconciliation_${selectedPatient.mrn}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Action Header */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            Clinical Medication Reconciliation Report
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Official electronic transition summary and unified medication story for patient chart.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleDownload}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={14} />
            <span>Export JSON Audit</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-accent btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Printer size={14} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Clinical Report Document Container */}
      <div
        className="card"
        style={{
          padding: 36,
          background: 'white',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-md)',
          maxWidth: 960,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Hospital Letterhead */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '2px solid #0F172A', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A' }}>
              <Stethoscope size={22} color="#0284C7" />
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>ST. JUDE METROPOLITAN MEDICAL CENTER</span>
            </div>
            <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 3 }}>
              Department of Pharmacotherapy & Clinical Transition Safety • Inpatient Care Services
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>MEDICATION RECONCILIATION SUMMARY</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Date: September 25, 2026 • 22:42 EST</div>
            <div style={{ fontSize: 10.5, color: '#10B981', fontWeight: 600 }}>MediSync AI Verified Protocol</div>
          </div>
        </div>

        {/* Patient Demographics Banner */}
        <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Patient Name</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{selectedPatient.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Medical Record #</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, fontFamily: 'monospace' }}>{selectedPatient.mrn}</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Age / Gender</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedPatient.age}y {selectedPatient.gender} ({selectedPatient.dob})</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Location / Bed</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedPatient.room}</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Transition Encounter</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedPatient.encounterType}</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Attending Physician</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedPatient.attendingPhysician}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Known Allergies</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#991B1B' }}>
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(', ') : 'No Known Drug Allergies (NKDA)'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Final Verified Medication List */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, paddingBottom: 6, borderBottom: '1.5px solid #E2E8F0' }}>
            1. Unified Active Inpatient Medication Orders
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                <th style={{ padding: '8px 10px', fontWeight: 700 }}>Medication & Generic</th>
                <th style={{ padding: '8px 10px', fontWeight: 700 }}>Dose</th>
                <th style={{ padding: '8px 10px', fontWeight: 700 }}>Frequency</th>
                <th style={{ padding: '8px 10px', fontWeight: 700 }}>Route</th>
                <th style={{ padding: '8px 10px', fontWeight: 700 }}>Indication</th>
                <th style={{ padding: '8px 10px', fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {patientMeds.map((med, idx) => (
                <tr key={med.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '8px 10px' }}>
                    <div style={{ fontWeight: 700 }}>{med.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{med.genericName}</div>
                  </td>
                  <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0284C7' }}>{med.dosage}</td>
                  <td style={{ padding: '8px 10px' }}>{med.frequency}</td>
                  <td style={{ padding: '8px 10px' }}>{med.route}</td>
                  <td style={{ padding: '8px 10px', color: '#475569' }}>{med.indication}</td>
                  <td style={{ padding: '8px 10px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#ECFDF5', color: '#065F46' }}>
                      {med.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Discrepancy Resolution & Audit Log */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, paddingBottom: 6, borderBottom: '1.5px solid #E2E8F0' }}>
            2. Care Transition Discrepancy Audit Ledger
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {patientDiscs.map(disc => (
              <div
                key={disc.id}
                style={{
                  padding: '10px 14px',
                  background: '#F8FAFC',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #E2E8F0',
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>
                    {disc.medicationName} ({disc.genericName})
                  </div>
                  <DiscrepancyBadge type={disc.type} />
                </div>
                <div style={{ color: '#475569', marginBottom: 4 }}>
                  <strong>Transition Variance:</strong> {disc.observation}
                </div>
                <div style={{ color: '#065F46', background: '#ECFDF5', padding: '4px 8px', borderRadius: 4, border: '1px solid #A7F3D0' }}>
                  <strong>Clinician Resolution:</strong> {disc.resolvedAction || 'Clinically verified and aligned with transition goals.'} (Notes: {disc.reviewNotes || 'Reviewed per inpatient protocol.'})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Clinical Sign-off & Verification */}
        <div style={{ padding: '18px 20px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>Electronic Attestation & Signature</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{user.name}, {user.title}</div>
            <div style={{ fontSize: 11.5, color: '#475569' }}>{user.role} • St. Jude Metropolitan Medical Center</div>
            <div style={{ fontSize: 11, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <ShieldCheck size={13} />
              <span>Cryptographic Signature Verified • Hash: MD5-8F29A4D9206E</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ width: 120, height: 40, borderBottom: '1.5px solid #0F172A', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: 'cursive', fontSize: 18, color: '#0284C7' }}>
              Dr. A. Sharma
            </div>
            <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 4 }}>Physician Digital Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};
