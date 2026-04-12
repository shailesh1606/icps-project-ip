import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const Field = ({ name, label, type = 'text', placeholder = '', value, onChange }: FieldProps) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      type={type}
      name={name}
      className="form-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    street: '', city: '', state: '', pincode: '',
    aadhaarNo: '', dob: '', gender: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8081/auth/register', form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-logo">
            <svg viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="2" />
              <path d="M15 25 L25 15 L35 25 L25 35 Z" fill="currentColor" opacity="0.25" />
              <path d="M25 10 L25 40 M10 25 L40 25" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register as a new policyholder</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-section-title">Personal Information</div>
          <div className="form-grid-2">
            <Field name="name" label="Full Name" placeholder="John Doe" value={form.name} onChange={handleChange} />
            <Field name="email" label="Email Address" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
            <Field name="password" label="Password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            <Field name="phone" label="Phone Number" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
            <Field name="dob" label="Date of Birth" type="date" value={form.dob} onChange={handleChange} />
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-input" value={form.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <Field name="aadhaarNo" label="Aadhaar Number" placeholder="XXXX XXXX XXXX" value={form.aadhaarNo} onChange={handleChange} />
          </div>

          <div className="form-section-title">Address Details</div>
          <div className="form-grid-2">
            <div className="form-group form-full">
              <label className="form-label">Street Address</label>
              <input type="text" name="street" className="form-input" placeholder="123 Main Street" value={form.street} onChange={handleChange} required />
            </div>
            <Field name="city" label="City" placeholder="Mumbai" value={form.city} onChange={handleChange} />
            <Field name="state" label="State" placeholder="Maharashtra" value={form.state} onChange={handleChange} />
            <Field name="pincode" label="Pincode" placeholder="400001" value={form.pincode} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
