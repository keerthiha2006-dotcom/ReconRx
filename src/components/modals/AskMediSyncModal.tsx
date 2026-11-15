import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { queryAskMediSync, AIResponse } from '../../services/aiAssistant';
import {
  X,
  Sparkles,
  Send,
  ShieldCheck,
  Bot,
  User,
  Stethoscope,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  action?: string;
  references?: string[];
  disclaimer?: string;
  timestamp: string;
}

export const AskMediSyncModal: React.FC = () => {
  const {
    activeModal,
    closeAllModals,
    selectedPatient,
    discrepancies,
    medications,
    selectedPatientId,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello, I'm your **MediSync AI Clinical Copilot**. I am currently indexed on **${selectedPatient?.name || 'the patient'}**'s transition records for **${selectedPatient?.encounterType || 'this encounter'}**.\n\nAsk me about any flagged discrepancy, dosage equivalence, allergy cross-checks, or reconciliation progress.`,
      disclaimer: 'MediSync AI is a clinical decision-support copilot. Final prescribing decisions remain with the healthcare provider.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (activeModal !== 'ask_medisync' || !selectedPatient) return null;

  const patientDiscs = discrepancies[selectedPatientId] || [];
  const patientMeds = medications[selectedPatientId] || [];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Query AI assistant
    setTimeout(() => {
      const response: AIResponse = queryAskMediSync(query, selectedPatient, patientDiscs, patientMeds);
      const assistantMsg: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        action: response.suggestedAction,
        references: response.sourceReferences,
        disclaimer: response.safetyDisclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 350);
  };

  const quickQuestions = [
    'Why is Atorvastatin flagged?',
    'Explain Metformin dose change',
    'Check potential duplicate therapies',
    'Cross-check patient allergies with current orders',
    'Summarize current reconciliation progress',
  ];

  return (
    <>
      <div className="modal-overlay" onClick={closeAllModals} />
      <div className="drawer-container" style={{ width: 560 }}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #0284C7, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Ask MediSync Copilot</div>
              <div style={{ fontSize: 11, color: '#38BDF8' }}>Patient: {selectedPatient.name} ({selectedPatient.mrn})</div>
            </div>
          </div>
          <button onClick={closeAllModals} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Chat History */}
        <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(m => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-faint)' }}>
                {m.sender === 'user' ? <User size={12} /> : <Bot size={12} color="#0284C7" />}
                <span>{m.sender === 'user' ? 'You' : 'MediSync AI'}</span>
                <span>• {m.timestamp}</span>
              </div>

              <div
                style={{
                  maxWidth: '92%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  background: m.sender === 'user' ? '#0F172A' : '#F1F5F9',
                  color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: 13,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                }}
              >
                {m.text}

                {/* Suggested review action box */}
                {m.action && (
                  <div style={{ marginTop: 10, padding: '8px 12px', background: '#E0F2FE', border: '1px solid #BAE6FD', borderRadius: 'var(--radius-md)', color: '#0369A1', fontSize: 12 }}>
                    <strong>Recommended Action:</strong> {m.action}
                  </div>
                )}

                {/* Sources */}
                {m.references && m.references.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                    <strong>Sources:</strong> {m.references.join(' | ')}
                  </div>
                )}

                {/* Disclaimer */}
                {m.disclaimer && (
                  <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--border-subtle)', fontSize: 10.5, color: 'var(--text-faint)' }}>
                    {m.disclaimer}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div style={{ padding: '8px 16px', background: 'var(--bg-surface-subtle)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 6, overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              style={{
                fontSize: 11.5,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'white',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <HelpCircle size={11} color="#0284C7" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Chat Input Footer */}
        <div className="drawer-footer">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: 8 }}
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about medications, dosages, omissions..."
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-medium)',
                outline: 'none',
                fontSize: 13,
              }}
            />
            <button
              type="submit"
              className="btn btn-accent btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '0 16px' }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
