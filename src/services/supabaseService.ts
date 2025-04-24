
import { createClient } from '@supabase/supabase-js'
import { GoogleSheetsCredentials, SheetConfig, Campaign } from '@/types'
import { processSheetData } from '@/utils/sheetProcessing'

// These should come from environment variables in Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export const fetchSheetData = async (): Promise<Campaign[]> => {
  try {
    // Call the Supabase Edge Function that will securely handle the Google Sheets API
    const { data, error } = await supabase.functions.invoke('fetch-google-sheets', {
      body: { action: 'fetch' }
    })

    if (error) throw error

    // Process the raw data from the sheet into our Campaign format
    return processSheetData(data.rows)
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    throw error
  }
}

export const storeCredentials = async (credentials: GoogleSheetsCredentials): Promise<void> => {
  try {
    // Store Google Sheets API credentials in Supabase (this should be secured with RLS)
    const { error } = await supabase
      .from('google_sheets_credentials')
      .upsert([credentials], { onConflict: 'user_id' })

    if (error) throw error
  } catch (error) {
    console.error('Error storing credentials:', error)
    throw error
  }
}

export const storeSheetConfig = async (config: SheetConfig): Promise<void> => {
  try {
    // Store Google Sheet configuration in Supabase
    const { error } = await supabase
      .from('sheet_configs')
      .upsert([config], { onConflict: 'user_id' })

    if (error) throw error
  } catch (error) {
    console.error('Error storing sheet config:', error)
    throw error
  }
}
