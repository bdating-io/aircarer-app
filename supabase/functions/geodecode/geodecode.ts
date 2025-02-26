// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  if (req.method === 'POST') {
    try{
      const GOOGLE_MAP_API_KEY = Deno.env.get('GOOGLE_MAP_API_KEY');
      const { address } = await req.json();
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAP_API_KEY}`);
      const googleResponse = await response.json();
      let result = {};
      if (googleResponse.results.length > 0) {
        const location = googleResponse.results[0].geometry.location;
        result = { latitude: location.lat, longitude: location.lng };
      }
      return new Response(
        JSON.stringify(result),
        { headers: { "Content-Type": "application/json" } },
      )
    } catch(error) {
      console.error("Failed to perform geodecoding", error)
    }
    
  } else
  return new Response('Method Not Allowed', { status: 405 });
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/geodecode' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"address":"123 Flinder Street, Melbourne, 3000"}'

*/
