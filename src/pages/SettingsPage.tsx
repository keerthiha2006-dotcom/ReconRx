import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  User,
  Bell,
  Sparkles,
  ShieldCheck,
  Eye,
  Lock,
  CheckCircle2,
  Sliders,
  Database,
  Building2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, resetDemoData } = useApp();

  const [aiOmissionSensitivity, setAiOmissionSensitivity] = useState('High (Conservative)');
  const [duplicateDetectionLevel, setDuplicateDetectionLevel] = useState('Same Chemical & Therapeutic Class');
  const [autoFlagDoseChanges, setAutoFlagDoseChanges] = useState(true);
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
          System & Reviewer Configuration
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Customize clinical reconciliation thresholds, AI decision-support parameters, and reviewer notifications.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <CheckCircle2 size={16} />
          <span>Configuration preferences updated successfully.</span>
        </div>
      )}

      {/* Section 1: Reviewer Profile */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <User size={17} color="#0284C7" />
            <span>Clinical Reviewer Profile</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
          <img src={user.avatar} alt={user.name} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #0284C7' }} />
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{user.name}</h3>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{user.title} • {user.role}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{user.department} • {user.hospital}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Work Email</label>
            <input type="text" readOnly value={user.email} style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-subtle)', fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Facility Department</label>
            <input type="text" readOnly value={user.department} style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-subtle)', fontSize: 13 }} />
          </div>
        </div>
      </div>

      {/* Section 2: AI Decision-Support Parameters */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={17} color="#0D9488" />
            <span>AI Decision-Support & Clinical Safety Rules</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              Medication Omission Detection Sensitivity:
            </label>
            <select
              value={aiOmissionSensitivity}
              onChange={(e) => setAiOmissionSensitivity(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'white', fontSize: 13 }}
            >
              <option value="High (Conservative)">High (Conservative — Flag all omitted chronic outpatient maintenance drugs)</option>
              <option value="Standard">Standard (Flag high-risk pharmacotherapy omissions only)</option>
              <option value="Custom Protocol">Custom Hospital Transition Protocol</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              Duplicate Therapy Scanning Scope:
            </label>
            <select
              value={duplicateDetectionLevel}
              onChange={(e) => setDuplicateDetectionLevel(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'white', fontSize: 13 }}
            >
              <option value="Same Chemical & Therapeutic Class">Same Chemical & Therapeutic Class (e.g. Lisinopril + Enalapril, NSAID overlaps)</option>
              <option value="Exact Brand & Molecule Only">Exact Brand & Molecule Only</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoFlagDoseChanges}
              onChange={(e) => setAutoFlagDoseChanges(e.target.checked)}
              style={{ accentColor: '#0284C7' }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>
              Automatically flag frequency alterations (e.g. Twice daily consolidated into Once daily)
            </span>
          </label>
        </div>
      </div>

      {/* Section 3: Notifications & Security */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Bell size={17} color="#F59E0B" />
            <span>Alerts & Audit Logging</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notifyOnCritical}
              onChange={(e) => setNotifyOnCritical(e.target.checked)}
              style={{ accentColor: '#0284C7' }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>
              Receive instant clinical priority notification when severe omission or duplication is detected
            </span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
            <Lock size={14} color="#10B981" />
            <span>All reconciliation events, user resolutions, and sign-offs are logged into an immutable audit trail.</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={resetDemoData}
          className="btn btn-outline btn-sm"
        >
          Reset Demo Dataset
        </button>

        <button
          onClick={handleSave}
          className="btn btn-accent btn-md"
        >
          Save Configuration Changes
        </button>
      </div>
    </div>
  );
};
