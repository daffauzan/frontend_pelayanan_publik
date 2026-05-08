import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getUserRole } from '../../utils/modelMapper';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const fromPath = location.state?.from?.pathname;

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(form);

      const role = getUserRole(response.data?.user || response.user);
      const defaultPath = role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      const targetPath = fromPath || defaultPath;

      navigate(targetPath, { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <section className="auth-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card auth-card">
              <div className="card-body p-4 p-md-5">
                <h2 className="fw-bold mb-2">Masuk Akun</h2>
                <p className="text-muted mb-4">
                  Silakan login untuk mengakses layanan desa.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="nama@email.com"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Masukkan password"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>

                <p className="text-center text-muted mt-4 mb-0">
                  Belum punya akun?{' '}
                  <Link to="/register" className="fw-semibold">
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;