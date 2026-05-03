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

  const jenisSurat = (
    form.JenisSurat || form.jenisSurat || form.jenis_surat || ''
  ).trim();
  const keperluan = (form.Keperluan || form.keperluan || '').trim();

  // Send both naming styles to match backend bind tags (json/form) safely.
  payload.append('JenisSurat', jenisSurat);
  payload.append('jenis_surat', jenisSurat);

  payload.append('Keperluan', keperluan);
  payload.append('keperluan', keperluan);

  const file = form.FilePendukung || form.filePendukung || form.file_pendukung;
  if (file) {
    payload.append('FilePendukung', file);
    payload.append('file_pendukung', file);
  }

  return payload;
};

export const mapPengaduanPayload = (form = {}) => {
  const payload = new FormData();

  const judul = (form.Judul || form.judul || '').trim();
  const deskripsi = (form.Deskripsi || form.deskripsi || '').trim();
  const kategori = (form.Kategori || form.kategori || '').trim();

  // Send both naming styles to match backend bind tags (json/form) safely.
  payload.append('Judul', judul);
  payload.append('judul', judul);

  payload.append('Deskripsi', deskripsi);
  payload.append('deskripsi', deskripsi);

  payload.append('Kategori', kategori);
  payload.append('kategori', kategori);

  const lampiran = form.Lampiran || form.lampiran;
  if (lampiran) {
    payload.append('Lampiran', lampiran);
    payload.append('lampiran', lampiran);
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

export const resolveFileUrl = (rawPath = '') => {
  if (!rawPath || rawPath === '-') {
    return '';
  }

  const normalizedPath = String(rawPath).trim();
  if (!normalizedPath) {
    return '';
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  const base = (import.meta.env.VITE_CLOUDFRONT_URL || '').trim();
  if (!base) {
    return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  }

  const cleanedBase = base.replace(/\/+$/, '');
  const cleanedPath = normalizedPath.replace(/^\/+/, '');
  return `${cleanedBase}/${cleanedPath}`;
};

export const getFileNameFromPath = (rawPath = '') => {
  if (!rawPath || rawPath === '-') {
    return 'lampiran';
  }

  const normalizedPath = String(rawPath).trim().replace(/\/+$/, '');
  if (!normalizedPath) {
    return 'lampiran';
  }

  const lastSegment = normalizedPath.split('/').pop() || 'lampiran';
  const safeName = lastSegment.split('?')[0].split('#')[0];
  return safeName || 'lampiran';
};

export const getStatusLabel = (rawStatus = '') => {
  const status = String(rawStatus || '').toLowerCase().trim();

  const labels = {
    pending: 'Menunggu',
    processed: 'Diproses',
    completed: 'Selesai',
    rejected: 'Ditolak',
    open: 'Baru',
    in_progress: 'Diproses',
    resolved: 'Selesai',
  };

  return labels[status] || (rawStatus || '-');
};