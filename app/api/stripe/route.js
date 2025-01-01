// app/api/route.js

import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
// Handles POST requests to /api
export async function POST(request) {
  // ...
  const data = await request.json();
  const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
  let price_id = process.env.NEXT_PUBLIC_STRIPE_UPGRADE_PRICE_ID;
  if (data.plan == "free") {
    price_id = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_CLIENT_PATH}/profile?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: data.email,
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],

      mode: "payment",
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" });
  }
}
