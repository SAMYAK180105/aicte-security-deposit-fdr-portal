import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileCheck2,
  CheckSquare,
  RefreshCw,
  Building,
  BarChart3,
  History,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  onOpenNewFDR: () => void;
}

export const Sidebar: React.FC<Props> = ({ onOpenNewFDR }) => {
  const { user } = useAuth();

  const navItems = [
    {
      to: '/',
      label: 'Executive Dashboard',
      icon: <LayoutDashboard size={18} />,
      roles: ['system_admin', 'aicte_officer', 'bank_officer', 'institution_admin', 'auditor'],
    },
    {
      to: '/fdrs',
      label: 'FDR Depository',
      icon: <FileCheck2 size={18} />,
      roles: ['system_admin', 'aicte_officer', 'bank_officer', 'institution_admin', 'auditor'],
    },
    {
      to: '/verification',
      label: '3-Way Verification Desk',
      icon: <CheckSquare size={18} />,
      badge: 'Live',
      roles: ['system_admin', 'aicte_officer', 'bank_officer'],
    },
    {
      to: '/lifecycle',
      label: 'Lifecycle & Renewals',
      icon: <RefreshCw size={18} />,
      roles: ['system_admin', 'aicte_officer', 'institution_admin', 'auditor'],
    },
    {
      to: '/institutions',
      label: 'Approved Institutions',
      icon: <Building size={18} />,
      roles: ['system_admin', 'aicte_officer', 'auditor'],
    },
    {
      to: '/reports',
      label: 'Compliance Reports',
      icon: <BarChart3 size={18} />,
      roles: ['system_admin', 'aicte_officer', 'auditor'],
    },
    {
      to: '/audit',
      label: 'Regulatory Audit Log',
      icon: <History size={18} />,
      roles: ['system_admin', 'auditor'],
    },
  ];

  const allowedNav = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1e293b',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '1.5rem 1.25rem' }}>
        {/* New FDR Action Button */}
        {(user?.role === 'institution_admin' || user?.role === 'system_admin' || user?.role === 'aicte_officer') && (
          <button
            onClick={onOpenNewFDR}
            className="btn btn-saffron"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.875rem',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
            }}
          >
            <PlusCircle size={18} />
            <span>Submit New FDR</span>
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#64748b',
            padding: '0.5rem 0.75rem',
          }}
        >
          Navigation
        </div>

        {allowedNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.6875rem 0.875rem',
              borderRadius: '8px',
              color: isActive ? '#ffffff' : '#94a3b8',
              backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.15s ease',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '4px',
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Regulatory Badge */}
      <div
        style={{
          margin: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <ShieldAlert size={16} color="#f97316" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f1f5f9' }}>
            APH Regulations
          </span>
        </div>
        <div style={{ fontSize: '0.6875rem', color: '#94a3b8', lineHeight: 1.4 }}>
          Joint FDR with AICTE Regional Officer & mandatory auto-renewal compliance.
        </div>
      </div>
    </aside>
  );
};
