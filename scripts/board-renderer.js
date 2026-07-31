const STATUS_CLASS = {
  Ready: "status-ready",
  Pending: "status-pending",
  Attention: "status-attention",
  Delayed: "status-delayed",
};

function createCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

function formatDepartureTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, hour, minute);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function createDepartureRow(record) {
  const row = document.createElement("tr");
  row.dataset.recordId = record.id;
  row.append(createCell(formatDepartureTime(record.departureTime), "departure-time"));
  row.append(createCell(record.customerLastName));
  row.append(createCell(record.unitNumber));
  row.append(createCell(record.destination, "destination"));

  const typeCell = document.createElement("td");
  const type = document.createElement("span");
  type.className = "type-label";
  type.dataset.type = record.departureType;
  type.textContent = record.departureType;
  typeCell.append(type);
  row.append(typeCell);

  const statusCell = document.createElement("td");
  const status = document.createElement("span");
  status.className = `status-label ${STATUS_CLASS[record.status]}`;
  status.textContent = record.status;
  if (record.warning) {
    status.title = record.warning;
    status.setAttribute("aria-label", `${record.status}: ${record.warning}`);
  }
  statusCell.append(status);
  row.append(statusCell);
  return row;
}

export function createBoardRenderer({ tableBody, messageElement }) {
  function renderRows(records) {
    const fragment = document.createDocumentFragment();
    records.forEach((record) => fragment.append(createDepartureRow(record)));
    tableBody.replaceChildren(fragment);
    messageElement.classList.remove("is-visible");
  }

  function renderMessage({ title, detail, symbol = "—" }) {
    tableBody.replaceChildren();
    messageElement.replaceChildren();

    const symbolElement = document.createElement("span");
    symbolElement.className = "message-symbol";
    symbolElement.setAttribute("aria-hidden", "true");
    symbolElement.textContent = symbol;

    const titleElement = document.createElement("strong");
    titleElement.textContent = title;

    const detailElement = document.createElement("span");
    detailElement.textContent = detail;

    messageElement.append(symbolElement, titleElement, detailElement);
    messageElement.classList.add("is-visible");
  }

  return { renderRows, renderMessage };
}

