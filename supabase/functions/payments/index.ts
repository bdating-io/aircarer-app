// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from "npm:stripe";

// {
//   action: "create-payment-intent|",
// }
const STRPIE_API_KEY = Deno.env.get('STRPIE_API_KEY')
const ACTIONS = {
  CREATE_PAYMENT_INTENT: "create-payment-intent"
}
Deno.serve(async (req) => {
  const stripe = new Stripe(STRPIE_API_KEY);
  const requestPayload = await req.json()
  let data = {};
  console.log('action =====> ' + requestPayload.action);
  if (requestPayload.action === ACTIONS.CREATE_PAYMENT_INTENT) {
    console.log('preparing parameters ...');
    let params: Stripe.PaymentIntentCreateParams;
    params = {
      //payment_method_types: requestPayload.paymentMethodType === 'link' ? ['link', 'card'] : [requestPayload.paymentMethodType],
      amount: requestPayload.amount,
      currency: requestPayload.currency,
      automatic_payment_methods: { enabled: true },
      capture_method: 'automatic',
    }

    if (requestPayload.metadata) {
      params.metadata = requestPayload.metadata;
    }

    if (requestPayload.description) {
      params.description = requestPayload.description;
    }

    try {
      console.log('creating payment intent ...');
      const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
        params
      );

      console.log('payment intent created...');
      data = {
        clientSecret: paymentIntent.client_secret,
        nextAction: paymentIntent.next_action,
      };
    } catch (e) {
      return new Response(
        JSON.stringify({ error: e.message }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/payments' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
