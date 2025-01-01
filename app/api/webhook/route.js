// app/api/route.js

import { NextResponse, NextRequest } from "next/server";
import headers from "next/headers";
import Stripe from "stripe";
// Handles POST requests to /api
const stripe = require("stripe")(
  
);
export async function POST(request) {
  // const sig =await request.headers;
  const headerMapSymbol = Object.getOwnPropertySymbols(request.headers)[0];
  const headerMap = request.headers[headerMapSymbol];
  const simpleObject = {};

  for (let [key, value] of headerMap) {
    simpleObject[key] = value;
  }

  const json = JSON.stringify(simpleObject);

  const endpointSecret =
    "whsec_05e2878d9e37d226017f0cc94a47fe6d9ee6dd0052244254359cc20dca0d5b6a";

  let event;

  const body = await request.json();
  try {
    event = await stripe.webhooks.constructEvent(
      body,
      simpleObject["stripe-signature"],
      endpointSecret
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event

  // Return a 200 response to acknowledge receipt of the event
  response.send();
}
