import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Patient,
  MedicationSource,
  MedicationItem,
  Discrepancy,
  TimelineEvent,
  NotificationItem,
  ActivityLog,
  DiscrepancyType,
} from '../types';
import {
  currentUser as mockUser,
  initialPatients,
  initialSources,
  initialDiscrepancies,
  initialMedications,
  initialTimelines,
  initialNotifications,
  initialActivityLogs,
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  user: User;
  patients: Patient[];
  selectedPatientId: string;
  selectedPatient: Patient | undefined;
  sources: Record<string, MedicationSource[]>;
  discrepancies: Record<string, Discrepancy[]>;
  medications: Record<string, MedicationItem[]>;
  timelines: Record<string, TimelineEvent[]>;
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  unreadNotifsCount: number;
  currentRoute: string;
  isSidebarOpen: boolean;
  isDemoMode: boolean;
  searchQuery: string;
  filterStatus: string;
  filterEncounter: string;
  filterDiscrepancyType: string;

  // Active Modals & Drawers
  activeModal: 'none' | 'processing' | 'explain' | 'resolve' | 'view_source' | 'finalize' | 'medication_detail' | 'ask_medisync' | 'tour';
  activeDiscrepancy: Discrepancy | null;
  activeSource: MedicationSource | null;
  activeMedication: MedicationItem | null;
  processingStep: number;
  processingSteps: string[];
  isProcessing: boolean;
  justFinalized: boolean;

  // Actions
  setRoute: (route: string) => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterEncounter: (encounter: string) => void;
  setFilterDiscrepancyType: (type: string) => void;
  selectPatient: (id: string) => void;
  runReconciliation: (patientId: string) => Promise<void>;
  resolveDiscrepancy: (discrepancyId: string, resolutionAction: string, notes: string, addToCurrentList?: boolean) => void;
  resolveAllDiscrepancies: (patientId: string) => void;
  finalizeReconciliation: (patientId: string) => void;
  resetDemoData: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  openExplainDrawer: (disc: Discrepancy) => void;
  openResolveModal: (disc: Discrepancy) => void;
  openSourceModal: (source: MedicationSource) => void;
  openMedicationDetail: (med: MedicationItem) => void;
  openAskMediSync: () => void;
  openFinalizeModal: () => void;
  openTour: () => void;
  closeAllModals: () => void;
  loginAsDemo: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PROCESSING_STEPS = [
  'Extracting medication entities from historical & inpatient charts...',
  'Normalizing pharmaceutical nomenclature & bioequivalent dosages...',
  'Cross-referencing drug routes, frequencies, and schedules...',
  'Scanning for omitted chronic maintenance regimens...',
  'Executing therapeutic duplication & adverse interaction checks...',
  'Synthesizing clinical discrepancy alerts & review recommendations...',
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentRoute, setCurrentRoute] = useState<string>('/dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Core Clinical State
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-10291');
  const [sources, setSources] = useState<Record<string, MedicationSource[]>>(initialSources);
  const [discrepancies, setDiscrepancies] = useState<Record<string, Discrepancy[]>>(initialDiscrepancies);
  const [medications, setMedications] = useState<Record<string, MedicationItem[]>>(initialMedications);
  const [timelines, setTimelines] = useState<Record<string, TimelineEvent[]>>(initialTimelines);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterEncounter, setFilterEncounter] = useState<string>('All');
  const [filterDiscrepancyType, setFilterDiscrepancyType] = useState<string>('All');

  // Modals & Dynamic UI state
  const [activeModal, setActiveModal] = useState<AppContextType['activeModal']>('none');
  const [activeDiscrepancy, setActiveDiscrepancy] = useState<Discrepancy | null>(null);
  const [activeSource, setActiveSource] = useState<MedicationSource | null>(null);
  const [activeMedication, setActiveMedication] = useState<MedicationItem | null>(null);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [justFinalized, setJustFinalized] = useState<boolean>(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const setRoute = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const selectPatient = (id: string) => {
    setSelectedPatientId(id);
  };

  // Re-calculate patient progress and status
  const updatePatientMetrics = (patientId: string, currentDiscs: Discrepancy[]) => {
    const total = currentDiscs.length;
    const reviewedCount = currentDiscs.filter(d => d.status === 'REVIEWED' || d.status === 'DISMISSED').length;
    const pendingCount = currentDiscs.filter(d => d.status === 'REQUIRES_REVIEW').length;
    const progress = total === 0 ? 100 : Math.round((reviewedCount / total) * 100);

    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          const newStatus = p.isReconciled ? 'Completed' : pendingCount === 0 ? 'In Progress' : 'Needs Review';
          return {
            ...p,
            reconciliationProgress: progress,
            discrepancyCount: pendingCount,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const runReconciliation = async (patientId: string) => {
    setIsProcessing(true);
    setActiveModal('processing');
    setProcessingStep(0);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStep(i);
      await new Promise(res => setTimeout(res, 260));
    }

    // Add activity log and notification
    const pat = patients.find(p => p.id === patientId);
    const patName = pat ? pat.name : 'Patient';

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'MediSync AI Engine',
      action: 'AI Reconciliation Executed',
      target: `${patName} (${pat?.mrn || patientId})`,
      details: 'Extracted 3 clinical sources and computed variance alerts.',
    };
    setActivityLogs(prev => [newActivity, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'AI Reconciliation Scan Complete',
      message: `${patName}: AI reconciliation analysis complete. 3 discrepancies detected.`,
      type: 'warning',
      timestamp: 'Just now',
      read: false,
      patientId,
      link: `/reconciliation/${patientId}`,
    };
    setNotifications(prev => [newNotif, ...prev]);

    setIsProcessing(false);
    setActiveModal('none');
    setRoute(`/reconciliation/${patientId}`);
  };

  const resolveDiscrepancy = (
    discrepancyId: string,
    resolutionAction: string,
    notes: string,
    addToCurrentList = false
  ) => {
    const pId = selectedPatientId;
    const patientDiscs = discrepancies[pId] || [];

    const updatedDiscs = patientDiscs.map(d => {
      if (d.id === discrepancyId) {
        return {
          ...d,
          status: 'REVIEWED' as const,
          resolvedAction: resolutionAction,
          reviewNotes: notes,
          resolvedBy: user.name,
          resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return d;
    });

    setDiscrepancies(prev => ({
      ...prev,
      [pId]: updatedDiscs,
    }));

    // If adding to current medications (e.g. for omission resumed)
    const targetDisc = patientDiscs.find(d => d.id === discrepancyId);
    if (addToCurrentList && targetDisc && targetDisc.previousRecord) {
      const newMed: MedicationItem = {
        id: `med-res-${Date.now()}`,
        name: targetDisc.medicationName,
        genericName: targetDisc.genericName,
        dosage: targetDisc.previousRecord.dosage,
        frequency: targetDisc.previousRecord.frequency,
        route: targetDisc.previousRecord.route,
        indication: targetDisc.clinicalContext,
        prescriber: user.name,
        source: 'Reinstated via MediSync Review',
        instructions: `Reinstated during reconciliation. Notes: ${notes}`,
        startDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      };
      setMedications(prev => ({
        ...prev,
        [pId]: [...(prev[pId] || []), newMed],
      }));
    }

    // Add activity log
    const pat = patients.find(p => p.id === pId);
    setActivityLogs(prev => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: user.name,
        action: 'Discrepancy Resolved',
        target: `${targetDisc?.medicationName || 'Medication'} (${pat?.name || pId})`,
        details: `Action: ${resolutionAction}. Notes: ${notes || 'Clinically verified.'}`,
      },
      ...prev,
    ]);

    updatePatientMetrics(pId, updatedDiscs);
    closeAllModals();
  };

  const resolveAllDiscrepancies = (patientId: string) => {
    const patientDiscs = discrepancies[patientId] || [];
    const updatedDiscs = patientDiscs.map(d => ({
      ...d,
      status: 'REVIEWED' as const,
      resolvedAction: d.status === 'REVIEWED' ? d.resolvedAction || 'Clinically Verified' : 'Confirmed and clinically accepted per hospital protocol',
      reviewNotes: d.reviewNotes || 'Batch verified by reviewer based on clinical record concordance.',
      resolvedBy: user.name,
      resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    setDiscrepancies(prev => ({
      ...prev,
      [patientId]: updatedDiscs,
    }));

    setActivityLogs(prev => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: user.name,
        action: 'Batch Discrepancies Resolved',
        target: `${patients.find(p => p.id === patientId)?.name || patientId}`,
        details: `All ${updatedDiscs.length} discrepancies marked reviewed.`,
      },
      ...prev,
    ]);

    updatePatientMetrics(patientId, updatedDiscs);
  };

  const finalizeReconciliation = (patientId: string) => {
    const pat = patients.find(p => p.id === patientId);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowDate = 'September 25, 2026';

    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            isReconciled: true,
            status: 'Completed',
            discrepancyCount: 0,
            reconciliationProgress: 100,
            finalizedAt: new Date().toISOString(),
            finalizedBy: user.name,
            lastUpdated: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Add timeline event
    const finalEvent: TimelineEvent = {
      id: `tl-final-${Date.now()}`,
      patientId,
      timestamp: new Date().toISOString(),
      dateStr: `${nowDate} • ${nowTime}`,
      title: 'Medication Reconciliation Finalized & Signed Off',
      type: 'finalization',
      description: `All medication variances resolved and signed off by ${user.name} (${user.role}). Unified verified medication story published to clinical chart.`,
      actor: user.name,
      badge: 'Signed Off',
      badgeType: 'success',
      metadata: { details: 'Full audit ledger recorded.' },
    };

    setTimelines(prev => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), finalEvent],
    }));

    setActivityLogs(prev => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: user.name,
        action: 'Reconciliation Finalized',
        target: `${pat?.name || patientId} (${pat?.mrn || ''})`,
        details: `Clinical sign-off complete. Concordant medication story published.`,
      },
      ...prev,
    ]);

    // Add success notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Reconciliation Signed Off',
        message: `${pat?.name}: Medication reconciliation finalized and ready for clinical discharge/inpatient charting.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
        patientId,
        link: `/reports/${patientId}`,
      },
      ...prev,
    ]);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0EA5E9', '#10B981', '#6366F1', '#38BDF8'],
      });
    } catch {
      // safe fallback
    }

    setJustFinalized(true);
    closeAllModals();
  };

  const resetDemoData = () => {
    setPatients(initialPatients);
    setSelectedPatientId('p-10291');
    setSources(initialSources);
    setDiscrepancies(initialDiscrepancies);
    setMedications(initialMedications);
    setTimelines(initialTimelines);
    setNotifications(initialNotifications);
    setActivityLogs(initialActivityLogs);
    setJustFinalized(false);
    setRoute('/dashboard');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const openExplainDrawer = (disc: Discrepancy) => {
    setActiveDiscrepancy(disc);
    setActiveModal('explain');
  };

  const openResolveModal = (disc: Discrepancy) => {
    setActiveDiscrepancy(disc);
    setActiveModal('resolve');
  };

  const openSourceModal = (source: MedicationSource) => {
    setActiveSource(source);
    setActiveModal('view_source');
  };

  const openMedicationDetail = (med: MedicationItem) => {
    setActiveMedication(med);
    setActiveModal('medication_detail');
  };

  const openAskMediSync = () => {
    setActiveModal('ask_medisync');
  };

  const openFinalizeModal = () => {
    setActiveModal('finalize');
  };

  const openTour = () => {
    setActiveModal('tour');
  };

  const closeAllModals = () => {
    setActiveModal('none');
    setActiveDiscrepancy(null);
    setActiveSource(null);
    setActiveMedication(null);
  };

  const loginAsDemo = () => {
    setUser(mockUser);
    setIsAuthenticated(true);
    setIsDemoMode(true);
    setRoute('/dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRoute('/login');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        patients,
        selectedPatientId,
        selectedPatient,
        sources,
        discrepancies,
        medications,
        timelines,
        notifications,
        activityLogs,
        unreadNotifsCount,
        currentRoute,
        isSidebarOpen,
        isDemoMode,
        searchQuery,
        filterStatus,
        filterEncounter,
        filterDiscrepancyType,
        activeModal,
        activeDiscrepancy,
        activeSource,
        activeMedication,
        processingStep,
        processingSteps: PROCESSING_STEPS,
        isProcessing,
        justFinalized,
        setRoute,
        toggleSidebar,
        setSearchQuery,
        setFilterStatus,
        setFilterEncounter,
        setFilterDiscrepancyType,
        selectPatient,
        runReconciliation,
        resolveDiscrepancy,
        resolveAllDiscrepancies,
        finalizeReconciliation,
        resetDemoData,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        openExplainDrawer,
        openResolveModal,
        openSourceModal,
        openMedicationDetail,
        openAskMediSync,
        openFinalizeModal,
        openTour,
        closeAllModals,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
