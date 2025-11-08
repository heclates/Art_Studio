const { VITE_CLIENT_ID: CLIENT_ID, VITE_API_KEY: API_KEY, VITE_SPREADSHEET_ID: SPREADSHEET_ID } = import.meta.env;

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

export async function initGoogleApi() {
  return new Promise((resolve, reject) => {
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] });
          gapiInited = true;
          checkInit(resolve);
        } catch (err) {
          reject(err);
        }
      });
    };
    gapiScript.onerror = () => reject(new Error('Failed to load gapi'));
    document.body.appendChild(gapiScript);

    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: () => {},
      });
      gisInited = true;
      checkInit(resolve);
    };
    gisScript.onerror = () => reject(new Error('Failed to load gis'));
    document.body.appendChild(gisScript);
  });
}

function checkInit(resolve) {
  if (gapiInited && gisInited) resolve();
}

async function getAuthToken() {
  return new Promise((resolve, reject) => {
    tokenClient.callback = (resp) => {
      if (resp.error) return reject(new Error('Auth error'));
      if (!resp.access_token) return reject(new Error('No access token'));
      resolve(resp.access_token);
    };
    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
}

export async function submitToGoogleSheets(values) {
  try {
    await getAuthToken();
    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [values] }
    });
    alert('Резервация отправлена успешно!');
  } catch (err) {
    console.error('Secure error:', err);
    alert('Ошибка отправки. Попробуйте позже.');

    console.log(err)

  }
}