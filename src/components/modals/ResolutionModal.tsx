import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DiscrepancyBadge } from '../common/Badges';
import {
  X,
  CheckCircle2,
  Stethoscope,
  FileEdit,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

export const ResolutionModal: React.FC = () => {
  const {
    activeModal,
    activeDiscrepancy,
    resolveDiscrepancy,
    closeAllModals,
    user,
  } = useApp();

  const [selectedAction, setSelectedAction] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [addToCurrentList, setAddToCurrentList] = useState<boolean>(false);

  useEffect(() => {
    if (activeDiscrepancy) {
      if (activeDiscrepancy.type === 'POTENTIAL_OMISSION') {
        setSelectedAction('Add to current medication list (Resume in hospital)');
        setAddToCurrentList(true);
        setNotes('Confirmed chronic statin therapy required for secondary cardiovascular prophylaxis.');
      } else if (activeDiscrepancy.type === 'DOSE_FREQUENCY_CHANGE') {
        setSelectedAction('Confirm intentional dose adjustment (Extended-Release formulation)');
        setAddToCurrentList(false);
        setNotes('Verified Metformin 1000mg QD is Extended-Release formulation with dinner.');
      } else if (activeDiscrepancy.type === 'NEWLY_ADDED') {
        setSelectedAction('Confirm intentional new therapy initiation');
        setAddToCurrentList(false);
        setNotes('Aspirin 75mg PO daily initiated for acute vascular prophylaxis on admission.');
      } else if (activeDiscrepancy.type === 'POSSIBLE_DUPLICATE') {
        setSelectedAction('Confirm duplicate and discontinue redundant agent');
        setAddToCurrentList(false);
        setNotes('Attending physician confirmed Enalapril should be discontinued in favor of Lisinopril.');
      } else {
        setSelectedAction('Concordance verified');
        setAddToCurrentList(false);
        setNotes('Verified identical across historical and current records.');
      }
    }
  }, [activeDiscrepancy]);

  if (activeModal !== 'resolve' || !activeDiscrepancy) return null;

  const getActionOptions = () => {
    switch (activeDiscrepancy.type) {
      case 'POTENTIAL_OMISSION':
        return [
          'Add to current medication list (Resume in hospital)',
          'Confirm intentionally discontinued (Document reason)',
          'Temporarily hold (Pending lab results / procedure)',
          'Mark for further attending physician consultation',
        ];
      case 'DOSE_FREQUENCY_CHANGE':
        return [
          'Confirm intentional dose adjustment (Extended-Release formulation)',
          'Revert to previous home dosage regimen',
          'Acknowledge acute inpatient titration schedule',
          'Mark for further clinical review',
        ];
      case 'NEWLY_ADDED':
        return [
          'Confirm intentional new therapy initiation',
          'Confirm acute inpatient-only medication order',
          'Discontinue new order after review',
          'Mark for further clinical review',
        ];
      case 'POSSIBLE_DUPLICATE':
        return [
          'Confirm duplicate and discontinue redundant agent',
          'Clinically justified dual-therapy (Document justification)',
          'Substitute with preferred formulary equivalent',
          'Mark for urgent attending review',
        ];
      default:
        return [
          'Concordance verified',
          'Clinical review completed',
        ];
    }
  };

  const handleResolve = () => {
    resolveDiscrepancy(activeDiscrepancy.id, selectedAction, notes, addToCurrentList);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: 560 }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Stethoscope size={18} color="#0284C7" />
            <span>Resolve Medication Discrepancy</span>
          </div>
          <button onClick={closeAllModals} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Target Medication Brief */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeDiscrepancy.medicationName}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                {activeDiscrepancy.genericName}
              </div>
            </div>
            <DiscrepancyBadge type={activeDiscrepancy.type} />
          </div>

          {/* Action Options */}
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Select Clinician Decision:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {getActionOptions().map((opt, idx) => (
                <label
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedAction === opt ? '1.5px solid #0284C7' : '1px solid var(--border-subtle)',
                    background: selectedAction === opt ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: selectedAction === opt ? 600 : 400,
                    color: selectedAction === opt ? '#0284C7' : 'var(--text-primary)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="resolution_action"
                    value={opt}
                    checked={selectedAction === opt}
                    onChange={() => setSelectedAction(opt)}
                    style={{ accentColor: '#0284C7' }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Add to Active Medication List Checkbox (for omissions) */}
          {activeDiscrepancy.type === 'POTENTIAL_OMISSION' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 12.5, color: '#065F46', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={addToCurrentList}
                onChange={(e) => setAddToCurrentList(e.target.checked)}
                style={{ accentColor: '#10B981' }}
              />
              <span>Reinstate {activeDiscrepancy.medicationName} into active inpatient medication orders</span>
            </label>
          )}

          {/* Clinician Notes */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              <FileEdit size={14} />
              <span>Clinical Audit Note & Rationale:</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter rationale, attending confirmation, or reconciliation note..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                fontFamily: 'inherit',
                fontSize: 12.5,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Reviewer Stamp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#10B981" />
            <span>Resolving as: <strong>{user.name}</strong> ({user.role})</span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={closeAllModals} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button
            onClick={handleResolve}
            className="btn btn-accent btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <CheckCircle2 size={14} />
            <span>Confirm Resolution</span>
          </button>
        </div>
      </div>
    </div>
  );
};
