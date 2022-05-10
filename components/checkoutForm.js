import { useState } from 'react';
import Router from 'next/router'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

import { SpinnerCover } from './spinner';

const CheckoutForm = ({connectedAccountID}) => {

  const [stripeReady, setStripeReady] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // Attach the payment method to the payment intent but don't confirm it yet!
    const result = await stripe.updatePaymentIntent({
      elements,
      params: {
        payment_method_data: {
          billing_details: { name: 'George Rowberry' }
        }
      }
    });

    // Check to see if the the request succeeded
    if (result.error) {
      console.log(result.error);
      alert(result.error.message)
    } else {

      // Confirm the payment on the backend
      const res = await fetch('/api/confirm_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_intent_id: result.paymentIntent.id,
          connected_account_id: connectedAccountID
        })
      });

      const response = await res.json();

      if (response.requires_action) {

        if (response.redirect_to_url) {
          // Redirect the customer
          Router.push(response.redirect_to_url)
          
        } else {
          
          // Use Stripe.js to handle any required next actions
        const handled = await stripe.handleNextAction({
          clientSecret: response.payment_intent_client_secret
        });
        }

        if (!handled.error) {
          setSuceeded(true);
        }

      } else if (response.success) {
        setSucceeded(true);
        
      } else {
        // Handle errors
        console.log(response)
      }
    }
  };

  if (succeeded) {
    // Redirect to the success page
    Router.push('/success');
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement onReady={() => setStripeReady(true)} />
      {stripeReady ? <button
        type="submit"
        className="mt-4 inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Pay Now
      </button> : <SpinnerCover />}
    </form>
  );
};

export default CheckoutForm