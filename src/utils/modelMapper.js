export const normalizeUser = (rawUser = null) => {
  if (!rawUser || typeof rawUser !== 'object') {
    return null;
  }

  const role = (rawUser.role || rawUser.Role || 'user').toLowerCase();

  return {
    ...rawUser,
    id: rawUser.id ?? rawUser.ID,
    nama: rawUser.nama ?? rawUser.Nama ?? '',
    email: rawUser.email ?? rawUser.Email ?? '',
    nik: rawUser.nik ?? rawUser.NIK ?? '',
    noTelp: rawUser.noTelp ?? rawUser.no_telp ?? rawUser.NoTelp ?? '',
    alamat: rawUser.alamat ?? rawUser.Alamat ?? '',
    role,
  };
};

export const getUserRole = (user = null) => {
  if (!user) {
    return '';
  }

  return (user.role || user.Role || '').toLowerCase();
};

export const mapSuratPayload = (form = {}) => {
  const payload = new FormData();

  payload.append(
    'JenisSurat',
    form.JenisSurat || form.jenisSurat || form.jenis_surat || ''
  );
  payload.append('Keperluan', form.Keperluan || form.keperluan || '');

  const file = form.FilePendukung || form.filePendukung || form.file_pendukung;
  if (file) {
    payload.append('FilePendukung', file);
  }

  return payload;
};

export const mapPengaduanPayload = (form = {}) => {
  const payload = new FormData();

  payload.append('Judul', form.Judul || form.judul || '');
  payload.append('Deskripsi', form.Deskripsi || form.deskripsi || '');
  payload.append('Kategori', form.Kategori || form.kategori || '');

  const lampiran = form.Lampiran || form.lampiran;
  if (lampiran) {
    payload.append('Lampiran', lampiran);
  }

  return payload;
};

export const pickField = (item = {}, keys = []) => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
      return item[key];
    }
  }

  return '-';
};