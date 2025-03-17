// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { Resend } from 'npm:resend';
import ejs from 'npm:ejs';
import { TEMPLATE } from "./_templates/template.ts";

/**
 * API for sending notifications.
 * endpoint: /notifications
 * POST: Send a notification to a user.
 * body: { 
 *  channel: string,
 *  recpient: string,
 *  type: string,
 *  payload: object
 * }
 */
const RESENT_API_KEY = Deno.env.get('RESENT_API_KEY')
const CHANNEL = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  PUSH: 'PUSH',
}

Deno.serve(async (req) => {

  console.log("RESENT_API_KEY", RESENT_API_KEY);
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { channel, recpient, type, payload } = await req.json()

  if (channel === CHANNEL.EMAIL) {
    const emailTemplate = TEMPLATE[type];
    let body = ejs.render(emailTemplate.body, payload);
    // send email
    const resend = new Resend(RESENT_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'AirCarer <onboarding@resend.dev>',
      to: [recpient],
      subject: emailTemplate.subject,
      html: body,
    });
    if (error) {
      console.error({ error });
    }
  } else if (channel === CHANNEL.SMS) {
    // send sms
  } else if (channel === CHANNEL.PUSH) {
    // send push notification
  } else {
    return new Response('Invalid channel', { status: 400 })
  }

  return new Response('Notification sent', { status: 200 })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notifications' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
