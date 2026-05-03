import { useEffect, useState } from 'react';
import pengaduanService from '../../services/pengaduanService';
import trackingService from '../../services/trackingService';
import useAuth from '../../hooks/useAuth';
import { pickField } from '../../utils/modelMapper';

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
      const response = await pengaduanService.getAll();
      const data = response.data || [];
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
      await pengaduanService.updateStatus(id, status, tanggapan);

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
                  <th>User ID</th>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Tanggapan Admin</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengaduan.map((item) => {
                  const id = pickField(item, ['ID', 'id']);

                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{pickField(item, ['UserID', 'user_id'])}</td>
                      <td>{pickField(item, ['Judul', 'judul'])}</td>
                      <td>{pickField(item, ['Kategori', 'kategori'])}</td>
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
                          <option value="open">open</option>
                          <option value="in_progress">in_progress</option>
                          <option value="resolved">resolved</option>
                          <option value="rejected">rejected</option>
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