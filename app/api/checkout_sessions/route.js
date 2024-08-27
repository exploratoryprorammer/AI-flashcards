import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const formatAmountForStripe= (amount)=> {
    return Math.round(amount * 100)
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get('session_id');

  try {
    const checkout_sessions = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(checkout_sessions);
  }
  catch(error) {
    console.log('error retrieving data', error)
    return NextResponse.json({error: {message: error.message}}, {status: 500})
  }

  
}

export async function POST(req) {
    const params = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
                currency: 'usd',
                product_data:{
                    name: 'Donate'
                },
                unit_amount: formatAmountForStripe(1),

            },
            quantity: 1,
          },
        ],
        success_url: `${req.headers.get(
          'origin',
        )}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: 'https://memoraai.vercel.app/',
        // `${req.headers.get(
        //   'origin',
        // )}/result?session_id={CHECKOUT_SESSION_ID}`,
      };
      const checkoutSession = await stripe.checkout.sessions.create(params);
      return NextResponse.json(checkoutSession, {
        status: 200,
      });
}