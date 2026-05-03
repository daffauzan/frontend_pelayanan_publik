import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import { normalizeUser } from '../../utils/modelMapper';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(normalizeUser(user));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setProfile(normalizeUser(response.data || response.user || user));
      } catch (error) {
        setProfile(normalizeUser(user));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="container-fluid">
        <h1 className="mb-4">Profil Saya</h1>
        <div className="card">
          <div className="card-body text-muted">Memuat data profil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Profil Saya</h1>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Data Profil</h5>

          <div className="mb-3">
            <label className="form-label text-muted mb-1">Nama</label>
            <div className="form-control bg-light">{profile?.nama || '-'}</div>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted mb-1">Email</label>
            <div className="form-control bg-light">{profile?.email || '-'}</div>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted mb-1">No. Telepon</label>
            <div className="form-control bg-light">{profile?.noTelp || '-'}</div>
          </div>

          <div className="mb-0">
            <label className="form-label text-muted mb-1">Alamat</label>
            <div className="form-control bg-light" style={{ minHeight: '96px' }}>
              {profile?.alamat || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;