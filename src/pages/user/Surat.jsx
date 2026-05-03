import { useEffect, useState } from 'react';
import suratService from '../../services/suratService';
import { pickField } from '../../utils/modelMapper';
import SuratForm from '../../components/surat/SuratForm';

const SuratPage = () => {
  const [surat, setSurat] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await suratService.getAll();
      setSurat(response.data);
    } catch (error) {
      console.error('Gagal memuat data surat:', error);
    }
  };

  const handleCreateSurat = async (formData) => {
    setLoadingSubmit(true);
    setMessage('');

    try {
      await suratService.create(formData);
      setMessage('Pengajuan surat berhasil dikirim.');
      await fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal mengajukan surat.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Pengajuan Surat</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Form Pengajuan Surat</h5>
          <SuratForm onSubmit={handleCreateSurat} loading={loadingSubmit} />

          {message && (
            <div className="alert alert-info mt-3 mb-0" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Riwayat Pengajuan Surat</h5>

          {surat.length === 0 ? (
            <p className="text-muted mb-0">Belum ada data pengajuan surat.</p>
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
                  {surat.map((item) => (
                    <tr key={item.ID || item.id}>
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

export default SuratPage;