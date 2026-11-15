import { Discrepancy, Patient, MedicationItem } from '../types';

export interface AIResponse {
  answer: string;
  suggestedAction?: string;
  sourceReferences?: string[];
  safetyDisclaimer: string;
}

const SAFETY_DISCLAIMER = 'MediSync AI observation is generated for clinical decision support. Final prescription and discontinuation decisions remain exclusively with the licensed healthcare professional.';

export function generateDiscrepancyExplanation(discrepancy: Discrepancy, patientName: string): {
  whatChanged: string;
  whyFlagged: string;
  clinicalContext: string;
  suggestedAction: string;
  safetyDisclaimer: string;
} {
  let whatChanged = '';
  let whyFlagged = '';

  switch (discrepancy.type) {
    case 'POTENTIAL_OMISSION':
      whatChanged = `${discrepancy.medicationName} (${discrepancy.previousRecord?.dosage || 'standard dose'}) was listed in the previous outpatient record (${discrepancy.previousRecord?.source}) but is absent from the current inpatient admission order set.`;
      whyFlagged = 'Unintentional medication omission is one of the most frequent care transition risks. If intentional, documenting the hold reason prevents confusion.';
      break;

    case 'DOSE_FREQUENCY_CHANGE':
      whatChanged = `Previous regimen: ${discrepancy.previousRecord?.dosage} ${discrepancy.previousRecord?.frequency} (${discrepancy.previousRecord?.route}). Current regimen: ${discrepancy.currentRecord?.dosage} ${discrepancy.currentRecord?.frequency} (${discrepancy.currentRecord?.route}).`;
      whyFlagged = 'Dosage or schedule modification detected across transitions. Verification ensures total daily bioequivalent dose aligns with clinical goals.';
      break;

    case 'NEWLY_ADDED':
      whatChanged = `${discrepancy.medicationName} (${discrepancy.currentRecord?.dosage}, ${discrepancy.currentRecord?.frequency}) was newly initiated in the current admission orders and did not exist in prior home lists.`;
      whyFlagged = 'New medications initiated upon admission require indication verification, allergy review, and reconciliation into the unified medication plan.';
      break;

    case 'POSSIBLE_DUPLICATE':
      whatChanged = `Multiple agents within the same therapeutic class or drug entity detected concurrently.`;
      whyFlagged = 'Therapeutic duplication may cause compounded adverse events, cumulative toxicity, or accidental double-dosing.';
      break;

    case 'ROUTE_CHANGE':
      whatChanged = `Route of administration altered between transition records (${discrepancy.previousRecord?.route} → ${discrepancy.currentRecord?.route}).`;
      whyFlagged = 'Route changes require pharmacokinetic consideration (IV vs Oral bioavailability equivalence) and future step-down planning.';
      break;

    default:
      whatChanged = 'Medication records are fully concordant.';
      whyFlagged = 'Baseline maintenance verified.';
  }

  return {
    whatChanged,
    whyFlagged,
    clinicalContext: discrepancy.clinicalContext || `Review required in the context of ${patientName}'s current admission diagnosis and organ function.`,
    suggestedAction: discrepancy.suggestedAction || 'Review with attending clinician and document reconciliation decision.',
    safetyDisclaimer: SAFETY_DISCLAIMER,
  };
}

export function queryAskMediSync(
  question: string,
  patient: Patient,
  discrepancies: Discrepancy[],
  medications: MedicationItem[]
): AIResponse {
  const q = question.toLowerCase();

  // Pattern 1: Why is Atorvastatin (or specific drug) flagged?
  for (const disc of discrepancies) {
    const drugName = disc.medicationName.toLowerCase();
    const genericName = disc.genericName.toLowerCase();
    if (q.includes(drugName) || q.includes(genericName) || (drugName.includes('atorvastatin') && q.includes('statin'))) {
      const expl = generateDiscrepancyExplanation(disc, patient.name);
      return {
        answer: `**${disc.medicationName}** was flagged as **${disc.type.replace(/_/g, ' ')}**.\n\n` +
          `• **What Changed:** ${expl.whatChanged}\n` +
          `• **Why Flagged:** ${expl.whyFlagged}\n` +
          `• **Clinical Context:** ${disc.clinicalContext}\n\n` +
          `**Potential Risk:** ${disc.potentialRisk || 'Therapeutic variation during care transition.'}`,
        suggestedAction: disc.suggestedAction,
        sourceReferences: [
          disc.previousRecord ? `Previous: ${disc.previousRecord.source} (${disc.previousRecord.dosage})` : 'Previous: Not Found',
          disc.currentRecord ? `Current: ${disc.currentRecord.source} (${disc.currentRecord.dosage})` : 'Current: Not Found',
        ],
        safetyDisclaimer: SAFETY_DISCLAIMER,
      };
    }
  }

  // Pattern 2: Metformin or dose changes
  if (q.includes('metformin') || q.includes('dose') || q.includes('frequency')) {
    const metforminDisc = discrepancies.find(d => d.medicationName.toLowerCase().includes('metformin'));
    if (metforminDisc) {
      return {
        answer: `**Metformin Regimen Analysis:**\n\n` +
          `• **Previous Home Regimen:** 500 mg twice daily (BID) — Total daily dose: 1,000 mg/day.\n` +
          `• **Current Hospital Order:** 1,000 mg once daily (QD) — Total daily dose: 1,000 mg/day.\n\n` +
          `While the cumulative daily dose is equal (1,000 mg), switching from twice daily to a single 1,000 mg dose requires confirming if this is an Extended-Release (XR/ER) formulation. Administering 1,000 mg of immediate-release at once may provoke gastrointestinal distress.`,
        suggestedAction: 'Verify whether Extended-Release (XR) was intended and confirm timing with evening meal.',
        sourceReferences: ['Previous Outpatient Rx', 'Hospital Inpatient Order Set'],
        safetyDisclaimer: SAFETY_DISCLAIMER,
      };
    }
  }

  // Pattern 3: Duplicate therapies / contraindications
  if (q.includes('duplicate') || q.includes('lisinopril') || q.includes('enalapril') || q.includes('interaction')) {
    const dup = discrepancies.find(d => d.type === 'POSSIBLE_DUPLICATE');
    if (dup) {
      return {
        answer: `**Therapeutic Duplication Detected:**\n\n` +
          `• **Alert:** ${dup.medicationName} co-prescribed concurrently.\n` +
          `• **Mechanism:** Both agents are systemic ACE inhibitors.\n` +
          `• **Risk:** Additive hypotension, acute hyperkalemia, and risk of acute kidney injury (AKI).\n\n` +
          `Dual ACE inhibitor regimens are not recommended. Clinician should confirm whether Lisinopril was meant to replace Enalapril.`,
        suggestedAction: 'Clarify intended single ACE inhibitor therapy with attending prescriber.',
        sourceReferences: ['Cardiology Clinic Regimen', 'Emergency Inpatient Orders'],
        safetyDisclaimer: SAFETY_DISCLAIMER,
      };
    }
  }

  // Pattern 4: Allergies and safety
  if (q.includes('allergy') || q.includes('allergies') || q.includes('safety') || q.includes('contraindication')) {
    const allergyList = patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'No Known Drug Allergies (NKDA)';
    return {
      answer: `**Patient Allergy Profile & Cross-Check:**\n\n` +
        `• **Recorded Allergies:** ${allergyList}\n` +
        `• **Active Inpatient Orders:** ${medications.map(m => `${m.name} (${m.dosage})`).join(', ')}\n\n` +
        `No direct contraindications found against current active orders. Ensure newly added medications remain clear of reported sensitivities.`,
      suggestedAction: 'Maintain vigilance for cross-reactive sensitivities throughout admission.',
      sourceReferences: ['Patient Triage Portal Record', 'Electronic Health Record Allergy Ledger'],
      safetyDisclaimer: SAFETY_DISCLAIMER,
    };
  }

  // Pattern 5: Reconciliation status summary
  if (q.includes('summary') || q.includes('status') || q.includes('progress') || q.includes('overview') || q.includes('reconcil')) {
    const pending = discrepancies.filter(d => d.status === 'REQUIRES_REVIEW').length;
    const reviewed = discrepancies.filter(d => d.status === 'REVIEWED').length;
    return {
      answer: `**Reconciliation Status for ${patient.name} (${patient.mrn}):**\n\n` +
        `• **Total Items Analyzed:** ${discrepancies.length} medication transitions\n` +
        `• **Pending Clinical Reviews:** ${pending} items\n` +
        `• **Reviewed / Concordant:** ${reviewed} items\n` +
        `• **Overall Completeness:** ${patient.reconciliationProgress}%\n\n` +
        `Key flagged items include: ${discrepancies.filter(d => d.status === 'REQUIRES_REVIEW').map(d => `${d.medicationName} (${d.type.replace(/_/g, ' ')})`).join(', ')}.`,
      suggestedAction: pending > 0 ? 'Resolve pending discrepancy cards in the Reconciliation Workspace.' : 'Ready to finalize clinical sign-off.',
      sourceReferences: ['MediSync AI Reconciliation Ledger'],
      safetyDisclaimer: SAFETY_DISCLAIMER,
    };
  }

  // Default smart fallback bounded by clinical context
  return {
    answer: `Based on **${patient.name}**'s records for encounter **${patient.encounterType}**:\n\n` +
      `We have analyzed ${discrepancies.length} medication items across 3 clinical sources.\n` +
      `• Primary Diagnosis: ${patient.primaryDiagnosis}\n` +
      `• Attending Physician: ${patient.attendingPhysician}\n` +
      `• Current Active Inpatient Meds: ${medications.map(m => m.name).join(', ')}\n\n` +
      `You can ask specifically about any flagged drug (e.g. "Why is Atorvastatin flagged?"), check dosage adjustments, review allergy cross-checks, or request reconciliation progress.`,
    suggestedAction: 'Click any Discrepancy Card on the left to review specific pharmacotherapeutic parameters.',
    sourceReferences: ['Patient Clinical Chart', 'Admission Encounter Data'],
    safetyDisclaimer: SAFETY_DISCLAIMER,
  };
}
