import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../axiosInstance';
import { Policy, Claim } from '../types';

const statusColors: Record<string, string> = {
  PENDING: 'badge-pending',
  APPROVED: 'badge-approved',
  REJECTED: 'badge-rejected',
};

const Dashboard = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem('name') || 'User';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axiosInstance.get('http://localhost:8082/policies/my'),
          axiosInstance.get('http://localhost:8082/claims/my'),
        ]);
        setPolicies(pRes.data);
        setClaims(cRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCoverage = policies.reduce((sum, p) => sum + p.coverageAmount, 0);
  const totalClaims = claims.length;
  const approvedClaims = claims.filter(c => c.claimStatus === 'APPROVED').length;

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {name}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">◈</div>
            <div className="stat-value">{policies.length}</div>
            <div className="stat-label">Active Policies</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">₹</div>
            <div className="stat-value">₹{totalCoverage.toLocaleString()}</div>
            <div className="stat-label">Total Coverage</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">⊕</div>
            <div className="stat-value">{totalClaims}</div>
            <div className="stat-label">Total Claims</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-teal">✓</div>
            <div className="stat-value">{approvedClaims}</div>
            <div className="stat-label">Approved Claims</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner-large" />
            <p>Loading your data…</p>
          </div>
        ) : (
          <>
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">My Policies</h2>
                <span className="section-count">{policies.length}</span>
              </div>
              {policies.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">◈</div>
                  <p>No policies assigned yet.</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {policies.map(p => (
                    <div key={p.policyId} className="policy-card">
                      <div className="policy-card-header">
                        <span className="policy-number">{p.policyNumber}</span>
                        <span className="badge badge-active">Active</span>
                      </div>
                      <div className="policy-amounts">
                        <div>
                          <div className="amount-label">Coverage</div>
                          <div className="amount-value">₹{p.coverageAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="amount-label">Premium</div>
                          <div className="amount-value">₹{p.premiumAmount.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="policy-dates">
                        <span>📅 {p.startDate}</span>
                        <span>→</span>
                        <span>{p.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="section">
              <div className="section-header">
                <h2 className="section-title">My Claims</h2>
                <span className="section-count">{claims.length}</span>
              </div>
              {claims.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">⊕</div>
                  <p>No claims submitted yet.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Claim No.</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map(c => (
                        <tr key={c.claimId}>
                          <td className="mono">{c.claimNumber}</td>
                          <td>{c.claimDate}</td>
                          <td>₹{c.claimAmount.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${statusColors[c.claimStatus] || 'badge-pending'}`}>
                              {c.claimStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
