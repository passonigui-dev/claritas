
export const isValidGoogleSheetsUrl = (url: string): boolean => {
  return url.includes("docs.google.com/spreadsheets");
};

export const extractSpreadsheetId = (url: string): string | null => {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};
