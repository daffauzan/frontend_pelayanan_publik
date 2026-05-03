import { useEffect, useState } from 'react';
import trackingService from '../../services/trackingService';
import { pickField } from '../../utils/modelMapper';

const AdminTrackingPage = () => {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracking = async () => {
      try {
        const response = await trackingService.getAll();
        setTracking(response.data || []);
      } catch (error) {
        console.error('Gagal memuat data tracking:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTracking();
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Tracking Layanan</h1>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <p className="text-muted mb-0">Memuat data tracking...</p>
          ) : tracking.length === 0 ? (
            <p className="text-muted mb-0">Belum ada data tracking.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Reference ID</th>
                    <th>Service Type</th>
                    <th>Status</th>
                    <th>Keterangan</th>
                    <th>Updated By</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {tracking.map((item) => (
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

export default AdminTrackingPage;
