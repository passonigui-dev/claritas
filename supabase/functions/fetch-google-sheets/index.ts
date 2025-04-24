
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RequestBody {
  action: string;
  spreadsheet_id?: string;
  range?: string;
}

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context from the request
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the JWT token from the request to identify the user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse the request body
    const { action, spreadsheet_id, range } = await req.json() as RequestBody

    // Get Google Sheets API credentials from Supabase secrets
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')
    const spreadsheetId = spreadsheet_id || Deno.env.get('SPREADSHEET_ID')
    const sheetRange = range || Deno.env.get('SHEET_RANGE')

    if (!spreadsheetId || !sheetRange || !GOOGLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing required configuration' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (action === 'fetch') {
      // Fetch data from Google Sheets API using the API key
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetRange}?key=${GOOGLE_API_KEY}`,
        { method: 'GET' }
      )

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Google Sheets API error: ${errorData}`)
      }

      const data = await response.json()
      
      // Transform the data to match our expected format
      const rows = transformSheetData(data.values)

      return new Response(JSON.stringify({ rows }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

// Transform the raw Google Sheets response into our expected format
function transformSheetData(values: string[][]) {
  if (!values || values.length < 2) {
    return []
  }

  const headers = values[0].map(header => header.toLowerCase())
  const rows = values.slice(1)

  return rows.map(row => {
    const rowData: Record<string, any> = {}
    headers.forEach((header, index) => {
      // Convert numerical values
      const value = row[index] || ''
      if (!isNaN(Number(value)) && value !== '') {
        rowData[header] = Number(value)
      } else {
        rowData[header] = value
      }
    })
    return rowData
  })
}
