export function createPagination({ rowsPerPage, rotationInterval, onPageChange }) {
  let records = [];
  let currentPage = 0;
  let timerId = null;

  const getTotalPages = () => Math.max(1, Math.ceil(records.length / rowsPerPage));

  function notify() {
    const totalPages = getTotalPages();
    const start = currentPage * rowsPerPage;
    onPageChange({
      records: records.slice(start, start + rowsPerPage),
      currentPage,
      totalPages,
      totalRecords: records.length,
    });
  }

  function stop() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function start() {
    stop();
    if (getTotalPages() <= 1) return;
    timerId = window.setInterval(() => {
      currentPage = (currentPage + 1) % getTotalPages();
      notify();
    }, rotationInterval);
  }

  function restart() {
    start();
  }

  function setRecords(nextRecords) {
    records = [...nextRecords];
    currentPage = 0;
    notify();
    start();
  }

  function next() {
    if (getTotalPages() <= 1) return;
    currentPage = (currentPage + 1) % getTotalPages();
    notify();
    restart();
  }

  function previous() {
    if (getTotalPages() <= 1) return;
    currentPage = (currentPage - 1 + getTotalPages()) % getTotalPages();
    notify();
    restart();
  }

  return { setRecords, next, previous, start, stop };
}

