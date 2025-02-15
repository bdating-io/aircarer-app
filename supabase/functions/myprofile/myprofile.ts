import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2";


// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
// const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); // Use service role key for server-side access
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

Deno.serve(async (req) => {
  // Handle GET requests
  if (req.method === 'GET') {
    try {

      const token = req.headers.get('Authorization')?.split(' ')[1]; // Bearer token
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey,
        {
          global: {
            headers: { Authorization: req.headers.get('Authorization')! },
          },
        }
      );

      // Decode the token to get the user ID
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (userError || !user) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Fetch the user's profile using the user ID from the token
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.log("error=" + error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });


    } catch (err) {
      console.error(err)
      return new Response('Invalid token', { status: 401 });
    }
  }

  // Handle unsupported methods
  return new Response('Method Not Allowed', { status: 405 });
});