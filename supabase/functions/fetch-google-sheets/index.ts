
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')
    let SPREADSHEET_ID = Deno.env.get('SPREADSHEET_ID')
    const SHEET_RANGE = Deno.env.get('SHEET_RANGE') || 'Campanhas!A1:J1000'
    
    // Get request body
    const requestData = await req.json()
    
    // If a spreadsheetId is provided in the request, use it instead of the env variable
    if (requestData && requestData.spreadsheetId) {
      SPREADSHEET_ID = requestData.spreadsheetId
      console.log(`Using provided spreadsheet ID: ${SPREADSHEET_ID}`)
    }

    if (!GOOGLE_API_KEY || !SPREADSHEET_ID) {
      throw new Error('Missing required configuration')
    }

    // Fetch data from Google Sheets API
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_API_KEY}`,
      { method: 'GET' }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Google Sheets API error:', errorData)
      throw new Error(`Google Sheets API error: ${errorData}`)
    }

    const data = await response.json()
    
    return new Response(JSON.stringify({ rows: data.values }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
