import { useEffect, useState, FormEvent } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../axiosInstance';
import { Claim } from '../types';

const AdminPanel = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [policyForm, setPolicyForm] = useState({
    policyHolderId: '', policyNumber: '', coverageAmount: '',
    premiumAmount: '', startDate: '', endDate: '',
  });
  const [policyLoading, setPolicyLoading] = useState(false);
  const [policyError, setPolicyError] = useState('');
  const [policySuccess, setPolicySuccess] = useState('');

  useEffect(() => {
    fetchPendingClaims();
  }, []);

  const fetchPendingClaims = async () => {
    setLoadingClaims(true);
    try {
      const res = await axiosInstance.get('/claims/pending');
      setClaims(res.data);
    } catch {
      setError('Failed to load pending claims.');
    } finally {
      setLoadingClaims(false);
    }
  };

  const handleStatus = async (claimId: string, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading(claimId + status);
    setError('');
    setSuccess('');
    try {
      await axiosInstance.patch(`/claims/${claimId}/status`, { claimStatus: status });
      setSuccess(`Claim ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully.`);
      setClaims(prev => prev.filter(c => c.claimId !== claimId));
    } catch {
      setError('Failed to update claim status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddPolicy = async (e: FormEvent) => {
    e.preventDefault();
    setPolicyError('');
    setPolicySuccess('');
    setPolicyLoading(true);
    try {
      await axiosInstance.post('/policies/add', {
        ...policyForm,
        coverageAmount: parseFloat(policyForm.coverageAmount),
        premiumAmount: parseFloat(policyForm.premiumAmount),
      });
      setPolicySuccess('Policy added successfully!');
      setPolicyForm({ policyHolderId: '', policyNumber: '', coverageAmount: '', premiumAmount: '', startDate: '', endDate: '' });
    } catch (err: any) {
      setPolicyError(err.response?.data?.message || 'Failed to add policy.');
    } finally {
      setPolicyLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Panel</h1>
            <p className="page-subtitle">Manage claims and policies</p>
          </div>
          <div className="admin-badge">⚙ Administrator</div>
        </div>

        {/* Pending Claims */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Pending Claims</h2>
            <span className="section-count pending">{claims.length}</span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {loadingClaims ? (
            <div className="loading-state"><div className="spinner-large" /><p>Loading claims…</p></div>
          ) : claims.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <p>No pending claims. All caught up!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Claim No.</th>
                    <th>Policy ID</th>
                    <th>Holder ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map(c => (
                    <tr key={c.claimId}>
                      <td className="mono">{c.claimNumber}</td>
                      <td className="mono text-sm">{c.policyId}</td>
                      <td className="mono text-sm">{c.policyHolderId}</td>
                      <td>{c.claimDate}</td>
                      <td>₹{c.claimAmount.toLocaleString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleStatus(c.claimId, 'APPROVED')}
                            disabled={!!actionLoading}
                          >
                            {actionLoading === c.claimId + 'APPROVED' ? <span className="spinner-sm" /> : '✓ Approve'}
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleStatus(c.claimId, 'REJECTED')}
                            disabled={!!actionLoading}
                          >
                            {actionLoading === c.claimId + 'REJECTED' ? <span className="spinner-sm" /> : '✕ Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Add Policy */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Add New Policy</h2>
          </div>
          <div className="form-card">
            {policyError && <div className="alert alert-error">{policyError}</div>}
            {policySuccess && <div className="alert alert-success">{policySuccess}</div>}
            <form onSubmit={handleAddPolicy} className="auth-form">
              <div className="form-grid-2">
                <div className="form-group form-full">
                  <label className="form-label">Policyholder ID</label>
                  <input
                    type="text"
                    className="form-input mono"
                    placeholder="MongoDB ObjectId of the policyholder"
                    value={policyForm.policyHolderId}
                    onChange={e => setPolicyForm(p => ({ ...p, policyHolderId: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Policy Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. POL-2024-001 (auto if blank)"
                    value={policyForm.policyNumber}
                    onChange={e => setPolicyForm(p => ({ ...p, policyNumber: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Coverage Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="500000"
                    value={policyForm.coverageAmount}
                    onChange={e => setPolicyForm(p => ({ ...p, coverageAmount: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Premium Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="12000"
                    value={policyForm.premiumAmount}
                    onChange={e => setPolicyForm(p => ({ ...p, premiumAmount: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={policyForm.startDate}
                    onChange={e => setPolicyForm(p => ({ ...p, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={policyForm.endDate}
                    onChange={e => setPolicyForm(p => ({ ...p, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={policyLoading}>
                {policyLoading ? <span className="spinner" /> : '+ Add Policy'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
