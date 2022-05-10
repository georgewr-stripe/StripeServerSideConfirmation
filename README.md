# Server Side Confirmation with Payment Element
This is a demo for updating a Payment Intent server side before confirmation using the stripe-js Payment Element, in this example the application_fee_amount is modified for destination charges.


## Getting Started

Set the environment variables: 

```bash
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_***
STRIPE_SECRET_KEY=sk_**
```


Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the payment button.