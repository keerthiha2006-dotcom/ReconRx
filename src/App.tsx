import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { ReconciliationWorkspacePage } from './pages/ReconciliationWorkspacePage';
import { TimelinePage } from './pages/TimelinePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

// Modals & Drawers
import { ProcessingModal } from './components/modals/ProcessingModal';
import { AIExplanationDrawer } from './components/modals/AIExplanationDrawer';
import { ResolutionModal } from './components/modals/ResolutionModal';
import { ViewSourceModal } from './components/modals/ViewSourceModal';
import { FinalizeModal } from './components/modals/FinalizeModal';
import { MedicationDetailDrawer } from './components/modals/MedicationDetailDrawer';
import { AskMediSyncModal } from './components/modals/AskMediSyncModal';
import { DemoTourModal } from './components/modals/DemoTourModal';

import { Sparkles, Bot } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentRoute, openAskMediSync } = useApp();

  if (currentRoute === '/login') {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    if (currentRoute === '/dashboard') return <DashboardPage />;
    if (currentRoute === '/patients') return <PatientsPage />;
    if (currentRoute.startsWith('/patients/')) return <PatientDetailPage />;
    if (currentRoute.startsWith('/reconciliation/')) return <ReconciliationWorkspacePage />;
    if (currentRoute.startsWith('/timeline/')) return <TimelinePage />;
    if (currentRoute.startsWith('/reports/')) return <ReportsPage />;
    if (currentRoute === '/settings') return <SettingsPage />;
    if (currentRoute === '/help') return <HelpPage />;
    return <DashboardPage />;
  };

  return (
    <div className="app-container">
      {/* Persistent Clinical Navigation Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <Topbar />
        <main className="content-area">
          {renderActivePage()}
        </main>
      </div>

      {/* Floating Ask MediSync Copilot Trigger */}
      <button
        onClick={openAskMediSync}
        className="floating-copilot-btn"
        title="Ask MediSync Clinical Copilot"
      >
        <Sparkles size={16} />
        <span>Ask MediSync</span>
      </button>

      {/* Global Modals & Drawers */}
      <ProcessingModal />
      <AIExplanationDrawer />
      <ResolutionModal />
      <ViewSourceModal />
      <FinalizeModal />
      <MedicationDetailDrawer />
      <AskMediSyncModal />
      <DemoTourModal />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
