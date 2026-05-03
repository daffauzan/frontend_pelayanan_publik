import { useEffect, useState } from 'react';
import suratService from '../../services/suratService';
import {
  getFileNameFromPath,
  pickField,
  resolveFileUrl,
} from '../../utils/modelMapper';
import trackingService from '../../services/trackingService';
import useAuth from '../../hooks/useAuth';

const SuratManagementPage = () => {
  const { user } = useAuth();
  const [surat, setSurat] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState('');
  const [statusMap, setStatusMap] = useState({});
  const [catatanMap, setCatatanMap] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await suratService.getAllAdmin();
      const data = Array.isArray(response) ? response : (response?.data ?? []);
      setSurat(data);

      const initialStatus = {};
      const initialCatatan = {};
      data.forEach((item) => {
        const id = pickField(item, ['ID', 'id']);
        initialStatus[id] = pickField(item, ['Status', 'status']);
        initialCatatan[id] = pickField(item, ['CatatanAdmin', 'catatan_admin']) === '-'
          ? ''
          : pickField(item, ['CatatanAdmin', 'catatan_admin']);
      });

      setStatusMap(initialStatus);
      setCatatanMap(initialCatatan);
    } catch (error) {
      console.error('Gagal memuat data manajemen surat:', error);
    }
  };

  const handleUpdateStatus = async (item) => {
    const id = pickField(item, ['ID', 'id']);
    const status = statusMap[id] || 'pending';
    const catatan = catatanMap[id] || '';

    setLoadingId(id);
    setMessage('');

    try {
      await suratService.updateStatusAdmin(id, status, catatan);

      try {
        await trackingService.create({
          ReferenceID: Number(id),
          ServiceType: 'surat',
          Status: status,
          Keterangan: catatan,
          UpdatedBy: user?.id || user?.ID || 0,
        });
      } catch {
        // Ignore tracking creation error to keep status update flow working.
      }

      setMessage(`Status surat #${id} berhasil diperbarui.`);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal memperbarui status surat.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Manajemen Surat</h1>

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
                  <th>Jenis Surat</th>
                  <th>Keperluan</th>
                  <th>Lampiran</th>
                  <th>Status</th>
                  <th>Catatan Admin</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {surat.map((item) => {
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
                    'FilePendukung',
                    'file_pendukung',
                    'filePendukung',
                    'Lampiran',
                    'lampiran',
                  ]);
                  const attachmentUrl = resolveFileUrl(attachmentPath);
                  const attachmentName = getFileNameFromPath(attachmentPath);

                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{userDisplay}</td>
                      <td>{pickField(item, ['JenisSurat', 'jenis_surat', 'jenisSurat'])}</td>
                      <td>{pickField(item, ['Keperluan', 'keperluan'])}</td>
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
                          value={statusMap[id] || 'pending'}
                          onChange={(e) =>
                            setStatusMap((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="processed">Dalam Proses</option>
                          <option value="completed">Selesai</option>
                          <option value="rejected">Ditolak</option>
                        </select>
                      </td>
                      <td style={{ minWidth: '220px' }}>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={catatanMap[id] || ''}
                          onChange={(e) =>
                            setCatatanMap((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                          placeholder="Catatan admin"
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

export default SuratManagementPage;