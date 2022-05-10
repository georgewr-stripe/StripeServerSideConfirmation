import React, { useState } from "react";
import {SpinnerCover} from './spinner';

const PaymentButton = ({clientSecret, setClientSecret, connectedAccountID, setConnectedAccountID}) => {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = async () => {
    
    // Show the spinner
    setClicked(true);
    
    // Create the Payment Intent
    const resp = await fetch('/api/create_payment_intent', {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    })
    const data = await resp.json();

    console.log(data)
    
    // Set the Client Secret
    setClientSecret(data.client_secret);
    // Set the Connected Account ID (demo only really)
    setConnectedAccountID(data.connected_account_id);
    
  }

  if (clicked && !clientSecret) {
    return (
      <SpinnerCover />
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => handleClick()}
        className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Pay Now
      </button>
    </>
  );
};

export default PaymentButton;
