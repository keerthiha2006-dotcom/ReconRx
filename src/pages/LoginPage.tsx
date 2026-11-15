import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  HeartPulse,
  BrainCircuit,
  FileCheck2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAsDemo, setRoute } = useApp();
  const [email, setEmail] = useState('ananya.sharma@medisync.health');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'Clinical Reviewer' | 'Healthcare Professional' | 'Demo Mode'>('Clinical Reviewer');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsDemo();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 1fr', background: '#0B132B' }}>
      {/* Left Branding Hero */}
      <div
        style={{
          padding: '60px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, #0B132B 0%, #162544 50%, #0F172A 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow circle */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #0284C7, #0D9488)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
              }}
            >
              <Stethoscope size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                MediSync AI
              </h1>
              <span style={{ fontSize: 11, color: '#38BDF8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Patient Safety Copilot
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, maxWidth: 520, marginBottom: 16 }}>
            From scattered medication records to <span style={{ color: '#38BDF8', background: 'linear-gradient(90deg, #38BDF8, #2DD4BF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>one verified medication story</span>.
          </h2>

          <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.6, maxWidth: 480, marginBottom: 36 }}>
            “MediSync AI doesn't prescribe — it catches what might otherwise be missed.” Empowering clinicians across hospital admissions, transfers, referrals, and discharges.
          </p>

          {/* Value Props */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
                <BrainCircuit size={16} />
              </div>
              <span style={{ color: '#CBD5E1', fontSize: 13.5 }}>Multi-source normalization & dosage equivalence cross-check</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
                <ShieldCheck size={16} />
              </div>
              <span style={{ color: '#CBD5E1', fontSize: 13.5 }}>Automatic detection of omissions, frequency changes & duplicate therapies</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' }}>
                <FileCheck2 size={16} />
              </div>
              <span style={{ color: '#CBD5E1', fontSize: 13.5 }}>Clinician-in-the-loop review workflow & electronic sign-off ledger</span>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <ShieldCheck size={16} color="#10B981" />
          <span style={{ fontSize: 11.5, color: '#94A3B8' }}>
            Clinical Decision Support System • Synthetic Demo Patient Environment
          </span>
        </div>
      </div>

      {/* Right Login Card */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 440,
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            padding: 36,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
              Clinician Sign In
            </h3>
            <p style={{ fontSize: 13, color: '#64748B' }}>
              Access your clinical reconciliation queue and patient records.
            </p>
          </div>

          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Workplace Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Password / SSO Token
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            {/* Role Select */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Clinical Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  fontSize: 13,
                  background: 'white',
                  outline: 'none',
                }}
              >
                <option value="Clinical Reviewer">Clinical Reviewer (Dr. Ananya Sharma)</option>
                <option value="Healthcare Professional">Healthcare Professional / Attending</option>
                <option value="Demo Mode">Hackathon Judge / Demo Mode</option>
              </select>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 8 }}
            >
              Sign In to Workspace
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            {/* One-Click Hackathon Demo Mode */}
            <button
              type="button"
              onClick={loginAsDemo}
              className="btn btn-accent btn-lg"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Sparkles size={16} />
              <span>Continue with Instant Demo Mode</span>
            </button>
          </form>

          {/* Quick Notice */}
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11.5, color: '#94A3B8' }}>
            Demo environment seeded with synthetic patient scenarios.
          </div>
        </div>
      </div>
    </div>
  );
};
