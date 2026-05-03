import { useEffect, useState } from 'react';
import suratService from '../../services/suratService';
import pengaduanService from '../../services/pengaduanService';
import trackingService from '../../services/trackingService';
import { pickField } from '../../utils/modelMapper';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalSurat: 0,
    suratPending: 0,
    totalPengaduan: 0,
    pengaduanOpen: 0,
  });
  const [recentTracking, setRecentTracking] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [suratRes, pengaduanRes] = await Promise.all([
          suratService.getAllAdmin(),
          pengaduanService.getAllAdmin(),
        ]);

        const suratData = Array.isArray(suratRes)
          ? suratRes
          : (suratRes?.data ?? []);
        const pengaduanData = Array.isArray(pengaduanRes)
          ? pengaduanRes
          : (pengaduanRes?.data ?? []);

        setSummary({
          totalSurat: suratData.length,
          suratPending: suratData.filter(
            (item) => pickField(item, ['Status', 'status']).toLowerCase() === 'pending'
          ).length,
          totalPengaduan: pengaduanData.length,
          pengaduanOpen: pengaduanData.filter((item) => {
            const status = pickField(item, ['Status', 'status']).toLowerCase();
            return status === 'open' || status === 'pending';
          }).length,
        });

        try {
          const trackingRes = await trackingService.getAllAdmin();
          const trackingData = Array.isArray(trackingRes)
            ? trackingRes
            : (trackingRes?.data ?? []);
          setRecentTracking(trackingData.slice(0, 5));
        } catch {
          const historyRes = await trackingService.getAll();
          const historyData = Array.isArray(historyRes)
            ? historyRes
            : (historyRes?.data ?? []);
          setRecentTracking(historyData.slice(0, 5));
        }
      } catch (error) {
        console.error('Gagal memuat dashboard admin:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="container-fluid">Memuat dashboard admin...</div>;
  }

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Dashboard Admin</h1>

      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2">Total Surat</h6>
              <h3 className="mb-0">{summary.totalSurat}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2">Surat Pending</h6>
              <h3 className="mb-0">{summary.suratPending}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2">Total Pengaduan</h6>
              <h3 className="mb-0">{summary.totalPengaduan}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card bg-danger text-white h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2">Pengaduan Aktif</h6>
              <h3 className="mb-0">{summary.pengaduanOpen}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Tracking Terbaru</h5>

          {recentTracking.length === 0 ? (
            <p className="text-muted mb-0">Belum ada data tracking.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Reference ID</th>
                    <th>Layanan</th>
                    <th>Status</th>
                    <th>Keterangan</th>
                    <th>Updated By</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTracking.map((item) => (
                    <tr key={pickField(item, ['ID', 'id'])}>
                      <td>{pickField(item, ['ID', 'id'])}</td>
                      <td>{pickField(item, ['ReferenceID', 'reference_id'])}</td>
                      <td>{pickField(item, ['ServiceType', 'service_type'])}</td>
                      <td>{pickField(item, ['Status', 'status'])}</td>
                      <td>{pickField(item, ['Keterangan', 'keterangan'])}</td>
                      <td>{pickField(item, ['UpdatedBy', 'updated_by'])}</td>
                      <td>{pickField(item, ['CreatedAt', 'created_at'])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;