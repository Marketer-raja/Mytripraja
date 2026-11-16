/**
 * MyTripRaja - save "Notify me" emails to Google Sheets.
 * Paste this into Extensions > Apps Script of your Google Sheet.
 */
const SHEET_NAME = 'Emails';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const data = JSON.parse(e.postData.contents);
    const email = String(data.email || '').trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return out({ ok: false, error: 'invalid email' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Email', 'Source']);
    }

    // Skip duplicates
    const last = sheet.getLastRow();
    if (last > 1) {
      const existing = sheet.getRange(2, 2, last - 1, 1).getValues().flat();
      if (existing.map(String).map(s => s.toLowerCase()).includes(email)) {
        return out({ ok: true, duplicate: true });
      }
    }

    sheet.appendRow([new Date(), email, data.source || '']);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out({ ok: true, message: 'MyTripRaja email collector is running' });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
