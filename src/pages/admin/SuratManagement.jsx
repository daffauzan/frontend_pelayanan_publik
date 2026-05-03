import { useEffect, useState } from 'react';
import suratService from '../../services/suratService';
import { pickField } from '../../utils/modelMapper';
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
      const response = await suratService.getAll();
      const data = response.data || [];
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
      await suratService.updateStatus(id, status, catatan);

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
                  <th>User ID</th>
                  <th>Jenis Surat</th>
                  <th>Keperluan</th>
                  <th>Status</th>
                  <th>Catatan Admin</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {surat.map((item) => {
                  const id = pickField(item, ['ID', 'id']);

                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{pickField(item, ['UserID', 'user_id'])}</td>
                      <td>{pickField(item, ['JenisSurat', 'jenis_surat', 'jenisSurat'])}</td>
                      <td>{pickField(item, ['Keperluan', 'keperluan'])}</td>
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
                          <option value="pending">pending</option>
                          <option value="processed">processed</option>
                          <option value="completed">completed</option>
                          <option value="rejected">rejected</option>
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