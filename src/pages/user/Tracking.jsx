import { useEffect, useState } from 'react';
import trackingService from '../../services/trackingService';
import { getStatusLabel, pickField } from '../../utils/modelMapper';

const formatDateTime = (value) => {
  if (!value || value === '-') {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusBadgeClass = (status) => {
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'completed' || normalized === 'resolved') {
    return 'text-bg-success';
  }
  if (normalized === 'rejected') {
    return 'text-bg-danger';
  }
  if (normalized === 'processed' || normalized === 'in_progress') {
    return 'text-bg-info';
  }
  return 'text-bg-warning';
};

const isTrackingItem = (item) => {
  if (!item || typeof item !== 'object') {
    return false;
  }

  const hasReferenceId = 'ReferenceID' in item || 'reference_id' in item;
  const hasStatus = 'Status' in item || 'status' in item;
  return hasReferenceId && hasStatus;
};

const extractTrackingList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const candidateKeys = ['data', 'tracking', 'trackings', 'items', 'results', 'records'];

  for (const key of candidateKeys) {
    if (!(key in payload)) {
      continue;
    }

    const value = payload[key];
    if (Array.isArray(value)) {
      return value;
    }

    if (value && typeof value === 'object') {
      const nested = extractTrackingList(value);
      if (nested.length > 0) {
        return nested;
      }
    }
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value) && value.some(isTrackingItem)) {
      return value;
    }
  }

  return [];
};

const TrackingPage = () => {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const tryLoadFrom = async (fetcher) => {
    const response = await fetcher();
    return extractTrackingList(response);
  };

  const loadTracking = async () => {
    setLoading(true);
    setMessage('');

    let lastError = null;

    try {
      let data = [];

      try {
        const [suratRes, pengaduanRes] = await Promise.all([
          trackingService.getByServiceType('surat'),
          trackingService.getByServiceType('pengaduan'),
        ]);

        const suratData = extractTrackingList(suratRes);
        const pengaduanData = extractTrackingList(pengaduanRes);
        data = [...suratData, ...pengaduanData]
          .filter((item) => item && (item.ID || item.id))
          .sort((a, b) => {
            const dateA = new Date(a.CreatedAt || a.created_at || 0).getTime();
            const dateB = new Date(b.CreatedAt || b.created_at || 0).getTime();
            return dateA - dateB;
          });
      } catch (error) {
        lastError = error;
      }

      if (data.length === 0) {
        try {
          data = await tryLoadFrom(trackingService.getAll);
        } catch (error) {
          lastError = error;
        }
      }

      if (data.length === 0) {
        try {
          data = await tryLoadFrom(trackingService.getHistory);
        } catch (error) {
          lastError = error;
        }
      }

      setTracking(data);

      if (data.length === 0 && lastError) {
        const backendMessage =
          lastError.response?.data?.message ||
          lastError.response?.data?.error ||
          'Data tracking belum tersedia.';
        setMessage(backendMessage);
      }
    } catch (error) {
      console.error('Gagal memuat data tracking user:', error);
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Gagal memuat data tracking.';
      setMessage(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracking();
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Tracking Layanan Saya</h1>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={loadTracking}
          disabled={loading}
        >
          {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {message && (
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          )}

          {loading ? (
            <p className="text-muted mb-0">Memuat data tracking...</p>
          ) : tracking.length === 0 ? (
            <p className="text-muted mb-0">Belum ada data tracking layanan.</p>
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
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {tracking.map((item) => {
                    const status = pickField(item, ['Status', 'status']);

                    return (
                      <tr key={pickField(item, ['ID', 'id'])}>
                        <td>{pickField(item, ['ID', 'id'])}</td>
                        <td>{pickField(item, ['ReferenceID', 'reference_id'])}</td>
                        <td className="text-uppercase">
                          {pickField(item, ['ServiceType', 'service_type'])}
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(status)}`}>
                            {getStatusLabel(status)}
                          </span>
                        </td>
                        <td>{pickField(item, ['Keterangan', 'keterangan'])}</td>
                        <td>
                          {formatDateTime(pickField(item, ['CreatedAt', 'created_at']))}
                        </td>
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

export default TrackingPage;