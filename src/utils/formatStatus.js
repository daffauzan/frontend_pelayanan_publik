export const formatStatus = (status) => {
  const statusMap = {
    pending: 'Menunggu',
    process: 'Diproses',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    completed: 'Selesai',
  };

  return statusMap[status] || status;
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    process: 'info',
    approved: 'success',
    rejected: 'danger',
    completed: 'primary',
  };

  return colors[status] || 'secondary';
};