import { useEffect, useState } from 'react';
import suratService from '../../services/suratService';
import { pickField } from '../../utils/modelMapper';

const DashboardPage = () => {
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const response = await suratService.getAll();
        setSuratList(response.data || []);
      } catch (error) {
        console.error('Gagal memuat dashboard surat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurat();
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Dashboard Pengajuan</h1>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Daftar Surat yang Diajukan</h5>

          {loading ? (
            <p className="text-muted mb-0">Memuat data surat...</p>
          ) : suratList.length === 0 ? (
            <p className="text-muted mb-0">Belum ada pengajuan surat.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Jenis Surat</th>
                    <th>Keperluan</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {suratList.map((item) => (
                    <tr key={pickField(item, ['ID', 'id'])}>
                      <td>{pickField(item, ['ID', 'id'])}</td>
                      <td>{pickField(item, ['JenisSurat', 'jenis_surat', 'jenisSurat'])}</td>
                      <td>{pickField(item, ['Keperluan', 'keperluan'])}</td>
                      <td>{pickField(item, ['Status', 'status'])}</td>
                      <td>{pickField(item, ['SubmittedAt', 'CreatedAt', 'created_at'])}</td>
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