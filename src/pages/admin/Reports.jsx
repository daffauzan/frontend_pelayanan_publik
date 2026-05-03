import React, { useEffect, useState } from 'react';
import suratService from '../../services/suratService';
import pengaduanService from '../../services/pengaduanService';

const ReportsPage = () => {
  const [report, setReport] = useState({
    totalSurat: 0,
    totalPengaduan: 0,
    suratPending: 0,
    suratCompleted: 0,
    pengaduanPending: 0,
    pengaduanCompleted: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const [suratRes, pengaduanRes] = await Promise.all([
        suratService.getAll(),
        pengaduanService.getAll(),
      ]);

      const suratData = suratRes.data || [];
      const pengaduanData = pengaduanRes.data || [];

      setReport({
        totalSurat: suratData.length,
        totalPengaduan: pengaduanData.length,

        suratPending: suratData.filter(
          (item) => item.status === 'pending'
        ).length,

        suratCompleted: suratData.filter(
          (item) => item.status === 'completed'
        ).length,

        pengaduanPending: pengaduanData.filter(
          (item) => item.status === 'pending'
        ).length,

        pengaduanCompleted: pengaduanData.filter(
          (item) => item.status === 'completed'
        ).length,
      });
    } catch (error) {
      console.error('Gagal memuat laporan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Memuat laporan...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Laporan Sistem</h2>

      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5>Total Surat</h5>
              <h2>{report.totalSurat}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5>Total Pengaduan</h5>
              <h2>{report.totalPengaduan}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-dark">
            <div className="card-body">
              <h5>Total Layanan</h5>
              <h2>
                {report.totalSurat + report.totalPengaduan}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Statistik Surat
            </div>
            <div className="card-body">
              <p>
                Menunggu: <strong>{report.suratPending}</strong>
              </p>
              <p>
                Selesai: <strong>{report.suratCompleted}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Statistik Pengaduan
            </div>
            <div className="card-body">
              <p>
                Menunggu: <strong>{report.pengaduanPending}</strong>
              </p>
              <p>
                Selesai: <strong>{report.pengaduanCompleted}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;