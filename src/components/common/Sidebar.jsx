import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-dark text-white min-vh-100 p-3">
      <h4>Dashboard</h4>

      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <Link
            className="nav-link text-white"
            to={`/${user.role}/dashboard`}
          >
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link text-white"
            to={`/${user.role}/surat`}
          >
            Surat
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link text-white"
            to={`/${user.role}/pengaduan`}
          >
            Pengaduan
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link text-white"
            to={`/${user.role}/tracking`}
          >
            Tracking
          </Link>
        </li>

        {user.role === 'admin' && (
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/admin/users"
            >
              Kelola User
            </Link>
          </li>
        )}

        <li className="nav-item mt-4">
          <button
            className="btn btn-danger w-100"
            onClick={logout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;