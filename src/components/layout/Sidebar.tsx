import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GitCompare,
  History,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentRoute,
    setRoute,
    isSidebarOpen,
    toggleSidebar,
    user,
    patients,
    selectedPatientId,
    openTour,
  } = useApp();

  const pendingDiscrepanciesTotal = patients.reduce((acc, p) => acc + (p.status === 'Needs Review' ? 1 : 0), 0);

  const navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Patients', route: '/patients', icon: Users, badge: patients.length },
    { label: 'Reconciliation', route: `/reconciliation/${selectedPatientId}`, icon: GitCompare, badge: pendingDiscrepanciesTotal > 0 ? `${pendingDiscrepanciesTotal} Pending` : undefined, alert: pendingDiscrepanciesTotal > 0 },
    { label: 'Medication Timeline', route: `/timeline/${selectedPatientId}`, icon: History },
    { label: 'Clinical Reports', route: `/reports/${selectedPatientId}`, icon: FileText },
  ];

  const bottomNavItems = [
    { label: 'Settings', route: '/settings', icon: Settings },
    { label: 'Help & Safety', route: '/help', icon: HelpCircle },
  ];

  return (
    <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="logo-badge" onClick={() => setRoute('/dashboard')}>
          <div className="logo-icon">
            <Stethoscope size={19} />
          </div>
          {isSidebarOpen && (
            <div>
              <div className="logo-text">MediSync AI</div>
              <div className="logo-sub">Safety Copilot</div>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="sidebar-nav">
        {isSidebarOpen && <div className="nav-section-title">Clinical Operations</div>}

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route || (item.route.startsWith('/reconciliation') && currentRoute.startsWith('/reconciliation')) || (item.route.startsWith('/timeline') && currentRoute.startsWith('/timeline')) || (item.route.startsWith('/reports') && currentRoute.startsWith('/reports'));
          return (
            <div
              key={item.route}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setRoute(item.route)}
              title={!isSidebarOpen ? item.label : undefined}
            >
              <Icon size={18} />
              {isSidebarOpen && <span>{item.label}</span>}
              {isSidebarOpen && item.badge && (
                <span className={`nav-badge ${item.alert ? 'alert' : ''}`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        {isSidebarOpen && (
          <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(2, 132, 199, 0.25)', borderRadius: 'var(--radius-md)', margin: '14px 10px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#38BDF8', marginBottom: 4 }}>
              <Sparkles size={13} />
              <span>Hackathon Demo</span>
            </div>
            <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.35, marginBottom: 8 }}>
              Experience the 2-minute clinical reconciliation workflow.
            </p>
            <button
              onClick={openTour}
              style={{
                width: '100%',
                padding: '5px 8px',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: '#0284C7',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Start 2-Min Demo Flow
            </button>
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          {isSidebarOpen && <div className="nav-section-title">Support & System</div>}
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <div
                key={item.route}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setRoute(item.route)}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon size={18} />
                {isSidebarOpen && <span>{item.label}</span>}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer / User Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-widget">
          <img src={user.avatar} alt={user.name} className="avatar" />
          {isSidebarOpen && (
            <div className="user-meta">
              <div className="user-name">{user.name}</div>
              <div className="user-role">
                <span className="status-dot"></span>
                <span>{user.role}</span>
              </div>
            </div>
          )}
        </div>
        {isSidebarOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, fontSize: 10.5, color: '#64748B' }}>
            <ShieldCheck size={12} color="#10B981" />
            <span>Synthetic Patient Demo Mode</span>
          </div>
        )}
      </div>
    </aside>
  );
};
