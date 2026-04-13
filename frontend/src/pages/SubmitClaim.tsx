import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosInstance from '../axiosInstance';
import { Policy } from '../types';

const SubmitClaim = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [form, setForm] = useState({ policyId: '', claimAmount: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('/policies/my')
      .then(res => setPolicies(res.data))
      .catch(() => setError('Failed to load policies.'));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.policyId) { setError('Please select a policy.'); return; }
    if (!form.claimAmount || Number(form.claimAmount) <= 0) { setError('Enter a valid claim amount.'); return; }
    setLoading(true);
    try {
      await axiosInstance.post('/claims/submit', {
        policyId: form.policyId,
        claimAmount: parseFloat(form.claimAmount),
        description: form.description,
      });
      setSuccess('Claim submitted successfully! Redirecting…');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPolicy = policies.find(p => p.policyId === form.policyId);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Submit a Claim</h1>
            <p className="page-subtitle">File a new insurance claim against your policy</p>
          </div>
        </div>

        <div className="form-page-layout">
          <div className="form-card">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Select Policy</label>
                <select
                  className="form-input"
                  value={form.policyId}
                  onChange={e => setForm(prev => ({ ...prev, policyId: e.target.value }))}
                  required
                >
                  <option value="">— Choose a policy —</option>
                  {policies.map(p => (
                    <option key={p.policyId} value={p.policyId}>
                      {p.policyNumber} — Coverage: ₹{p.coverageAmount.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPolicy && (
                <div className="policy-preview">
                  <div className="policy-preview-row">
                    <span>Policy Number</span><span className="mono">{selectedPolicy.policyNumber}</span>
                  </div>
                  <div className="policy-preview-row">
                    <span>Coverage Amount</span><span>₹{selectedPolicy.coverageAmount.toLocaleString()}</span>
                  </div>
                  <div className="policy-preview-row">
                    <span>Premium</span><span>₹{selectedPolicy.premiumAmount.toLocaleString()}</span>
                  </div>
                  <div className="policy-preview-row">
                    <span>Valid Until</span><span>{selectedPolicy.endDate}</span>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Claim Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter amount"
                  min="1"
                  value={form.claimAmount}
                  onChange={e => setForm(prev => ({ ...prev, claimAmount: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Describe the reason for this claim…"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Submit Claim'}
              </button>
            </form>
          </div>

          <div className="info-panel">
            <h3 className="info-panel-title">How it works</h3>
            <div className="info-step">
              <div className="info-step-num">1</div>
              <div>
                <strong>Select your policy</strong>
                <p>Choose the policy you want to file a claim against.</p>
              </div>
            </div>
            <div className="info-step">
              <div className="info-step-num">2</div>
              <div>
                <strong>Enter claim details</strong>
                <p>Specify the amount and describe the reason for the claim.</p>
              </div>
            </div>
            <div className="info-step">
              <div className="info-step-num">3</div>
              <div>
                <strong>Wait for review</strong>
                <p>Your claim will be reviewed by an admin and approved or rejected.</p>
              </div>
            </div>
            <div className="info-step">
              <div className="info-step-num">4</div>
              <div>
                <strong>Receive payment</strong>
                <p>On approval, payment is automatically initiated to your account.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitClaim;
