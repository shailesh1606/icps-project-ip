import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem('name') || 'User';
  const role = localStorage.getItem('role') || '';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { to: '/submit-claim', label: 'Submit Claim', icon: '✦', roles: ['POLICYHOLDER'] },
    { to: '/admin', label: 'Admin Panel', icon: '⚙', roles: ['ADMIN'] },
  ].filter(link => !link.roles || link.roles.includes(role));

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
            <path d="M12 20 L20 12 L28 20 L20 28 Z" fill="currentColor" opacity="0.3" />
            <path d="M20 8 L20 32 M8 20 L32 20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <div className="brand-title">ICPS</div>
          <div className="brand-sub">Insurance Portal</div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{name.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <div className="user-name">{name}</div>
          <div className={`user-role role-${role.toLowerCase()}`}>{role}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} className="logout-btn">
        <span>↩</span>
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Navbar;
