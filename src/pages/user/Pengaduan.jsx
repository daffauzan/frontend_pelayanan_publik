import { useEffect, useState } from 'react';
import PengaduanForm from '../../components/pengaduan/PengaduanForm';
import pengaduanService from '../../services/pengaduanService';
import {
  getFileNameFromPath,
  getStatusLabel,
  pickField,
  resolveFileUrl,
} from '../../utils/modelMapper';

const PengaduanPage = () => {
  const [pengaduan, setPengaduan] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await pengaduanService.getAll();
      const data = Array.isArray(response) ? response : (response?.data ?? []);
      setPengaduan(data);
    } catch (error) {
      console.error('Gagal memuat data pengaduan:', error);
    }
  };

  const handleCreatePengaduan = async (formData) => {
    setLoadingSubmit(true);
    setMessage('');

    try {
      await pengaduanService.create(formData);
      setMessage('Pengaduan berhasil dikirim.');
      await fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal mengirim pengaduan.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Pengaduan Masyarakat</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Form Pengaduan</h5>
          <PengaduanForm
            onSubmit={handleCreatePengaduan}
            loading={loadingSubmit}
          />

          {message && (
            <div className="alert alert-info mt-3 mb-0" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Riwayat Pengaduan</h5>

          {pengaduan.length === 0 ? (
            <p className="text-muted mb-0">Belum ada data pengaduan.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>Lampiran</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {pengaduan.map((item) => {
                    const attachmentPath = pickField(item, [
                      'Lampiran',
                      'lampiran',
                      'FilePendukung',
                      'file_pendukung',
                      'filePendukung',
                    ]);
                    const attachmentUrl = resolveFileUrl(attachmentPath);
                    const attachmentName = getFileNameFromPath(attachmentPath);

                    return (
                      <tr key={item.ID || item.id}>
                        <td>{pickField(item, ['ID', 'id'])}</td>
                        <td>{pickField(item, ['Judul', 'judul'])}</td>
                        <td>{pickField(item, ['Kategori', 'kategori'])}</td>
                        <td>
                          {attachmentUrl ? (
                            <div className="d-flex gap-2">
                              <a
                                href={attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-secondary btn-sm"
                              >
                                Lihat
                              </a>
                              <a
                                href={attachmentUrl}
                                download={attachmentName}
                                className="btn btn-outline-primary btn-sm"
                              >
                                Download
                              </a>
                            </div>
                          ) : (
                            <span className="text-muted">Tidak ada</span>
                          )}
                        </td>
                        <td>{getStatusLabel(pickField(item, ['Status', 'status']))}</td>
                        <td>{pickField(item, ['CreatedAt', 'created_at', 'createdAt'])}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PengaduanPage;