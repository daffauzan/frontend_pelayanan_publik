import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    noTelp: '',
    alamat: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authService.register(form);
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <section className="auth-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-7">
            <div className="card auth-card">
              <div className="card-body p-4 p-md-5">
                <h2 className="fw-bold mb-2">Buat Akun Baru</h2>
                <p className="text-muted mb-4">
                  Lengkapi data berikut untuk mulai menggunakan layanan.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="nama" className="form-label">
                        Nama Lengkap
                      </label>
                      <input
                        id="nama"
                        name="nama"
                        className="form-control"
                        placeholder="Masukkan nama lengkap"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="nama@email.com"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Minimal 8 karakter"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="noTelp" className="form-label">
                        No. Telepon
                      </label>
                      <input
                        id="noTelp"
                        name="noTelp"
                        className="form-control"
                        placeholder="08xxxxxxxxxx"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="alamat" className="form-label">
                        Alamat
                      </label>
                      <textarea
                        id="alamat"
                        name="alamat"
                        className="form-control"
                        placeholder="Masukkan alamat lengkap"
                        rows="3"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-4">
                    Daftar
                  </button>
                </form>

                <p className="text-center text-muted mt-4 mb-0">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="fw-semibold">
                    Login di sini
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

export default RegisterPage;