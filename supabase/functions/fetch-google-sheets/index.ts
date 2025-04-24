
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check for required environment variables
    const GOOGLE_API_KEY = Deno.env.get('KEY')
    let SPREADSHEET_ID = Deno.env.get('SPREADSHEET_ID')
    const SHEET_RANGE = Deno.env.get('SHEET_RANGE') || 'Campanhas!A1:Z1000'
    
    // Get request body
    const requestData = await req.json()
    
    // If a spreadsheetId is provided in the request, use it instead of the env variable
    if (requestData && requestData.spreadsheetId) {
      SPREADSHEET_ID = requestData.spreadsheetId
      console.log(`Using provided spreadsheet ID: ${SPREADSHEET_ID}`)
    }

    // Detailed error checking to help with debugging
    const missingConfigs = []
    if (!GOOGLE_API_KEY) missingConfigs.push('KEY (Google API Key)')
    if (!SPREADSHEET_ID) missingConfigs.push('SPREADSHEET_ID')
    
    if (missingConfigs.length > 0) {
      const errorMessage = `Missing required configuration: ${missingConfigs.join(', ')}`
      console.error(errorMessage)
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: 'Please check your Supabase secrets configuration for Google Sheets API' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Fetching Google Sheets data with API key: ${GOOGLE_API_KEY.substring(0, 5)}...`)
    console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`)
    console.log(`Sheet range: ${SHEET_RANGE}`)

    // Fetch data from Google Sheets API
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_API_KEY}`,
      { method: 'GET' }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Google Sheets API error:', errorData)
      return new Response(JSON.stringify({ 
        error: 'Google Sheets API request failed',
        details: errorData 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    
    // Validate the response data structure
    if (!data || !data.values || !Array.isArray(data.values)) {
      console.error('Invalid data format received from Google Sheets:', data)
      return new Response(JSON.stringify({
        error: 'Invalid data format received from Google Sheets',
        details: 'The API response did not contain the expected data structure'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Successfully fetched sheet data:', {
      rowCount: data.values.length,
      columnCount: data.values[0]?.length || 0
    })
    
    return new Response(JSON.stringify({ rows: data.values }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ 
      error: 'Unexpected error occurred',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
