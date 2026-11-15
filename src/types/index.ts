export type UserRole = 'Healthcare Professional' | 'Clinical Reviewer' | 'Pharmacist' | 'Demo Mode';

export interface User {
  id: string;
  name: string;
  title: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  hospital: string;
  isOnline: boolean;
}

export type EncounterType = 'Hospital Admission' | 'Cardiac Care Transfer' | 'Surgical Discharge' | 'Referral' | 'Emergency Care';
export type PatientStatus = 'Needs Review' | 'In Progress' | 'Completed';
export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number e.g. P-10291
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  encounterType: EncounterType;
  admissionDate: string;
  room: string;
  attendingPhysician: string;
  primaryDiagnosis: string;
  allergies: string[];
  status: PatientStatus;
  priority: PriorityLevel;
  medicationCount: number;
  discrepancyCount: number;
  lastUpdated: string;
  reconciliationProgress: number; // 0 - 100 percentage
  isReconciled: boolean;
  finalizedAt?: string;
  finalizedBy?: string;
}

export type SourceType = 'previous_prescription' | 'patient_record' | 'hospital_admission';

export interface MedicationSource {
  id: string;
  patientId: string;
  type: SourceType;
  title: string;
  date: string;
  facility: string;
  provider: string;
  medicationCount: number;
  status: 'Processed' | 'Pending' | 'Verified';
  rawDocumentSnippet: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  dosage: string;
  frequency: string;
  route: string;
  form?: string;
  indication?: string;
  prescriber?: string;
  source: string;
  instructions?: string;
  startDate?: string;
  status: 'Active' | 'Discontinued' | 'Modified' | 'New' | 'Unchanged';
  category?: string;
}

export type DiscrepancyType =
  | 'DOSE_FREQUENCY_CHANGE'
  | 'POTENTIAL_OMISSION'
  | 'NEWLY_ADDED'
  | 'POSSIBLE_DUPLICATE'
  | 'ROUTE_CHANGE'
  | 'UNCHANGED';

export type DiscrepancyStatus = 'REQUIRES_REVIEW' | 'REVIEWED' | 'DISMISSED';
export type DiscrepancySeverity = 'critical' | 'warning' | 'info' | 'success';

export interface Discrepancy {
  id: string;
  patientId: string;
  medicationName: string;
  genericName: string;
  type: DiscrepancyType;
  severity: DiscrepancySeverity;
  status: DiscrepancyStatus;
  previousRecord: {
    dosage: string;
    frequency: string;
    route: string;
    date: string;
    source: string;
    prescriber?: string;
  } | null;
  currentRecord: {
    dosage: string;
    frequency: string;
    route: string;
    date: string;
    source: string;
    prescriber?: string;
  } | null;
  observation: string;
  clinicalContext: string;
  suggestedAction: string;
  potentialRisk?: string;
  reviewNotes?: string;
  resolvedAction?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  timestamp: string;
  dateStr: string;
  title: string;
  type: 'prescription' | 'update' | 'admission' | 'reconciliation' | 'review' | 'finalization';
  description: string;
  actor: string;
  badge?: string;
  badgeType?: 'primary' | 'warning' | 'success' | 'danger' | 'info';
  metadata?: {
    medicationsCount?: number;
    discrepancyCount?: number;
    details?: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'success' | 'info' | 'critical';
  timestamp: string;
  read: boolean;
  patientId?: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
}

export interface ReconciliationReport {
  id: string;
  patientId: string;
  generatedAt: string;
  finalizedAt: string;
  reviewedBy: string;
  reviewerRole: string;
  summary: {
    totalMedications: number;
    unchanged: number;
    doseChanges: number;
    omissions: number;
    newlyAdded: number;
    duplicates: number;
  };
  finalMedicationList: MedicationItem[];
  resolvedDiscrepancies: Discrepancy[];
  clinicalSignOff: {
    doctorName: string;
    license: string;
    timestamp: string;
    hospital: string;
  };
}
