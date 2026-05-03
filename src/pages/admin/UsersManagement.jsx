import { useEffect, useState } from 'react';
import suratService from '../../services/suratService';
import pengaduanService from '../../services/pengaduanService';
import { normalizeUser, pickField } from '../../utils/modelMapper';
import userService from '../../services/userService';

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [relationUserIds, setRelationUserIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedUserKey, setSelectedUserKey] = useState('');
  const [form, setForm] = useState({
    nama: '',
    email: '',
    noTelp: '',
    alamat: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const [usersRes, suratRes, pengaduanRes] = await Promise.all([
          userService.getAll(),
          suratService.getAll(),
          pengaduanService.getAll(),
        ]);

        const toArray = (value) => {
          if (Array.isArray(value)) {
            return value;
          }

          if (!value || typeof value !== 'object') {
            return [];
          }

          if (Array.isArray(value.data)) {
            return value.data;
          }

          if (Array.isArray(value.users)) {
            return value.users;
          }

          if (Array.isArray(value.items)) {
            return value.items;
          }

          return [];
        };

        const usersData = toArray(usersRes);
        const suratData = toArray(suratRes);
        const pengaduanData = toArray(pengaduanRes);

        const allRelationItems = [...suratData, ...pengaduanData];

        const relationIds = new Set(
          allRelationItems
            .map((item) => Number(item.UserID || item.user_id || item.userId || 0))
            .filter((value) => Number.isFinite(value) && value > 0)
        );

        setRelationUserIds(relationIds);

        const usersMap = new Map();

        usersData.forEach((item) => {
          const candidate = normalizeUser(item);
          if (!candidate) {
            return;
          }

          const role = (candidate.role || '').toLowerCase();
          if (role && role !== 'user') {
            return;
          }

          const key = candidate.id || candidate.email;
          if (!key || usersMap.has(String(key))) {
            return;
          }

          usersMap.set(String(key), candidate);
        });

        if (usersMap.size === 0) {
          allRelationItems.forEach((item) => {
            const candidate = normalizeUser(
              item.User ||
                item.user ||
                item.Pengguna ||
                item.pengguna || {
                  ID: item.UserID || item.user_id,
                  Nama: item.Nama || item.nama || '',
                  Email: item.Email || item.email || '',
                  NoTelp: item.NoTelp || item.no_telp || item.noTelp || '',
                  Alamat: item.Alamat || item.alamat || '',
                  Role: item.Role || item.role || 'user',
                }
            );

            if (!candidate) {
              return;
            }

            const key = candidate.id || candidate.email || item.UserID || item.user_id;
            if (!key || usersMap.has(String(key))) {
              return;
            }

            usersMap.set(String(key), candidate);
          });
        }

        setUsers(Array.from(usersMap.values()));
      } catch (error) {
        console.error('Gagal memuat data pengguna:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleSelectUser = (item) => {
    const key = item.id || item.ID || item.email || item.Email;
    setSelectedUserKey(String(key));
    setForm({
      nama: item.nama || item.Nama || '',
      email: item.email || item.Email || '',
      noTelp: item.noTelp || item.NoTelp || item.no_telp || '',
      alamat: item.alamat || item.Alamat || '',
    });
    setMessage('');
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUserKey) {
      setMessage('Pilih user terlebih dahulu.');
      return;
    }

    setUsers((prev) =>
      prev.map((item) => {
        const key = String(item.id || item.ID || item.email || item.Email);

        if (key !== selectedUserKey) {
          return item;
        }

        return {
          ...item,
          nama: form.nama,
          Nama: form.nama,
          email: form.email,
          Email: form.email,
          noTelp: form.noTelp,
          NoTelp: form.noTelp,
          no_telp: form.noTelp,
          alamat: form.alamat,
          Alamat: form.alamat,
        };
      })
    );

    setMessage('Data identitas user berhasil diperbarui di halaman ini.');
  };

  const handleDeleteUser = (item) => {
    const key = String(item.id || item.ID || item.email || item.Email);

    const isConfirmed = window.confirm(
      `Yakin ingin menghapus user ${item.nama || item.Nama || item.email || item.Email}?`
    );

    if (!isConfirmed) {
      return;
    }

    setUsers((prev) =>
      prev.filter((userItem) => {
        const itemKey = String(
          userItem.id || userItem.ID || userItem.email || userItem.Email
        );
        return itemKey !== key;
      })
    );

    if (selectedUserKey === key) {
      setSelectedUserKey('');
      setForm({
        nama: '',
        email: '',
        noTelp: '',
        alamat: '',
      });
    }

    setMessage('User berhasil dihapus dari daftar pada halaman ini.');
  };

  const usersWithRelation = users.filter((item) => {
    const id = Number(item.id || item.ID || 0);
    return Number.isFinite(id) && relationUserIds.has(id);
  });

  const usersWithoutRelation = users.filter((item) => {
    const id = Number(item.id || item.ID || 0);
    if (!Number.isFinite(id) || id <= 0) {
      return true;
    }
    return !relationUserIds.has(id);
  });

  const renderTable = (data) => (
    <div className="table-responsive">
      <table className="table table-striped mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>No. Telepon</th>
            <th>Alamat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id || item.email}>
              <td>{pickField(item, ['id', 'ID'])}</td>
              <td>{pickField(item, ['nama', 'Nama'])}</td>
              <td>{pickField(item, ['email', 'Email'])}</td>
              <td>{pickField(item, ['noTelp', 'NoTelp', 'no_telp'])}</td>
              <td>{pickField(item, ['alamat', 'Alamat'])}</td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleSelectUser(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteUser(item)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Manajemen Pengguna</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-1">Ringkasan User</h5>
          <p className="text-muted mb-0">
            Total user terdaftar: <strong>{users.length}</strong>
          </p>
          <p className="text-muted mb-0">
            User dengan relasi surat/pengaduan: <strong>{usersWithRelation.length}</strong>
          </p>
          <p className="text-muted mb-0">
            User tanpa relasi surat/pengaduan: <strong>{usersWithoutRelation.length}</strong>
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">User Tanpa Relasi Surat/Pengaduan</h5>

          {loading ? (
            <p className="text-muted mb-0">Memuat data pengguna...</p>
          ) : usersWithoutRelation.length === 0 ? (
            <p className="text-muted mb-0">
              Tidak ada user tanpa relasi surat/pengaduan.
            </p>
          ) : (
            renderTable(usersWithoutRelation)
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">User Dengan Relasi Surat/Pengaduan</h5>

          {loading ? (
            <p className="text-muted mb-0">Memuat data pengguna...</p>
          ) : usersWithRelation.length === 0 ? (
            <p className="text-muted mb-0">
              Tidak ada user dengan relasi surat/pengaduan.
            </p>
          ) : (
            renderTable(usersWithRelation)
          )}
        </div>
      </div>

      {selectedUserKey && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Edit Data Identitas User</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="nama" className="form-label">Nama</label>
                  <input
                    id="nama"
                    name="nama"
                    className="form-control"
                    value={form.nama}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="noTelp" className="form-label">No. Telepon</label>
                  <input
                    id="noTelp"
                    name="noTelp"
                    className="form-control"
                    value={form.noTelp}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="alamat" className="form-label">Alamat</label>
                  <input
                    id="alamat"
                    name="alamat"
                    className="form-control"
                    value={form.alamat}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSelectedUserKey('');
                    setMessage('');
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {message && (
        <div className="alert alert-info mt-4 mb-0" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default UsersManagementPage;