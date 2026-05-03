import React, { useState } from 'react';

const SuratForm = ({ onSubmit, loading = false }) => {
  const [form, setForm] = useState({
    JenisSurat: '',
    Keperluan: '',
    FilePendukung: null,
  });

  const handleChange = (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);

    setForm({
      JenisSurat: '',
      Keperluan: '',
      FilePendukung: null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Jenis Surat</label>
        <select
          name="JenisSurat"
          className="form-select"
          value={form.JenisSurat}
          onChange={handleChange}
          required
        >
          <option value="">Pilih Jenis Surat</option>
          <option value="Surat Keterangan Usaha">
            Surat Keterangan Usaha
          </option>
          <option value="Surat Domisili">
            Surat Domisili
          </option>
          <option value="Surat Keterangan Tidak Mampu">
            Surat Keterangan Tidak Mampu
          </option>
          <option value="Surat Pengantar SKCK">
            Surat Pengantar SKCK
          </option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Keperluan</label>
        <input
          type="text"
          name="Keperluan"
          className="form-control"
          value={form.Keperluan}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">File Pendukung</label>
        <input
          type="file"
          name="FilePendukung"
          className="form-control"
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Mengirim...' : 'Ajukan Surat'}
      </button>
    </form>
  );
};

export default SuratForm;