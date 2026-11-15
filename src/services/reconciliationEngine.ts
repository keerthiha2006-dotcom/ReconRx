import { Discrepancy, DiscrepancyType, DiscrepancySeverity } from '../types';

export interface RawMedInput {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  source: string;
  date?: string;
  prescriber?: string;
}

// Drug class map for therapeutic duplicate detection
const DRUG_CLASSES: Record<string, string> = {
  lisinopril: 'ACE_INHIBITOR',
  enalapril: 'ACE_INHIBITOR',
  ramipril: 'ACE_INHIBITOR',
  captopril: 'ACE_INHIBITOR',
  losartan: 'ARB',
  valsartan: 'ARB',
  candesartan: 'ARB',
  amlodipine: 'CCB',
  nifedipine: 'CCB',
  diltiazem: 'CCB',
  metoprolol: 'BETA_BLOCKER',
  atenolol: 'BETA_BLOCKER',
  bisoprolol: 'BETA_BLOCKER',
  carvedilol: 'BETA_BLOCKER',
  atorvastatin: 'STATIN',
  rosuvastatin: 'STATIN',
  simvastatin: 'STATIN',
  ibuprofen: 'NSAID',
  naproxen: 'NSAID',
  meloxicam: 'NSAID',
  omeprazole: 'PPI',
  pantoprazole: 'PPI',
  esomeprazole: 'PPI',
  metformin: 'BIGUANIDE',
  glipizide: 'SULFONYLUREA',
  aspirin: 'ANTIPLATELET',
  clopidogrel: 'ANTIPLATELET',
};

// Generic brand name synonyms
const BRAND_TO_GENERIC: Record<string, string> = {
  glucophage: 'metformin',
  norvasc: 'amlodipine',
  lipitor: 'atorvastatin',
  zestril: 'lisinopril',
  prinivil: 'lisinopril',
  vasotec: 'enalapril',
  lopressor: 'metoprolol',
  toprol: 'metoprolol',
  nexium: 'esomeprazole',
  prilosec: 'omeprazole',
  protonix: 'pantoprazole',
  ecotrin: 'aspirin',
  plavix: 'clopidogrel',
  crestor: 'rosuvastatin',
  ultram: 'tramadol',
  lasix: 'furosemide',
};

export function normalizeDrugName(name: string): string {
  if (!name) return '';
  const cleaned = name.toLowerCase()
    .replace(/\s*(hydrochloride|hcl|besylate|calcium|sodium|tartrate|succinate|potassium|er|xr|sr|dr|cr|oral|tablet|capsule|liquid)\b/gi, '')
    .trim();
  return BRAND_TO_GENERIC[cleaned] || cleaned;
}

export function normalizeDosage(dosage: string): string {
  if (!dosage) return '';
  let d = dosage.toLowerCase().trim();
  d = d.replace(/\s*milligrams?\b/g, ' mg');
  d = d.replace(/\s*micrograms?\b|\s*mcg\b/g, ' mcg');
  d = d.replace(/\s*grams?\b|\s*g\b/g, ' g');
  d = d.replace(/(\d+)\s*(mg|mcg|g|ml|units?)/i, '$1 $2');
  return d;
}

export function normalizeFrequency(freq: string): string {
  if (!freq) return '';
  const f = freq.toLowerCase().trim();
  if (f.includes('bid') || f.includes('twice') || f.includes('2 times') || f.includes('q12h')) return 'Twice daily';
  if (f.includes('tid') || f.includes('three times') || f.includes('3 times') || f.includes('q8h')) return 'Three times daily';
  if (f.includes('qid') || f.includes('four times') || f.includes('4 times') || f.includes('q6h')) return 'Four times daily';
  if (f.includes('qd') || f.includes('daily') || f.includes('once') || f.includes('q24h') || f.includes('every day')) return 'Once daily';
  if (f.includes('qhs') || f.includes('bedtime') || f.includes('night')) return 'Once daily at bedtime';
  if (f.includes('prn') || f.includes('as needed')) return 'As needed (PRN)';
  return freq.trim();
}

export function normalizeRoute(route: string): string {
  if (!route) return 'Oral (PO)';
  const r = route.toLowerCase().trim();
  if (r.includes('po') || r.includes('oral') || r.includes('mouth')) return 'Oral (PO)';
  if (r.includes('iv') || r.includes('intravenous')) return 'Intravenous (IV)';
  if (r.includes('sc') || r.includes('subcutaneous') || r.includes('sq')) return 'Subcutaneous (SC)';
  if (r.includes('im') || r.includes('intramuscular')) return 'Intramuscular (IM)';
  if (r.includes('inh') || r.includes('inhal')) return 'Inhalation';
  if (r.includes('top') || r.includes('topical')) return 'Topical';
  return route.trim();
}

/**
 * Deterministic Clinical Reconciliation Engine
 * Cross-references previous outpatient records with current hospital admission records.
 */
export function reconcileMedications(
  patientId: string,
  previousMeds: RawMedInput[],
  currentMeds: RawMedInput[]
): Discrepancy[] {
  const discrepancies: Discrepancy[] = [];
  const processedCurrentNames = new Set<string>();
  const classMapCount: Record<string, string[]> = {};

  // Track drug classes in current medications to detect duplicate therapies
  currentMeds.forEach(c => {
    const norm = normalizeDrugName(c.name);
    const dClass = DRUG_CLASSES[norm];
    if (dClass) {
      if (!classMapCount[dClass]) classMapCount[dClass] = [];
      classMapCount[dClass].push(c.name);
    }
  });

  // Check previous records against current records
  previousMeds.forEach((prev, idx) => {
    const prevNorm = normalizeDrugName(prev.name);
    const match = currentMeds.find(curr => normalizeDrugName(curr.name) === prevNorm);

    if (!match) {
      // Medication present in previous, absent in current -> POTENTIAL OMISSION
      discrepancies.push({
        id: `disc-gen-${patientId}-omission-${idx}`,
        patientId,
        medicationName: prev.name,
        genericName: prevNorm.charAt(0).toUpperCase() + prevNorm.slice(1),
        type: 'POTENTIAL_OMISSION',
        severity: 'critical',
        status: 'REQUIRES_REVIEW',
        previousRecord: {
          dosage: prev.dosage,
          frequency: prev.frequency,
          route: prev.route,
          date: prev.date || 'Historical Record',
          source: prev.source,
          prescriber: prev.prescriber,
        },
        currentRecord: null,
        observation: `Medication "${prev.name}" appears on previous active prescription list but is absent from current inpatient orders.`,
        clinicalContext: `Patient was actively prescribed this agent prior to transition. Review required to determine intentional hold vs unintended omission.`,
        suggestedAction: `Verify whether ${prev.name} should be resumed during inpatient stay or if holding therapy was clinically indicated.`,
        potentialRisk: 'Loss of therapeutic disease control due to unrecognized therapy omission.',
      });
    } else {
      processedCurrentNames.add(normalizeDrugName(match.name));

      const doseSame = normalizeDosage(prev.dosage) === normalizeDosage(match.dosage);
      const freqSame = normalizeFrequency(prev.frequency) === normalizeFrequency(match.frequency);
      const routeSame = normalizeRoute(prev.route) === normalizeRoute(match.route);

      if (doseSame && freqSame && routeSame) {
        // UNCHANGED
        discrepancies.push({
          id: `disc-gen-${patientId}-unchanged-${idx}`,
          patientId,
          medicationName: match.name,
          genericName: prevNorm.charAt(0).toUpperCase() + prevNorm.slice(1),
          type: 'UNCHANGED',
          severity: 'success',
          status: 'REVIEWED',
          previousRecord: {
            dosage: prev.dosage,
            frequency: prev.frequency,
            route: prev.route,
            date: prev.date || 'Previous Record',
            source: prev.source,
            prescriber: prev.prescriber,
          },
          currentRecord: {
            dosage: match.dosage,
            frequency: match.frequency,
            route: match.route,
            date: match.date || 'Current Order',
            source: match.source,
            prescriber: match.prescriber,
          },
          observation: 'Exact concordance verified across previous and current medication records.',
          clinicalContext: 'Standard ongoing maintenance therapy confirmed without modification.',
          suggestedAction: 'No clinician action required. Concordance verified.',
        });
      } else if (!routeSame) {
        // ROUTE CHANGE
        discrepancies.push({
          id: `disc-gen-${patientId}-route-${idx}`,
          patientId,
          medicationName: match.name,
          genericName: prevNorm.charAt(0).toUpperCase() + prevNorm.slice(1),
          type: 'ROUTE_CHANGE',
          severity: 'warning',
          status: 'REQUIRES_REVIEW',
          previousRecord: {
            dosage: prev.dosage,
            frequency: prev.frequency,
            route: prev.route,
            date: prev.date || 'Previous Record',
            source: prev.source,
          },
          currentRecord: {
            dosage: match.dosage,
            frequency: match.frequency,
            route: match.route,
            date: match.date || 'Current Order',
            source: match.source,
          },
          observation: `Route of administration changed from ${prev.route} to ${match.route}.`,
          clinicalContext: `Route transition may reflect acute inpatient status (e.g. NPO status, acute IV bioavailability requirements).`,
          suggestedAction: `Confirm clinical rationale for route modification and plan step-down route when oral intake resumes.`,
        });
      } else {
        // DOSE OR FREQUENCY CHANGE
        discrepancies.push({
          id: `disc-gen-${patientId}-dose-${idx}`,
          patientId,
          medicationName: match.name,
          genericName: prevNorm.charAt(0).toUpperCase() + prevNorm.slice(1),
          type: 'DOSE_FREQUENCY_CHANGE',
          severity: 'warning',
          status: 'REQUIRES_REVIEW',
          previousRecord: {
            dosage: prev.dosage,
            frequency: prev.frequency,
            route: prev.route,
            date: prev.date || 'Previous Record',
            source: prev.source,
          },
          currentRecord: {
            dosage: match.dosage,
            frequency: match.frequency,
            route: match.route,
            date: match.date || 'Current Order',
            source: match.source,
          },
          observation: `Dosage or frequency difference detected between previous (${prev.dosage}, ${prev.frequency}) and current (${match.dosage}, ${match.frequency}).`,
          clinicalContext: `May represent intentional dose titration, acute condition adjustment, or scheduling difference.`,
          suggestedAction: `Confirm whether dose/schedule alteration is intentional and aligned with inpatient clinical goals.`,
          potentialRisk: 'Risk of over-dosing or subtherapeutic effect if modification was inadvertent.',
        });
      }
    }
  });

  // Check for newly added current medications
  currentMeds.forEach((curr, idx) => {
    const currNorm = normalizeDrugName(curr.name);
    if (!processedCurrentNames.has(currNorm)) {
      // Check if duplicate class exists
      const dClass = DRUG_CLASSES[currNorm];
      const isDuplicateClass = dClass && classMapCount[dClass] && classMapCount[dClass].length > 1;

      if (isDuplicateClass) {
        discrepancies.push({
          id: `disc-gen-${patientId}-duplicate-${idx}`,
          patientId,
          medicationName: curr.name,
          genericName: currNorm.charAt(0).toUpperCase() + currNorm.slice(1),
          type: 'POSSIBLE_DUPLICATE',
          severity: 'critical',
          status: 'REQUIRES_REVIEW',
          previousRecord: null,
          currentRecord: {
            dosage: curr.dosage,
            frequency: curr.frequency,
            route: curr.route,
            date: curr.date || 'Current Order',
            source: curr.source,
          },
          observation: `Potential duplicate therapy identified in class: ${dClass.replace('_', ' ')}. Concurrent agents: ${classMapCount[dClass].join(', ')}.`,
          clinicalContext: `Co-prescribing multiple agents in the same therapeutic class increases risk of additive adverse reactions and compounding toxicity.`,
          suggestedAction: `Clinical review recommended. Clarify if the order was intended to replace existing class therapy rather than be added concurrently.`,
          potentialRisk: 'Severe cumulative adverse effects or additive toxicity.',
        });
      } else {
        discrepancies.push({
          id: `disc-gen-${patientId}-new-${idx}`,
          patientId,
          medicationName: curr.name,
          genericName: currNorm.charAt(0).toUpperCase() + currNorm.slice(1),
          type: 'NEWLY_ADDED',
          severity: 'info',
          status: 'REQUIRES_REVIEW',
          previousRecord: null,
          currentRecord: {
            dosage: curr.dosage,
            frequency: curr.frequency,
            route: curr.route,
            date: curr.date || 'Current Order',
            source: curr.source,
          },
          observation: `New medication initiated during current encounter; not present in previous outpatient records.`,
          clinicalContext: `New inpatient therapy order initiated for acute symptom management or prophylactic regimen.`,
          suggestedAction: `Confirm clinical indication for new drug start and verify patient allergy clearance.`,
          potentialRisk: 'Potential drug-drug interaction with existing home regimen or unrecorded allergy.',
        });
      }
    }
  });

  return discrepancies;
}
