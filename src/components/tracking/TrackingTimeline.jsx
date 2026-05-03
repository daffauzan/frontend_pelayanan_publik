import { pickField } from '../../utils/modelMapper';

const TrackingTimeline = ({ histories = [] }) => {
  return (
    <div className="timeline">
      {histories.map((item, index) => (
        <div
          key={index}
          className="card mb-3 border-start border-primary border-4"
        >
          <div className="card-body">
            <h6>{pickField(item, ['Status', 'status'])}</h6>
            <p className="mb-1">{pickField(item, ['Keterangan', 'keterangan'])}</p>
            <small className="text-muted">
              {pickField(item, ['CreatedAt', 'created_at', 'createdAt'])}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackingTimeline;