# MediSync AI — Intelligent Medication Reconciliation & Patient Safety Copilot

> **“From scattered medication records to one verified medication story.”**  
> *“MediSync AI doesn't prescribe — it catches what might otherwise be missed.”*

---

## 🌟 Overview & Clinical Value Proposition

**MediSync AI** is a production-grade clinical decision-support platform designed for healthcare professionals to streamline medication reconciliation across complex care transitions (hospital admission, intra-facility transfer, specialist referral, and post-op discharge).

Care transitions are notoriously prone to adverse drug events (ADEs), duplicate therapies, unintentional omissions of chronic maintenance medications, and uncoordinated dose/frequency changes. MediSync AI consolidates multi-source records (outpatient prescriptions, patient-reported intake, and inpatient admission orders), executes deterministic & AI pharmacotherapeutic analysis, and provides clinicians with an intuitive verification and resolution workflow before the final medication plan is published to the chart.

---

## 🚀 Core Features

### 1. Multi-Source Record Consolidation & OCR Parsing
- Parses and normalizes heterogeneous sources:
  - **Previous Outpatient Prescriptions** (Community EMR)
  - **Patient-Reported History** (Pre-admission intake / triage portal)
  - **Current Inpatient Orders** (Hospital order set)
- View raw document excerpts and normalized ingredient rosters in real-time.

### 2. Deterministic & AI Discrepancy Classification Engine
Categorizes every transition variation with clear clinical rationale:
- 🔴 **Potential Omissions**: High-risk chronic medications absent in current orders.
- 🟡 **Dose & Frequency Modifications**: Schedule alterations (e.g. 500mg BID consolidated into 1000mg QD) evaluated for extended-release (ER/XR) bioavailability.
- 🔵 **Newly Added Medications**: Inpatient-initiated therapies cross-referenced against allergy ledgers.
- 🟣 **Therapeutic Duplications**: Automated detection of overlapping pharmacotherapeutic classes (e.g. concurrent dual ACE inhibitors Lisinopril + Enalapril).
- 🟢 **Concordant / Unchanged**: Exact matching items verified across all transition records.

### 3. AI Review Assistant Side-Drawer
- **What Changed?** Clear comparative delta between pre-admission and current orders.
- **Why Was It Flagged?** Mechanism of risk (e.g. GI tolerance, rebound hypertension, AKI risk).
- **Suggested Clinician Action**: Actionable guidance adhering strictly to non-prescriptive clinical decision-support guardrails.
- **Safety Disclaimer**: Prominent verification notices reminding reviewers that prescribing authority remains exclusively with licensed clinicians.

### 4. Interactive Clinician Review & Resolution Workflow
- Review individual discrepancy cards with contextual resolution options (e.g. *Reinstate into inpatient orders*, *Confirm intentional hold*, *Confirm dose titration*).
- One-click **Batch Resolve All** for rapid concordance verification.
- Live dynamic state updates across review progress meters, priority queues, and audit trails.

### 5. Final Reconciliation & Electronic Sign-Off
- Attestation modal with cryptographic signature verification.
- Confetti celebration upon completion.
- Automated publication to patient timeline.

### 6. Official Clinical Medication Reconciliation Report
- Standardized hospital letterhead summary.
- Complete unified active medication roster.
- Full discrepancy resolution audit ledger.
- One-click **Print / Save as PDF** and **Export JSON Audit**.

### 7. "Ask MediSync" Clinical Copilot Drawer
- Docked/floating interactive Q&A assistant indexed directly on active patient data.
- Preset clinical queries: *"Why is Atorvastatin flagged?"*, *"Explain Metformin dose change"*, *"Check potential duplicate therapies"*, *"Cross-check patient allergies"*.

### 8. 2-Minute Hackathon Demo Tour Mode
- Interactive 4-step walkthrough designed for judges to experience the entire workflow in under 2 minutes.

---

## 🩺 Primary Synthetic Demo Scenario

- **Patient**: Ravi Kumar (MRN: `P-10291`)
- **Encounter**: Hospital Admission (Ward 4B - Bed 12)
- **Primary Diagnosis**: Type 2 Diabetes Mellitus with Acute Glycemic Fluctuation & Essential Hypertension
- **Transition Delta**:
  1. **Metformin**: Outpatient `500 mg BID` → Inpatient `1000 mg QD` (Dose/Frequency modified — verified as ER formulation).
  2. **Atorvastatin**: Outpatient `20 mg QPM` → Inpatient `Not Found` (Critical omission flagged → reinstated).
  3. **Aspirin**: Inpatient `75 mg QD` (Newly added for acute vascular prophylaxis).
  4. **Amlodipine**: `5 mg QD` (Concordant across all sources).

---

## 🛠️ Technology Stack & Architecture

- **Frontend Core**: React 18, TypeScript, Vite
- **Design System**: Vanilla CSS Custom Properties (Sleek Midnight Navy `#0B132B`, Clinical Cyan `#0284C7`, Restrained Semantic Accents, Inter Typography)
- **Icons & Micro-Interactions**: Lucide React, Canvas Confetti
- **State Management**: Reactive React Context with live multi-patient dynamic updating
- **Reconciliation Engine**: Normalization heuristics, Bioequivalence matching, Drug-class duplicate detection

---

## 🏃 Getting Started Locally

```bash
# Clone the repository
git clone <repo-url>
cd ReconRx

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Visit `http://localhost:5173/` in your browser. Click **"Continue with Instant Demo Mode"** to test the platform.

---

## ⚖️ Clinical Safety & Compliance Disclaimer

*MediSync AI is developed as a clinical decision-support hackathon MVP using synthetic patient data. It does not prescribe, modify, or discontinue medications independently. All clinical decisions remain exclusively with licensed healthcare professionals.*
