function doPost(e) {
  const sheetName = 'Home Cleaning';
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  const headers = [
    'Nama Pelanggan',
    'WhatsApp',
    'Alamat / Lokasi',
    'Google Map',
    'Jadwal Booking',
    'Pilih Layanan',
    'Catatan / Keterangan',
    'Tanggal Submit',
    'No. Order',
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    let payload = getPayloadFromEvent(e);

    const normalized = {
      nama: firstNonEmpty(payload['Nama Pelanggan'], payload.nama, payload['nama'], payload['Name'], payload.name),
      whatsapp: firstNonEmpty(payload['WhatsApp'], payload.whatsapp, payload['whatsapp']),
      alamat: firstNonEmpty(payload['Alamat / Lokasi'], payload.alamat, payload['alamat'], payload.address),
      googleMap: firstNonEmpty(payload['Google Map'], payload.googleMap, payload['googleMap']),
      jadwal: firstNonEmpty(payload['Jadwal Booking'], payload.jadwalBooking, payload.jadwal, payload.schedule),
      layanan: firstNonEmpty(payload['Pilih Layanan'], payload.layanan, payload.service, payload['service']),
      catatan: firstNonEmpty(payload['Catatan / Keterangan'], payload.catatan, payload.notes, payload['notes']),
      tanggalSubmit: firstNonEmpty(payload['Tanggal Submit'], payload.tanggalSubmit, payload['tanggalSubmit']),
    };

    const orderNumber = generateOrderNumber(sheet);
    const row = [
      normalized.nama || '',
      normalized.whatsapp || '',
      normalized.alamat || '',
      normalized.googleMap || '',
      normalized.jadwal || '',
      normalized.layanan || '',
      normalized.catatan || '',
      normalized.tanggalSubmit || '',
      orderNumber,
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderNumber }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getPayloadFromEvent(e) {
  let payload = {};

  try {
    const contentType = (e.postData && e.postData.contentsType) || '';
    const rawBody = (e.postData && e.postData.getDataAsString && e.postData.getDataAsString()) || '';

    if (rawBody) {
      if (contentType.includes('application/json')) {
        payload = JSON.parse(rawBody || '{}');
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        payload = Object.fromEntries(new URLSearchParams(rawBody || '').entries());
      }
    }
  } catch (err) {
    payload = {};
  }

  if (!payload || Object.keys(payload).length === 0) {
    payload = e.parameter || {};
  }

  const parameterMap = e.parameters || {};
  Object.keys(parameterMap).forEach(function (key) {
    const value = parameterMap[key];
    payload[key] = Array.isArray(value) ? value[0] : value;
  });

  if (typeof payload.payload_json === 'string') {
    try {
      const parsedPayload = JSON.parse(payload.payload_json);
      payload = { ...payload, ...parsedPayload };
    } catch (err) {
      // ignore invalid payload_json and continue
    }
  }

  return payload;
}

function firstNonEmpty() {
  for (let i = 0; i < arguments.length; i++) {
    const value = arguments[i];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return '';
}

function generateOrderNumber(sheet) {
  const values = sheet.getDataRange().getDisplayValues();
  let lastOrderNumber = '';

  for (let i = values.length - 1; i >= 1; i--) {
    const value = values[i][8];
    if (value && String(value).trim()) {
      lastOrderNumber = String(value).trim();
      break;
    }
  }

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const monthKey = `${month}${year}`;

  let running = 1;
  const match = lastOrderNumber.match(/^(\d{3})\/HCS\/(\d{4})$/);

  if (match) {
    const lastMonthKey = match[2];
    if (lastMonthKey === monthKey) {
      running = Number(match[1]) + 1;
    }
  }

  return `${String(running).padStart(3, '0')}/HCS/${monthKey}`;
}
