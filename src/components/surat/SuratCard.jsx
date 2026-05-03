import { pickField } from '../../utils/modelMapper';

const SuratCard = ({ surat }) => {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5>{pickField(surat, ['JenisSurat', 'jenis_surat', 'jenisSurat'])}</h5>
        <p className="mb-1">{pickField(surat, ['Keperluan', 'keperluan'])}</p>
        <span className="badge bg-primary">
          {pickField(surat, ['Status', 'status'])}
        </span>
      </div>
    </div>
  );
};

export default SuratCard;