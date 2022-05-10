const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27;server_side_confirmation_beta=v1'
});

const defaultFee = 25;
const brandFees = {
  'visa': 20,
  'mastercard': 10,
  'amex': 40
}

export default async function handler(req, res) {
  
  // Get the Payment Intent
  const paymentIntent = await stripe.paymentIntents.retrieve(req.body.payment_intent_id, {
    expand: ['payment_method']
  }, {
    stripeAccount: req.body.connected_account_id
  });

  // Get the card information from the payment_method attribute
  const cardBrand = paymentIntent.payment_method.card.brand;
  const cardCountry = paymentIntent.payment_method.card.country;
  console.log(`Card Info - ${cardCountry}, ${cardBrand}`);

  // Calculate the application fee given the brand (as an example)
  const applicationFee = brandFees[cardBrand] || defaultFee;

  // Update the payment intent
  await stripe.paymentIntents.update(paymentIntent.id, {
    application_fee_amount: applicationFee
  }, {
    stripeAccount: req.body.connected_account_id
  });

  // Now we have the new application fee set, confirm the payment intent
  const intent = await stripe.paymentIntents.confirm(paymentIntent.id, {
    return_url: "https://selfishsveltelists.georgerowberry1.repl.co/success"
  }, {
    stripeAccount: req.body.connected_account_id
  });

  let response = {};

  // Handle any next actions
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    response = {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret
    };
  } else if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'redirect_to_url'
  ) {
    // Redirect the customer
    response = {
      requires_action: true,
      redirect_to_url: intent.next_action.redirect_to_url.url
    };
    
  } else if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    response = {
      success: true
    };
  } else {
    // Invalid status
    response = {
      error: 'Invalid PaymentIntent status'
    }
  }
  res.status(200).json(response);
}
