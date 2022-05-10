const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27;server_side_confirmation_beta=v1'
});

import connectedAccount from './_get_connected_account';

export default async function handler(req, res) {
	// Get the Connected Account ID
	const connectedAccountID = await connectedAccount();

	// Create the Payment Intent
	const paymentIntent = await stripe.paymentIntents.create(
		{
			amount: 2000,
			currency: 'gbp',
			automatic_payment_methods: { enabled: true },
			secret_key_confirmation: 'required'
		},
		{
			stripeAccount: connectedAccountID
		}
	);
  
	// Send the Client Secret to the Frontent
	res.status(200).json({ client_secret: paymentIntent.client_secret, connected_account_id: connectedAccountID });

}
