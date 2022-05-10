import React, { useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentButton from '../components/paymentButton';
import CheckoutForm from '../components/checkoutForm';

export default () => {
	const [clientSecret, setClientSecret] = useState(null);
	const [connectedAccountID, setConnectedAccountID] = useState(null);

	if (!clientSecret || !connectedAccountID) {
		return (
			<PaymentButton
				setClientSecret={setClientSecret}
				setConnectedAccountID={setConnectedAccountID}
			/>
		);
	} else {
		// Init stripe-js
		const stripePromise = loadStripe(
			process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
			{
				betas: ['server_side_confirmation_beta_1'],
				apiVersion: '2020-08-27;server_side_confirmation_beta=v1',
				stripeAccount: connectedAccountID
			}
		);

		return (
			<Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
				<CheckoutForm connectedAccountID={connectedAccountID} />
			</Elements>
		);
	}
};
