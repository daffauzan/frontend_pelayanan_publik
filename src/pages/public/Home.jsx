import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">
          Sistem Pelayanan Desa Digital
        </h1>
        <p className="lead mt-3">
          Pengajuan surat, dan pengaduan masyarakat, dalam satu platform.
        </p>

        <div className="mt-4">
          <Link to="/register" className="btn btn-primary btn-lg me-3">
            Daftar Sekarang
          </Link>

          <Link to="/login" className="btn btn-outline-primary btn-lg">
            Masuk
          </Link>
        </div>
      </div>

      <div className="row g-4 mt-5">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h3>Pengajuan Surat</h3>
              <p>
                Ajukan berbagai jenis surat administrasi secara online
                tanpa harus datang langsung ke kantor desa.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h3>Pengaduan Masyarakat</h3>
              <p>
                Sampaikan aspirasi, kritik, dan laporan dengan cepat,
                aman, dan transparan.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h3>Tracking Layanan</h3>
              <p>
                Pantau status pengajuan surat maupun pengaduan secara
                real-time kapan saja.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

