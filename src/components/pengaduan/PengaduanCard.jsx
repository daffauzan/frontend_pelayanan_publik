import { pickField } from '../../utils/modelMapper';

const PengaduanCard = ({ pengaduan }) => {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5>{pickField(pengaduan, ['Judul', 'judul'])}</h5>
        <p>{pickField(pengaduan, ['Deskripsi', 'deskripsi'])}</p>
        <span className="badge bg-warning text-dark">
          {pickField(pengaduan, ['Status', 'status'])}
        </span>
      </div>
    </div>
  );
};

export default PengaduanCard;