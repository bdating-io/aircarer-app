// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from "npm:stripe";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const STRPIE_API_KEY = Deno.env.get('STRPIE_API_KEY')
const STRIPE_SECRET = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')
// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider()

Deno.serve(async (request) => {
  const stripe = new Stripe(STRPIE_API_KEY);
  const signature = request.headers.get('Stripe-Signature')

  // First step is to verify the event. The .text() method must be used as the
  // verification relies on the raw request body rather than the parsed JSON.
  let event = await request.text()

  try {
    event = await stripe.webhooks.constructEventAsync(
      event,
      signature!,
      STRIPE_SECRET!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    return new Response(err.message, { status: 400 })
  }
  console.log(`🔔 Event received: ${event.id}`)

  switch (event.type) {
    case 'charge.succeeded':
      const chargeEvent = event.data.object;
      console.log(event.data.object);
      if (chargeEvent.metadata && chargeEvent.metadata.task_id) {
        // Update the task payment status
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        console.log(`Processing PaymentIntent for task_id: ${chargeEvent.metadata.task_id}`);
        const { data, error } = await supabase
          .from('tasks')
          .select('task_id, budget')
          .eq('task_id', chargeEvent.metadata.task_id)
          .single();

        if (error) {
          console.error('Error fetching task:', error)
        }

        if (data.budget * 100 !== chargeEvent.amount) {
          console.error('amount mismatch:', data.budget, chargeEvent.amount)
        }

        await updateTaskPaymentStatus(chargeEvent, supabase);
      }
      console.log(`PaymentIntent for ${chargeEvent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
});

const updateTaskPaymentStatus = async (chargeEvent, supabase) => {
  console.log(`Updating task payment status for task_id: ${chargeEvent.metadata.task_id}`);
  let { data, error } = await supabase
    .from('tasks')
    .update({ payment_status: 'Completed' })
    .eq('task_id', chargeEvent.metadata.task_id)
  if (error) {
    console.error('Error updating task payment status:', error)
  }
}
