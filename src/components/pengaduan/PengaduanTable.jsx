import { pickField } from '../../utils/modelMapper';

const PengaduanTable = ({ data = [] }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>No</th>
          <th>Judul</th>
          <th>Status</th>
          <th>Tanggal</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item.ID || item.id || index}>
            <td>{index + 1}</td>
            <td>{pickField(item, ['Judul', 'judul'])}</td>
            <td>{pickField(item, ['Status', 'status'])}</td>
            <td>{pickField(item, ['CreatedAt', 'created_at', 'createdAt'])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PengaduanTable;