const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27;server_side_confirmation_beta=v1'
});

const connectedAccount = async () => {
  // Get some accounts
	const accounts = await stripe.accounts.list({ limit: 20 });

	for (const account of accounts['data']) {
		// Find an activated account
		if (account.charges_enabled) {
			return account['id'];
		}
	}
	throw 'Could not find an active connected account';
};

export default connectedAccount;
