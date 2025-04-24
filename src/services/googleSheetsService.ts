
import { GOOGLE_API_CONFIG, SPREADSHEET_ID, SHEET_RANGE } from "@/config/googleConfig";
import { processSheetData } from "@/utils/sheetProcessing";
import { Campaign } from "@/types";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private isInitialized = false;
  private isAuthenticated = false;
  private tokenClient: any = null;

  private constructor() {}

  public static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  /**
   * Inicializa a biblioteca gapi e carrega as APIs necessárias
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: GOOGLE_API_CONFIG.API_KEY,
              discoveryDocs: [GOOGLE_API_CONFIG.DISCOVERY_DOC],
            });
            this.isInitialized = true;
            this.loadTokenClient();
            resolve();
          } catch (error) {
            console.error('Erro ao inicializar cliente Google API:', error);
            reject(error);
          }
        });
      };
      script.onerror = (error) => {
        console.error('Erro ao carregar script Google API:', error);
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Carrega o cliente de token para autenticação OAuth
   */
  private loadTokenClient(): void {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_API_CONFIG.CLIENT_ID,
        scope: GOOGLE_API_CONFIG.SCOPES,
        callback: () => {
          this.isAuthenticated = true;
        },
      });
    };
    document.body.appendChild(script);
  }

  /**
   * Autentica o usuário com OAuth
   */
  public async authenticate(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isAuthenticated) return;

    return new Promise<void>((resolve, reject) => {
      try {
        this.tokenClient.callback = (resp: any) => {
          if (resp.error !== undefined) {
            reject(resp);
            return;
          }
          this.isAuthenticated = true;
          resolve();
        };
        
        if (window.gapi.client.getToken() === null) {
          this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          this.tokenClient.requestAccessToken({ prompt: '' });
        }
      } catch (error) {
        console.error('Erro na autenticação:', error);
        reject(error);
      }
    });
  }

  /**
   * Busca os dados da planilha
   */
  public async fetchSheetData(): Promise<Campaign[]> {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_RANGE,
      });

      const values = response.result.values || [];
      
      // Transforma os dados brutos em formato utilizável
      const headers = values[0];
      const rows = values.slice(1);
      
      const rawData = rows.map(row => {
        const rowData: Record<string, any> = {};
        headers.forEach((header: string, index: number) => {
          // Converte valores numéricos
          const value = row[index];
          if (!isNaN(Number(value)) && value !== '') {
            rowData[header.toLowerCase()] = Number(value);
          } else {
            rowData[header.toLowerCase()] = value;
          }
        });
        return rowData;
      });

      return processSheetData(rawData);
    } catch (error) {
      console.error('Erro ao buscar dados da planilha:', error);
      throw error;
    }
  }
}

// Exporta uma instância singleton do serviço
export const googleSheetsService = GoogleSheetsService.getInstance();
