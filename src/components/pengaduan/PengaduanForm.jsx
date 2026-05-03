import React, { useState } from 'react';

const PengaduanForm = ({ onSubmit, loading = false }) => {
  const [form, setForm] = useState({
    Judul: '',
    Kategori: '',
    Deskripsi: '',
    Lampiran: null,
  });

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    const fieldValue = type === 'file' ? files[0] : value;

    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);

    setForm({
      Judul: '',
      Kategori: '',
      Deskripsi: '',
      Lampiran: null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Judul Pengaduan</label>
        <input
          type="text"
          name="Judul"
          className="form-control"
          value={form.Judul}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Kategori</label>
        <select
          name="Kategori"
          className="form-select"
          value={form.Kategori}
          onChange={handleChange}
          required
        >
          <option value="">Pilih Kategori</option>
          <option value="Infrastruktur">
            Infrastruktur
          </option>
          <option value="Pelayanan">
            Pelayanan
          </option>
          <option value="Keamanan">
            Keamanan
          </option>
          <option value="Lingkungan">
            Lingkungan
          </option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Deskripsi</label>
        <textarea
          name="Deskripsi"
          className="form-control"
          rows="5"
          value={form.Deskripsi}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Lampiran</label>
        <input
          type="file"
          name="Lampiran"
          className="form-control"
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="btn btn-success"
        disabled={loading}
      >
        {loading ? 'Mengirim...' : 'Kirim Pengaduan'}
      </button>
    </form>
  );
};

export default PengaduanForm;