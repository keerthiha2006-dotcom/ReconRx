import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badges';
import {
  Users,
  Search,
  Filter,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const {
    patients,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterEncounter,
    setFilterEncounter,
    selectPatient,
    setRoute,
  } = useApp();

  // Filter patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.encounterType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesEncounter = filterEncounter === 'All' || p.encounterType === filterEncounter;

    return matchesSearch && matchesStatus && matchesEncounter;
  });

  const statusOptions = ['All', 'Needs Review', 'In Progress', 'Completed'];
  const encounterOptions = ['All', 'Hospital Admission', 'Cardiac Care Transfer', 'Surgical Discharge', 'Referral'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            Patient Care Directory
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Manage care transitions and medication reconciliation worklists across departments.
          </p>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> patients
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginRight: 4 }}>Status:</span>
          {statusOptions.map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: filterStatus === st ? '1px solid #0284C7' : '1px solid var(--border-subtle)',
                background: filterStatus === st ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                color: filterStatus === st ? '#0284C7' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Encounter Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} color="var(--text-muted)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Encounter:</span>
          <select
            value={filterEncounter}
            onChange={(e) => setFilterEncounter(e.target.value)}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              background: 'white',
              fontSize: 12.5,
              outline: 'none',
            }}
          >
            {encounterOptions.map(enc => (
              <option key={enc} value={enc}>{enc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>MRN / ID</th>
              <th>Transition Encounter</th>
              <th>Attending Physician</th>
              <th>Medications</th>
              <th>Discrepancies</th>
              <th>Priority</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                  No patients match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredPatients.map(p => (
                <tr
                  key={p.id}
                  onClick={() => {
                    selectPatient(p.id);
                    setRoute(`/patients/${p.id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.age}y {p.gender} • {p.room}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {p.mrn}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{p.encounterType}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Admitted: {new Date(p.admissionDate).toLocaleDateString()}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{p.attendingPhysician}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{p.medicationCount} meds</span>
                  </td>
                  <td>
                    {p.discrepancyCount > 0 ? (
                      <span style={{ color: '#EF4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={13} /> {p.discrepancyCount} flagged
                      </span>
                    ) : (
                      <span style={{ color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={13} /> Concordant
                      </span>
                    )}
                  </td>
                  <td>
                    <PriorityBadge priority={p.priority} />
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectPatient(p.id);
                          setRoute(`/reconciliation/${p.id}`);
                        }}
                        className="btn btn-accent btn-sm"
                        style={{ fontSize: 11.5 }}
                      >
                        Reconcile
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectPatient(p.id);
                          setRoute(`/patients/${p.id}`);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="Patient Workspace"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
