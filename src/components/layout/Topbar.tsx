import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  RotateCcw,
  CheckCheck,
  Stethoscope,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    currentRoute,
    setRoute,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    patients,
    selectedPatient,
    selectPatient,
    resetDemoData,
    openAskMediSync,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const patientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (patientRef.current && !patientRef.current.contains(event.target as Node)) {
        setIsPatientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    if (currentRoute === '/dashboard') return ['MediSync Hub', 'Reconciliation Overview'];
    if (currentRoute === '/patients') return ['Clinical Directory', 'Patient Roster'];
    if (currentRoute.startsWith('/patients/')) return ['Patients', selectedPatient ? selectedPatient.name : 'Patient Workspace'];
    if (currentRoute.startsWith('/reconciliation/')) return ['Reconciliation', selectedPatient ? `${selectedPatient.name} (${selectedPatient.mrn})` : 'Workspace'];
    if (currentRoute.startsWith('/timeline/')) return ['Medication Journey', selectedPatient ? selectedPatient.name : 'Timeline'];
    if (currentRoute.startsWith('/reports/')) return ['Clinical Reports', selectedPatient ? `${selectedPatient.name} - Summary` : 'Report'];
    if (currentRoute === '/settings') return ['Configuration', 'Reviewer Preferences'];
    if (currentRoute === '/help') return ['Documentation', 'Clinical Safety & Workflow'];
    return ['MediSync AI', 'Workspace'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Breadcrumb Trail */}
        <div className="breadcrumbs">
          <span>{breadcrumbs[0]}</span>
          <span style={{ color: 'var(--text-faint)' }}>/</span>
          <span className="breadcrumb-active">{breadcrumbs[1]}</span>
        </div>

        {/* Global Search Bar */}
        <div className="topbar-search">
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search patient, MRN, medication (e.g. Metformin)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="topbar-right">
        {/* Active Patient Quick Switcher */}
        {selectedPatient && (
          <div style={{ position: 'relative' }} ref={patientRef}>
            <button
              onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              <Stethoscope size={14} color="#0284C7" />
              <span>{selectedPatient.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>({selectedPatient.mrn})</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {isPatientDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: 280,
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-subtle)',
                  padding: 6,
                  zIndex: 60,
                }}
              >
                <div style={{ padding: '8px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  Select Clinical Patient
                </div>
                {patients.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      selectPatient(p.id);
                      setIsPatientDropdownOpen(false);
                      if (currentRoute.includes('/reconciliation/')) setRoute(`/reconciliation/${p.id}`);
                      else if (currentRoute.includes('/patients/')) setRoute(`/patients/${p.id}`);
                      else if (currentRoute.includes('/timeline/')) setRoute(`/timeline/${p.id}`);
                      else if (currentRoute.includes('/reports/')) setRoute(`/reports/${p.id}`);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: p.id === selectedPatient.id ? 'var(--accent-subtle)' : 'transparent',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.mrn} • {p.encounterType}</div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: p.status === 'Completed' ? '#059669' : '#D97706' }}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ask MediSync Copilot Trigger */}
        <button
          className="btn btn-accent btn-sm"
          onClick={openAskMediSync}
          style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-full)' }}
        >
          <Sparkles size={13} />
          <span>Ask MediSync</span>
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="icon-button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            title="Notifications"
          >
            <Bell size={16} />
            {unreadNotifsCount > 0 && <span className="badge-dot"></span>}
          </button>

          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: 340,
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                padding: 12,
                zIndex: 60,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)', marginBottom: 8 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Clinical Alerts ({unreadNotifsCount})
                </div>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    style={{ background: 'transparent', border: 'none', color: '#0284C7', fontSize: 11.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 500 }}
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.patientId) selectPatient(n.patientId);
                      if (n.link) setRoute(n.link);
                      setIsNotifOpen(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: n.read ? 'transparent' : 'var(--bg-surface-subtle)',
                      borderLeft: n.type === 'critical' ? '3px solid #EF4444' : n.type === 'success' ? '3px solid #10B981' : '3px solid #F59E0B',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                      <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>{n.timestamp}</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo State Button */}
        <button
          onClick={resetDemoData}
          className="icon-button"
          title="Reset Demo Data to Initial State"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </header>
  );
};
