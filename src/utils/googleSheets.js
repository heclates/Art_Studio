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
    gapiScript.onerror = () => reject(new Error('gapi load error'));
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
    gisScript.onerror = () => reject(new Error('gis load error'));
    document.body.appendChild(gisScript);
  });
}

function checkInit(resolve) {
  if (gapiInited && gisInited) resolve();
}

async function getAuthToken() {
  return new Promise((resolve, reject) => {
    tokenClient.callback = (resp) => {
      if (resp.error) return reject(new Error(resp.error));
      if (!resp.access_token) return reject(new Error('No access token'));
      resolve(resp.access_token);
    };

    const token = gapi.client.getToken();
    tokenClient.requestAccessToken({ prompt: token ? '' : 'consent' });
  });
}

export async function submitToGoogleSheets(values) {
  try {
    await getAuthToken();

    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [values] },
    });

    return { success: true, result: response };
  } catch (err) {
    return { success: false, error: err };
  }
}
