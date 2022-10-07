import React, {useState, useEffect} from 'react'
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  'pk_test_51LlxulLVr6OUxlRlSwuqaaUD9FHfxR5NGSaaENTy6vglnNr2DVSNyCSweRUMFjoOADKd9hCYlqDcWic1Mnl6ylDp00cra5CZ7J'
)

export default function Stripe() {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({items: [{id: '2'}]})
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
  }, [])

  const appearance = {
    theme: 'stripe'
  }
  const options = {
    clientSecret,
    appearance
  }

  return (
    <div className="Stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}
