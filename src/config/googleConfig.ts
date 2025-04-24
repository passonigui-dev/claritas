// Configurações para autenticação com Google API
export const GOOGLE_API_CONFIG = {
  // Estas chaves são publicáveis e seguras para uso no frontend
  API_KEY: 'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs', // Substitua pela sua API key
  CLIENT_ID: '489099242050-qqc9tp9k3gmnmkdk770der4q8bt3lt8l.apps.googleusercontent.com', // Substitua pelo seu Client ID
  DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets.readonly',
};

// ID da planilha para leitura
// Formato do URL: https://docs.google.com/spreadsheets/d/ID_DA_PLANILHA/edit
export const SPREADSHEET_ID = '1UPGtJx3rYgq63Ew7-mFTLNHrGAX4sEOZ7YBttYsPPRU';

// Nome da aba/range que contém os dados
export const SHEET_RANGE = 'Campanhas!A2:J1000';
