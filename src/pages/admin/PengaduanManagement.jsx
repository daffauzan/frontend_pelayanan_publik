import { useEffect, useState } from 'react';
import pengaduanService from '../../services/pengaduanService';
import trackingService from '../../services/trackingService';
import useAuth from '../../hooks/useAuth';
import {
  getFileNameFromPath,
  pickField,
  resolveFileUrl,
} from '../../utils/modelMapper';

const PengaduanManagementPage = () => {
  const { user } = useAuth();
  const [pengaduan, setPengaduan] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState('');
  const [statusMap, setStatusMap] = useState({});
  const [tanggapanMap, setTanggapanMap] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await pengaduanService.getAllAdmin();
      const data = Array.isArray(response) ? response : (response?.data ?? []);
      setPengaduan(data);

      const initialStatus = {};
      const initialTanggapan = {};
      data.forEach((item) => {
        const id = pickField(item, ['ID', 'id']);
        initialStatus[id] = pickField(item, ['Status', 'status']);
        initialTanggapan[id] =
          pickField(item, ['TanggapanAdmin', 'tanggapan_admin']) === '-'
            ? ''
            : pickField(item, ['TanggapanAdmin', 'tanggapan_admin']);
      });

      setStatusMap(initialStatus);
      setTanggapanMap(initialTanggapan);
    } catch (error) {
      console.error('Gagal memuat data manajemen pengaduan:', error);
    }
  };

  const handleUpdateStatus = async (item) => {
    const id = pickField(item, ['ID', 'id']);
    const status = statusMap[id] || 'open';
    const tanggapan = tanggapanMap[id] || '';

    setLoadingId(id);
    setMessage('');

    try {
      await pengaduanService.updateStatusAdmin(id, status, tanggapan);

      try {
        await trackingService.create({
          ReferenceID: Number(id),
          ServiceType: 'pengaduan',
          Status: status,
          Keterangan: tanggapan,
          UpdatedBy: user?.id || user?.ID || 0,
        });
      } catch {
        // Ignore tracking creation error to keep status update flow working.
      }

      setMessage(`Status pengaduan #${id} berhasil diperbarui.`);
      await loadData();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Gagal memperbarui status pengaduan.'
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Manajemen Pengaduan</h1>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Lampiran</th>
                  <th>Status</th>
                  <th>Tanggapan Admin</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengaduan.map((item) => {
                  const id = pickField(item, ['ID', 'id']);
                  const userNameField = pickField(item, [
                    'NamaUser',
                    'nama_user',
                    'UserNama',
                    'user_nama',
                    'UserName',
                    'username',
                    'Nama',
                    'nama',
                  ]);
                  const userNameNested = item?.User?.Nama || item?.user?.nama || '';
                  const userDisplay =
                    userNameField !== '-'
                      ? userNameField
                      : (userNameNested || pickField(item, ['UserID', 'user_id']));
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
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{userDisplay}</td>
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
                      <td style={{ minWidth: '160px' }}>
                        <select
                          className="form-select"
                          value={statusMap[id] || 'open'}
                          onChange={(e) =>
                            setStatusMap((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                        >
                          <option value="open">Dalam Pengajuan</option>
                          <option value="in_progress">Dalam Proses</option>
                          <option value="resolved">Selesai</option>
                          <option value="rejected">Ditolak</option>
                        </select>
                      </td>
                      <td style={{ minWidth: '220px' }}>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={tanggapanMap[id] || ''}
                          onChange={(e) =>
                            setTanggapanMap((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                          placeholder="Tanggapan admin"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdateStatus(item)}
                          disabled={loadingId === id}
                        >
                          {loadingId === id ? 'Menyimpan...' : 'Simpan'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengaduanManagementPage;