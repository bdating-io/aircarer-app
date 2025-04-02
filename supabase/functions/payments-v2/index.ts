// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from "npm:stripe";
import { createClient } from "jsr:@supabase/supabase-js@2";

// {
//   action: "create-payment-intent|",
// }
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
const STRPIE_API_KEY = Deno.env.get('STRPIE_API_KEY')
const ACTIONS = {
  CREATE_PAYMENT_INTENT: "create-payment-intent",
  ADDITIONAL_CHARGES: "additional-charges"
}
Deno.serve(async (req) => {
  const stripe = new Stripe(STRPIE_API_KEY);
  const requestPayload = await req.json()
  let data = {};
  console.log('action =====> ' + requestPayload.action);
  console.log('request metadata payload =====> ' + JSON.stringify(requestPayload.metadata));
  const supabase = createClient(supabaseUrl, supabaseKey, { global: { headers: { Authorization: req.headers.get('Authorization')! } } });
  if (requestPayload.action === ACTIONS.CREATE_PAYMENT_INTENT) {
    console.log('preparing parameters ...');

    const { data: taskData, error } = await supabase
      .from('tasks')
      .select('task_id, estimated_price, customer_id, customer:profiles!customer_id (first_name, last_name, stripe_customer_id)')
      .eq('task_id', requestPayload.metadata.task_id)
      .single();

    if (error) {
      console.error('Error fetching task:', error)
    } else {
      const customerData = taskData.customer;
      if (customerData.stripe_customer_id === null) {
        const customer = await stripe.customers.create({
          name: customerData.first_name + ' ' + customerData.last_name,
          metadata: { aircarer_user_id: taskData.customer_id }
        });
        let { error } = await supabase
          .from('profiles')
          .update({ stripe_customer_id: customer.id })
          .eq('user_id', taskData.customer_id);
        customerData.stripe_customer_id = customer.id;
      }

      let params: Stripe.PaymentIntentCreateParams;
      params = {
        //payment_method_types: requestPayload.paymentMethodType === 'link' ? ['link', 'card'] : [requestPayload.paymentMethodType],
        amount: taskData.estimated_price * 100,
        currency: 'AUD',
        automatic_payment_methods: { enabled: true },
        capture_method: 'automatic',
        customer: customerData.stripe_customer_id,
        setup_future_usage: 'off_session'
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
  } else if (requestPayload.action === ACTIONS.ADDITIONAL_CHARGES) {
    const { data: taskData, error } = await supabase
      .from('tasks')
      .select('task_id, estimated_price, customer_id, customer:profiles!customer_id (first_name, last_name, stripe_customer_id)')
      .eq('task_id', requestPayload.metadata.task_id)
      .single();

    const paymentMethods = await stripe.paymentMethods.list({
      customer: taskData.customer.stripe_customer_id,
      type: 'card',
    });

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: requestPayload.amount,
        currency: 'AUD',
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: { enabled: true },
        customer: taskData.customer.stripe_customer_id,
        payment_method: paymentMethods.data[0].id,
        return_url: 'aircarer://stripe-redirect',
        off_session: true,
        confirm: true,
      });
    } catch (err) {
      // Error code will be authentication_required if authentication is needed
      console.log('Error code is: ', err.code);
      const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
      console.log('PI retrieved: ', paymentIntentRetrieved.id);
      data = {
        paymentId: paymentIntentRetrieved.id
      }
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
