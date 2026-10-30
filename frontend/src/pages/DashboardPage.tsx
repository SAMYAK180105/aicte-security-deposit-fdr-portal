import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardStats, FDR } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  FileCheck,
  IndianRupee,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface Props {
  onOpenFDR: (fdr: FDR) => void;
  onOpenNewFDR: () => void;
}

export const DashboardPage: React.FC<Props> = ({ onOpenFDR, onOpenNewFDR }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [maturityAlerts, setMaturityAlerts] = useState<FDR[]>([]);
  const [recentFDRs, setRecentFDRs] = useState<FDR[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, alertsData, fdrsData] = await Promise.all([
        api.getDashboardStats(),
        api.getMaturityAlerts(90),
        api.getFDRs({ limit: 5 }),
      ]);
      setStats(statsData);
      setMaturityAlerts(alertsData);
      setRecentFDRs(fdrsData.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatLakhsCrores = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <RefreshCw size={32} className="spin" color="#1e40af" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading Centralized FDR Depository Metrics...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Top Banner & Quick Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Executive Regulatory Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Comprehensive overview of institutional fixed deposit receipts, lien records, and maturity lifecycles.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={loadData} className="btn btn-outline btn-sm">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button onClick={onOpenNewFDR} className="btn btn-saffron btn-sm">
            <PlusCircle size={14} />
            <span>Submit FDR</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card blue">
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Active Security Deposits
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              {stats?.active_fdrs ?? 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '0.25rem' }}>
              Out of {stats?.total_fdrs ?? 0} Total Deposited
            </div>
          </div>
          <div style={{ padding: '0.625rem', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <FileCheck size={24} />
          </div>
        </div>

        <div className="stat-card green">
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Total Lien Marked Corpus
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              {formatLakhsCrores(stats?.total_active_amount ?? 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              Across {stats?.institutions_count ?? 0} Institutions
            </div>
          </div>
          <div style={{ padding: '0.625rem', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669' }}>
            <IndianRupee size={24} />
          </div>
        </div>

        <div className="stat-card amber">
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Pending 3-Way Verifications
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              {stats?.pending_verification ?? 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: '0.25rem' }}>
              {stats?.discrepancy_count ?? 0} Discrepancies Flagged
            </div>
          </div>
          <div style={{ padding: '0.625rem', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card saffron">
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Maturity Pipeline (&lt;90 Days)
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              {(stats?.maturing_30_days ?? 0) + (stats?.maturing_60_days ?? 0) + (stats?.maturing_90_days ?? 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: 600, marginTop: '0.25rem' }}>
              {stats?.maturing_30_days ?? 0} within 30 days!
            </div>
          </div>
          <div style={{ padding: '0.625rem', borderRadius: '10px', backgroundColor: '#fff7ed', color: '#ea580c' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Critical Maturity Pipeline Alert Strip */}
      {maturityAlerts.length > 0 && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1.25rem',
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="#ea580c" />
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#9a3412' }}>
                FDRs Approaching Maturity Requiring Renewal / Release
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c2410c' }}>
              Automated Reminders Dispatched
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {maturityAlerts.slice(0, 4).map((fdr) => (
              <div
                key={fdr.id}
                onClick={() => onOpenFDR(fdr)}
                style={{
                  background: '#ffffff',
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #fed7aa',
                  minWidth: '260px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                    {fdr.fdr_number}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '4px',
                    }}
                  >
                    Due: {fdr.maturity_date}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {fdr.institution?.name}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
                  ₹{fdr.deposit_amount.toLocaleString('en-IN')} ({fdr.issuing_bank})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Bank Distribution & Recent Activity */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Bank Wise Distribution */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              Deposit Distribution by Issuing Bank
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Scheduled Commercial Banks</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.bank_distribution &&
              Object.entries(stats.bank_distribution).map(([bank, count]) => {
                const total = stats.total_fdrs || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={bank}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{bank}</span>
                      <span style={{ color: '#64748b' }}>
                        {count} FDRs ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '4px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: '#2563eb',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              AICTE Regional Office Breakup
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Statutory Jurisdiction</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.region_distribution &&
              Object.entries(stats.region_distribution).map(([region, count]) => {
                const total = stats.total_fdrs || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={region}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{region} Region</span>
                      <span style={{ color: '#64748b' }}>
                        {count} FDRs ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '4px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: '#f97316',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recent Deposits Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
              Recently Logged Security Deposits
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Real-time audit records from institutional submissions and bank endorsements.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = '/fdrs')}
            className="btn btn-outline btn-sm"
          >
            <span>View All FDRs</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>FDR Number</th>
                <th>Institution</th>
                <th>Bank & Branch</th>
                <th>Amount</th>
                <th>Maturity Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentFDRs.map((fdr) => (
                <tr key={fdr.id}>
                  <td>
                    <code>{fdr.fdr_record_id}</code>
                  </td>
                  <td style={{ fontWeight: 700, color: '#1e293b' }}>{fdr.fdr_number}</td>
                  <td>{fdr.institution?.name || 'N/A'}</td>
                  <td>
                    {fdr.issuing_bank}
                    <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{fdr.bank_branch}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>
                    ₹{fdr.deposit_amount.toLocaleString('en-IN')}
                  </td>
                  <td>{fdr.maturity_date}</td>
                  <td>
                    <StatusBadge status={fdr.status} size="sm" />
                  </td>
                  <td>
                    <button
                      onClick={() => onOpenFDR(fdr)}
                      className="btn btn-outline btn-sm"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
