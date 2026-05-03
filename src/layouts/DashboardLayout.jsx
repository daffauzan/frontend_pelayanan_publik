import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserRole } from '../utils/modelMapper';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = getUserRole(user);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-md-3 col-lg-2 bg-dark text-white min-vh-100 p-3">
          <h4 className="mb-4">Pelayanan Desa</h4>

          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to={`/${role}/dashboard`}
              >
                Dashboard
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to={`/${role}/surat`}
              >
                Surat
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to={`/${role}/pengaduan`}
              >
                Pengaduan
              </Link>
            </li>

            {role === 'user' && (
              <li className="nav-item mb-2">
                <Link
                  className="nav-link text-white"
                  to="/user/profile"
                >
                  Profile
                </Link>
              </li>
            )}

            {role === 'admin' && (
              <li className="nav-item mb-2">
                <Link
                  className="nav-link text-white"
                  to="/admin/tracking"
                >
                  Tracking
                </Link>
              </li>
            )}

            <li className="nav-item mt-4">
              <button
                className="btn btn-danger w-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </aside>

        <main className="col-md-9 col-lg-10 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;